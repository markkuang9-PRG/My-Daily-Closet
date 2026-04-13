# Show a user-facing toast when item deletion fails

Labels: `help wanted`, `firebase`, `ux`

## Problem

The delete path logs Firestore failures, but it does not currently show the user what happened. Silent failures make the app feel unreliable.

## Scope

- keep the existing delete behavior and logging structure;
- add clear feedback when Firestore deletion fails;
- avoid broad CRUD refactors in this issue.

## Acceptance criteria

- users see a clear failure state when deletion does not succeed;
- existing delete success behavior still works;
- `npm run lint` passes;
- `npm run build` passes.

## Notes

Keep the scope narrow. This is about deletion failure feedback, not a larger retry framework.
