"""Pydantic models for the Quest resource."""

from enum import Enum
from pydantic import BaseModel, Field
from typing import Literal
from uuid import uuid4


class Category(str, Enum):
    fitness = "fitness"
    social = "social"
    creative = "creative"
    productivity = "productivity"
    challenge = "challenge"


class Difficulty(str, Enum):
    easy = "easy"
    medium = "medium"
    hard = "hard"


# XP mapping: easy → 10, medium → 25, hard → 50
XP_MAP: dict[Difficulty, int] = {
    Difficulty.easy: 10,
    Difficulty.medium: 25,
    Difficulty.hard: 50,
}


class Quest(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    title: str
    description: str
    category: Category
    difficulty: Difficulty
    xp_reward: Literal[10, 25, 50]
