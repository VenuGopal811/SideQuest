from datetime import datetime, timezone, timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.models import User, QuestCompletion
from app.schemas.schemas import UserOut, CompleteQuestOut
from app.services.quest_service import get_random_quest
from app.services.xp_service import calculate_level

router = APIRouter(prefix="/quests", tags=["quests"])


@router.post("/random", response_model=UserOut)
def accept_random_quest(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Assign a random quest to the user.
    Returns updated user (with active_quest populated).
    Rejects if user already has an active quest.
    """
    if current_user.active_quest_id:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="You already have an active quest. Complete or abandon it first.",
        )

    quest = get_random_quest(db, exclude_id=None)
    if not quest:
        raise HTTPException(status_code=500, detail="No quests available.")

    current_user.active_quest_id = quest.id
    db.commit()
    db.refresh(current_user)
    return current_user


@router.post("/complete", response_model=CompleteQuestOut)
def complete_quest(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Mark the active quest as complete.
    Awards XP, recalculates level, records history, updates streak.
    """
    if not current_user.active_quest_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No active quest to complete.",
        )

    quest = current_user.active_quest
    xp_gained = quest.xp_reward
    old_level = current_user.level

    new_xp = current_user.xp + xp_gained
    new_level = calculate_level(new_xp)

    # ── Record completion history ──
    completion = QuestCompletion(
        user_id=current_user.id,
        quest_id=quest.id,
        xp_earned=xp_gained,
    )
    db.add(completion)

    # ── Update streak ──
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    if current_user.last_active_date:
        last = datetime.strptime(current_user.last_active_date, "%Y-%m-%d").date()
        today_date = datetime.now(timezone.utc).date()
        diff = (today_date - last).days
        if diff == 1:
            current_user.streak += 1
        elif diff > 1:
            current_user.streak = 1
        # diff == 0 means already active today, streak stays
    else:
        current_user.streak = 1

    current_user.last_active_date = today

    # ── Update XP / level ──
    current_user.xp = new_xp
    current_user.level = new_level
    current_user.active_quest_id = None

    db.commit()

    return CompleteQuestOut(
        xp_gained=xp_gained,
        new_xp=new_xp,
        new_level=new_level,
        leveled_up=new_level > old_level,
    )


@router.delete("/abandon", status_code=204)
def abandon_quest(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Abandon the active quest. No XP is awarded.
    Returns 204 No Content on success.
    """
    if not current_user.active_quest_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No active quest to abandon.",
        )

    current_user.active_quest_id = None
    db.commit()
