import React, { useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  TextInput,
  Text,
  Animated,
  Pressable,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { useLaunches } from '../hooks/useLaunches';
import State from '../components/State';
import LaunchListItem from '../components/LaunchListItem';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;
type Props = { navigation: HomeScreenNavigationProp };

export default function HomeScreen({ navigation }: Props) {
  const {
    data,
    loading,
    error,
    refreshing,
    refresh,
    loadMore,
    search,
    setSearch,
    page,
  } = useLaunches(10);

  const fade = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, []);

  if (loading && page === 1) return <State type="loading" />;

  if (error) return <State type="error" message={error} />;

  return (
    <Animated.View style={[styles.container, { opacity: fade }]}>
      {/* App Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Explore Launches</Text>
          <Text style={styles.subtitle}>
            Search missions, open details, view pads
          </Text>
        </View>
        <Pressable
          onPress={refresh}
          android_ripple={{ color: '#ffffff10', borderless: true }}
          style={styles.refresh}
        >
          <Text style={styles.refreshLabel}>↻</Text>
        </Pressable>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Text style={styles.searchIcon}>🔎</Text>
        <TextInput
          style={styles.search}
          placeholder="Search mission name"
          placeholderTextColor={colors.subtext}
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
        />
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            tintColor={colors.text}
            refreshing={refreshing}
            onRefresh={refresh}
          />
        }
        ListEmptyComponent={
          <State type="empty" message="No launches match your search." />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        contentContainerStyle={{ paddingBottom: spacing.xl }}
        renderItem={({ item }) => (
          <LaunchListItem
            launch={item}
            onPress={() => navigation.navigate('Details', { id: item.id })}
          />
        )}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { ...typography.h1, color: colors.text },
  subtitle: { ...typography.body, color: colors.subtext, marginTop: 4 },
  refresh: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  refreshLabel: { color: colors.text, fontSize: 16 },
  searchWrap: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    borderRadius: 14,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  searchIcon: { fontSize: 16, marginRight: spacing.sm, color: colors.subtext },
  search: {
    flex: 1,
    height: 44,
    color: colors.text,
  },
});
