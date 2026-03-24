import { useState, useEffect, useCallback } from "react";
import { UserData } from "../types";
import {
  getToken,
  registerAnonymous,
  fetchMe,
  acceptRandomQuest,
  completeQuest as apiCompleteQuest,
  abandonQuest as apiAbandonQuest,
} from "../services/apiService";

// ─── usePlayer Hook ───────────────────────────────────────────────────────────
// Owns all player state. On mount: check for stored token → load profile,
// or register anonymously if first launch.

export const usePlayer = () => {
  const [userData, setUserData] = useState<UserData>({
    xp: 0,
    level: 0,
    activeQuest: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Bootstrap: token check → fetch or register ──
  useEffect(() => {
    const bootstrap = async () => {
      try {
        const token = await getToken();
        if (token) {
          const user = await fetchMe();
          setUserData(mapUser(user));
        } else {
          const user = await registerAnonymous();
          setUserData(mapUser(user));
        }
      } catch (e: any) {
        setError(e.message ?? "Failed to load player data.");
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  // ── Accept a random quest ──
  const acceptQuest = useCallback(async () => {
    if (userData.activeQuest) return;
    try {
      const updated = await acceptRandomQuest();
      setUserData(mapUser(updated));
    } catch (e: any) {
      setError(e.message ?? "Failed to get quest.");
    }
  }, [userData.activeQuest]);

  // ── Complete active quest → gain XP ──
  const completeQuest = useCallback(async () => {
    if (!userData.activeQuest) return;
    try {
      const result = await apiCompleteQuest();
      setUserData({ xp: result.new_xp, level: result.new_level, activeQuest: null });
      return result.leveled_up;
    } catch (e: any) {
      setError(e.message ?? "Failed to complete quest.");
    }
  }, [userData.activeQuest]);

  // ── Abandon active quest (no XP) ──
  const abandonQuest = useCallback(async () => {
    if (!userData.activeQuest) return;
    try {
      await apiAbandonQuest();
      setUserData((prev) => ({ ...prev, activeQuest: null }));
    } catch (e: any) {
      setError(e.message ?? "Failed to abandon quest.");
    }
  }, [userData.activeQuest]);

  const clearError = () => setError(null);

  return { userData, loading, error, clearError, acceptQuest, completeQuest, abandonQuest };
};

// ─── Map snake_case API response → camelCase UserData ────────────────────────
// FastAPI returns snake_case; frontend types are camelCase. Bridge here once.
const mapUser = (raw: any): UserData => ({
  xp: raw.xp,
  level: raw.level,
  activeQuest: raw.active_quest
    ? {
        id: raw.active_quest.id,
        title: raw.active_quest.title,
        description: raw.active_quest.description,
        difficulty: raw.active_quest.difficulty,
        xpReward: raw.active_quest.xp_reward,
        type: raw.active_quest.type,
      }
    : null,
});
