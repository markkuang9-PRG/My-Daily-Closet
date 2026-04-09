# Add tests for outfit/result parsing edge cases

Labels: `help wanted`, `ai`, `refactor`

## Problem

AI integrations are fragile around malformed JSON and partial model responses. The project has some test coverage, but not enough around parsing and fallback behavior in the outfit and copy flows.

## Scope

- add deterministic tests for parsing helpers or extracted fallback logic;
- focus on malformed or partial model output;
- avoid broad UI or network-level tests.

## Acceptance criteria

- tests cover malformed AI output or missing fields;
- the coverage protects current fallback behavior;
- `npm run test` passes.

## Notes

Prefer low-flake utility-level tests over larger end-to-end work in this issue.
