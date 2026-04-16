import { Quest } from "../types";
import { API_BASE_URL } from "../config/api";

// ─── Fallback Quests (used when the API is unreachable) ──────────────────────

const FALLBACK_QUESTS: Quest[] = [
  {
    id: "fallback-1",
    title: "Morning Stretch Routine",
    description: "Complete a 10-minute full-body stretching session to start your day.",
    difficulty: "easy",
    xpReward: 10,
    type: "fitness",
  },
  {
    id: "fallback-2",
    title: "Compliment a Stranger",
    description: "Give a genuine, specific compliment to someone you don't know today.",
    difficulty: "easy",
    xpReward: 10,
    type: "social",
  },
  {
    id: "fallback-3",
    title: "Pomodoro Power Hour",
    description: "Work in two 25-minute Pomodoro sprints with a 5-minute break in between.",
    difficulty: "medium",
    xpReward: 25,
    type: "skill",
  },
  {
    id: "fallback-4",
    title: "Sketch a Self-Portrait",
    description: "Draw a self-portrait using any medium — pencil, digital, or even crayon.",
    difficulty: "medium",
    xpReward: 25,
    type: "chaos",
  },
  {
    id: "fallback-5",
    title: "Full Digital Detox Evening",
    description: "No screens after 7 PM. Read, walk, cook, or just sit with your thoughts until bed.",
    difficulty: "hard",
    xpReward: 50,
    type: "chaos",
  },
];

// ─── Category → QuestType mapping ────────────────────────────────────────────
// Backend uses 5 categories; frontend uses 4 quest types.

const CATEGORY_TO_TYPE: Record<string, Quest["type"]> = {
  fitness: "fitness",
  social: "social",
  creative: "skill",
  productivity: "skill",
  challenge: "chaos",
};

// ─── Quest Service ───────────────────────────────────────────────────────────

/**
 * Fetches a random quest from the backend API.
 * Falls back to a local quest if the network request fails.
 */
export const getRandomQuest = async (): Promise<Quest> => {
  try {
    const res = await fetch(`${API_BASE_URL}/quests/random`);
    if (!res.ok) throw new Error(`API error: ${res.status}`);

    const data = await res.json();

    // Map backend schema → frontend Quest type
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      difficulty: data.difficulty,
      xpReward: data.xp_reward,
      type: CATEGORY_TO_TYPE[data.category] ?? "chaos",
    };
  } catch {
    // Graceful fallback: return a random quest from the local array
    const index = Math.floor(Math.random() * FALLBACK_QUESTS.length);
    return FALLBACK_QUESTS[index];
  }
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
