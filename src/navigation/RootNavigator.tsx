import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import DetailsScreen from '../screens/DetailsScreen';
import Map from '../screens/MapScreen';
import { Launchpad } from '../types/spacex';
import { colors } from '../theme/colors';

export type RootStackParamList = {
  Home: undefined;
  Details: { id: string };
  Map: { launchpad: Launchpad | null };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleStyle: { color: colors.text, fontWeight: '700' },
        headerTintColor: colors.text,
        headerShadowVisible: false,
        headerStyle: { backgroundColor: colors.surface },
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'SpaceX Explorer' }}
      />
      <Stack.Screen
        name="Details"
        component={DetailsScreen}
        options={{ title: 'Mission Details' }}
      />
      <Stack.Screen
        name="Map"
        component={Map}
        options={{ title: 'Launchpad Map' }}
      />
    </Stack.Navigator>
  );
}
