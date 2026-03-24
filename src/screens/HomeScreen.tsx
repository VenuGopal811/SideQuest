/**
 * HomeScreen.tsx
 *
 * Main screen of SideQuest.
 * Uses ONLY React Native primitives — View, Text, ScrollView,
 * TouchableOpacity, SafeAreaView, StatusBar, ActivityIndicator.
 * No web APIs, no CSS, no HTML elements.
 */

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import { usePlayer } from "../store/usePlayer";
import { QuestCard } from "../components/QuestCard";
import { XPBar } from "../components/XPBar";
import { Button } from "../components/Button";
import { Colors, Spacing, Radius } from "../styles/theme";

export const HomeScreen: React.FC = () => {
  const {
    userData,
    loading,
    error,
    clearError,
    acceptQuest,
    completeQuest,
    abandonQuest,
  } = usePlayer();

  const [questLoading, setQuestLoading] = useState(false);
  const [completeLoading, setCompleteLoading] = useState(false);

  // Surface Firebase errors as native alerts (works on Android + iOS)
  useEffect(() => {
    if (error) {
      Alert.alert("Something went wrong", error, [
        { text: "OK", onPress: clearError },
      ]);
    }
  }, [error]);

  const handleAcceptQuest = async () => {
    setQuestLoading(true);
    await acceptQuest();
    setQuestLoading(false);
  };

  const handleCompleteQuest = async () => {
    setCompleteLoading(true);
    await completeQuest();
    setCompleteLoading(false);
  };

  const handleAbandon = () => {
    // Native modal dialog — works on both Android and iOS
    Alert.alert(
      "Abandon Quest?",
      "You'll earn no XP. This can't be undone.",
      [
        { text: "Keep going", style: "cancel" },
        { text: "Abandon", style: "destructive", onPress: abandonQuest },
      ]
    );
  };

  // ── Loading state ──
  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />
        <ActivityIndicator size="large" color={Colors.accent} />
        <Text style={styles.loadingLabel}>LOADING...</Text>
      </SafeAreaView>
    );
  }

  const { xp, level, activeQuest } = userData;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── App header ── */}
        <View style={styles.header}>
          <Text style={styles.appName}>SIDEQUEST</Text>
          <Text style={styles.tagline}>Your life. Gamified.</Text>
        </View>

        {/* ── XP + Level bar ── */}
        <XPBar xp={xp} level={level} />

        {/* ── Thin separator (View, not <hr>) ── */}
        <View style={styles.separator} />

        {/* ── Section label ── */}
        <Text style={styles.sectionLabel}>
          {activeQuest ? "⚔️  ACTIVE QUEST" : "📭  NO ACTIVE QUEST"}
        </Text>

        {/* ── Quest content ── */}
        {activeQuest ? (
          <View>
            <QuestCard quest={activeQuest} />
            <Button
              label="✓  COMPLETE QUEST"
              onPress={handleCompleteQuest}
              variant="primary"
              loading={completeLoading}
              style={styles.primaryBtn}
            />
            <Button
              label="Abandon quest"
              onPress={handleAbandon}
              variant="ghost"
            />
          </View>
        ) : (
          <View>
            {/* Empty state card */}
            <View style={styles.emptyCard}>
              <Text style={styles.emptyIcon}>🎲</Text>
              <Text style={styles.emptyTitle}>Ready for a challenge?</Text>
              <Text style={styles.emptyBody}>
                Tap below to receive a random quest and start earning XP.
              </Text>
            </View>

            <Button
              label="🎲  GET RANDOM QUEST"
              onPress={handleAcceptQuest}
              variant="primary"
              loading={questLoading}
              style={styles.primaryBtn}
            />
          </View>
        )}

        {/* ── Stats row ── */}
        <View style={styles.statsRow}>
          <StatPill label="TOTAL XP" value={xp.toLocaleString()} />
          <StatPill label="LEVEL" value={String(level)} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// ─── StatPill ─────────────────────────────────────────────────────────────────

const StatPill: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={pillStyles.container}>
    <Text style={pillStyles.value}>{value}</Text>
    <Text style={pillStyles.label}>{label}</Text>
  </View>
);

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  centered: {
    flex: 1,
    backgroundColor: Colors.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingLabel: {
    color: Colors.accent,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 3,
    marginTop: Spacing.sm,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  appName: {
    fontSize: 28,
    fontWeight: "900",
    color: Colors.textPrimary,
    letterSpacing: 4,
  },
  tagline: {
    fontSize: 12,
    color: Colors.textMuted,
    letterSpacing: 1.5,
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: Colors.textMuted,
    letterSpacing: 2,
    marginBottom: Spacing.md,
  },
  primaryBtn: {
    marginBottom: Spacing.sm,
  },
  emptyCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: "dashed",
    padding: Spacing.xl,
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: Spacing.sm,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  emptyBody: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
});

const pillStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  value: {
    fontSize: 22,
    fontWeight: "900",
    color: Colors.textPrimary,
  },
  label: {
    fontSize: 10,
    fontWeight: "700",
    color: Colors.textMuted,
    letterSpacing: 1.5,
    marginTop: 2,
  },
});
