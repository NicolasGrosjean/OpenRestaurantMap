/**
 * Adaptation from https://github.com/NorbertB29/geolocation-api-hook/blob/master/src/hooks/useCurrentLocation.js
 *
 * See also https://norbertbartos.tech/blog/use-geolocation-api-with-react-hooks/
 */
import { useState, useEffect } from 'react';

const useCurrentLocation = (options = {}) => {
  // store location in state
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  // store error message in state
  const [locationError, setLocationError] = useState('');

  // Success handler for geolocation's `getCurrentPosition` method
  const handleSuccess = (pos: any) => {
    const { latitude, longitude } = pos.coords;

    setLocation({
      latitude,
      longitude,
    });
  };

  // Error handler for geolocation's `getCurrentPosition` method
  const handleError = (err: any) => {
    setLocationError(err.message);
  };

  useEffect(() => {
    const { geolocation } = navigator;

    // If the geolocation is not defined in the used browser we handle it as an error
    if (!geolocation) {
      setLocationError('Geolocation is not supported.');
      return;
    }

    // Call Geolocation API
    geolocation.getCurrentPosition(handleSuccess, handleError, options);
  }, []);

  return { location, locationError };
};

export default useCurrentLocation;
