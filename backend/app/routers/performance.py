from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db
from app.models.bankroll import BankrollLedger
from app.models.tip import Tip, TipStatus
from app.schemas.bankroll import PerformanceResponse

router = APIRouter()


@router.get("", response_model=PerformanceResponse)
async def get_performance(db: AsyncSession = Depends(get_db)):
    # Get all settled tips
    result = await db.execute(
        select(Tip).where(Tip.status.in_([TipStatus.won, TipStatus.lost, TipStatus.void]))
    )
    settled = result.scalars().all()

    won = [t for t in settled if t.status == TipStatus.won]
    lost = [t for t in settled if t.status == TipStatus.lost]
    void = [t for t in settled if t.status == TipStatus.void]

    total_settled = len(settled)
    total_won = len(won)
    total_lost = len(lost)
    total_void = len(void)

    # Win rate (excluding void)
    decisive = total_won + total_lost
    win_rate = (total_won / decisive * 100) if decisive > 0 else 0.0

    # Total staked and PnL
    total_staked = sum(float(t.stake_units) for t in settled if t.status != TipStatus.void)
    total_pnl = sum(float(t.pnl_units or 0) for t in settled)

    # Yield = total PnL / total staked
    yield_pct = (total_pnl / total_staked * 100) if total_staked > 0 else 0.0

    # ROI = total PnL / initial bankroll (100)
    roi_pct = total_pnl  # since initial is 100, ROI% = PnL

    # Average odd
    odds = [float(t.taken_odd) for t in settled if t.status != TipStatus.void]
    avg_odd = sum(odds) / len(odds) if odds else 0.0

    # Drawdown from equity curve
    ledger_result = await db.execute(
        select(BankrollLedger).order_by(BankrollLedger.created_at.asc())
    )
    entries = ledger_result.scalars().all()
    equity = [float(e.balance_after_units) for e in entries]

    max_drawdown = 0.0
    peak = equity[0] if equity else 100.0
    for val in equity:
        if val > peak:
            peak = val
        dd = (peak - val) / peak * 100
        if dd > max_drawdown:
            max_drawdown = dd

    # Win/loss streaks
    longest_win = 0
    longest_loss = 0
    current_win = 0
    current_loss = 0
    for t in sorted(settled, key=lambda x: x.settled_at or x.published_at):
        if t.status == TipStatus.won:
            current_win += 1
            current_loss = 0
            longest_win = max(longest_win, current_win)
        elif t.status == TipStatus.lost:
            current_loss += 1
            current_win = 0
            longest_loss = max(longest_loss, current_loss)
        else:
            current_win = 0
            current_loss = 0

    # PnL by sport
    pnl_by_sport: dict[str, float] = {}
    for t in settled:
        sport = t.sport.value
        pnl_by_sport[sport] = pnl_by_sport.get(sport, 0.0) + float(t.pnl_units or 0)

    return PerformanceResponse(
        yield_pct=round(yield_pct, 2),
        roi_pct=round(roi_pct, 2),
        win_rate=round(win_rate, 1),
        total_settled=total_settled,
        total_won=total_won,
        total_lost=total_lost,
        total_void=total_void,
        avg_odd=round(avg_odd, 2),
        max_drawdown=round(max_drawdown, 2),
        longest_win_streak=longest_win,
        longest_loss_streak=longest_loss,
        pnl_by_sport=pnl_by_sport,
    )
