import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { usePlayerContext } from "../store/PlayerContext";
import { XPBar } from "../components/XPBar";
import { getQuestHistory } from "../services/apiService";
import { QuestCompletion } from "../types";
import { Colors, Spacing, Radius } from "../styles/theme";

export const ProfileScreen = () => {
  const { userData, abandonQuest } = usePlayerContext();
  const [history, setHistory] = useState<QuestCompletion[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadHistory = useCallback(async () => {
    try {
      const data = await getQuestHistory();
      setHistory(data);
    } catch (e) {
      console.error("Failed to load quest history:", e);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHistory();
    setRefreshing(false);
  };

  const handleAbandon = () => {
    Alert.alert("Abandon Quest", "Are you sure? You'll lose all progress on this quest.", [
      { text: "Cancel", style: "cancel" },
      { text: "Abandon", style: "destructive", onPress: abandonQuest },
    ]);
  };

  const typeIcons: Record<string, string> = {
    fitness: "⚡",
    social: "🤝",
    skill: "🧠",
    chaos: "🎲",
  };

  const difficultyColors: Record<string, string> = {
    easy: Colors.easy,
    medium: Colors.medium,
    hard: Colors.hard,
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.accent} />}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarEmoji}>⚔️</Text>
          </View>
          <Text style={styles.title}>ADVENTURER</Text>
          <Text style={styles.subtitle}>Anonymous Quester</Text>
        </View>

        {/* ── XP Bar ── */}
        <XPBar xp={userData.xp} level={userData.level} />

        {/* ── Stats Row ── */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{userData.xp.toLocaleString()}</Text>
            <Text style={styles.statLabel}>TOTAL XP</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{userData.level}</Text>
            <Text style={styles.statLabel}>LEVEL</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>🔥 {userData.streak}</Text>
            <Text style={styles.statLabel}>STREAK</Text>
          </View>
        </View>

        {/* ── Active Quest ── */}
        {userData.activeQuest && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⚔️  ACTIVE QUEST</Text>
            <View style={styles.activeQuestCard}>
              <View style={styles.activeQuestHeader}>
                <Text style={styles.activeQuestIcon}>
                  {typeIcons[userData.activeQuest.type] || "📜"}
                </Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.activeQuestTitle}>{userData.activeQuest.title}</Text>
                  <Text style={styles.activeQuestXP}>+{userData.activeQuest.xpReward} XP</Text>
                </View>
                <TouchableOpacity onPress={handleAbandon} style={styles.abandonBtn}>
                  <Text style={styles.abandonText}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* ── Quest History ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📜  QUEST HISTORY</Text>
          {historyLoading ? (
            <ActivityIndicator color={Colors.accent} style={{ marginTop: Spacing.lg }} />
          ) : history.length === 0 ? (
            <View style={styles.emptyHistory}>
              <Text style={styles.emptyHistoryIcon}>🏰</Text>
              <Text style={styles.emptyHistoryText}>
                No quests completed yet. Your journey begins with the first quest!
              </Text>
            </View>
          ) : (
            history.map((item) => (
              <View key={item.id} style={styles.historyItem}>
                <View style={styles.historyLeft}>
                  <Text style={styles.historyIcon}>{typeIcons[item.questType] || "📜"}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.historyTitle} numberOfLines={1}>
                      {item.questTitle}
                    </Text>
                    <Text style={styles.historyDate}>
                      {new Date(item.completedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </View>
                </View>
                <View style={styles.historyRight}>
                  <View
                    style={[
                      styles.historyDiffBadge,
                      { backgroundColor: (difficultyColors[item.questDifficulty] || Colors.accent) + "20" },
                    ]}
                  >
                    <Text
                      style={[
                        styles.historyDiffText,
                        { color: difficultyColors[item.questDifficulty] || Colors.accent },
                      ]}
                    >
                      {item.questDifficulty.toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.historyXP}>+{item.xpEarned}</Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  header: {
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.accent + "20",
    borderWidth: 2,
    borderColor: Colors.accent,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  avatarEmoji: {
    fontSize: 36,
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    color: Colors.textPrimary,
    letterSpacing: 4,
    marginTop: Spacing.xs,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    letterSpacing: 1,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "900",
    color: Colors.textPrimary,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: Colors.textMuted,
    letterSpacing: 1.5,
    marginTop: 2,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: Colors.textMuted,
    letterSpacing: 2,
    marginBottom: Spacing.md,
  },
  activeQuestCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.accent + "30",
  },
  activeQuestHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  activeQuestIcon: {
    fontSize: 24,
  },
  activeQuestTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  activeQuestXP: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.accent,
    marginTop: 2,
  },
  abandonBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.error + "15",
    alignItems: "center",
    justifyContent: "center",
  },
  abandonText: {
    color: Colors.error,
    fontSize: 14,
    fontWeight: "700",
  },
  emptyHistory: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: "dashed",
    padding: Spacing.xl,
    alignItems: "center",
  },
  emptyHistoryIcon: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  emptyHistoryText: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  historyLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    flex: 1,
  },
  historyIcon: {
    fontSize: 20,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  historyDate: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  historyRight: {
    alignItems: "flex-end",
    gap: 4,
  },
  historyDiffBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  historyDiffText: {
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 1,
  },
  historyXP: {
    fontSize: 13,
    fontWeight: "800",
    color: Colors.accent,
  },
});
