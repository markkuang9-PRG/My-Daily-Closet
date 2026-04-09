# Contributor Start Here

This file is for developers who want to evaluate the project quickly and decide whether to contribute.

## What the project is right now

My Daily Closet is an AI wardrobe app moving from open prototype to structured MVP.

Today the repository already has:

- working Google sign-in via Firebase;
- wardrobe upload and AI tagging;
- outfit recommendation flow;
- idle item resale copy generation;
- CI, test baseline, and contribution/legal policies.

The project still needs focused engineering cleanup and product hardening before broader feature expansion.

## Best places to contribute right now

These are the highest-value contribution areas at the moment:

1. Firebase reliability and user-facing error handling
2. Weather mapping and outfit prompt quality
3. Performance improvements, especially bundle size and image handling
4. Accessibility and mobile interaction polish
5. Small documentation improvements that reduce setup ambiguity

## Good first contribution profile

The best first PRs are usually:

- one bug fix or one small UX improvement;
- under roughly 150 changed lines unless discussed first;
- easy to verify locally with `npm run lint`, `npm run build`, and `npm run test`;
- aligned with [ROADMAP.md](ROADMAP.md) and [GOOD_FIRST_TASKS.md](GOOD_FIRST_TASKS.md).

## Fast path in 30 minutes

1. Read [README.md](README.md)
2. Read [ROADMAP.md](ROADMAP.md)
3. Pick one item from [GOOD_FIRST_TASKS.md](GOOD_FIRST_TASKS.md)
4. Run:

```bash
npm install
npm run lint
npm run build
npm run test
```

5. If you want to code, open a small PR with a clear before/after explanation

## What maintainers are likely to merge quickly

- scoped bug fixes;
- prompt validation improvements;
- better fallback states;
- small UI fixes in the main closet workflow;
- tests for existing utility logic.

## What to avoid in a first PR

- broad rewrites without prior discussion;
- parallel state-management systems;
- visual redesigns that change the product direction;
- legal, licensing, branding, or governance edits without maintainer input.

## Before opening a PR

Read these:

- [CONTRIBUTING.md](CONTRIBUTING.md)
- [CLA.md](CLA.md)
- [TRADEMARKS.md](TRADEMARKS.md)
- [SECURITY.md](SECURITY.md)

If the contribution touches business terms, trademark usage, or licensing boundaries, stop and ask first.
