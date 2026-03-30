from sqlalchemy import Column, String, Integer, ForeignKey, Enum as SAEnum, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import enum
import uuid

from app.database import Base


# ─── Enums ────────────────────────────────────────────────────────────────────

class QuestDifficulty(str, enum.Enum):
    easy = "easy"
    medium = "medium"
    hard = "hard"


class QuestType(str, enum.Enum):
    fitness = "fitness"
    social = "social"
    skill = "skill"
    chaos = "chaos"


# ─── User ─────────────────────────────────────────────────────────────────────

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    xp = Column(Integer, default=0, nullable=False)
    level = Column(Integer, default=0, nullable=False)
    streak = Column(Integer, default=0, nullable=False)
    last_active_date = Column(String, nullable=True)  # ISO date string "YYYY-MM-DD"

    # FK to the currently active quest (nullable — no quest = null)
    active_quest_id = Column(String, ForeignKey("quests.id"), nullable=True)
    active_quest = relationship("Quest", foreign_keys=[active_quest_id])

    # Quest history
    completions = relationship("QuestCompletion", back_populates="user", order_by="QuestCompletion.completed_at.desc()")


# ─── Quest (pool) ─────────────────────────────────────────────────────────────

class Quest(Base):
    __tablename__ = "quests"

    id = Column(String, primary_key=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    difficulty = Column(SAEnum(QuestDifficulty), nullable=False)
    xp_reward = Column(Integer, nullable=False)
    type = Column(SAEnum(QuestType), nullable=False)


# ─── Quest Completion (history) ───────────────────────────────────────────────

class QuestCompletion(Base):
    __tablename__ = "quest_completions"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    quest_id = Column(String, ForeignKey("quests.id"), nullable=False)
    xp_earned = Column(Integer, nullable=False)
    completed_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    user = relationship("User", back_populates="completions")
    quest = relationship("Quest")
