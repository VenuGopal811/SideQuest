// ─── Core Types ──────────────────────────────────────────────────────────────

export type QuestDifficulty = "easy" | "medium" | "hard";
export type QuestType = "fitness" | "social" | "skill" | "chaos";

export interface Quest {
  id: string;
  title: string;
  description: string;
  difficulty: QuestDifficulty;
  xpReward: number;
  type: QuestType;
}

export interface UserData {
  xp: number;
  level: number;
  streak: number;
  activeQuest: Quest | null;
}

export interface QuestCompletion {
  id: string;
  questTitle: string;
  questType: QuestType;
  questDifficulty: QuestDifficulty;
  xpEarned: number;
  completedAt: string;
}
