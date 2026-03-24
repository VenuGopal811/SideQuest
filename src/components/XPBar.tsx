import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors, Spacing, Radius } from "../styles/theme";
import { getLevelProgress, xpToNextLevel } from "../store/xpSystem";

interface XPBarProps {
  xp: number;
  level: number;
}

// ─── XPBar ────────────────────────────────────────────────────────────────────
// Shows current level, XP progress bar, and XP until next level.

export const XPBar: React.FC<XPBarProps> = ({ xp, level }) => {
  const progress = getLevelProgress(xp);
  const remaining = xpToNextLevel(xp);

  return (
    <View style={styles.container}>
      {/* Level badge + XP count */}
      <View style={styles.header}>
        <View style={styles.levelBadge}>
          <Text style={styles.levelLabel}>LVL</Text>
          <Text style={styles.levelNumber}>{level}</Text>
        </View>
        <Text style={styles.xpText}>{xp.toLocaleString()} XP</Text>
        <Text style={styles.remainingText}>{remaining} to next</Text>
      </View>

      {/* Progress bar track */}
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${Math.min(progress * 100, 100)}%` }]} />
        {/* Glow dot at progress tip */}
        {progress > 0.02 && (
          <View
            style={[
              styles.glowDot,
              { left: `${Math.min(progress * 100, 100)}%` as any },
            ]}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  levelBadge: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    flexDirection: "row",
    alignItems: "baseline",
    gap: 3,
  },
  levelLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: "#ffffff80",
    letterSpacing: 1,
  },
  levelNumber: {
    fontSize: 16,
    fontWeight: "900",
    color: "#fff",
  },
  xpText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    color: Colors.textPrimary,
    letterSpacing: 0.5,
  },
  remainingText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  track: {
    height: 6,
    backgroundColor: Colors.bgElevated,
    borderRadius: 99,
    overflow: "visible",
    position: "relative",
  },
  fill: {
    height: "100%",
    backgroundColor: Colors.accent,
    borderRadius: 99,
    // Subtle glow via shadow
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
  glowDot: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
    top: -2,
    marginLeft: -5,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 6,
  },
});
