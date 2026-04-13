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

### Issue 2

**Title:** Replace browser delete confirmation with an in-app confirmation step

**Labels:** `good first issue`, `frontend`, `ux`

**Problem**

The delete flow still uses a blocking browser `window.confirm`. That feels rough, especially on mobile, and does not match the rest of the in-app UI.

**Scope**

- replace the blocking browser confirm in the delete path;
- use a lightweight in-app confirmation pattern;
- keep the implementation narrowly scoped to item deletion.

**Acceptance criteria**

- deleting an item requires an in-app confirmation step;
- cancellation leaves the current item untouched;
- lint and build continue to pass.

### Issue 3

**Title:** Handle clipboard-copy failures without losing the resale draft

**Labels:** `good first issue`, `frontend`, `ux`

**Problem**

The resale flow assumes clipboard access succeeds. In some browsers or privacy settings, clipboard writes can fail, and the UI should recover cleanly without losing the generated draft or deleting the item.

**Scope**

- handle clipboard write errors explicitly;
- keep the generated copy visible when copy fails;
- avoid changing the broader market workflow.

**Acceptance criteria**

- users see a clear toast or inline error when copy fails;
- the item is not deleted when clipboard access fails;
- lint and build continue to pass.

### Issue 4

**Title:** Show a user-facing toast when item deletion fails

**Labels:** `help wanted`, `firebase`, `ux`

**Problem**

The delete path logs Firestore failures, but it does not currently show the user what happened. Silent failures make the app feel unreliable.

**Scope**

- keep the existing delete behavior and logging structure;
- add clear feedback when Firestore deletion fails;
- avoid broad CRUD refactors in this issue.

**Acceptance criteria**

- users see a clear failure state when deletion does not succeed;
- existing delete success behavior still works;
- lint and build pass.

### Issue 5

**Title:** Improve occasion-aware outfit prompt guidance

**Labels:** `help wanted`, `ai`

**Problem**

The stylist flow works, but the prompt is still fairly generic. It should better guide outfit generation for common real-life scenarios without forcing a much larger settings surface.

**Scope**

- refine the outfit prompt for common situations like office, travel, and dinner;
- keep the current AI provider and general user flow;
- avoid turning this into a broader personalization system.

**Acceptance criteria**

- prompt updates improve context guidance for occasion-style requests;
- the current outfit generation flow remains intact;
- tests or prompt-focused validation continue to pass where applicable.

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

**Title:** Reduce image payload pressure in the closet list

**Labels:** `help wanted`, `performance`, `frontend`

**Problem**

Each clothing card currently renders the stored image payload directly. As the closet grows, the list should stay responsive and avoid heavier-than-needed image work on initial render.

**Scope**

- improve rendering strategy for closet item images;
- preserve the current upload and editing flows;
- avoid adding backend image infrastructure in this issue.

**Acceptance criteria**

- the closet list remains stable with more items loaded;
- the chosen optimization is documented clearly in the PR;
- build and core flows remain stable.

## Maintainer guidance

When publishing these issues:

1. Start with 3 to 5 issues, not all 8.
2. Keep at least 1 or 2 `good first issue` tasks open at all times.
3. Close or rewrite stale issues quickly.
4. Reply fast to early contributors. Responsiveness matters more than issue count.
