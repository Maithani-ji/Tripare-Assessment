import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { Launch } from '../types/spacex';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { shadow } from '../utils/shadow';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = { launch: Launch; onPress: () => void };

const LaunchListItem = React.memo(({ launch, onPress }: Props) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Pick best image: Flickr first → Patch → null (use fallback)
  const imageUrl =
    launch.links?.flickr?.original?.[0] || launch.links?.patch?.large || null;

  const statusText = launch.upcoming
    ? 'Upcoming'
    : launch.success
      ? 'Success'
      : 'Failure';

  const statusStyle =
    statusText === 'Success'
      ? styles.success
      : statusText === 'Failure'
        ? styles.failure
        : styles.upcoming;

  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: '#ffffff15' }}
      style={({ pressed }) => [
        styles.card,
        pressed && { transform: [{ scale: 0.98 }] },
      ]}
    >
      <View style={styles.imageWrapper}>
        {loading && !error && imageUrl && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        )}

        {/* Fallback if no image or error */}
        {(!imageUrl || error) && (
          <View style={styles.fallback}>
            <Icon name="rocket-outline" size={64} color={colors.subtext} />
          </View>
        )}

        {imageUrl && !error && (
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            onLoadEnd={() => setLoading(false)}
            onError={() => {
              setError(true);
              setLoading(false);
            }}
          />
        )}

        <View style={[styles.statusChip, statusStyle]}>
          <Text style={styles.statusText}>{statusText}</Text>
        </View>
      </View>

      <View style={styles.info}>
        <Text numberOfLines={1} style={styles.name}>
          {launch.name}
        </Text>
        <Text style={styles.date}>
          {new Date(launch.date_utc).toLocaleString()}
        </Text>
        <Text style={styles.meta}>
          Flight #{launch.flight_number} •{' '}
          <Icon name="rocket-outline" size={14} color={colors.subtext} />{' '}
          Rocket: {launch.rocket || 'N/A'}
        </Text>
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.md,
    overflow: 'hidden',
    ...shadow(12),
  },
  imageWrapper: {
    width: '100%',
    height: 180,
    backgroundColor: colors.surfaceAlt,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surfaceAlt,
  },
  fallback: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusChip: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusText: {
    ...typography.caption,
    color: '#fff',
    fontWeight: '600',
  },
  success: { backgroundColor: '#27ae60' },
  failure: { backgroundColor: '#c0392b' },
  upcoming: { backgroundColor: '#2980b9' },
  info: {
    padding: spacing.md,
  },
  name: {
    ...typography.h2,
    color: colors.text,
    fontWeight: 'bold',
  },
  date: {
    ...typography.caption,
    color: colors.subtext,
    marginTop: 4,
  },
  meta: {
    ...typography.caption,
    color: colors.subtext,
    marginTop: 2,
    fontStyle: 'italic',
  },
});

export default LaunchListItem;
