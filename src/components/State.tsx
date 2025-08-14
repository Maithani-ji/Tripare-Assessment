import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

type Props = { type: 'loading' | 'empty' | 'error'; message?: string };

export default function State({ type, message }: Props) {
  if (type === 'loading') {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.title}>Loading</Text>
        <Text style={styles.sub}>Fetching the latest launches…</Text>
      </View>
    );
  }

  const fallback = type === 'empty' ? 'No data found' : 'Something went wrong';
  return (
    <View style={styles.center}>
      <Text style={styles.emoji}>{type === 'empty' ? '🛰️' : '🛑'}</Text>
      <Text style={styles.title}>{message || fallback}</Text>
      {type === 'error' && (
        <Text style={styles.sub}>Pull to refresh to retry.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  emoji: { fontSize: 40, marginBottom: spacing.sm },
  title: { ...typography.h2, color: colors.text, marginTop: spacing.sm },
  sub: {
    ...typography.caption,
    color: colors.subtext,
    marginTop: 4,
    textAlign: 'center',
  },
});
