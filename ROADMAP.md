# Roadmap

This roadmap is intentionally practical. It is meant to help contributors understand what matters now, what is intentionally deferred, and where the project needs help.

## Current Stage

My Daily Closet is currently at the **open prototype to structured MVP** stage.

That means:

- the product direction is clear;
- the repository is now legally and operationally prepared for outside contributors;
- the application runs locally and builds successfully;
- the codebase still needs engineering cleanup before broad feature expansion.

## Current Priorities

### 1. MVP stabilization

Goal: turn the current prototype into a clean, maintainable first release candidate.

High-value work:

- split `src/App.tsx` into smaller components and modules;
- standardize environment variable handling for Vite and Gemini;
- improve Firebase error handling and empty states;
- reduce bundle size and identify obvious code-splitting opportunities;
- add lightweight tests for critical flows.

### 2. Closet core workflow

Goal: make the core wardrobe flow feel reliable.

High-value work:

- improve clothing upload UX;
- improve AI result parsing and fallback behavior;
- add editable item metadata after AI import;
- improve delete / update / last-worn flows;
- make mobile interaction more resilient.

### 3. AI stylist quality

Goal: make outfit recommendations more useful and less fragile.

High-value work:

- improve prompt design and response validation;
- refine weather interpretation;
- improve outfit selection rules;
- add clearer UI for recommendation reasoning.

### 4. Monetization workflow

Goal: make the 90-day idle clothing workflow more usable.

High-value work:

- improve idle item detection visibility;
- make generated marketplace copy more structured;
- support different marketplace output formats;
- let users edit generated listing text before copying.

## Intentionally Deferred

The following are not current top priorities unless a maintainer marks them as active:

- broad marketplace integrations;
- complex admin tooling;
- advanced analytics;
- deep account/profile systems;
- polished launch marketing pages.

## How Contributors Can Help Best

If you want to contribute, the most useful pull requests right now usually fall into one of these categories:

1. engineering cleanup with low product risk;
2. UI improvements that simplify the main wardrobe flow;
3. better validation, error handling, and edge-case coverage;
4. tightly scoped Firebase or AI workflow improvements;
5. focused documentation that removes ambiguity for future contributors.

## Before Starting Work

Read these first:

- [README.md](README.md)
- [CONTRIBUTING.md](CONTRIBUTING.md)
- [GOOD_FIRST_TASKS.md](GOOD_FIRST_TASKS.md)
- [GOVERNANCE.md](GOVERNANCE.md)

If a task touches licensing, branding, security, or business terms, check:

- [CLA.md](CLA.md)
- [TRADEMARKS.md](TRADEMARKS.md)
- [SECURITY.md](SECURITY.md)
