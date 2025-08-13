import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

type Props = {
  type: 'loading' | 'empty' | 'error';
  message?: string;
};

export default function State({ type, message }: Props) {
  if (type === 'loading') {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.text}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.center}>
      <Text style={styles.text}>{message || (type === 'empty' ? 'No data found' : 'Something went wrong')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { marginTop: 10, color: colors.primary, fontSize: 16 },
});
