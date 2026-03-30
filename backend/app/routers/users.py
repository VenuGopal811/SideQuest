from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.dependencies import get_current_user
from app.models.models import User
from app.schemas.schemas import UserOut, LeaderboardEntry, QuestCompletionOut

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    """Return the current user's profile: XP, level, streak, and active quest."""
    return current_user


@router.get("/leaderboard", response_model=List[LeaderboardEntry])
def get_leaderboard(db: Session = Depends(get_db)):
    """Return the top 50 players ordered by XP descending."""
    users = db.query(User).order_by(User.xp.desc()).limit(50).all()
    return users


@router.get("/me/history", response_model=List[QuestCompletionOut])
def get_quest_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Return the current user's quest completion history, most recent first."""
    completions = current_user.completions  # ordered by completed_at desc via relationship
    result = []
    for c in completions:
        result.append(QuestCompletionOut(
            id=c.id,
            quest_title=c.quest.title,
            quest_type=c.quest.type,
            quest_difficulty=c.quest.difficulty,
            xp_earned=c.xp_earned,
            completed_at=c.completed_at,
        ))
    return result
