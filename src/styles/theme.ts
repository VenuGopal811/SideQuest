// ─── SideQuest Theme ──────────────────────────────────────────────────────────
// Dark mode, game-like feel. One place to change everything.

const Colors = {
  // Backgrounds
  bg: "#0a0a0f",
  bgCard: "#13131a",
  bgElevated: "#1a1a24",

  // Text
  textPrimary: "#f0f0ff",
  textSecondary: "#8888aa",
  textMuted: "#44445a",

  // Brand
  accent: "#7c6af7",       // purple-violet primary
  accentGlow: "#7c6af730",

  // Difficulty
  easy: "#4ade80",
  medium: "#facc15",
  hard: "#f87171",

  // Quest type
  fitness: "#fb923c",
  social: "#38bdf8",
  skill: "#a78bfa",
  chaos: "#f472b6",

  // UI
  border: "#ffffff10",
  borderActive: "#7c6af750",
  success: "#4ade80",
  error: "#f87171",
};

const Fonts = {
  mono: "Courier New", // fallback for game-like text
};

const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};

export const theme = {
  colors: {
    background: Colors.bg,
    surface: Colors.bgCard,
    surfaceElevated: Colors.bgElevated,
    text: Colors.textPrimary,
    textSecondary: Colors.textSecondary,
    textMuted: Colors.textMuted,
    primary: Colors.accent,
    accentGlow: Colors.accentGlow,
    easy: Colors.easy,
    medium: Colors.medium,
    hard: Colors.hard,
    fitness: Colors.fitness,
    social: Colors.social,
    skill: Colors.skill,
    chaos: Colors.chaos,
    border: Colors.border,
    borderActive: Colors.borderActive,
    success: Colors.success,
    error: Colors.error,
  },
  fonts: Fonts,
  spacing: Spacing,
  roundness: Radius,
};
