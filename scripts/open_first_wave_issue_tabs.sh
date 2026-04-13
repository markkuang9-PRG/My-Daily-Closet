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
  "Add tests for outfit/result parsing edge cases" \
  "community/issue-drafts/ai-parsing-tests.md"

sleep 0.3

open_issue_tab \
  "Replace browser delete confirmation with an in-app confirmation step" \
  "community/issue-drafts/delete-confirmation.md"

sleep 0.3

open_issue_tab \
  "Handle clipboard-copy failures without losing the resale draft" \
  "community/issue-drafts/clipboard-failure.md"

sleep 0.3

open_issue_tab \
  "Show a user-facing toast when item deletion fails" \
  "community/issue-drafts/delete-failure-toast.md"

echo "Opened 4 prefilled GitHub issue tabs."
