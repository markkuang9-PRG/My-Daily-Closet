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
ensure_label "ux" "d93f0b" "User experience and interaction polish"

create_issue \
  "Improve weather code mapping and fallback states" \
  "good first issue,frontend,ux" \
  "community/issue-drafts/weather-fallback.md"

create_issue \
  "Let users edit generated resale copy before copying" \
  "help wanted,frontend,ux" \
  "community/issue-drafts/editable-resale-copy.md"

create_issue \
  "Reduce initial bundle size with targeted code splitting" \
  "help wanted,performance" \
  "community/issue-drafts/bundle-size.md"

create_issue \
  "Add upload success and failure toasts instead of \`alert\`" \
  "good first issue,frontend,ux" \
  "community/issue-drafts/upload-toasts.md"

create_issue \
  "Add tests for outfit/result parsing edge cases" \
  "help wanted,ai" \
  "community/issue-drafts/ai-parsing-tests.md"

echo "First-wave labels and issues published."
