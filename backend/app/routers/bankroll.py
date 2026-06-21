from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db
from app.models.bankroll import BankrollLedger
from app.models.tip import Tip, TipStatus
from app.schemas.bankroll import BankrollResponse

router = APIRouter()


@router.get("", response_model=BankrollResponse)
async def get_bankroll(db: AsyncSession = Depends(get_db)):
    # Get all ledger entries ordered by creation
    result = await db.execute(
        select(BankrollLedger).order_by(BankrollLedger.created_at.asc())
    )
    entries = result.scalars().all()

    equity_curve = [float(e.balance_after_units) for e in entries]
    current_balance = equity_curve[-1] if equity_curve else 100.0
    initial_balance = equity_curve[0] if equity_curve else 100.0

    # Count tips
    total_result = await db.execute(select(Tip))
    all_tips = total_result.scalars().all()
    total_tips = len(all_tips)
    pending_tips = sum(1 for t in all_tips if t.status == TipStatus.pending)

    return BankrollResponse(
        current_balance=current_balance,
        initial_balance=initial_balance,
        equity_curve=equity_curve,
        total_tips=total_tips,
        pending_tips=pending_tips,
    )
