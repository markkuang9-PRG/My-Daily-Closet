# Issue Backlog

This file contains ready-to-post issue drafts for the first public contributor wave.

The goal is not to publish every issue at once. Start with a small set, respond quickly, and expand as the project capacity grows.

## Recommended first labels

Create these labels in GitHub before posting issues:

- `good first issue`
- `help wanted`
- `frontend`
- `firebase`
- `ai`
- `docs`
- `performance`
- `refactor`
- `ux`

## Wave 1: publish these first

### Issue 1

**Title:** Improve weather code mapping and fallback states

**Labels:** `good first issue`, `frontend`, `ux`

**Problem**

The app uses Open-Meteo weather data, but the display and fallback behavior can still be more robust. If location access fails, if the weather API returns an unfamiliar code, or if the request takes too long, the UI should remain clear and calm.

**Scope**

- improve weather-code-to-label mapping;
- improve fallback messaging when geolocation or weather fetches fail;
- keep the current provider and general UI structure;
- avoid adding account-level location settings in this issue.

**Acceptance criteria**

- weather labels are clearer and more consistent;
- fallback states do not leave confusing empty text;
- `npm run lint` passes;
- `npm run build` passes.

### Issue 2

**Title:** Let users edit generated resale copy before copying

**Labels:** `help wanted`, `frontend`, `ux`

**Problem**

The resale flow generates useful copy, but users cannot refine it before copying. For a marketplace workflow, the AI output should be an editable draft rather than locked final text.

**Scope**

- make generated title editable;
- make generated description editable;
- preserve the existing one-click generation flow;
- do not introduce a full listing manager.

**Acceptance criteria**

- users can adjust generated resale copy before copying it;
- current flow still works if users make no edits;
- lint and build continue to pass.

### Issue 3

**Title:** Reduce initial bundle size with targeted code splitting

**Labels:** `help wanted`, `performance`, `refactor`

**Problem**

The production build currently warns about a large JavaScript bundle. The project needs a focused performance pass, not a broad rewrite.

**Scope**

- identify obvious code-splitting opportunities;
- keep user-visible behavior consistent;
- document what changed and what measurable improvement was achieved.

**Acceptance criteria**

- `npm run build` still passes;
- bundle warning is reduced or the biggest contributors are documented clearly in the PR;
- no regression in main closet, stylist, or market flows.

### Issue 4

**Title:** Add upload success and failure toasts instead of `alert`

**Labels:** `good first issue`, `frontend`, `ux`

**Problem**

The app still uses blocking browser `alert` dialogs in key paths such as uploads and AI actions. That makes the product feel rough and interrupts the user flow.

**Scope**

- replace `alert` in one focused workflow, starting with upload success and failure states;
- keep the UI lightweight;
- avoid a broad notification framework unless it is justified and contained.

**Acceptance criteria**

- users receive clear non-blocking feedback after upload attempts;
- current upload behavior remains understandable;
- lint and build pass.

### Issue 5

**Title:** Add tests for outfit/result parsing edge cases

**Labels:** `help wanted`, `ai`, `refactor`

**Problem**

AI integrations are fragile around malformed JSON and unexpected model responses. The project has some test coverage, but not enough around parsing and fallback behavior in the outfit and copy flows.

**Scope**

- add deterministic tests for parsing helpers or extracted fallback logic;
- focus on malformed or partial model output;
- avoid broad UI or network-level tests.

**Acceptance criteria**

- tests cover malformed AI output or missing fields;
- the coverage helps protect current fallback behavior;
- `npm run test` passes.

## Wave 2: publish after the first responses

### Issue 6

**Title:** Improve accessibility of dialogs, buttons, and loading states

**Labels:** `help wanted`, `frontend`, `ux`

**Problem**

The app is visually coherent, but accessibility quality can be improved across dialogs, action buttons, and loading states. This is especially relevant now that the closet editor exists.

**Scope**

- review core action paths for keyboard and screen-reader clarity;
- improve labels, focus states, and semantic affordances where needed;
- avoid a broad visual redesign.

**Acceptance criteria**

- accessibility improves in the main user flows;
- no visual regression in current views;
- lint and build continue to pass.

### Issue 7

**Title:** Improve Firestore error recovery and retry messaging

**Labels:** `help wanted`, `firebase`, `ux`

**Problem**

Firestore errors are logged, but the user-facing recovery guidance is still thin. The app should better explain what happened and what users can do next.

**Scope**

- improve error messages in core write flows;
- keep structured logging intact;
- avoid introducing server-side infrastructure in this issue.

**Acceptance criteria**

- users see clearer recovery guidance on Firestore write failures;
- logs remain structured for maintainer debugging;
- current flows remain stable.

### Issue 8

**Title:** Add occasion-aware outfit prompts without changing the main flow

**Labels:** `help wanted`, `ai`, `frontend`

**Problem**

The AI stylist is useful, but it currently works from closet inventory and weather only. A small occasion input could make recommendations more relevant without changing the overall UX too much.

**Scope**

- add a small optional occasion input such as date night, office, or travel;
- keep the current recommendation flow intact;
- avoid a large settings or profile system.

**Acceptance criteria**

- users can optionally supply an occasion before generating an outfit;
- the styling flow still works when no occasion is provided;
- scope remains narrow and MVP-friendly.

## Maintainer guidance

When publishing these issues:

1. Start with 3 to 5 issues, not all 8.
2. Keep at least 1 or 2 `good first issue` tasks open at all times.
3. Close or rewrite stale issues quickly.
4. Reply fast to early contributors. Responsiveness matters more than issue count.
