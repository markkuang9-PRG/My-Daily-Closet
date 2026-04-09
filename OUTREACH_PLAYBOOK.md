# Outreach Playbook

This file is for the first public contributor push.

The goal is simple:

- get a small number of high-signal contributors;
- keep expectations realistic;
- avoid attracting broad, low-context feature requests too early.

## What to say publicly

Lead with:

1. what the product does;
2. what is already working;
3. what kind of help is needed now;
4. where contributors should start.

Do not lead with:

- a giant long-term vision;
- acquisition or buyout language;
- vague statements like "all help welcome";
- a giant task dump with no entry point.

## Best channels for the first wave

Use channels where scoped technical collaboration is normal:

- X / Twitter
- Reddit communities related to React, Firebase, startups, open source, and AI tooling
- Hacker News
- Dev.to or Hashnode
- founder or developer group chats where people already know you

For the first wave, it is better to post in a few focused places and reply well than to spray the link everywhere.

## What to have ready before posting

Before sharing the repository, make sure these are easy to find:

- [README.md](README.md)
- [CONTRIBUTOR_START_HERE.md](CONTRIBUTOR_START_HERE.md)
- [GOOD_FIRST_TASKS.md](GOOD_FIRST_TASKS.md)
- 3 to 5 live GitHub issues based on [ISSUE_BACKLOG.md](ISSUE_BACKLOG.md)
- [COMMUNITY_LAUNCH_CHECKLIST.md](COMMUNITY_LAUNCH_CHECKLIST.md)

If those are not ready, outside developers will bounce quickly.

## Suggested first 5 live issues

Post these first:

1. Improve weather code mapping and fallback states
2. Let users edit generated resale copy before copying
3. Reduce the large production JavaScript bundle
4. Add upload success and failure toasts instead of `alert`
5. Add tests for outfit/result parsing edge cases

Use labels such as:

- `good first issue`
- `help wanted`
- `frontend`
- `ai`
- `performance`
- `ux`

Ready-to-paste issue bodies are stored in:

- [community/issue-drafts](community/issue-drafts)

## Ready-to-post short outreach copy

### X / Twitter version

Building **My Daily Closet**, an open-source AI wardrobe app with Firebase + Gemini.

Current app can:
- digitize clothes from a photo
- recommend outfits based on weather
- flag unworn items and generate resale copy

Now looking for a few contributors to help with MVP cleanup:
- React polish
- Firebase reliability
- prompt quality
- performance and accessibility

Start here:
[CONTRIBUTOR_START_HERE.md](CONTRIBUTOR_START_HERE.md)

### Reddit / forum version

I am building **My Daily Closet**, an open-source AI wardrobe app focused on turning personal clothing into a more manageable inventory.

The current prototype already supports:

- Google sign-in with Firebase
- clothing upload and AI tagging
- AI outfit recommendations using weather context
- idle item detection and resale copy generation

I am now trying to turn it into a cleaner MVP and am looking for a small number of contributors who are interested in:

- React cleanup
- Firebase reliability
- prompt and response handling
- mobile UX and accessibility
- performance improvements

The contributor entry point is here:
[CONTRIBUTOR_START_HERE.md](CONTRIBUTOR_START_HERE.md)

And the first-task list is here:
[GOOD_FIRST_TASKS.md](GOOD_FIRST_TASKS.md)

### Hacker News / Show HN style version

Show HN: My Daily Closet, an open-source AI wardrobe manager built with React, Firebase, and Gemini

Working today:

- clothing photo upload with AI tagging
- weather-aware outfit suggestions
- 90-day idle item detection
- AI-generated resale copy

Current focus is turning the prototype into a stable MVP. I am especially looking for help with frontend cleanup, Firebase reliability, prompt robustness, and performance.

Contributor entry point:
[CONTRIBUTOR_START_HERE.md](CONTRIBUTOR_START_HERE.md)

## How to reply when someone shows interest

Keep the reply short and specific:

1. thank them;
2. point them to [CONTRIBUTOR_START_HERE.md](CONTRIBUTOR_START_HERE.md);
3. link one live issue;
4. state expected scope in one sentence.

Example:

> Thanks. The fastest way in is [CONTRIBUTOR_START_HERE.md](CONTRIBUTOR_START_HERE.md). A good first scoped task is the weather fallback issue. Goal is to improve mapping and empty/error states without changing providers.

## What success looks like

For the first public push, success is not volume.

Success looks like:

- 2 to 5 serious contributors showing interest;
- 1 to 3 external PRs with clean scope;
- no long periods of unanswered issues or PRs.
