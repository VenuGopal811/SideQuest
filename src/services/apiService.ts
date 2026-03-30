import AsyncStorage from "@react-native-async-storage/async-storage";
import { QuestCompletion } from "../types";

// ─── Config ───────────────────────────────────────────────────────────────────
// Use your computer's LAN IP so physical devices can reach the backend.
// Find it with: ipconfig (Windows) or ifconfig (Mac/Linux)
const DEV_URL = "http://172.16.185.42:8000";
const PROD_URL = "https://api.yourdomain.com";

const BASE_URL = __DEV__ ? DEV_URL : PROD_URL;
const TOKEN_KEY = "sidequest_token";

// ─── Token storage ────────────────────────────────────────────────────────────

export const saveToken = async (token: string): Promise<void> => {
  await AsyncStorage.setItem(TOKEN_KEY, token);
};

export const getToken = async (): Promise<string | null> => {
  return AsyncStorage.getItem(TOKEN_KEY);
};

export const clearToken = async (): Promise<void> => {
  await AsyncStorage.removeItem(TOKEN_KEY);
};

// ─── Base fetch wrapper ───────────────────────────────────────────────────────

const apiFetch = async <T>(
  path: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = await getToken();

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail ?? `HTTP ${res.status}`);
  }

  // 204 No Content — return empty
  if (res.status === 204) return undefined as T;

  return res.json();
};

// ─── Auth ─────────────────────────────────────────────────────────────────────

/**
 * Register as an anonymous user.
 * Stores the returned JWT locally — call once on first launch.
 */
export const registerAnonymous = async (): Promise<any> => {
  const data = await apiFetch<{ access_token: string; user: any }>(
    "/auth/anonymous",
    { method: "POST" }
  );
  await saveToken(data.access_token);
  return data.user;
};

// ─── User ─────────────────────────────────────────────────────────────────────

export const fetchMe = async (): Promise<any> => {
  return apiFetch<any>("/users/me");
};

// ─── Quests ───────────────────────────────────────────────────────────────────

/**
 * Get a random quest and assign it to the current user.
 * Returns updated UserData (raw) with active_quest populated.
 */
export const acceptRandomQuest = async (): Promise<any> => {
  return apiFetch<any>("/quests/random", { method: "POST" });
};

/**
 * Complete the active quest. Returns XP gained + new level info.
 */
export const completeQuest = async (): Promise<{
  xp_gained: number;
  new_xp: number;
  new_level: number;
  leveled_up: boolean;
}> => {
  return apiFetch("/quests/complete", { method: "POST" });
};

/**
 * Abandon the active quest with no XP reward.
 */
export const abandonQuest = async (): Promise<void> => {
  return apiFetch("/quests/abandon", { method: "DELETE" });
};

// ─── Social ───────────────────────────────────────────────────────────────────

export const getLeaderboard = async (): Promise<any[]> => {
  return apiFetch<any[]>("/users/leaderboard");
};

// ─── Quest History ────────────────────────────────────────────────────────────

export const getQuestHistory = async (): Promise<QuestCompletion[]> => {
  const raw = await apiFetch<any[]>("/users/me/history");
  return raw.map((c) => ({
    id: c.id,
    questTitle: c.quest_title,
    questType: c.quest_type,
    questDifficulty: c.quest_difficulty,
    xpEarned: c.xp_earned,
    completedAt: c.completed_at,
  }));
};
