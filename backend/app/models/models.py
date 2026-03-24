from sqlalchemy import Column, String, Integer, ForeignKey, Enum as SAEnum
from sqlalchemy.orm import relationship
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

    # FK to the currently active quest (nullable — no quest = null)
    active_quest_id = Column(String, ForeignKey("quests.id"), nullable=True)
    active_quest = relationship("Quest", foreign_keys=[active_quest_id])


# ─── Quest (pool) ─────────────────────────────────────────────────────────────

class Quest(Base):
    __tablename__ = "quests"

    id = Column(String, primary_key=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    difficulty = Column(SAEnum(QuestDifficulty), nullable=False)
    xp_reward = Column(Integer, nullable=False)
    type = Column(SAEnum(QuestType), nullable=False)
