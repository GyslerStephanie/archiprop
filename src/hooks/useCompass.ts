import { useState, useEffect, useRef } from 'react';
import { Magnetometer } from 'expo-sensors';

const ALPHA = 0.1; // low-pass filter smoothing factor

/**
 * Returns smoothed compass heading in degrees (0 = North, clockwise).
 */
export function useCompass() {
  const [heading, setHeading] = useState(0);
  const smoothed = useRef(0);

  useEffect(() => {
    let sub: ReturnType<typeof Magnetometer.addListener>;

    Magnetometer.setUpdateInterval(100);
    sub = Magnetometer.addListener(({ x, y }) => {
      // Convert magnetometer X/Y to heading degrees
      let raw = Math.atan2(y, x) * (180 / Math.PI);
      raw = (raw + 360) % 360; // normalize to 0-360

      // Low-pass filter to smooth noise
      smoothed.current = ALPHA * raw + (1 - ALPHA) * smoothed.current;
      setHeading(Math.round(smoothed.current));
    });

    return () => sub?.remove();
  }, []);

  return heading;
}
