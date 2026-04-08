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

**Title:** Extract upload flow into a dedicated hook

**Labels:** `help wanted`, `frontend`, `refactor`

**Problem**

The clothing upload flow still lives directly in `src/App.tsx`. It would be easier to maintain and test if the upload, compression, AI analysis, and Firestore write logic were grouped into a dedicated hook or service boundary.

**Scope**

- extract the upload workflow into a dedicated module or hook;
- keep the existing user-visible behavior the same;
- preserve structured error logging;
- avoid a broad UI redesign.

**Acceptance criteria**

- `App.tsx` no longer owns the full upload workflow directly;
- `npm run lint` passes;
- `npm run build` passes.

### Issue 2

**Title:** Standardize Gemini prompt helpers for outfit and resale generation

**Labels:** `help wanted`, `ai`, `refactor`

**Problem**

Gemini prompt strings are still embedded inline in the main app logic. Pulling them into small helper functions would make future prompt tuning easier and reduce noise in the UI layer.

**Scope**

- move inline prompt construction into dedicated helper functions;
- keep current outputs compatible with the UI;
- do not change the product flow.

**Acceptance criteria**

- prompt generation is isolated from UI rendering code;
- lint and build continue to pass.

### Issue 3

**Title:** Add lazy loading to closet and market item images

**Labels:** `good first issue`, `frontend`, `performance`, `ux`

**Problem**

The closet and market views render item images immediately. Adding native lazy loading would improve performance for longer closets with minimal risk.

**Scope**

- apply image lazy loading where appropriate;
- preserve current layout and styling;
- avoid introducing a third-party image library.

**Acceptance criteria**

- closet item images lazy load;
- market item images lazy load where reasonable;
- no layout regressions in current views.

### Issue 4

**Title:** Add editable metadata after AI clothing import

**Labels:** `help wanted`, `frontend`, `ux`

**Problem**

AI tagging is helpful, but users currently cannot correct category, color, style, or season after import. That blocks trust in the wardrobe inventory.

**Scope**

- add a lightweight way to edit item metadata after upload;
- support category, color, style, and season;
- keep the current app structure intact.

**Acceptance criteria**

- users can edit imported metadata;
- changes persist in Firestore;
- the closet view updates correctly after edits.

### Issue 5

**Title:** Improve weather code mapping and fallback states

**Labels:** `good first issue`, `frontend`, `ux`

**Problem**

Weather handling is currently simple and works, but the code-to-condition mapping and fallback messaging can be more robust.

**Scope**

- improve WMO code mapping;
- keep the current API provider;
- improve fallback messaging without adding location settings yet.

**Acceptance criteria**

- weather display is clearer and more consistent;
- fallback behavior remains stable if geolocation or the weather API fails.

## Wave 2: publish after the first responses

### Issue 6

**Title:** Reduce initial bundle size with targeted code splitting

**Labels:** `help wanted`, `performance`, `refactor`

**Problem**

The production build currently warns about large JavaScript chunks. The project needs a focused performance pass rather than a broad rewrite.

**Scope**

- analyze the largest client bundle contributors;
- apply targeted dynamic import or chunking improvements where justified;
- preserve current behavior.

**Acceptance criteria**

- build still passes;
- bundle warning is reduced or documented with concrete improvements.

### Issue 7

**Title:** Add basic unit tests for upload validation and utility helpers

**Labels:** `help wanted`, `frontend`, `refactor`

**Problem**

The project now has reusable helper modules, but very little test coverage. A small first test set would make future refactors safer.

**Scope**

- choose a lightweight test setup;
- add tests for upload validation and related utility behavior;
- do not attempt broad end-to-end coverage in this issue.

**Acceptance criteria**

- tests run in CI or are documented for immediate follow-up;
- at least the core upload validation behavior is covered.

### Issue 8

**Title:** Improve accessibility of buttons, status text, and empty states

**Labels:** `help wanted`, `frontend`, `ux`

**Problem**

The app is visually coherent, but accessibility quality can be improved across key actions and status messaging.

**Scope**

- improve button labels and semantics where needed;
- review empty states and loading text;
- avoid large design changes.

**Acceptance criteria**

- no accessibility regression in current flows;
- keyboard and screen-reader affordances improve in at least the main action paths.

## Maintainer guidance

When publishing these issues:

1. Start with 3 to 5 issues, not all 8.
2. Keep at least 1 or 2 `good first issue` tasks open at all times.
3. Close or rewrite stale issues quickly.
4. Reply fast to early contributors. Responsiveness matters more than issue count.
