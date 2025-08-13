import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import DetailsScreen from '../screens/DetailsScreen';
import Map from '../screens/MapScreen';
import { Launchpad } from '../types/spacex';

export type RootStackParamList = {
  Home: undefined;
  Details: { id: string };
  Map: { launchpad: Launchpad | null };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Details" component={DetailsScreen} />
      <Stack.Screen name="Map" component={Map} />
    </Stack.Navigator>
  );
}
