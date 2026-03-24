import math


# ─── XP System ────────────────────────────────────────────────────────────────
# Formula: level = floor(0.1 * sqrt(xp))
# Matches the frontend xpSystem.ts logic exactly.


def calculate_level(xp: int) -> int:
    """Derive level from total XP."""
    return math.floor(0.1 * math.sqrt(xp))


def xp_for_level(level: int) -> int:
    """Minimum XP required to reach a given level."""
    return int((level / 0.1) ** 2)


def xp_to_next_level(xp: int) -> int:
    """How much XP is still needed to reach the next level."""
    next_level = calculate_level(xp) + 1
    return max(0, xp_for_level(next_level) - xp)


def get_level_progress(xp: int) -> float:
    """Progress toward next level as a value between 0 and 1."""
    current_level = calculate_level(xp)
    current_level_xp = xp_for_level(current_level)
    next_level_xp = xp_for_level(current_level + 1)
    if next_level_xp == current_level_xp:
        return 1.0
    return (xp - current_level_xp) / (next_level_xp - current_level_xp)
