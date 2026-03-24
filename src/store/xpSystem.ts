// ─── XP & Level Logic ─────────────────────────────────────────────────────────

/**
 * Calculates level from total XP.
 * Formula: level = floor(0.1 * sqrt(xp))
 * Examples: 100xp → L1, 400xp → L2, 900xp → L3, 10000xp → L10
 */
export const calculateLevel = (xp: number): number => {
  return Math.floor(0.1 * Math.sqrt(xp));
};

/**
 * Returns the XP required to reach the next level.
 * Derived by inverting the level formula: xp = (level / 0.1)^2
 */
export const xpForLevel = (level: number): number => {
  return Math.pow(level / 0.1, 2);
};

/**
 * Returns progress (0–1) toward the next level.
 * Used to render the XP progress bar.
 */
export const getLevelProgress = (xp: number): number => {
  const currentLevel = calculateLevel(xp);
  const currentLevelXP = xpForLevel(currentLevel);
  const nextLevelXP = xpForLevel(currentLevel + 1);

  if (nextLevelXP === currentLevelXP) return 1;

  return (xp - currentLevelXP) / (nextLevelXP - currentLevelXP);
};

/**
 * Returns XP needed to reach next level from current XP.
 */
export const xpToNextLevel = (xp: number): number => {
  const nextLevel = calculateLevel(xp) + 1;
  return Math.max(0, xpForLevel(nextLevel) - xp);
};
