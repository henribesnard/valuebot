from pydantic import BaseModel, EmailStr, Field


class ProfileResponse(BaseModel):
    id: str
    email: str
    first_name: str | None
    last_name: str | None
    auth_provider: str
    sports_followed: list[str]
    is_email_verified: bool
    two_factor_enabled: bool
    plan: str
    billing_cycle: str | None
    subscription_status: str | None
    created_at: str

    model_config = {"from_attributes": True}


class UpdateProfileRequest(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    sports_followed: list[str] | None = None


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str = Field(min_length=8)


class Enable2FAResponse(BaseModel):
    secret: str
    provisioning_uri: str


class Disable2FARequest(BaseModel):
    totp_code: str


class NotificationPrefsResponse(BaseModel):
    daily_tips: bool
    value_alerts: bool
    weekly_summary: bool
    product_news: bool

    model_config = {"from_attributes": True}


class UpdateNotificationPrefsRequest(BaseModel):
    daily_tips: bool | None = None
    value_alerts: bool | None = None
    weekly_summary: bool | None = None
    product_news: bool | None = None
