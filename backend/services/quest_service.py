"""Load quests from JSON and expose filter / random-selection helpers."""

import json
import random
from pathlib import Path

from models.quest import Quest, Category

# ─── Load once at import time ────────────────────────────────────────────────

_DATA_PATH = Path(__file__).resolve().parent.parent / "data" / "quests.json"

with open(_DATA_PATH, encoding="utf-8") as f:
    _QUESTS: list[Quest] = [Quest(**q) for q in json.load(f)]


# ─── Public helpers ──────────────────────────────────────────────────────────

def get_random_quest() -> Quest:
    """Return one random quest from the full pool."""
    return random.choice(_QUESTS)


def get_random_quest_by_category(category: str) -> Quest:
    """Return one random quest that matches the given category.

    Raises ValueError if the category is invalid or has no quests.
    """
    cat = Category(category)  # raises ValueError on bad input
    pool = [q for q in _QUESTS if q.category == cat]
    if not pool:
        raise ValueError(f"No quests found for category '{category}'")
    return random.choice(pool)


def get_quests(limit: int = 10) -> list[Quest]:
    """Return up to *limit* quests (default 10, max 50)."""
    limit = max(1, min(limit, 50))
    return random.sample(_QUESTS, min(limit, len(_QUESTS)))
