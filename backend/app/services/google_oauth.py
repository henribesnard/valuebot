import httpx
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.models.user import (
    AuthProvider,
    BillingCycle,
    NotificationPreference,
    Subscription,
    SubscriptionPlan,
    SubStatus,
    User,
)


class GoogleAuthError(Exception):
    pass


async def verify_google_token(credential: str) -> dict:
    """Verify a Google ID token and return user info."""
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            "https://oauth2.googleapis.com/tokeninfo",
            params={"id_token": credential},
        )
        if resp.status_code != 200:
            raise GoogleAuthError("Token Google invalide")

        data = resp.json()
        if data.get("aud") != settings.google_client_id:
            raise GoogleAuthError("Client ID Google invalide")

        return {
            "google_id": data["sub"],
            "email": data["email"],
            "first_name": data.get("given_name", ""),
            "last_name": data.get("family_name", ""),
            "email_verified": data.get("email_verified", "false") == "true",
        }


async def get_or_create_user(db: AsyncSession, user_info: dict) -> User:
    """Find or create a user from Google OAuth info."""
    # Check by google_id first
    result = await db.execute(
        select(User).where(User.google_id == user_info["google_id"])
    )
    user = result.scalar_one_or_none()
    if user:
        return user

    # Check by email (link accounts)
    result = await db.execute(
        select(User).where(User.email == user_info["email"])
    )
    user = result.scalar_one_or_none()
    if user:
        user.google_id = user_info["google_id"]
        if not user.first_name:
            user.first_name = user_info["first_name"]
        if not user.last_name:
            user.last_name = user_info["last_name"]
        user.is_email_verified = True
        await db.commit()
        await db.refresh(user)
        return user

    # Create new user
    user = User(
        email=user_info["email"],
        first_name=user_info["first_name"],
        last_name=user_info["last_name"],
        auth_provider=AuthProvider.google,
        google_id=user_info["google_id"],
        is_email_verified=True,
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
