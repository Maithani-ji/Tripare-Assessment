import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Button } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/RootNavigator';
import { useLaunchDetails } from '../hooks/useLaunchDetails';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type DetailsScreenRouteProp = RouteProp<RootStackParamList, 'Details'>;
type DetailsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Details'
>;
type Props = {
  route: DetailsScreenRouteProp;
};

export default function DetailsScreen({ route }: Props) {
  const { id } = route.params;
  const { launch, launchpad, loading, error, refresh } = useLaunchDetails(id);
  const navigation = useNavigation<DetailsScreenNavigationProp>();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: colors.error }}>{error}</Text>
        <Button title="Retry" onPress={refresh} />
      </View>
    );
  }

  if (!launch) {
    return (
      <View style={styles.center}>
        <Text>No details found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{launch.name}</Text>
      <Text style={styles.date}>
        {new Date(launch.date_utc).toLocaleString()}
      </Text>
      <Text>Status: {launch.upcoming ? 'Upcoming' : launch.success ? 'Success' : 'Failure'}</Text>

      {launchpad && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Launchpad Info</Text>
          <Text>{launchpad.full_name}</Text>
          <Text>{launchpad.locality}, {launchpad.region}</Text>
          <Text>Timezone: {launchpad.timezone}</Text>
          <Text>Launch Attempts: {launchpad.launch_attempts}</Text>
          <Text>Launch Successes: {launchpad.launch_successes}</Text>
        </View>
      )}

      {/* Navigation to Map will come in Phase 5 */}
      <Button title="View on Map" onPress={() => navigation.navigate('Map', { launchpad })} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 20, fontWeight: 'bold', color: colors.text },
  date: { color: colors.secondary, marginBottom: spacing.sm },
  section: { marginTop: spacing.lg },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: spacing.sm },
});
