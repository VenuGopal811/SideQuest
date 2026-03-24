import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { usePlayer } from '../store/usePlayer';
import { XPBar } from '../components/XPBar';
import { theme } from '../styles/theme';

export const ProfileScreen = () => {
  const { userData, abandonQuest } = usePlayer();

  const handleAbandon = () => {
    Alert.alert(
      "Abandon Quest",
      "Are you sure? You'll lose all progress on this specific quest.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Abandon", style: "destructive", onPress: abandonQuest }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Player Profile</Text>
      </View>

      <View style={styles.statsCard}>
        <Text style={styles.label}>Current Level</Text>
        <Text style={styles.levelText}>{userData.level}</Text>
        
        <XPBar xp={userData.xp} />
        <Text style={styles.xpText}>{userData.xp} Total XP</Text>
      </View>

      {userData.activeQuest && (
        <View style={styles.activeQuestSection}>
          <Text style={styles.sectionTitle}>Active Quest</Text>
          <View style={styles.questMiniCard}>
            <Text style={styles.questTitle}>{userData.activeQuest.title}</Text>
            <TouchableOpacity style={styles.abandonButton} onPress={handleAbandon}>
              <Text style={styles.abandonText}>Abandon</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>About SideQuest</Text>
        <Text style={styles.infoBody}>
          Complete real-world tasks to level up your life. Every quest completed adds to your global XP found on the leaderboard.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  statsCard: {
    margin: theme.spacing.lg,
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness.md,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  levelText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.lg,
  },
  xpText: {
    marginTop: theme.spacing.md,
    color: theme.colors.textSecondary,
    fontSize: 16,
  },
  activeQuestSection: {
    padding: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  questMiniCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness.sm,
  },
  questTitle: {
    fontSize: 16,
    color: theme.colors.text,
    flex: 1,
  },
  abandonButton: {
    padding: theme.spacing.sm,
  },
  abandonText: {
    color: theme.colors.error,
    fontWeight: 'bold',
  },
  infoSection: {
    padding: theme.spacing.lg,
    marginTop: 'auto',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  infoBody: {
    color: theme.colors.textSecondary,
    lineHeight: 20,
  }
});
