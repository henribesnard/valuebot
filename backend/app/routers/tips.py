from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db, get_optional_user
from app.models.tip import Match, Tip, TipStatus, SportType
from app.models.user import User
from app.schemas.tip import TipDetailResponse, TipListResponse, TipResponse

router = APIRouter()

SPORT_LABELS = {"football": "\u26bd Football", "tennis": "\U0001F3BE Tennis"}


def _format_when(start_time: datetime) -> str:
    now = datetime.now(timezone.utc)
    diff = start_time - now
    if diff.total_seconds() < 0:
        return start_time.strftime("%d/%m \u00b7 %H:%M")
    if diff.days == 0:
        return f"Aujourd\u2019hui \u00b7 {start_time.strftime('%H:%M')}"
    if diff.days == 1:
        return f"Demain \u00b7 {start_time.strftime('%H:%M')}"
    return start_time.strftime("%d/%m \u00b7 %H:%M")


def _format_odd_captured(captured_at: datetime) -> str:
    return captured_at.strftime("%d/%m \u00e0 %H:%M")


def _tip_to_response(tip: Tip, match: Match) -> TipResponse:
    status_map = {
        "pending": "avenir",
        "won": "gagne",
        "lost": "perdu",
        "void": "annule",
        "cancelled": "annule",
    }
    return TipResponse(
        id=tip.id,
        sport=tip.sport.value,
        sport_label=SPORT_LABELS.get(tip.sport.value, tip.sport.value),
        competition=match.competition if match else "",
        matchup=f"{match.home_or_player1} \u2014 {match.away_or_player2}" if match else "",
        when=_format_when(match.start_time) if match else "",
        selection=tip.selection,
        confidence=tip.confidence,
        stake_units=float(tip.stake_units),
        taken_odd=float(tip.taken_odd),
        bookmaker=tip.bookmaker,
        odd_captured_at=_format_odd_captured(tip.odd_captured_at),
        status=status_map.get(tip.status.value, tip.status.value),
        rationale=tip.rationale,
        pnl_units=float(tip.pnl_units) if tip.pnl_units is not None else None,
        estimated_probability=float(tip.estimated_probability) if tip.estimated_probability else None,
        expected_value=float(tip.expected_value) if tip.expected_value else None,
    )


def _get_user_plan(user: User | None) -> str:
    if not user or not user.subscription:
        return "anonymous"
    return user.subscription.plan.value


@router.get("", response_model=TipListResponse)
async def list_tips(
    sport: str | None = None,
    status: str | None = None,
    page: int = 1,
    limit: int = 20,
    user: User | None = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db),
):
    plan = _get_user_plan(user)
    query = select(Tip, Match).outerjoin(Match, Tip.match_id == Match.id)

    # Auth-aware: anonymous and decouverte see only J+1
    if plan in ("anonymous", "decouverte"):
        cutoff = datetime.now(timezone.utc) - timedelta(days=1)
        query = query.where(Tip.published_at <= cutoff)

    # Filters
    if sport and sport != "tous":
        query = query.where(Tip.sport == sport)
    if status and status != "tous":
        if status == "avenir":
            query = query.where(Tip.status == TipStatus.pending)
        elif status == "regle":
            query = query.where(Tip.status != TipStatus.pending)

    # Count
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar() or 0

    # Paginate
    query = query.order_by(Tip.published_at.desc())
    query = query.offset((page - 1) * limit).limit(limit)

    result = await db.execute(query)
    rows = result.all()

    tips = [_tip_to_response(tip, match) for tip, match in rows]

    return TipListResponse(tips=tips, total=total, page=page, limit=limit)


@router.get("/{tip_id}", response_model=TipDetailResponse)
async def get_tip(
    tip_id: int,
    user: User | None = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Tip, Match).outerjoin(Match, Tip.match_id == Match.id).where(Tip.id == tip_id)
    )
    row = result.first()
    if not row:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conseil introuvable")

    tip, match = row

    # Auth-aware check
    plan = _get_user_plan(user)
    if plan in ("anonymous", "decouverte"):
        cutoff = datetime.now(timezone.utc) - timedelta(days=1)
        if tip.published_at and tip.published_at > cutoff:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Ce conseil est reserve aux abonnes Pro ou Expert",
            )

    base = _tip_to_response(tip, match)

    return TipDetailResponse(
        **base.model_dump(),
        match_home=match.home_or_player1 if match else "",
        match_away=match.away_or_player2 if match else "",
        match_start_time=match.start_time.isoformat() if match else "",
        market=tip.market,
        fair_odd=float(tip.fair_odd) if tip.fair_odd else None,
    )
