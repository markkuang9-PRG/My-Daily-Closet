# Reduce initial bundle size with targeted code splitting

Labels: `help wanted`, `performance`, `refactor`

## Problem

The production build currently warns about a large JavaScript bundle. The app needs a focused performance pass, not a broad rewrite.

## Scope

- identify obvious code-splitting opportunities;
- keep user-visible behavior consistent;
- document what changed and what measurable improvement was achieved.

## Acceptance criteria

- `npm run build` still passes;
- the bundle warning is reduced, or the biggest contributors are documented clearly in the PR;
- no regression in main closet, stylist, or market flows.

## Notes

Prefer measured, targeted improvements over architectural churn.
