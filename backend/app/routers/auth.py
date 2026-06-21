from fastapi import APIRouter, Depends, HTTPException, Request, status
from jose import JWTError
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.dependencies import get_db
from app.middleware.rate_limit import check_rate_limit, get_redis
from app.schemas.auth import (
    ForgotPasswordRequest,
    GoogleAuthRequest,
    LoginRequest,
    RefreshRequest,
    RegisterRequest,
    ResetPasswordRequest,
    TokenResponse,
    UserBrief,
    VerifyEmailRequest,
)
from app.services import auth_service, google_oauth
from app.services.token_service import (
    create_access_token,
    create_email_verification_token,
    create_password_reset_token,
    create_refresh_token,
    decode_token,
)

router = APIRouter()


def _user_brief(user, plan: str) -> UserBrief:
    return UserBrief(
        id=str(user.id),
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        plan=plan,
        is_email_verified=user.is_email_verified,
    )


def _token_response(user, plan: str) -> TokenResponse:
    access = create_access_token(str(user.id))
    refresh = create_refresh_token(str(user.id))
    return TokenResponse(
        access_token=access,
        refresh_token=refresh,
        user=_user_brief(user, plan),
    )


@router.post("/register", response_model=TokenResponse, status_code=201)
async def register(
    data: RegisterRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    await check_rate_limit(request)
    if not data.accept_age:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Vous devez certifier avoir 18 ans ou plus",
        )
    user = await auth_service.register_user(db, data)
    plan = await auth_service.get_user_plan(db, user.id)
    return _token_response(user, plan)


@router.post("/login", response_model=TokenResponse)
async def login(
    data: LoginRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    await check_rate_limit(request)
    user = await auth_service.authenticate_user(db, data.email, data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou mot de passe incorrect",
        )
    if user.two_factor_enabled:
        if not data.totp_code:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Code 2FA requis",
                headers={"X-Requires-2FA": "true"},
            )
        if not user.two_factor_secret or not auth_service.verify_totp(
            user.two_factor_secret, data.totp_code
        ):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Code 2FA invalide",
            )
    plan = await auth_service.get_user_plan(db, user.id)
    return _token_response(user, plan)


@router.post("/google", response_model=TokenResponse)
async def google_auth_endpoint(
    data: GoogleAuthRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    await check_rate_limit(request)
    try:
        user_info = await google_oauth.verify_google_token(data.credential)
    except google_oauth.GoogleAuthError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e)
        )
    user = await google_oauth.get_or_create_user(db, user_info)
    plan = await auth_service.get_user_plan(db, user.id)
    return _token_response(user, plan)


@router.post("/refresh", response_model=TokenResponse)
async def refresh(
    data: RefreshRequest,
    db: AsyncSession = Depends(get_db),
):
    try:
        payload = decode_token(data.refresh_token)
        if payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Type de token invalide",
            )
        user_id = payload.get("sub")
        jti = payload.get("jti")
        if not user_id or not jti:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token invalide",
            )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token invalide ou expire",
        )

    # Check jti blacklist in Redis
    redis = await get_redis()
    blacklist_key = f"refresh_blacklist:{jti}"
    if await redis.exists(blacklist_key):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token deja utilise",
        )
    # Blacklist the used jti (TTL = refresh token lifetime)
    await redis.set(blacklist_key, "1", ex=settings.refresh_token_expire_days * 86400)

    user = await auth_service.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Utilisateur introuvable",
        )
    plan = await auth_service.get_user_plan(db, user.id)
    return _token_response(user, plan)


@router.post("/forgot-password")
async def forgot_password(
    data: ForgotPasswordRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    await check_rate_limit(request)
    user = await auth_service.get_user_by_email(db, data.email)
    if user:
        _token = create_password_reset_token(str(user.id))
        # TODO: send email with reset link containing the token
    # Always return 200 to prevent email enumeration
    return {"message": "Si un compte existe avec cet email, un lien de reinitialisation a ete envoye."}


@router.post("/reset-password")
async def reset_password(
    data: ResetPasswordRequest,
    db: AsyncSession = Depends(get_db),
):
    try:
        payload = decode_token(data.token)
        if payload.get("type") != "password_reset":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Token invalide",
            )
        user_id = payload.get("sub")
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Token invalide ou expire",
        )

    user = await auth_service.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Utilisateur introuvable",
        )
    user.password_hash = auth_service.hash_password(data.new_password)
    await db.commit()
    return {"message": "Mot de passe mis a jour avec succes"}


@router.post("/verify-email")
async def verify_email(
    data: VerifyEmailRequest,
    db: AsyncSession = Depends(get_db),
):
    try:
        payload = decode_token(data.token)
        if payload.get("type") != "email_verify":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Token invalide",
            )
        user_id = payload.get("sub")
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Token invalide ou expire",
        )

    user = await auth_service.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Utilisateur introuvable",
        )
    user.is_email_verified = True
    await db.commit()
    return {"message": "Email verifie avec succes"}
