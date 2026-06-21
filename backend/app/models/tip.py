import enum

from sqlalchemy import Column, Enum, ForeignKey, Integer, Numeric, SmallInteger, Text, VARCHAR
from sqlalchemy.dialects.postgresql import JSONB, TIMESTAMP

from app.models.user import Base


class SportType(str, enum.Enum):
    football = "football"
    tennis = "tennis"


class MatchStatus(str, enum.Enum):
    scheduled = "scheduled"
    live = "live"
    finished = "finished"
    cancelled = "cancelled"


class TipStatus(str, enum.Enum):
    pending = "pending"
    won = "won"
    lost = "lost"
    void = "void"
    cancelled = "cancelled"


class Match(Base):
    __tablename__ = "matches"

    id = Column(Integer, primary_key=True)
    sport = Column(
        Enum(SportType, name="sport_type", create_type=False), nullable=False
    )
    competition = Column(VARCHAR(255), nullable=False)
    country = Column(VARCHAR(100))
    home_or_player1 = Column(VARCHAR(255), nullable=False)
    away_or_player2 = Column(VARCHAR(255), nullable=False)
    start_time = Column(TIMESTAMP(timezone=True), nullable=False)
    status = Column(
        Enum(MatchStatus, name="match_status", create_type=False),
        nullable=False,
        default=MatchStatus.scheduled,
    )
    result_json = Column(JSONB)
    data_quality = Column(SmallInteger)
    created_at = Column(TIMESTAMP(timezone=True), server_default="NOW()")
    updated_at = Column(TIMESTAMP(timezone=True), server_default="NOW()")


class OddsSnapshot(Base):
    __tablename__ = "odds_snapshots"

    id = Column(Integer, primary_key=True)
    match_id = Column(Integer, ForeignKey("matches.id"))
    market = Column(VARCHAR(100), nullable=False)
    selection = Column(VARCHAR(255), nullable=False)
    odd = Column(Numeric(6, 3), nullable=False)
    bookmaker = Column(VARCHAR(100), nullable=False)
    captured_at = Column(TIMESTAMP(timezone=True), nullable=False)


class Tip(Base):
    __tablename__ = "tips"

    id = Column(Integer, primary_key=True)
    match_id = Column(Integer, ForeignKey("matches.id"))
    sport = Column(
        Enum(SportType, name="sport_type", create_type=False), nullable=False
    )
    market = Column(VARCHAR(100), nullable=False)
    selection = Column(VARCHAR(255), nullable=False)
    estimated_probability = Column(Numeric(5, 4))
    fair_odd = Column(Numeric(6, 3))
    taken_odd = Column(Numeric(6, 3), nullable=False)
    bookmaker = Column(VARCHAR(100), nullable=False)
    odd_captured_at = Column(TIMESTAMP(timezone=True), nullable=False)
    expected_value = Column(Numeric(6, 4))
    confidence = Column(SmallInteger, nullable=False)
    stake_units = Column(Numeric(5, 2), nullable=False)
    rationale = Column(Text)
    status = Column(
        Enum(TipStatus, name="tip_status", create_type=False),
        nullable=False,
        default=TipStatus.pending,
    )
    pnl_units = Column(Numeric(7, 2))
    model_version_id = Column(Integer, ForeignKey("model_versions.id"))
    published_at = Column(TIMESTAMP(timezone=True), server_default="NOW()")
    settled_at = Column(TIMESTAMP(timezone=True))
