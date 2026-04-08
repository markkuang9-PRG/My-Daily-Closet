import { useEffect, useState } from 'react';
import { logAppError } from '../lib/logger';

export const useWeather = (userId?: string | null) => {
  const [weather, setWeather] = useState<string>('Fetching weather...');

  useEffect(() => {
    if (!navigator.geolocation) {
      setWeather('20°C, Clear (Default)');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`,
          );
          const data = await res.json();
          const code = data.current_weather.weathercode;
          let condition = 'Clear';

          if (code >= 51 && code <= 67) condition = 'Rain';
          if (code >= 71 && code <= 77) condition = 'Snow';
          if (code >= 1 && code <= 3) condition = 'Cloudy';

          setWeather(`${data.current_weather.temperature}°C, ${condition}`);
        } catch (error) {
          logAppError(error, {
            operation: 'fetch_weather',
            path: window.location.pathname,
            userId: userId ?? null,
          });
          setWeather('20°C, Clear (Default)');
        }
      },
      () => {
        setWeather('20°C, Clear (Default)');
      },
    );
  }, [userId]);

  return weather;
};
