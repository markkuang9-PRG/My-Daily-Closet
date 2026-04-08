# Good First Tasks

This list is for contributors who want a concrete place to start.

These tasks are intentionally scoped so they can be completed without needing to redesign the whole app.

## Good first issues

### 1. Split `src/App.tsx`

Suggested outcome:

- extract auth screen;
- extract closet tab;
- extract stylist tab;
- extract market tab;
- move shared types into a separate file.

Why it matters:

- lowers maintenance cost;
- makes future contribution safer;
- gives the project a real module structure.

### 2. Fix environment variable consistency

Suggested outcome:

- standardize on `VITE_GEMINI_API_KEY`;
- document env usage clearly in `.env.example` and `README.md`;
- remove dead or inconsistent env references.

Why it matters:

- reduces setup friction for new contributors;
- avoids broken local runs.

### 3. Add upload validation

Suggested outcome:

- reject unsupported file types;
- reject extremely large files before processing;
- show clear error messages;
- keep the current flow simple.

Why it matters:

- prevents common user-facing errors;
- improves perceived quality quickly.

### 4. Add editable metadata after AI tagging

Suggested outcome:

- after import, allow category, color, style, and season to be edited;
- keep the UI lightweight;
- do not redesign the whole application.

Why it matters:

- AI tagging will never be perfect;
- manual correction is essential for trust.

### 5. Add basic tests for core utility paths

Suggested outcome:

- add tests for parsing / validation helpers once those helpers are extracted;
- prioritize low-flake tests over broad coverage.

Why it matters:

- makes future refactors less risky;
- helps contributors move faster.

## Help wanted

These are useful, but typically need a little more context:

- improve weather code mapping and fallback behavior;
- improve AI outfit prompt robustness;
- reduce the large production JS bundle;
- improve accessibility of buttons, status text, and loading states;
- improve Firestore error recovery and retry messaging.

## Contribution style that helps most

The best first pull requests are:

- small enough to review quickly;
- clearly scoped;
- accompanied by a short explanation of the user-facing impact;
- aligned with the current roadmap instead of introducing a parallel architecture.
