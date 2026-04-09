# Improve weather code mapping and fallback states

Labels: `good first issue`, `frontend`, `ux`

## Problem

The app uses Open-Meteo weather data, but the current display and fallback behavior can be more robust. If geolocation fails, the weather request returns an unfamiliar code, or the response is delayed, the UI should still stay clear and calm.

## Scope

- improve weather-code-to-label mapping;
- improve fallback messaging when geolocation or weather fetches fail;
- keep the current API provider;
- avoid adding account-level location settings in this issue.

## Acceptance criteria

- weather labels are clearer and more consistent;
- fallback states do not leave confusing empty text in the header or stylist flow;
- `npm run lint` passes;
- `npm run build` passes.

## Notes

Keep this narrowly scoped. The goal is better resilience and clearer text, not a larger location/settings feature.
