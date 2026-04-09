# Good First Tasks

This list is for contributors who want a concrete place to start.

These tasks are intentionally scoped so they can be completed without needing to redesign the whole app.

## Good first issues

### 1. Improve weather code mapping and fallback states

Suggested outcome:

- standardize weather labels for more real API responses;
- handle missing geolocation or failed weather fetches more gracefully;
- avoid confusing empty text in the header and stylist flow.

Why it matters:

- weather quality directly affects outfit quality;
- better fallbacks reduce trust-damaging edge cases.

### 2. Let users edit generated resale copy before copying

Suggested outcome:

- keep AI-generated title and description editable in the market flow;
- preserve the existing one-click generation path;
- do not introduce a full listing management system.

Why it matters:

- AI output is a draft, not final truth;
- manual editing makes the resale flow more usable.

### 3. Reduce the large production JavaScript bundle

Suggested outcome:

- identify obvious code-splitting opportunities;
- keep the app behavior unchanged;
- document the measured improvement in the PR.

Why it matters:

- smaller bundles improve first load on mobile;
- it is one of the clearest current technical weaknesses.

### 4. Add upload success and failure toasts instead of `alert`

Suggested outcome:

- replace blocking browser alerts in one focused workflow;
- keep the UI lightweight;
- preserve clear user feedback for success and failure cases.

Why it matters:

- alerts feel rough and slow the flow down;
- a contained improvement here helps the app feel less like a demo.

### 5. Add tests for outfit/result parsing edge cases

Suggested outcome:

- cover malformed AI JSON and fallback behavior;
- keep tests deterministic;
- focus on helper logic instead of UI snapshots.

Why it matters:

- AI integrations fail at the seams first;
- this increases confidence without expensive E2E work.

## Help wanted

These are useful, but typically need a little more context:

- improve AI outfit prompt robustness for specific occasions;
- reduce the large production JS bundle;
- improve accessibility of buttons, status text, dialogs, and loading states;
- improve Firestore error recovery and retry messaging.

## Contribution style that helps most

The best first pull requests are:

- small enough to review quickly;
- clearly scoped;
- accompanied by a short explanation of the user-facing impact;
- aligned with the current roadmap instead of introducing a parallel architecture.
