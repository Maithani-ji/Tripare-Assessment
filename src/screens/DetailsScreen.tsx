import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { useLaunchDetails } from '../hooks/useLaunchDetails';
import State from '../components/State';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { shadow } from '../utils/shadow';

type DetailsScreenRouteProp = RouteProp<RootStackParamList, 'Details'>;
type DetailsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Details'
>;
type Props = { route: DetailsScreenRouteProp };

export default function DetailsScreen({ route }: Props) {
  const { id } = route.params;
  const { launch, launchpad, loading, error } = useLaunchDetails(id);
  const navigation = useNavigation<DetailsScreenNavigationProp>();

  const [launchImgLoading, setLaunchImgLoading] = useState(true);
  const [launchImgError, setLaunchImgError] = useState(false);

  const [padImgLoading, setPadImgLoading] = useState(true);
  const [padImgError, setPadImgError] = useState(false);

  if (loading) return <State type="loading" />;
  if (error) return <State type="error" message={error} />;
  if (!launch) return <State type="empty" message="No details found." />;

  const statusText = launch.upcoming
    ? 'Upcoming'
    : launch.success
      ? 'Success'
      : 'Failure';

  const statusColor =
    statusText === 'Success'
      ? colors.success
      : statusText === 'Failure'
        ? colors.error
        : colors.warning;

  const launchImage =
    launch.links?.patch?.large ||
    launch.links?.patch?.small ||
    launch.links?.flickr?.original?.[0] ||
    null;

  const launchpadImage = launchpad?.images?.large?.[0] || null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Mission Card */}
      <View style={styles.card}>
        {launchImage && !launchImgError ? (
          <>
            {launchImgLoading && (
              <View style={styles.imageLoader}>
                <ActivityIndicator size="small" color={colors.primary} />
              </View>
            )}
            <Image
              source={{ uri: launchImage }}
              style={styles.launchImage}
              resizeMode="cover"
              onLoadEnd={() => setLaunchImgLoading(false)}
              onError={() => {
                setLaunchImgLoading(false);
                setLaunchImgError(true);
              }}
            />
          </>
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="rocket-outline" size={48} color={colors.subtext} />
          </View>
        )}

        <Text style={styles.title}>{launch.name}</Text>
        <View style={styles.row}>
          <Text style={styles.date}>
            {new Date(launch.date_utc).toLocaleString()}
          </Text>
          <View
            style={[
              styles.statusBadge,
              { borderColor: statusColor, backgroundColor: `${statusColor}15` },
            ]}
          >
            <Text style={[styles.statusText, { color: statusColor }]}>
              {statusText}
            </Text>
          </View>
        </View>
        <Text style={styles.body}>
          {launch?.details || 'No mission details provided.'}
        </Text>
      </View>

      {/* Launchpad Card */}
      {launchpad && (
        <View style={styles.card}>
          {launchpadImage && !padImgError ? (
            <>
              {padImgLoading && (
                <View style={styles.imageLoader}>
                  <ActivityIndicator size="small" color={colors.primary} />
                </View>
              )}
              <Image
                source={{ uri: launchpadImage }}
                style={styles.launchpadImage}
                resizeMode="cover"
                onLoadEnd={() => setPadImgLoading(false)}
                onError={() => {
                  setPadImgLoading(false);
                  setPadImgError(true);
                }}
              />
            </>
          ) : (
            <View style={styles.placeholder}>
              <Ionicons
                name="location-outline"
                size={48}
                color={colors.subtext}
              />
            </View>
          )}

          <Text style={styles.sectionTitle}>{launchpad.full_name}</Text>
          <Text style={styles.location}>
            {launchpad.locality}, {launchpad.region} • {launchpad.timezone}
          </Text>

          <View style={styles.kpiRow}>
            <KPI label="Attempts" value={launchpad.launch_attempts} />
            <KPI label="Successes" value={launchpad.launch_successes} />
          </View>

          <Pressable
            onPress={() => navigation.navigate('Map', { launchpad })}
            style={({ pressed }) => [
              styles.ctaButton,
              pressed && { opacity: 0.9 },
            ]}
          >
            <Text style={styles.ctaText}>View on Map ➜</Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
}

function KPI({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.kpiCard}>
      <Text style={styles.kpiValue}>{value}</Text>
      <Text style={styles.kpiLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    backgroundColor: colors.background,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadow(12),
  },
  launchImage: {
    width: '100%',
    height: 180,
    borderRadius: 16,
    marginBottom: spacing.md,
    ...shadow(8),
  },
  launchpadImage: {
    width: '100%',
    height: 160,
    borderRadius: 14,
    marginBottom: spacing.md,
  },
  placeholder: {
    width: '100%',
    height: 180,
    borderRadius: 16,
    backgroundColor: colors.surfaceAlt,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  imageLoader: {
    position: 'absolute',
    zIndex: 1,
    width: '100%',
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  date: {
    ...typography.caption,
    color: colors.subtext,
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: spacing.sm,
  },
  statusBadge: {
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    ...typography.caption,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  body: {
    ...typography.body,
    color: colors.text,
    lineHeight: 22,
  },
  sectionTitle: {
    ...typography.h2,
    marginTop: spacing.md,
    color: colors.text,
  },
  location: {
    ...typography.caption,
    color: colors.subtext,
    marginTop: 2,
  },
  kpiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  kpiCard: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 14,
    paddingVertical: spacing.md,
    flex: 1,
    marginHorizontal: spacing.sm,
    alignItems: 'center',
  },
  kpiValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  kpiLabel: {
    fontSize: 12,
    color: colors.subtext,
    marginTop: 2,
  },
  ctaButton: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    alignItems: 'center',
    paddingVertical: spacing.md,
    marginTop: spacing.lg,
  },
  ctaText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
});
