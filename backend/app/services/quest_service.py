from sqlalchemy.orm import Session
from app.models.models import Quest, QuestDifficulty, QuestType

# ─── Quest Pool ───────────────────────────────────────────────────────────────
# 25 quests. Seed once on startup via seed_quests().

QUEST_POOL = [
    # FITNESS
    Quest(id="f1", title="10-Minute Sprint", description="Do 10 minutes of non-stop cardio. Run, jump, burpees — your choice.", difficulty=QuestDifficulty.easy, xp_reward=50, type=QuestType.fitness),
    Quest(id="f2", title="Push-Up Gauntlet", description="Do as many push-ups as you can in 3 sets with 60s rest between each.", difficulty=QuestDifficulty.medium, xp_reward=100, type=QuestType.fitness),
    Quest(id="f3", title="Cold Shower Challenge", description="Finish your next shower with 60 seconds of cold water. No skipping.", difficulty=QuestDifficulty.medium, xp_reward=120, type=QuestType.fitness),
    Quest(id="f4", title="1000 Steps", description="Walk or run 1000 steps right now. No elevator, no excuses.", difficulty=QuestDifficulty.easy, xp_reward=40, type=QuestType.fitness),
    Quest(id="f5", title="The Iron Hour", description="Complete a full 60-minute workout — strength, cardio, and stretch.", difficulty=QuestDifficulty.hard, xp_reward=250, type=QuestType.fitness),

    # SOCIAL
    Quest(id="s1", title="Compliment a Stranger", description="Give a genuine compliment to someone you don't know well today.", difficulty=QuestDifficulty.easy, xp_reward=60, type=QuestType.social),
    Quest(id="s2", title="Reconnect", description="Message someone you haven't talked to in 3+ months. Make it real.", difficulty=QuestDifficulty.easy, xp_reward=50, type=QuestType.social),
    Quest(id="s3", title="Start a Conversation", description="Strike up a conversation with someone new — in person, not online.", difficulty=QuestDifficulty.medium, xp_reward=110, type=QuestType.social),
    Quest(id="s4", title="Share Your Work", description="Post something you made or learned publicly. Don't overthink it.", difficulty=QuestDifficulty.medium, xp_reward=130, type=QuestType.social),
    Quest(id="s5", title="Host Something", description="Organize a hangout, study session, or meetup with 3+ people this week.", difficulty=QuestDifficulty.hard, xp_reward=300, type=QuestType.social),

    # SKILL
    Quest(id="sk1", title="Learn One Thing", description="Spend 20 minutes learning something completely outside your field.", difficulty=QuestDifficulty.easy, xp_reward=70, type=QuestType.skill),
    Quest(id="sk2", title="Build Something Small", description="Code, draw, write, or design something from scratch in under an hour.", difficulty=QuestDifficulty.medium, xp_reward=150, type=QuestType.skill),
    Quest(id="sk3", title="Teach It Back", description="Explain a concept you recently learned to someone else.", difficulty=QuestDifficulty.medium, xp_reward=120, type=QuestType.skill),
    Quest(id="sk4", title="Deep Work Block", description="Work with zero distractions for 90 minutes on your most important task.", difficulty=QuestDifficulty.hard, xp_reward=200, type=QuestType.skill),
    Quest(id="sk5", title="Read 30 Pages", description="Read 30 pages of a non-fiction book. No skimming.", difficulty=QuestDifficulty.easy, xp_reward=80, type=QuestType.skill),
    Quest(id="sk6", title="Ship It", description="Deploy, publish, or submit something you've been sitting on. Done > perfect.", difficulty=QuestDifficulty.hard, xp_reward=350, type=QuestType.skill),

    # CHAOS
    Quest(id="c1", title="Eat Something New", description="Try a food you've never eaten before today.", difficulty=QuestDifficulty.easy, xp_reward=45, type=QuestType.chaos),
    Quest(id="c2", title="Digital Detox Hour", description="Put your phone down for one full hour. No peeking.", difficulty=QuestDifficulty.medium, xp_reward=100, type=QuestType.chaos),
    Quest(id="c3", title="Take a Different Route", description="Get somewhere today using a path you've never taken before.", difficulty=QuestDifficulty.easy, xp_reward=35, type=QuestType.chaos),
    Quest(id="c4", title="Wake Up Earlier", description="Tomorrow, set your alarm 1 hour earlier than usual. Actually get up.", difficulty=QuestDifficulty.medium, xp_reward=130, type=QuestType.chaos),
    Quest(id="c5", title="Write by Hand", description="Write 1 full page in a notebook about anything. No keyboard.", difficulty=QuestDifficulty.easy, xp_reward=55, type=QuestType.chaos),
    Quest(id="c6", title="Say Yes", description="Say yes to the next social invite you'd normally skip.", difficulty=QuestDifficulty.medium, xp_reward=140, type=QuestType.chaos),
    Quest(id="c7", title="The Midnight Mission", description="Do something productive after 10 PM that you've been putting off.", difficulty=QuestDifficulty.hard, xp_reward=220, type=QuestType.chaos),
    Quest(id="c8", title="No Complaints Day", description="Go an entire day without complaining out loud. Reset if you slip.", difficulty=QuestDifficulty.hard, xp_reward=280, type=QuestType.chaos),
    Quest(id="c9", title="Spend Zero", description="Don't spend any money today. Not a rupee.", difficulty=QuestDifficulty.medium, xp_reward=90, type=QuestType.chaos),
]


def seed_quests(db: Session) -> None:
    """Insert quests into DB if they don't already exist. Safe to call on every startup."""
    existing_ids = {q.id for q in db.query(Quest.id).all()}
    new_quests = [q for q in QUEST_POOL if q.id not in existing_ids]
    if new_quests:
        db.add_all(new_quests)
        db.commit()


def get_random_quest(db: Session, exclude_id: str | None = None) -> Quest | None:
    """Return a random quest, optionally excluding the currently active one."""
    from sqlalchemy import func
    query = db.query(Quest)
    if exclude_id:
        query = query.filter(Quest.id != exclude_id)
    return query.order_by(func.random()).first()
