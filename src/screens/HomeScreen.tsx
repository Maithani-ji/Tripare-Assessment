import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  TextInput,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
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

  // Handle initial loading
  if (loading && page === 1) {
    return <State type="loading" />;
  }

  // Handle error
  if (error) {
    return <State type="error" message={error} />;
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <TextInput
        style={styles.search}
        placeholder="Search mission name..."
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
        ListEmptyComponent={
          <State type="empty" message="No launches match your search." />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        renderItem={({ item }) => (
          <LaunchListItem
            launch={item}
            onPress={() => navigation.navigate('Details', { id: item.id })}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  search: {
    backgroundColor: '#F3F4F6',
    margin: spacing.md,
    padding: spacing.sm,
    borderRadius: 8,
  },
});
