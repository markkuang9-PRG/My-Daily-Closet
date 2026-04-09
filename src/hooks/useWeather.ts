import { useEffect, useState } from 'react';
import { logAppError } from '../lib/logger';
import { buildLiveWeatherState, buildWeatherFallbackState, buildWeatherLoadingState } from '../lib/weather';
import type { WeatherState } from '../types';

export const useWeather = (userId?: string | null) => {
  const [weather, setWeather] = useState<WeatherState>(buildWeatherLoadingState());

  useEffect(() => {
    if (!navigator.geolocation) {
      setWeather(buildWeatherFallbackState('unsupported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`,
          );
          if (!res.ok) {
            throw new Error(`Weather request failed with status ${res.status}`);
          }
          const data = await res.json();
          const currentWeather = data.current_weather;

          if (!currentWeather || typeof currentWeather.temperature !== 'number' || typeof currentWeather.weathercode !== 'number') {
            throw new Error('Weather response was missing current weather fields.');
          }

          setWeather(buildLiveWeatherState(currentWeather.temperature, currentWeather.weathercode));
        } catch (error) {
          logAppError(error, {
            operation: 'fetch_weather',
            path: window.location.pathname,
            userId: userId ?? null,
          });
          setWeather(buildWeatherFallbackState('fetch'));
        }
      },
      () => {
        setWeather(buildWeatherFallbackState('permission'));
      },
    );
  }, [userId]);

  return weather;
};
