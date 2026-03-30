from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.models import QuestDifficulty, QuestType


# ─── Quest ────────────────────────────────────────────────────────────────────

class QuestOut(BaseModel):
    id: str
    title: str
    description: str
    difficulty: QuestDifficulty
    xp_reward: int
    type: QuestType

    model_config = {"from_attributes": True}


# ─── User ─────────────────────────────────────────────────────────────────────

class UserOut(BaseModel):
    id: str
    xp: int
    level: int
    streak: int = 0
    active_quest: Optional[QuestOut] = None

    model_config = {"from_attributes": True}


# ─── Auth ─────────────────────────────────────────────────────────────────────

class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


# ─── XP response (after completing a quest) ──────────────────────────────────

class CompleteQuestOut(BaseModel):
    xp_gained: int
    new_xp: int
    new_level: int
    leveled_up: bool


# ─── Quest Completion (history) ───────────────────────────────────────────────

class QuestCompletionOut(BaseModel):
    id: str
    quest_title: str
    quest_type: QuestType
    quest_difficulty: QuestDifficulty
    xp_earned: int
    completed_at: datetime

    model_config = {"from_attributes": True}


# ─── Leaderboard ──────────────────────────────────────────────────────────────

class LeaderboardEntry(BaseModel):
    id: str
    xp: int
    level: int
    streak: int = 0

    model_config = {"from_attributes": True}
