from passlib.context import CryptContext
from pyotp import TOTP
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import (
    AuthProvider,
    BillingCycle,
    NotificationPreference,
    Subscription,
    SubscriptionPlan,
    SubStatus,
    User,
)
from app.schemas.auth import RegisterRequest

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def verify_totp(secret: str, code: str) -> bool:
    totp = TOTP(secret)
    return totp.verify(code, valid_window=1)


async def get_user_by_email(db: AsyncSession, email: str) -> User | None:
    result = await db.execute(select(User).where(User.email == email))
    return result.scalar_one_or_none()


async def get_user_by_id(db: AsyncSession, user_id: str) -> User | None:
    result = await db.execute(select(User).where(User.id == user_id))
    return result.scalar_one_or_none()


async def get_user_plan(db: AsyncSession, user_id) -> str:
    result = await db.execute(
        select(Subscription.plan).where(
            Subscription.user_id == user_id, Subscription.status == SubStatus.active
        )
    )
    plan = result.scalar_one_or_none()
    return plan.value if plan else "decouverte"


async def register_user(db: AsyncSession, data: RegisterRequest) -> User:
    existing = await get_user_by_email(db, data.email)
    if existing:
        from fastapi import HTTPException

        raise HTTPException(status_code=409, detail="Un compte existe deja avec cet email")

    user = User(
        email=data.email,
        password_hash=hash_password(data.password),
        first_name=data.first_name,
        auth_provider=AuthProvider.email,
        is_email_verified=False,
    )
    db.add(user)
    await db.flush()

    subscription = Subscription(
        user_id=user.id,
        plan=SubscriptionPlan.decouverte,
        billing_cycle=BillingCycle.monthly,
        status=SubStatus.active,
    )
    db.add(subscription)

    notif_prefs = NotificationPreference(
        user_id=user.id,
        daily_tips=True,
        value_alerts=True,
        weekly_summary=True,
        product_news=False,
    )
    db.add(notif_prefs)

    await db.commit()
    await db.refresh(user)
    return user


async def authenticate_user(
    db: AsyncSession, email: str, password: str
) -> User | None:
    user = await get_user_by_email(db, email)
    if not user or not user.password_hash:
        return None
    if not verify_password(password, user.password_hash):
        return None
    return user
