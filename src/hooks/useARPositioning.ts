import { useMemo } from 'react';
import { gpsToARCoords, distanceMeters } from '@/utils/gpsToMeters';
import { useLocation } from './useLocation';
import { useCompass } from './useCompass';

/**
 * Returns real-time AR scene position [x, y, z] (meters) for a GPS anchor,
 * plus distance to anchor and compass heading.
 */
export function useARPositioning(anchorLat: number, anchorLng: number) {
  const { latitude, longitude } = useLocation();
  const heading = useCompass();

  const position = useMemo(
    () => gpsToARCoords(latitude, longitude, anchorLat, anchorLng, heading),
    [latitude, longitude, anchorLat, anchorLng, heading],
  );

  const distanceM = useMemo(
    () => distanceMeters(latitude, longitude, anchorLat, anchorLng),
    [latitude, longitude, anchorLat, anchorLng],
  );

  return { position, distanceM, heading };
}
