import pyotp
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_current_user, get_db
from app.models.user import NotificationPreference, User
from app.schemas.account import (
    ChangePasswordRequest,
    Disable2FARequest,
    Enable2FAResponse,
    NotificationPrefsResponse,
    ProfileResponse,
    UpdateNotificationPrefsRequest,
    UpdateProfileRequest,
)
from app.services.auth_service import get_user_plan, hash_password, verify_password, verify_totp

router = APIRouter()


def _profile_response(user: User, plan: str) -> ProfileResponse:
    sub = user.subscription
    return ProfileResponse(
        id=str(user.id),
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        auth_provider=user.auth_provider.value if user.auth_provider else "email",
        sports_followed=user.sports_followed or [],
        is_email_verified=user.is_email_verified or False,
        two_factor_enabled=user.two_factor_enabled or False,
        plan=plan,
        billing_cycle=sub.billing_cycle.value if sub else None,
        subscription_status=sub.status.value if sub else None,
        created_at=user.created_at.isoformat() if user.created_at else "",
    )


@router.get("", response_model=ProfileResponse)
async def get_profile(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    plan = await get_user_plan(db, user.id)
    return _profile_response(user, plan)


@router.patch("", response_model=ProfileResponse)
async def update_profile(
    data: UpdateProfileRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if data.first_name is not None:
        user.first_name = data.first_name
    if data.last_name is not None:
        user.last_name = data.last_name
    if data.sports_followed is not None:
        user.sports_followed = data.sports_followed
    await db.commit()
    await db.refresh(user)
    plan = await get_user_plan(db, user.id)
    return _profile_response(user, plan)


@router.delete("", status_code=204)
async def delete_account(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await db.delete(user)
    await db.commit()


@router.patch("/password")
async def change_password(
    data: ChangePasswordRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if not user.password_hash:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Compte Google sans mot de passe. Utilisez la connexion Google.",
        )
    if not verify_password(data.current_password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Mot de passe actuel incorrect",
        )
    user.password_hash = hash_password(data.new_password)
    await db.commit()
    return {"message": "Mot de passe mis a jour"}


@router.post("/2fa/enable", response_model=Enable2FAResponse)
async def enable_2fa(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if user.two_factor_enabled:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="2FA deja active",
        )
    secret = pyotp.random_base32()
    user.two_factor_secret = secret
    await db.commit()
    totp = pyotp.TOTP(secret)
    uri = totp.provisioning_uri(name=user.email, issuer_name="ValueBot")
    return Enable2FAResponse(secret=secret, provisioning_uri=uri)


@router.post("/2fa/disable")
async def disable_2fa(
    data: Disable2FARequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if not user.two_factor_enabled:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="2FA non active",
        )
    if not user.two_factor_secret or not verify_totp(
        user.two_factor_secret, data.totp_code
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Code 2FA invalide",
        )
    user.two_factor_enabled = False
    user.two_factor_secret = None
    await db.commit()
    return {"message": "2FA desactive"}


@router.post("/2fa/confirm")
async def confirm_2fa(
    data: Disable2FARequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Confirm 2FA activation after enable (user must provide first valid code)."""
    if not user.two_factor_secret:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Activez d'abord le 2FA",
        )
    if not verify_totp(user.two_factor_secret, data.totp_code):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Code 2FA invalide",
        )
    user.two_factor_enabled = True
    await db.commit()
    return {"message": "2FA active avec succes"}


@router.get("/notifications", response_model=NotificationPrefsResponse)
async def get_notifications(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    prefs = user.notification_prefs
    if not prefs:
        prefs = NotificationPreference(user_id=user.id)
        db.add(prefs)
        await db.commit()
        await db.refresh(prefs)
    return NotificationPrefsResponse.model_validate(prefs)


@router.patch("/notifications", response_model=NotificationPrefsResponse)
async def update_notifications(
    data: UpdateNotificationPrefsRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    prefs = user.notification_prefs
    if not prefs:
        prefs = NotificationPreference(user_id=user.id)
        db.add(prefs)
        await db.flush()

    if data.daily_tips is not None:
        prefs.daily_tips = data.daily_tips
    if data.value_alerts is not None:
        prefs.value_alerts = data.value_alerts
    if data.weekly_summary is not None:
        prefs.weekly_summary = data.weekly_summary
    if data.product_news is not None:
        prefs.product_news = data.product_news

    await db.commit()
    await db.refresh(prefs)
    return NotificationPrefsResponse.model_validate(prefs)
