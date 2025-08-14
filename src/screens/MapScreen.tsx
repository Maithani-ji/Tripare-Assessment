import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Text,
  Platform,
  Linking,
  Alert,
} from 'react-native';
import MapView, { Marker, MapType } from 'react-native-maps';
import * as Location from 'expo-location';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/RootNavigator';
import { colors } from '../theme/colors';
import { getPreciseDistance } from 'geolib';
import { shadow } from '../utils/shadow';
import { spacing } from '../theme/spacing';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type MapScreenRouteProp = RouteProp<RootStackParamList, 'Map'>;
type Props = { route: MapScreenRouteProp };

export default function Map({ route }: Props) {
  const { launchpad } = route.params;
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [mapType, setMapType] = useState<MapType>('standard');
  const [locationDenied, setLocationDenied] = useState(false);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    requestUserLocation();
  }, []);

  const requestUserLocation = async () => {
    try {
      Alert.alert(
        'Location Needed',
        'We use your location to calculate how far you are from the launch site.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'OK',
            onPress: async () => {
              const { status } =
                await Location.requestForegroundPermissionsAsync();
              if (status !== 'granted') {
                setLocationDenied(true);
                return;
              }
              const loc = await Location.getCurrentPositionAsync({});
              const coords = {
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
              };
              setUserLocation(coords);
              setLocationDenied(false);
            },
          },
        ],
      );
    } catch (e) {
      console.log('Location error:', e);
    }
  };

  useEffect(() => {
    if (userLocation && launchpad?.latitude && launchpad?.longitude) {
      const d = getPreciseDistance(userLocation, {
        latitude: launchpad.latitude,
        longitude: launchpad.longitude,
      });
      setDistance(d / 1000);

      // Fit both points into view
      mapRef.current?.fitToCoordinates(
        [
          {
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
          },
          { latitude: launchpad.latitude, longitude: launchpad.longitude },
        ],
        {
          edgePadding: { top: 80, bottom: 80, left: 80, right: 80 },
          animated: true,
        },
      );
    }
  }, [userLocation, launchpad]);

  const openInMaps = () => {
    const url = Platform.select({
      ios: `http://maps.apple.com/?daddr=${launchpad?.latitude},${launchpad?.longitude}`,
      android: `geo:${launchpad?.latitude},${launchpad?.longitude}?q=${launchpad?.full_name}`,
    });
    if (url) Linking.openURL(url);
  };

  const toggleMapType = (type: MapType) => {
    setMapType(type);
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          latitude: launchpad?.latitude || 0,
          longitude: launchpad?.longitude || 0,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        }}
        mapType={mapType}
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
          <Marker coordinate={userLocation} title="You" pinColor="#60A5FA" />
        )}
      </MapView>
      {distance !== null && (
        <View style={styles.distanceChip}>
          <Text style={styles.distanceText}>{distance.toFixed(2)} km</Text>
        </View>
      )}
      {/* Map controls */}
      <View style={styles.controls}>
        <View style={styles.mapTypeButtons}>
          <Pressable
            onPress={() => toggleMapType('standard')}
            style={[
              styles.circleBtn,
              mapType === 'standard' && styles.activeBtn,
            ]}
          >
            <MaterialCommunityIcons name="map" size={20} color="#fff" />
          </Pressable>
          <Pressable
            onPress={() => toggleMapType('satellite')}
            style={[
              styles.circleBtn,
              mapType === 'satellite' && styles.activeBtn,
            ]}
          >
            <MaterialCommunityIcons
              name="satellite-variant"
              size={20}
              color="#fff"
            />
          </Pressable>
          <Pressable
            onPress={() => toggleMapType('hybrid')}
            style={[styles.circleBtn, mapType === 'hybrid' && styles.activeBtn]}
          >
            <MaterialCommunityIcons name="terrain" size={20} color="#fff" />
          </Pressable>
        </View>
      </View>

      {/* Location denied */}
      {locationDenied && (
        <Pressable style={styles.retryChip} onPress={requestUserLocation}>
          <Text style={styles.retryText}>Enable Location</Text>
        </Pressable>
      )}

      {/* Floating CTA */}
      <Pressable
        onPress={openInMaps}
        android_ripple={{ color: '#ffffff20' }}
        style={styles.fab}
      >
        <Text style={styles.fabText}>Open in Maps</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  controls: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
    alignItems: 'center',
  },
  mapTypeButtons: {
    gap: 8,
    marginBottom: 8,
  },
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#00000080',
    justifyContent: 'center',
    alignItems: 'center',
    ...shadow(4),
  },
  activeBtn: {
    backgroundColor: colors.primary,
  },
  distanceChip: {
    width: '40%',
    alignItems: 'center',
    marginHorizontal: 'auto',
    marginTop: '10',
    backgroundColor: '#00000080',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    ...shadow(4),
  },
  distanceText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  retryChip: {
    position: 'absolute',
    top: spacing.xl * 2,
    alignSelf: 'center',
    backgroundColor: '#E53935',
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: 999,
    ...shadow(8),
  },
  retryText: { color: '#fff', fontWeight: '600' },
  fab: {
    position: 'absolute',
    bottom: spacing.xl,
    left: spacing.lg,
    right: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: 16,
    alignItems: 'center',
    paddingVertical: 14,
    ...shadow(12),
  },
  fabText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
