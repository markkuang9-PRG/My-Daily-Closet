#!/usr/bin/env bash

set -euo pipefail

repo_root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$repo_root"

open_issue_tab() {
  local title="$1"
  local body_file="$2"

  local url
  url="$(ISSUE_TITLE="$title" ISSUE_BODY_FILE="$body_file" python3 - <<'PY'
import os
from pathlib import Path
from urllib.parse import urlencode

title = os.environ["ISSUE_TITLE"]
body_file = Path(os.environ["ISSUE_BODY_FILE"])
body = body_file.read_text()

params = urlencode({
    "title": title,
    "body": body,
})

print(f"https://github.com/markkuang9-PRG/My-Daily-Closet/issues/new?{params}")
PY
)"

  open "$url"
}

open_issue_tab \
  "Improve weather code mapping and fallback states" \
  "community/issue-drafts/weather-fallback.md"

sleep 0.3

open_issue_tab \
  "Let users edit generated resale copy before copying" \
  "community/issue-drafts/editable-resale-copy.md"

sleep 0.3

open_issue_tab \
  "Reduce initial bundle size with targeted code splitting" \
  "community/issue-drafts/bundle-size.md"

sleep 0.3

open_issue_tab \
  "Add upload success and failure toasts instead of \`alert\`" \
  "community/issue-drafts/upload-toasts.md"

sleep 0.3

open_issue_tab \
  "Add tests for outfit/result parsing edge cases" \
  "community/issue-drafts/ai-parsing-tests.md"

echo "Opened 5 prefilled GitHub issue tabs."
