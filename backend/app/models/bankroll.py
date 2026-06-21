import enum

from sqlalchemy import Column, Date, Enum, ForeignKey, Integer, Numeric, Text, VARCHAR
from sqlalchemy.dialects.postgresql import JSONB, TIMESTAMP

from app.models.user import Base


class LedgerType(str, enum.Enum):
    init = "init"
    bet_settled = "bet_settled"
    adjustment = "adjustment"


class BankrollLedger(Base):
    __tablename__ = "bankroll_ledger"

    id = Column(Integer, primary_key=True)
    tip_id = Column(Integer, ForeignKey("tips.id"), nullable=True)
    type = Column(
        Enum(LedgerType, name="ledger_type", create_type=False), nullable=False
    )
    delta_units = Column(Numeric(8, 2), nullable=False)
    balance_after_units = Column(Numeric(10, 2), nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default="NOW()")


class ModelVersion(Base):
    __tablename__ = "model_versions"

    id = Column(Integer, primary_key=True)
    label = Column(VARCHAR(100), nullable=False)
    params_json = Column(JSONB)
    created_at = Column(TIMESTAMP(timezone=True), server_default="NOW()")
    notes = Column(Text)


class Learning(Base):
    __tablename__ = "learnings"

    id = Column(Integer, primary_key=True)
    date = Column(Date, nullable=False)
    period_metrics_json = Column(JSONB)
    observations = Column(Text)
    adjustments_json = Column(JSONB)
    created_at = Column(TIMESTAMP(timezone=True), server_default="NOW()")


class Source(Base):
    __tablename__ = "sources"

    id = Column(Integer, primary_key=True)
    name = Column(VARCHAR(255), nullable=False)
    url = Column(Text)
    fetched_at = Column(TIMESTAMP(timezone=True))
    http_status = Column(Integer)
    cache_key = Column(VARCHAR(255))
    notes = Column(Text)
