/**
 * Compute the flat-earth displacement (in meters) from user position to anchor.
 * Accurate to ~1m within 1km — sufficient for AR at building scale.
 */
export function gpsToMeters(
  userLat: number,
  userLng: number,
  anchorLat: number,
  anchorLng: number,
): { deltaNorth: number; deltaEast: number } {
  const deltaNorth = (anchorLat - userLat) * 111_320;
  const deltaEast = (anchorLng - userLng) * 111_320 * Math.cos((userLat * Math.PI) / 180);
  return { deltaNorth, deltaEast };
}

/**
 * Convert compass heading (degrees from magnetic north, 0-360)
 * and GPS displacement to AR scene XYZ coordinates (in meters).
 *
 * AR scene convention: +X = right, +Y = up, -Z = forward (camera direction).
 */
export function gpsToARCoords(
  userLat: number,
  userLng: number,
  anchorLat: number,
  anchorLng: number,
  headingDeg: number,
): [number, number, number] {
  const { deltaNorth, deltaEast } = gpsToMeters(userLat, userLng, anchorLat, anchorLng);
  const h = (headingDeg * Math.PI) / 180;

  const arX = deltaEast * Math.cos(h) + deltaNorth * Math.sin(h);
  const arZ = -(deltaEast * Math.sin(h) - deltaNorth * Math.cos(h));
  const arY = 0; // elevation handled separately if needed

  return [arX, arY, arZ];
}

/**
 * Compute bearing in degrees from user to anchor (0 = North, clockwise).
 */
export function bearingTo(
  userLat: number,
  userLng: number,
  anchorLat: number,
  anchorLng: number,
): number {
  const dLng = anchorLng - userLng;
  const y = Math.sin((dLng * Math.PI) / 180) * Math.cos((anchorLat * Math.PI) / 180);
  const x =
    Math.cos((userLat * Math.PI) / 180) * Math.sin((anchorLat * Math.PI) / 180) -
    Math.sin((userLat * Math.PI) / 180) *
      Math.cos((anchorLat * Math.PI) / 180) *
      Math.cos((dLng * Math.PI) / 180);
  const bearing = (Math.atan2(y, x) * 180) / Math.PI;
  return (bearing + 360) % 360;
}

/**
 * Distance in meters between two GPS points.
 */
export function distanceMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const { deltaNorth, deltaEast } = gpsToMeters(lat1, lng1, lat2, lng2);
  return Math.sqrt(deltaNorth ** 2 + deltaEast ** 2);
}
