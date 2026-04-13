#!/usr/bin/env bash

set -euo pipefail

if ! command -v gh >/dev/null 2>&1; then
  echo "gh CLI is required. Install it first."
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "GitHub CLI is not authenticated. Run: gh auth login"
  exit 1
fi

repo_root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$repo_root"

ensure_label() {
  local name="$1"
  local color="$2"
  local description="$3"
  gh label create "$name" --color "$color" --description "$description" --force >/dev/null
}

create_issue() {
  local title="$1"
  local labels="$2"
  local body_file="$3"
  gh issue create --title "$title" --label "$labels" --body-file "$body_file"
}

ensure_label "good first issue" "7057ff" "Good entry point for a first contribution"
ensure_label "help wanted" "0e8a16" "Maintainer is open to outside help on this issue"
ensure_label "frontend" "1f6feb" "Frontend implementation work"
ensure_label "firebase" "f39c12" "Firebase auth, Firestore, or related workflows"
ensure_label "ai" "a371f7" "AI prompt, inference, or response handling work"
ensure_label "performance" "fbca04" "Performance, bundle size, or load-time work"
ensure_label "refactor" "c2e0c6" "Internal cleanup and code organization"
ensure_label "ux" "d93f0b" "User experience and interaction polish"

if gh issue list --state open --search "Add tests for outfit/result parsing edge cases in:title" --json title --jq 'length > 0' | grep -q true; then
  echo "Skipping existing issue: Add tests for outfit/result parsing edge cases"
else
  create_issue \
    "Add tests for outfit/result parsing edge cases" \
    "help wanted,ai,refactor" \
    "community/issue-drafts/ai-parsing-tests.md"
fi

if gh issue list --state open --search "Replace browser delete confirmation with an in-app confirmation step in:title" --json title --jq 'length > 0' | grep -q true; then
  echo "Skipping existing issue: Replace browser delete confirmation with an in-app confirmation step"
else
  create_issue \
    "Replace browser delete confirmation with an in-app confirmation step" \
    "good first issue,frontend,ux" \
    "community/issue-drafts/delete-confirmation.md"
fi

if gh issue list --state open --search "Handle clipboard-copy failures without losing the resale draft in:title" --json title --jq 'length > 0' | grep -q true; then
  echo "Skipping existing issue: Handle clipboard-copy failures without losing the resale draft"
else
  create_issue \
    "Handle clipboard-copy failures without losing the resale draft" \
    "good first issue,frontend,ux" \
    "community/issue-drafts/clipboard-failure.md"
fi

if gh issue list --state open --search "Show a user-facing toast when item deletion fails in:title" --json title --jq 'length > 0' | grep -q true; then
  echo "Skipping existing issue: Show a user-facing toast when item deletion fails"
else
  create_issue \
    "Show a user-facing toast when item deletion fails" \
    "help wanted,firebase,ux" \
    "community/issue-drafts/delete-failure-toast.md"
fi

echo "First-wave labels and issues published."
