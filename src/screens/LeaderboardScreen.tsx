import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { getLeaderboard } from "../services/apiService";
import { usePlayerContext } from "../store/PlayerContext";
import { Colors, Spacing, Radius } from "../styles/theme";

export const LeaderboardScreen = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { userData } = usePlayerContext();

  const load = useCallback(async () => {
    try {
      const leaderboard = await getLeaderboard();
      setData(leaderboard);
    } catch (e) {
      console.error("Failed to load leaderboard:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const medals = ["🥇", "🥈", "🥉"];

  // ── Podium (top 3) ──
  const renderPodium = () => {
    if (data.length < 3) return null;
    const top3 = data.slice(0, 3);
    // Display order: 2nd, 1st, 3rd
    const podiumOrder = [top3[1], top3[0], top3[2]];
    const podiumHeights = [90, 120, 70];
    const podiumIndices = [1, 0, 2]; // actual rank indices

    return (
      <View style={styles.podiumContainer}>
        {podiumOrder.map((player, i) => {
          const actualIdx = podiumIndices[i];
          return (
            <View key={player.id} style={styles.podiumSlot}>
              <Text style={styles.podiumMedal}>{medals[actualIdx]}</Text>
              <Text style={styles.podiumName} numberOfLines={1}>
                Player {player.id.substring(0, 4)}
              </Text>
              <Text style={styles.podiumXP}>{player.xp.toLocaleString()} XP</Text>
              <View
                style={[
                  styles.podiumBar,
                  {
                    height: podiumHeights[i],
                    backgroundColor:
                      actualIdx === 0
                        ? Colors.accent
                        : actualIdx === 1
                        ? Colors.accent + "80"
                        : Colors.accent + "50",
                  },
                ]}
              >
                <Text style={styles.podiumRank}>{actualIdx + 1}</Text>
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  const renderItem = ({ item, index }: any) => {
    if (index < 3) return null; // shown in podium

    return (
      <View style={styles.item}>
        <View style={styles.rankBadge}>
          <Text style={styles.rankText}>{index + 1}</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName} numberOfLines={1}>
            Player {item.id.substring(0, 4)}
          </Text>
          <Text style={styles.userLevel}>Level {item.level}</Text>
        </View>
        {item.streak > 0 && (
          <Text style={styles.streakBadge}>🔥{item.streak}</Text>
        )}
        <Text style={styles.xpValue}>{item.xp.toLocaleString()}</Text>
        <Text style={styles.xpLabel}>XP</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>LEADERBOARD</Text>
        <Text style={styles.subtitle}>Global Rankings</Text>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.accent} />
          <Text style={styles.loadingText}>LOADING...</Text>
        </View>
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListHeaderComponent={renderPodium}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🏰</Text>
              <Text style={styles.emptyText}>No players yet. Be the first!</Text>
            </View>
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.accent} />
          }
        />
      )}
    </SafeAreaView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  header: {
    padding: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    color: Colors.textPrimary,
    letterSpacing: 4,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    letterSpacing: 1,
    marginTop: 2,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: Colors.accent,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 3,
    marginTop: Spacing.sm,
  },
  list: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },

  // ── Podium ──
  podiumContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
    paddingTop: Spacing.lg,
  },
  podiumSlot: {
    flex: 1,
    alignItems: "center",
  },
  podiumMedal: {
    fontSize: 28,
    marginBottom: Spacing.xs,
  },
  podiumName: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  podiumXP: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  podiumBar: {
    width: "100%",
    borderTopLeftRadius: Radius.md,
    borderTopRightRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  podiumRank: {
    fontSize: 24,
    fontWeight: "900",
    color: "#ffffff60",
  },

  // ── List items ──
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.bgCard,
    padding: Spacing.md,
    borderRadius: Radius.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  rankBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.bgElevated,
    alignItems: "center",
    justifyContent: "center",
  },
  rankText: {
    fontSize: 13,
    fontWeight: "800",
    color: Colors.textSecondary,
  },
  userInfo: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  userName: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  userLevel: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 1,
  },
  streakBadge: {
    fontSize: 12,
    marginRight: Spacing.sm,
  },
  xpValue: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.textPrimary,
  },
  xpLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: Colors.textMuted,
    marginLeft: 3,
  },

  // ── Empty ──
  emptyContainer: {
    alignItems: "center",
    paddingVertical: Spacing.xxl,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
  },
});
