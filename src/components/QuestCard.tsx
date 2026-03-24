import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Quest } from "../types";
import { Colors, Spacing, Radius } from "../styles/theme";
import { getQuestTypeIcon, getDifficultyColor } from "../services/questService";

interface QuestCardProps {
  quest: Quest;
}

// ─── QuestCard ────────────────────────────────────────────────────────────────
// Displays a quest with type icon, difficulty badge, description, and XP reward.

export const QuestCard: React.FC<QuestCardProps> = ({ quest }) => {
  const typeIcon = getQuestTypeIcon(quest.type);
  const difficultyColor = getDifficultyColor(quest.difficulty);
  const typeColor = Colors[quest.type];

  return (
    <View style={[styles.card, { borderColor: typeColor + "30" }]}>
      {/* Top row: icon + title + difficulty */}
      <View style={styles.header}>
        <View style={[styles.iconBadge, { backgroundColor: typeColor + "20" }]}>
          <Text style={styles.icon}>{typeIcon}</Text>
        </View>

        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {quest.title}
          </Text>
          <View style={[styles.diffBadge, { backgroundColor: difficultyColor + "20" }]}>
            <Text style={[styles.diffText, { color: difficultyColor }]}>
              {quest.difficulty.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>

      {/* Description */}
      <Text style={styles.description}>{quest.description}</Text>

      {/* Footer: type label + XP reward */}
      <View style={styles.footer}>
        <Text style={[styles.typeLabel, { color: typeColor }]}>
          {quest.type.toUpperCase()}
        </Text>
        <View style={styles.xpBadge}>
          <Text style={styles.xpReward}>+{quest.xpReward} XP</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: 20,
  },
  titleRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
    letterSpacing: 0.2,
  },
  diffBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  diffText: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
  },
  description: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: Spacing.xs,
  },
  typeLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  xpBadge: {
    backgroundColor: Colors.accent + "20",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: 99,
  },
  xpReward: {
    fontSize: 12,
    fontWeight: "800",
    color: Colors.accent,
    letterSpacing: 0.5,
  },
});
