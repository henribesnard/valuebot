import enum
import uuid

from sqlalchemy import (
    ARRAY,
    Boolean,
    CheckConstraint,
    Column,
    Enum,
    ForeignKey,
    Integer,
    Text,
)
from sqlalchemy.dialects.postgresql import TIMESTAMP, UUID
from sqlalchemy.orm import DeclarativeBase, relationship


class Base(DeclarativeBase):
    pass


class AuthProvider(str, enum.Enum):
    email = "email"
    google = "google"


class SubscriptionPlan(str, enum.Enum):
    decouverte = "decouverte"
    pro = "pro"
    expert = "expert"


class BillingCycle(str, enum.Enum):
    monthly = "monthly"
    annual = "annual"


class SubStatus(str, enum.Enum):
    active = "active"
    cancelled = "cancelled"
    past_due = "past_due"
    trialing = "trialing"


class InvoiceStatus(str, enum.Enum):
    paid = "paid"
    open = "open"
    void = "void"
    uncollectible = "uncollectible"


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(Text, unique=True, nullable=False)
    password_hash = Column(Text, nullable=True)
    first_name = Column(Text)
    last_name = Column(Text)
    auth_provider = Column(
        Enum(AuthProvider, name="auth_provider_type", create_type=False),
        nullable=False,
        default=AuthProvider.email,
    )
    google_id = Column(Text, unique=True, nullable=True)
    sports_followed = Column(ARRAY(Text), default=["football", "tennis"])
    is_email_verified = Column(Boolean, default=False)
    two_factor_enabled = Column(Boolean, default=False)
    two_factor_secret = Column(Text, nullable=True)
    created_at = Column(TIMESTAMP(timezone=True), server_default="NOW()")
    updated_at = Column(TIMESTAMP(timezone=True), server_default="NOW()")

    subscription = relationship(
        "Subscription", back_populates="user", uselist=False, lazy="selectin"
    )
    notification_prefs = relationship(
        "NotificationPreference", back_populates="user", uselist=False, lazy="selectin"
    )

    __table_args__ = (
        CheckConstraint(
            "auth_provider = 'google' OR password_hash IS NOT NULL",
            name="chk_password_email",
        ),
    )


class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    plan = Column(
        Enum(SubscriptionPlan, name="subscription_plan", create_type=False),
        nullable=False,
        default=SubscriptionPlan.decouverte,
    )
    billing_cycle = Column(
        Enum(BillingCycle, name="billing_cycle_type", create_type=False),
        nullable=False,
        default=BillingCycle.monthly,
    )
    status = Column(
        Enum(SubStatus, name="subscription_status", create_type=False),
        nullable=False,
        default=SubStatus.active,
    )
    stripe_subscription_id = Column(Text)
    stripe_customer_id = Column(Text)
    current_period_start = Column(TIMESTAMP(timezone=True))
    current_period_end = Column(TIMESTAMP(timezone=True))
    cancelled_at = Column(TIMESTAMP(timezone=True))
    created_at = Column(TIMESTAMP(timezone=True), server_default="NOW()")

    user = relationship("User", back_populates="subscription")


class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    subscription_id = Column(
        UUID(as_uuid=True),
        ForeignKey("subscriptions.id", ondelete="SET NULL"),
        nullable=True,
    )
    stripe_invoice_id = Column(Text)
    amount_cents = Column(Integer, nullable=False)
    currency = Column(Text, default="eur")
    status = Column(
        Enum(InvoiceStatus, name="invoice_status", create_type=False),
        nullable=False,
        default=InvoiceStatus.open,
    )
    pdf_url = Column(Text)
    period_start = Column(TIMESTAMP(timezone=True))
    period_end = Column(TIMESTAMP(timezone=True))
    created_at = Column(TIMESTAMP(timezone=True), server_default="NOW()")


class NotificationPreference(Base):
    __tablename__ = "notification_preferences"

    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        primary_key=True,
    )
    daily_tips = Column(Boolean, default=True)
    value_alerts = Column(Boolean, default=True)
    weekly_summary = Column(Boolean, default=True)
    product_news = Column(Boolean, default=False)

    user = relationship("User", back_populates="notification_prefs")
