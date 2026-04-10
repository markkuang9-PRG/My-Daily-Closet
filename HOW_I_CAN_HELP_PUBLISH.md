# How Codex Can Help Publish

This file explains what can be done directly by Codex and what still requires your account click.

## What Codex can do right now

Codex can already do all of these in this repository:

- prepare the live issue bodies;
- prepare outreach copy for X, Reddit, and Hacker News;
- maintain contributor onboarding docs;
- keep the app improving while recruiting;
- push code and docs to GitHub through the repo SSH remote.

These materials are already ready:

- [OUTREACH_PLAYBOOK.md](OUTREACH_PLAYBOOK.md)
- [COMMUNITY_LAUNCH_CHECKLIST.md](COMMUNITY_LAUNCH_CHECKLIST.md)
- [FIRST_WAVE_RECRUITMENT_PLAN.md](FIRST_WAVE_RECRUITMENT_PLAN.md)
- [COMMUNITY_REPLY_TEMPLATES.md](COMMUNITY_REPLY_TEMPLATES.md)
- [community/issue-drafts](community/issue-drafts)

## What Codex can do after one GitHub login

If you authenticate `gh` once on this machine, Codex can also:

- create GitHub labels;
- publish the first-wave GitHub issues;
- edit issue bodies and labels later;
- create and update pull requests;
- work more directly with issue triage.

The one-time command is:

```bash
gh auth login
```

After that, this script can publish the first wave automatically:

```bash
./scripts/publish_first_wave_issues.sh
```

## What still requires your personal account action

Codex cannot silently post from accounts that are not authenticated on this machine.

That means:

- GitHub issue creation needs `gh` authentication first;
- X / Twitter posting needs your X account access;
- Reddit posting needs your Reddit account access;
- direct community posts in your private groups still depend on you.

## Smallest-possible user action

If you want Codex to do almost everything:

1. Run `gh auth login`
2. Tell Codex to publish the first-wave GitHub issues
3. Copy and paste one outreach post from [OUTREACH_PLAYBOOK.md](OUTREACH_PLAYBOOK.md)

That reduces your manual work to one GitHub login and one or two public posts.
