# Add upload success and failure toasts instead of `alert`

Labels: `good first issue`, `frontend`, `ux`

## Problem

The app still uses blocking browser `alert` dialogs in key paths such as uploads and AI actions. That makes the product feel rough and interrupts the user flow.

## Scope

- replace `alert` in one focused workflow, starting with upload success and failure states;
- keep the UI lightweight;
- avoid a broad notification framework unless clearly justified.

## Acceptance criteria

- users receive clear non-blocking feedback after upload attempts;
- the current upload behavior remains understandable;
- `npm run lint` passes;
- `npm run build` passes.

## Notes

This issue is intentionally narrow. Do not try to replace every alert in the app at once.
