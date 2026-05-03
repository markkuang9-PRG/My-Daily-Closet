# Deployment Guide

This document defines the shortest realistic path from the current repository state to a private beta deployment.

## Recommended path

Use:

- **Frontend hosting:** Vercel
- **Auth + database:** Firebase Authentication + Firestore
- **Weather data:** Open-Meteo
- **AI provider:** Gemini, using `VITE_GEMINI_API_KEY`

This is appropriate for:

- maintainer testing;
- friend-and-advisor private beta;
- narrow early feedback loops.

This is **not** the final public-launch architecture. The current AI calls run in the browser, so the Gemini key must be restricted carefully and should eventually move behind a server-side boundary before broader public rollout.

Also note:

- the older no-auth claimable deployment path is no longer available;
- deployment should now go through the Vercel CLI or the Vercel dashboard import flow.

## Current deployment status

As of May 3, 2026, the repository already has:

- passing type checks;
- passing unit tests;
- passing production build;
- Firebase auth and Firestore client wiring;
- a Vercel-ready Vite build configuration.
- a Vercel project named `my-daily-closet`;
- a production deployment at https://my-daily-closet.vercel.app.

The current Vercel deployment does **not** yet have `VITE_GEMINI_API_KEY` configured. Until that environment variable is set and redeployed, AI actions remain disabled with in-app configuration notices.

## Required private beta setup

### 1. Firebase

Before deployment:

- confirm Google Sign-In is enabled in Firebase Authentication;
- confirm Firestore rules are published from [firestore.rules](firestore.rules);
- add your deployed domain to **Firebase Authentication authorized domains**.

This matters because Firebase Google sign-in only works on allowed domains. Firebase's web auth docs require custom or deployed domains to be added to the authorized domain list.

### 2. Gemini API key

Create or reuse a Gemini API key and set:

```env
VITE_GEMINI_API_KEY=your_key_here
```

For private beta, restrict the key to:

- `localhost`
- `my-daily-closet.vercel.app`
- your Vercel preview domain
- your production domain

Do not treat this client-side key pattern as broad public-launch ready. It is acceptable for private beta only when domain restrictions are enforced.

### 3. Vercel environment variables

In Vercel, add `VITE_GEMINI_API_KEY` to:

- Preview
- Production

Vercel applies updated environment variables only to new deployments, so redeploy after any change.

## Vercel deployment steps

### Option A: GitHub import in the Vercel dashboard

1. Create a new Vercel project
2. Import `markkuang9-PRG/My-Daily-Closet`
3. Framework preset should resolve to **Vite**
4. Add `VITE_GEMINI_API_KEY`
5. Deploy

### Option B: Vercel CLI

```bash
npm i -g vercel
vercel
```

Then:

1. link the repository to a Vercel project;
2. add `VITE_GEMINI_API_KEY` in project settings or with `vercel env add`;
3. run a fresh deploy.

If the CLI is not logged in yet:

```bash
vercel login
```

Or use a token:

```bash
vercel --token <YOUR_VERCEL_TOKEN>
```

## Private beta smoke test checklist

After deployment, test these flows on the live URL:

1. open the app and confirm the auth screen loads;
2. sign in with Google;
3. upload one clothing image and confirm AI tags are saved;
4. open Stylist and generate an outfit;
5. confirm the recommended outfit updates `lastWorn`;
6. open Market and generate resale copy for an idle item;
7. copy the generated text and confirm the item flow behaves correctly;
8. delete one item and confirm the in-app delete sheet works;
9. confirm weather fallback text still behaves correctly if location is denied.

## Known pre-public-launch gap

The main architectural gap before broader public launch is this:

- Gemini requests currently run from the browser with a Vite environment variable.

For wider public release, move AI requests behind a server-side boundary such as:

- a Vercel function;
- a Firebase function;
- another private backend service.

That change is not required to start private testing, but it is the next serious launch-hardening step.

## Recommended launch sequence

### Phase 1: private beta

- deploy to Vercel;
- authorize the deployed domain in Firebase Auth;
- restrict the Gemini API key by domain;
- run the smoke test checklist above;
- invite a small number of testers.

### Phase 2: public beta hardening

- move Gemini calls server-side;
- add one end-to-end test for the main happy path;
- improve image rendering performance in the closet list;
- add basic runtime monitoring and clearer error reporting.

## References

- Vercel Vite docs: https://vercel.com/docs/frameworks/frontend/vite
- Vercel environment variable docs: https://vercel.com/docs/environment-variables
- Firebase Google sign-in docs: https://firebase.google.com/docs/auth/web/google-signin
