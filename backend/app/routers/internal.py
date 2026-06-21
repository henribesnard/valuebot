from datetime import date, datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.dependencies import get_db
from app.models.bankroll import BankrollLedger, LedgerType, Learning
from app.models.tip import Tip, TipStatus
from app.schemas.bankroll import CreateLearningRequest, CreateTipRequest, SettleTipRequest

router = APIRouter()


def _verify_hermes_token(request: Request) -> None:
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token requis")
    token = auth[7:]
    if token != settings.hermes_api_token:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Token invalide")


@router.post("/tips", status_code=201)
async def create_tip(
    data: CreateTipRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    _verify_hermes_token(request)
    tip = Tip(
        match_id=data.match_id,
        sport=data.sport,
        market=data.market,
        selection=data.selection,
        estimated_probability=data.estimated_probability,
        fair_odd=round(1 / data.estimated_probability, 3) if data.estimated_probability else None,
        taken_odd=data.taken_odd,
        bookmaker=data.bookmaker,
        odd_captured_at=datetime.fromisoformat(data.odd_captured_at),
        expected_value=data.expected_value,
        confidence=data.confidence,
        stake_units=data.stake_units,
        rationale=data.rationale,
        status=TipStatus.pending,
        model_version_id=1,
    )
    db.add(tip)
    await db.commit()
    await db.refresh(tip)
    return {"id": tip.id, "status": "published"}


@router.patch("/tips/{tip_id}/settle")
async def settle_tip(
    tip_id: int,
    data: SettleTipRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    _verify_hermes_token(request)

    result = await db.execute(select(Tip).where(Tip.id == tip_id))
    tip = result.scalar_one_or_none()
    if not tip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tip introuvable")

    if tip.status != TipStatus.pending:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ce tip est deja regle",
        )

    # Validate status
    valid_statuses = {"won", "lost", "void"}
    if data.status not in valid_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Statut invalide. Valeurs acceptees: {valid_statuses}",
        )

    # Compute PnL
    if data.status == "won":
        pnl = float(tip.stake_units) * (float(tip.taken_odd) - 1)
    elif data.status == "lost":
        pnl = -float(tip.stake_units)
    else:
        pnl = 0.0

    tip.status = TipStatus(data.status)
    tip.pnl_units = round(pnl, 2)
    tip.settled_at = datetime.now(timezone.utc)

    # Get current balance
    last_entry = await db.execute(
        select(BankrollLedger).order_by(BankrollLedger.created_at.desc()).limit(1)
    )
    last = last_entry.scalar_one_or_none()
    current_balance = float(last.balance_after_units) if last else 100.0

    new_balance = round(current_balance + pnl, 2)
    ledger_entry = BankrollLedger(
        tip_id=tip.id,
        type=LedgerType.bet_settled,
        delta_units=round(pnl, 2),
        balance_after_units=new_balance,
    )
    db.add(ledger_entry)
    await db.commit()

    return {"id": tip.id, "status": data.status, "pnl_units": pnl, "new_balance": new_balance}


@router.post("/learnings", status_code=201)
async def create_learning(
    data: CreateLearningRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    _verify_hermes_token(request)
    learning = Learning(
        date=date.fromisoformat(data.date),
        period_metrics_json=data.period_metrics_json,
        observations=data.observations,
        adjustments_json=data.adjustments_json,
    )
    db.add(learning)
    await db.commit()
    await db.refresh(learning)
    return {"id": learning.id, "status": "created"}
