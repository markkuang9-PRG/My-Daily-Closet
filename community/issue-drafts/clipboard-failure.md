# Handle clipboard-copy failures without losing the resale draft

Labels: `good first issue`, `frontend`, `ux`

## Problem

The resale flow assumes clipboard access succeeds. In some browsers or privacy settings, clipboard writes can fail, and the UI should recover cleanly without losing the generated draft or deleting the item.

## Scope

- handle clipboard write errors explicitly;
- keep the generated copy visible when copy fails;
- avoid changing the broader market workflow.

## Acceptance criteria

- users see a clear toast or inline error when copy fails;
- the item is not deleted when clipboard access fails;
- `npm run lint` passes;
- `npm run build` passes.

## Notes

Preserve the current fast path when clipboard access succeeds. The main fix here is resilience when it does not.
