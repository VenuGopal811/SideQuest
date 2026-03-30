import React, { createContext, useContext, ReactNode } from "react";
import { usePlayer } from "./usePlayer";
import { UserData } from "../types";

// ─── Context Type ─────────────────────────────────────────────────────────────

interface PlayerContextType {
  userData: UserData;
  loading: boolean;
  error: string | null;
  clearError: () => void;
  acceptQuest: () => Promise<void>;
  completeQuest: () => Promise<boolean | undefined>;
  abandonQuest: () => Promise<void>;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
// Wraps the app so all screens share one player state instance.

export const PlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const player = usePlayer();

  return (
    <PlayerContext.Provider value={player}>
      {children}
    </PlayerContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────
// Use this in screens instead of calling usePlayer() directly.

export const usePlayerContext = (): PlayerContextType => {
  const ctx = useContext(PlayerContext);
  if (!ctx) {
    throw new Error("usePlayerContext must be used within a <PlayerProvider>");
  }
  return ctx;
};
