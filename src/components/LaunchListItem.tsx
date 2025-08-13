import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Launch } from '../types/spacex';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

type Props = {
  launch: Launch;
  onPress: () => void;
};

const LaunchListItem = React.memo(({ launch, onPress }: Props) => {
  const statusText = launch.upcoming
    ? 'Upcoming'
    : launch.success
      ? 'Success'
      : 'Failure';

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {launch.links?.patch?.small ? (
        <Image
          source={{ uri: launch.links.patch.small }}
          style={styles.image}
        />
      ) : (
        <View style={[styles.image, styles.placeholder]} />
      )}

      <View style={styles.info}>
        <Text style={styles.name}>{launch.name}</Text>
        <Text style={styles.date}>
          {new Date(launch.date_utc).toLocaleDateString()}
        </Text>
        <Text
          style={[
            styles.status,
            statusText === 'Success'
              ? styles.success
              : statusText === 'Failure'
                ? styles.failure
                : styles.upcoming,
          ]}
        >
          {statusText}
        </Text>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  image: {
    width: 60,
    height: 60,
    marginRight: spacing.md,
  },
  placeholder: {
    backgroundColor: colors.border,
  },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: 'bold', color: colors.text },
  date: { fontSize: 14, color: colors.secondary },
  status: { fontSize: 14, marginTop: 4 },
  success: { color: colors.primary },
  failure: { color: colors.error },
  upcoming: { color: colors.secondary },
});

export default LaunchListItem;
