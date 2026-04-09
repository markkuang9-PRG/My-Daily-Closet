# Let users edit generated resale copy before copying

Labels: `help wanted`, `frontend`, `ux`

## Problem

The resale flow generates useful AI copy, but users cannot refine it before copying. In practice, marketplace text should be editable because AI output is a draft, not final truth.

## Scope

- make generated title editable;
- make generated description editable;
- preserve the existing one-click generation flow;
- do not introduce a full listing manager.

## Acceptance criteria

- users can adjust generated resale copy before copying it;
- the current flow still works if users make no edits;
- `npm run lint` passes;
- `npm run build` passes.

## Notes

Keep the UX lightweight. This should improve trust and usability without creating a larger product surface.
