"""Router for quest endpoints."""

from fastapi import APIRouter, HTTPException, Query
from typing import Optional

from models.quest import Quest
from services.quest_service import (
    get_random_quest,
    get_random_quest_by_category,
    get_quests,
)

router = APIRouter(prefix="/quests", tags=["quests"])


@router.get("/random", response_model=Quest)
def random_quest(category: Optional[str] = Query(default=None)):
    """GET /quests/random — return one random quest.

    Optional query param ``category`` filters by category.
    Returns 400 if the category is invalid.
    """
    if category is None:
        return get_random_quest()
    try:
        return get_random_quest_by_category(category)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@router.get("", response_model=list[Quest])
def list_quests(limit: int = Query(default=10, ge=1, le=50)):
    """GET /quests?limit=N — return N random quests (default 10, max 50)."""
    return get_quests(limit)
