# Replace browser delete confirmation with an in-app confirmation step

Labels: `good first issue`, `frontend`, `ux`

## Problem

The delete flow still uses a blocking browser `window.confirm`. That feels rough, especially on mobile, and does not match the rest of the in-app UI.

## Scope

- replace the blocking browser confirm in the delete path;
- use a lightweight in-app confirmation pattern;
- keep the implementation narrowly scoped to item deletion.

## Acceptance criteria

- deleting an item requires an in-app confirmation step;
- cancellation leaves the current item untouched;
- `npm run lint` passes;
- `npm run build` passes.

## Notes

Keep this focused on the existing item-delete workflow. Do not redesign the wider closet view in this issue.
