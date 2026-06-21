from pydantic import BaseModel


class TipResponse(BaseModel):
    id: int
    sport: str
    sport_label: str
    competition: str
    matchup: str
    when: str
    selection: str
    confidence: int
    stake_units: float
    taken_odd: float
    bookmaker: str
    odd_captured_at: str
    status: str
    rationale: str | None
    pnl_units: float | None
    estimated_probability: float | None
    expected_value: float | None

    model_config = {"from_attributes": True}


class TipListResponse(BaseModel):
    tips: list[TipResponse]
    total: int
    page: int
    limit: int


class TipDetailResponse(TipResponse):
    match_home: str
    match_away: str
    match_start_time: str
    market: str
    fair_odd: float | None
