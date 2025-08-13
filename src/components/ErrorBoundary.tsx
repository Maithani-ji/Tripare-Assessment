import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

type State = { hasError: boolean; error?: Error };
type Props = { children: React.ReactNode };

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    // Send to your logging helper
    logError(error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.text}>Something went wrong.</Text>
          <Button title="Reload App" onPress={() => this.setState({ hasError: false })} />
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  text: { fontSize: 16, marginBottom: 10 },
});

// Logging helper
export function logError(error: any, info?: any) {
  console.error('Logged Error:', error, info);
 
}
