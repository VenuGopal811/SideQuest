import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, SafeAreaView } from 'react-native';
import { getLeaderboard } from '../services/apiService';
import { theme } from '../styles/theme';

export const LeaderboardScreen = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const leaderboard = await getLeaderboard();
        setData(leaderboard);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const renderItem = ({ item, index }: any) => (
    <View style={styles.item}>
      <Text style={styles.rank}>{index + 1}</Text>
      <View style={styles.userInfo}>
        <Text style={styles.userId} numberOfLines={1}>
          Player {item.id.split('-')[0]}
        </Text>
        <Text style={styles.userStats}>Level {item.level}</Text>
      </View>
      <Text style={styles.xp}>{item.xp} XP</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Global Leaderboard</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loader} />
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.empty}>No players found.</Text>
          }
        />
      )}
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
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surface,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  loader: {
    marginTop: 50,
  },
  list: {
    padding: theme.spacing.md,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.roundness.sm,
    marginBottom: theme.spacing.sm,
  },
  rank: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
    width: 30,
  },
  userInfo: {
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
  userId: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: '500',
  },
  userStats: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  xp: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  empty: {
    textAlign: 'center',
    marginTop: 20,
    color: theme.colors.textSecondary,
  }
});
