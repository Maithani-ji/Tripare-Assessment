import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Button,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/RootNavigator';
import { colors } from '../theme/colors';
import { getPreciseDistance } from 'geolib';

type MapScreenRouteProp = RouteProp<RootStackParamList, 'Map'>;

type Props = {
  route: MapScreenRouteProp;
};

export default function Map({ route }: Props) {
  const { launchpad } = route.params;
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  
  const [distance, setDistance] = useState<number | null>(null);

  useEffect(() => {
    if (userLocation && launchpad?.latitude && launchpad?.longitude) {
      const dist = getPreciseDistance(
        { latitude: userLocation.latitude, longitude: userLocation.longitude },
        { latitude: launchpad.latitude, longitude: launchpad.longitude },
      );
      setDistance(dist / 1000); // km
    }
  }, [userLocation, launchpad]);
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to show your position.',
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  const openInMaps = () => {
    const url = Platform.select({
      ios: `http://maps.apple.com/?daddr=${launchpad?.latitude},${launchpad?.longitude}`,
      android: `geo:${launchpad?.latitude},${launchpad?.longitude}?q=${launchpad?.full_name}`,
    });
    if (url) Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          latitude: launchpad?.latitude || 0,
          longitude: launchpad?.longitude || 0,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        }}
      >
        <Marker
          coordinate={{
            latitude: launchpad?.latitude || 0,
            longitude: launchpad?.longitude || 0,
          }}
          title={launchpad?.full_name}
          pinColor={colors.primary}
        />
        {userLocation && (
          <Marker coordinate={userLocation} title="You" pinColor="blue" />
        )}
      </MapView>

      <View style={styles.button}>
        {distance !== null && (
          <Button
            title={`Open in Maps (${distance.toFixed(2)} km away)`}
            onPress={openInMaps}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  button: {
    backgroundColor: 'white',
    position: 'absolute',
    borderRadius: 20,
    bottom: 30,
    left: 20,
    right: 20,
  },
});
