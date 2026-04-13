# Good First Tasks

This list is for contributors who want a concrete place to start.

These tasks are intentionally scoped so they can be completed without needing to redesign the whole app.

## Good first issues

### 1. Add tests for AI parsing edge cases

Suggested outcome:

- cover malformed AI JSON and fallback behavior in deterministic utility-level tests;
- focus on outfit and resale parsing paths;
- keep the tests low-flake and fast to run.

Why it matters:

- AI integrations fail first at parsing boundaries;
- better coverage protects the most fragile current logic.

### 2. Replace browser delete confirmation with an in-app confirmation step

Suggested outcome:

- remove the blocking `window.confirm` call from the delete path;
- replace it with a lightweight in-app confirmation dialog, sheet, or equivalent pattern;
- keep the flow mobile-friendly and easy to cancel.

Why it matters:

- browser confirms feel rough and inconsistent;
- this is a visible polish win with low product risk.

### 3. Handle clipboard-copy failures in the resale flow

Suggested outcome:

- show a clear error if clipboard access fails;
- do not delete or hide the item when copy fails;
- preserve the fast happy path when clipboard access succeeds.

Why it matters:

- the current resale flow assumes clipboard success;
- losing the draft or item state on failure would damage trust.

### 4. Improve delete failure feedback for Firestore write errors

Suggested outcome:

- surface a user-facing toast when delete requests fail;
- keep structured logging in place;
- avoid changing unrelated CRUD behavior.

Why it matters:

- silent failures make the app feel unreliable;
- this is a good entry point for contributors who want to improve Firebase UX without changing architecture.

### 5. Tighten occasion-aware outfit prompt guidance

Suggested outcome:

- improve prompt instructions for common scenarios like office, travel, and dinner;
- keep current model/provider choices intact;
- avoid introducing a larger settings system in the first pass.

Why it matters:

- stylist quality is one of the product's clearest differentiators;
- prompt improvements can move quality without a large UI rewrite.

## Help wanted

These are useful, but typically need a little more context:

- improve AI outfit prompt robustness for specific occasions;
- improve accessibility of buttons, status text, dialogs, and loading states;
- improve Firestore error recovery and retry messaging.

## Contribution style that helps most

The best first pull requests are:

- small enough to review quickly;
- clearly scoped;
- accompanied by a short explanation of the user-facing impact;
- aligned with the current roadmap instead of introducing a parallel architecture.
