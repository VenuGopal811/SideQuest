import { Quest } from "../types";

// ─── Quest Pool ──────────────────────────────────────────────────────────────
// 25 quests across 4 types and 3 difficulty levels

const QUEST_POOL: Quest[] = [
  // FITNESS
  {
    id: "f1",
    title: "10-Minute Sprint",
    description: "Do 10 minutes of non-stop cardio. Run, jump, burpees — your choice.",
    difficulty: "easy",
    xpReward: 50,
    type: "fitness",
  },
  {
    id: "f2",
    title: "Push-Up Gauntlet",
    description: "Do as many push-ups as you can in 3 sets with 60s rest between each.",
    difficulty: "medium",
    xpReward: 100,
    type: "fitness",
  },
  {
    id: "f3",
    title: "Cold Shower Challenge",
    description: "Finish your next shower with 60 seconds of cold water. No skipping.",
    difficulty: "medium",
    xpReward: 120,
    type: "fitness",
  },
  {
    id: "f4",
    title: "1000 Steps",
    description: "Walk or run 1000 steps right now. No elevator, no excuses.",
    difficulty: "easy",
    xpReward: 40,
    type: "fitness",
  },
  {
    id: "f5",
    title: "The Iron Hour",
    description: "Complete a full 60-minute workout — strength, cardio, and stretch.",
    difficulty: "hard",
    xpReward: 250,
    type: "fitness",
  },

  // SOCIAL
  {
    id: "s1",
    title: "Compliment Stranger",
    description: "Give a genuine compliment to someone you don't know well today.",
    difficulty: "easy",
    xpReward: 60,
    type: "social",
  },
  {
    id: "s2",
    title: "Reconnect",
    description: "Message someone you haven't talked to in 3+ months. Make it real.",
    difficulty: "easy",
    xpReward: 50,
    type: "social",
  },
  {
    id: "s3",
    title: "Start a Conversation",
    description: "Strike up a conversation with someone new — in person, not online.",
    difficulty: "medium",
    xpReward: 110,
    type: "social",
  },
  {
    id: "s4",
    title: "Share Your Work",
    description: "Post something you made or learned publicly. Don't overthink it.",
    difficulty: "medium",
    xpReward: 130,
    type: "social",
  },
  {
    id: "s5",
    title: "Host Something",
    description: "Organize a hangout, study session, or meetup with 3+ people this week.",
    difficulty: "hard",
    xpReward: 300,
    type: "social",
  },

  // SKILL
  {
    id: "sk1",
    title: "Learn One Thing",
    description: "Spend 20 minutes learning something completely outside your field.",
    difficulty: "easy",
    xpReward: 70,
    type: "skill",
  },
  {
    id: "sk2",
    title: "Build Something Small",
    description: "Code, draw, write, or design something from scratch in under an hour.",
    difficulty: "medium",
    xpReward: 150,
    type: "skill",
  },
  {
    id: "sk3",
    title: "Teach It Back",
    description: "Explain a concept you recently learned to someone else.",
    difficulty: "medium",
    xpReward: 120,
    type: "skill",
  },
  {
    id: "sk4",
    title: "Deep Work Block",
    description: "Work with zero distractions for 90 minutes on your most important task.",
    difficulty: "hard",
    xpReward: 200,
    type: "skill",
  },
  {
    id: "sk5",
    title: "Read 30 Pages",
    description: "Read 30 pages of a non-fiction book. No skimming.",
    difficulty: "easy",
    xpReward: 80,
    type: "skill",
  },
  {
    id: "sk6",
    title: "Ship It",
    description: "Deploy, publish, or submit something you've been sitting on. Done > perfect.",
    difficulty: "hard",
    xpReward: 350,
    type: "skill",
  },

  // CHAOS
  {
    id: "c1",
    title: "Eat Something New",
    description: "Try a food you've never eaten before today.",
    difficulty: "easy",
    xpReward: 45,
    type: "chaos",
  },
  {
    id: "c2",
    title: "Digital Detox Hour",
    description: "Put your phone down for one full hour. No peeking.",
    difficulty: "medium",
    xpReward: 100,
    type: "chaos",
  },
  {
    id: "c3",
    title: "Take a Different Route",
    description: "Get somewhere today using a path you've never taken before.",
    difficulty: "easy",
    xpReward: 35,
    type: "chaos",
  },
  {
    id: "c4",
    title: "Wake Up Earlier",
    description: "Tomorrow, set your alarm 1 hour earlier than usual. Actually get up.",
    difficulty: "medium",
    xpReward: 130,
    type: "chaos",
  },
  {
    id: "c5",
    title: "Write by Hand",
    description: "Write 1 full page in a notebook about anything. No keyboard.",
    difficulty: "easy",
    xpReward: 55,
    type: "chaos",
  },
  {
    id: "c6",
    title: "Say Yes",
    description: "Say yes to the next social invite you'd normally skip.",
    difficulty: "medium",
    xpReward: 140,
    type: "chaos",
  },
  {
    id: "c7",
    title: "The Midnight Mission",
    description: "Do something productive after 10 PM that you've been putting off.",
    difficulty: "hard",
    xpReward: 220,
    type: "chaos",
  },
  {
    id: "c8",
    title: "No Complaints Day",
    description: "Go an entire day without complaining out loud. Reset if you slip.",
    difficulty: "hard",
    xpReward: 280,
    type: "chaos",
  },
  {
    id: "c9",
    title: "Spend Zero",
    description: "Don't spend any money today. Not a rupee.",
    difficulty: "medium",
    xpReward: 90,
    type: "chaos",
  },
];

// ─── Quest Service ────────────────────────────────────────────────────────────

/**
 * Returns a random quest from the pool, avoiding the current active quest.
 */
export const getRandomQuest = (currentQuestId?: string | null): Quest => {
  const available = currentQuestId
    ? QUEST_POOL.filter((q) => q.id !== currentQuestId)
    : QUEST_POOL;

  const index = Math.floor(Math.random() * available.length);
  return available[index];
};

/**
 * Returns the emoji icon for a quest type.
 */
export const getQuestTypeIcon = (type: Quest["type"]): string => {
  const icons = {
    fitness: "⚡",
    social: "🤝",
    skill: "🧠",
    chaos: "🎲",
  };
  return icons[type];
};

/**
 * Returns the color key for a difficulty level.
 */
export const getDifficultyColor = (
  difficulty: Quest["difficulty"]
): string => {
  const colors = {
    easy: "#4ade80",   // green
    medium: "#facc15", // yellow
    hard: "#f87171",   // red
  };
  return colors[difficulty];
};
