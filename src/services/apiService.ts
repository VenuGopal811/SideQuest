import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserData } from "../types";

// ─── Config ───────────────────────────────────────────────────────────────────
// Point this at your FastAPI server.
// Local dev: "http://192.168.x.x:8000"  (your machine's LAN IP, not localhost)
// Production: "https://api.yourdomain.com"

const BASE_URL = "http://192.168.1.100:8000"; // ← change this
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
export const registerAnonymous = async (): Promise<UserData> => {
  const data = await apiFetch<{ access_token: string; user: UserData }>(
    "/auth/anonymous",
    { method: "POST" }
  );
  await saveToken(data.access_token);
  return data.user;
};

// ─── User ─────────────────────────────────────────────────────────────────────

export const fetchMe = async (): Promise<UserData> => {
  return apiFetch<UserData>("/users/me");
};

// ─── Quests ───────────────────────────────────────────────────────────────────

/**
 * Get a random quest and assign it to the current user.
 * Returns updated UserData with active_quest populated.
 */
export const acceptRandomQuest = async (): Promise<UserData> => {
  return apiFetch<UserData>("/quests/random", { method: "POST" });
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
