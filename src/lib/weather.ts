import type { WeatherState } from '../types';

export const DEFAULT_WEATHER_SUMMARY = '20°C, Mild';

const WEATHER_LABELS: Record<number, string> = {
  0: 'Clear',
  1: 'Mostly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Foggy',
  48: 'Icy fog',
  51: 'Light drizzle',
  53: 'Drizzle',
  55: 'Heavy drizzle',
  56: 'Freezing drizzle',
  57: 'Heavy freezing drizzle',
  61: 'Light rain',
  63: 'Rain',
  65: 'Heavy rain',
  66: 'Freezing rain',
  67: 'Heavy freezing rain',
  71: 'Light snow',
  73: 'Snow',
  75: 'Heavy snow',
  77: 'Snow grains',
  80: 'Rain showers',
  81: 'Heavy rain showers',
  82: 'Violent rain showers',
  85: 'Snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with hail',
  99: 'Severe thunderstorm with hail',
};

export const mapWeatherCodeToLabel = (code: number) => WEATHER_LABELS[code] ?? 'Mixed conditions';

export const buildLiveWeatherState = (temperature: number, weatherCode: number): WeatherState => {
  const roundedTemperature = Math.round(temperature);
  const label = mapWeatherCodeToLabel(weatherCode);

  return {
    summary: `${roundedTemperature}°C, ${label}`,
    detail: 'Live local weather',
    source: 'live',
  };
};

export const buildWeatherFallbackState = (reason: 'unsupported' | 'permission' | 'fetch') => {
  const detailByReason: Record<typeof reason, string> = {
    fetch: 'Weather unavailable. Using fallback conditions.',
    permission: 'Location unavailable. Using fallback conditions.',
    unsupported: 'Device weather unavailable. Using fallback conditions.',
  };

  return {
    summary: DEFAULT_WEATHER_SUMMARY,
    detail: detailByReason[reason],
    source: 'fallback',
  } satisfies WeatherState;
};

export const buildWeatherLoadingState = (): WeatherState => ({
  summary: 'Checking weather...',
  detail: 'Looking up your local weather',
  source: 'loading',
});
