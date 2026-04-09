import { describe, expect, it } from 'vitest';
import {
  DEFAULT_WEATHER_SUMMARY,
  buildLiveWeatherState,
  buildWeatherFallbackState,
  buildWeatherLoadingState,
  mapWeatherCodeToLabel,
} from './weather';

describe('weather helpers', () => {
  it('maps known WMO weather codes to readable labels', () => {
    expect(mapWeatherCodeToLabel(0)).toBe('Clear');
    expect(mapWeatherCodeToLabel(63)).toBe('Rain');
    expect(mapWeatherCodeToLabel(95)).toBe('Thunderstorm');
  });

  it('falls back for unknown weather codes', () => {
    expect(mapWeatherCodeToLabel(999)).toBe('Mixed conditions');
  });

  it('builds a live weather state', () => {
    expect(buildLiveWeatherState(21.6, 2)).toEqual({
      summary: '22°C, Partly cloudy',
      detail: 'Live local weather',
      source: 'live',
    });
  });

  it('builds a fallback state with reason-specific messaging', () => {
    expect(buildWeatherFallbackState('permission')).toEqual({
      summary: DEFAULT_WEATHER_SUMMARY,
      detail: 'Location unavailable. Using fallback conditions.',
      source: 'fallback',
    });
  });

  it('builds a loading state', () => {
    expect(buildWeatherLoadingState()).toEqual({
      summary: 'Checking weather...',
      detail: 'Looking up your local weather',
      source: 'loading',
    });
  });
});
