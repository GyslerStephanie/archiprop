import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export interface LocationState {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  granted: boolean;
}

/**
 * Continuously watches GPS position. Returns current location + permission state.
 */
export function useLocation() {
  const [location, setLocation] = useState<LocationState>({
    latitude: 47.3769, // Default: Zurich
    longitude: 8.5417,
    accuracy: null,
    granted: false,
  });

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      setLocation((prev) => ({ ...prev, granted: true }));

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 500,
          distanceInterval: 0.5,
        },
        (loc) => {
          setLocation({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            accuracy: loc.coords.accuracy,
            granted: true,
          });
        },
      );
    })();

    return () => {
      subscription?.remove();
    };
  }, []);

  return location;
}
