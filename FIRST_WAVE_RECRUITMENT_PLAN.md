# First-Wave Recruitment Plan

This plan is for the phase before broad product expansion.

The goal is to:

- get the first 2 to 5 serious contributors into the repo;
- keep scope controlled;
- avoid stalling product work while recruiting.

## Principle

Do not pause development completely.

Instead:

- spend a short focused window making the project contributor-ready in public;
- publish a small set of real issues;
- do light product improvements while waiting for replies;
- switch back to deeper feature work after the first contributor wave starts.

## Recommended sequence

### Phase 1: Prepare the public entry points

Target window: same day

Do these first:

1. Make sure `main` is green
2. Confirm the repo entry points are current:
   - [README.md](README.md)
   - [CONTRIBUTOR_START_HERE.md](CONTRIBUTOR_START_HERE.md)
   - [GOOD_FIRST_TASKS.md](GOOD_FIRST_TASKS.md)
   - [OUTREACH_PLAYBOOK.md](OUTREACH_PLAYBOOK.md)
   - [COMMUNITY_LAUNCH_CHECKLIST.md](COMMUNITY_LAUNCH_CHECKLIST.md)
3. Create the first 3 to 5 live GitHub issues from:
   - [community/issue-drafts](community/issue-drafts)
4. Create the labels:
   - `good first issue`
   - `help wanted`
   - `frontend`
   - `firebase`
   - `ai`
   - `performance`
   - `ux`

### Phase 2: Publish the first wave

Target window: next 24 hours

Publish in this order:

1. X / Twitter
2. One developer forum or Reddit post
3. One founder / builder / dev group chat where you already have trust

Do not publish in 10 places at once.

The first wave should be small enough that you can answer everyone who replies.

### Phase 3: Hold the queue

Target window: next 3 to 7 days

During this period:

- reply to interest within 24 hours;
- route each person to one narrow issue;
- do not assign broad ownership of the product;
- keep `main` stable;
- avoid disruptive refactors.

This is the period where credibility is created or lost.

### Phase 4: Resume deeper product work

Once you have:

- a few serious contributor conversations, or
- 1 to 3 external PRs in flight, or
- one week of outreach completed

then shift more time back into product execution.

At that point the next internal work should be:

1. editable resale copy
2. Firestore recovery messaging
3. accessibility pass
4. tighter AI result validation

## What to work on while recruiting

While waiting for contributor responses, prefer work that helps onboarding:

- bug fixes with visible user impact;
- small UX improvements;
- keeping tests green;
- tightening docs where confusion shows up;
- reviewing incoming issues quickly.

Avoid during the recruitment window:

- big architecture shifts;
- migration to a new state library;
- broad UI redesigns;
- opening a huge backlog of vague feature ideas.

## What success looks like

A good first wave looks like:

- 3 to 10 useful external conversations;
- 2 to 5 people who seem technically credible;
- 1 to 3 scoped PRs;
- no dead time on issues or PRs.

That is enough. You do not need a crowd yet.

## Practical cadence

Recommended cadence for the next week:

### Day 1

- publish 3 to 5 live issues
- post first public outreach

### Day 2

- reply to comments
- answer DMs
- steer people to one scoped issue each
- continue light product work only

### Day 3 to Day 7

- review first PRs or follow-up questions
- post one follow-up update if needed
- keep product momentum with small improvements

## Decision rule

If no credible contributors appear after the first week:

- do not panic;
- tighten the demo and the issue quality;
- post again with a shorter, clearer message;
- keep building.

Good contributors usually respond to clarity and momentum, not just the word "open source".
