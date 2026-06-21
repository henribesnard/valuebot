from pydantic import BaseModel


class BankrollResponse(BaseModel):
    current_balance: float
    initial_balance: float
    equity_curve: list[float]
    total_tips: int
    pending_tips: int


class PerformanceResponse(BaseModel):
    yield_pct: float
    roi_pct: float
    win_rate: float
    total_settled: int
    total_won: int
    total_lost: int
    total_void: int
    avg_odd: float
    max_drawdown: float
    longest_win_streak: int
    longest_loss_streak: int
    pnl_by_sport: dict[str, float]


class CreateTipRequest(BaseModel):
    match_id: int
    sport: str
    market: str
    selection: str
    estimated_probability: float
    taken_odd: float
    bookmaker: str
    odd_captured_at: str
    expected_value: float
    confidence: int
    stake_units: float
    rationale: str


class SettleTipRequest(BaseModel):
    status: str  # "won", "lost", "void"


class CreateLearningRequest(BaseModel):
    date: str
    period_metrics_json: dict | None = None
    observations: str | None = None
    adjustments_json: dict | None = None
