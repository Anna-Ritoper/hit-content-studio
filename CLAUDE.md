# HIT Content Studio

Internal AI content tool for EDHEC's Chaire Management in Innovative Health. Used by a non-technical team (Simone, Deborah, Loick, Bing) to generate LinkedIn posts, manage an editorial calendar, and create branded visuals.

## Stack

React 19 + TypeScript + Vite 8 + Tailwind CSS v4 (uses `@theme` in index.css, not tailwind.config). Vercel serverless functions in `api/` for API proxy (no Express server). Firebase Firestore (db: `hit-content-studio-db`) + Firebase Auth (Google sign-in). Anthropic Claude API (`claude-sonnet-4-6`). Animation: `motion` (Framer Motion). Icons: `lucide-react`.

## Commands

```
npm run dev          # Frontend dev server (port 3000)
npm run build        # Production build
npx tsc --noEmit     # Type check
```

## Verification

YOU MUST run these after every change. Do not move on until all pass:
1. `npx tsc --noEmit` : zero errors
2. `npm run build` : completes successfully
3. Grep for em dashes (U+2014, U+2013) across all src/ and server/ files : zero matches

When you fix a bug or add a feature, write a short test plan in tasks/todo.md, execute it, and record pass/fail. If something fails, fix it and re-verify everything before continuing.

## Architecture

```
src/
  App.tsx              # 3-level nav: Splash (/) -> ModuleSelector (/hub) -> Layout+Sidebar
  firebase.ts          # Firebase init from firebase-applet-config.json
  constants.ts         # Style rules, system prompts, cleanGeneratedText()
  types.ts             # All TypeScript interfaces
  services/aiService.ts  # AI API calls (THIS IS THE FILE TO REFACTOR)
  screens/             # Generate, Visuals, Voices, Calendar, Library, Settings, StyleGuide, Splash, ModuleSelector
  components/          # Layout, Sidebar, VoiceCreator
```

## Critical Rules

**IMPORTANT: NEVER use em dashes (U+2014) or en dashes (U+2013) anywhere.** Not in code, comments, strings, or generated content. Use colons, commas, or separate sentences. `cleanGeneratedText()` in constants.ts strips them from AI output, but they must not appear in source.

- Admin email: anna.ritoper@gmail.com
- Brand: bordeaux `#6B1E2E`, coral `#D4614A`, teal `#2A7D6B`, navy `#1A1F3C`, warm-white `#FAF8F4`
- Fonts: Playfair Display (headlines), DM Sans (body), Poppins (brand)
- Official name: "Chaire Management in Innovative Health" (always English, even in French contexts)
- Do NOT fabricate personal anecdotes for voice profiles
- Hashtags always grouped at end of posts, never inline

## The One Big Problem to Solve

The app currently calls the Anthropic API directly from the browser using `dangerouslyAllowBrowser: true` and stores the API key in localStorage. This does not work outside the AI Studio sandbox.

**Goal**: Create a server-side API proxy so the key lives in `process.env.ANTHROPIC_API_KEY` and the frontend calls `/api/generate`, `/api/tone`, `/api/visual`. No API key touches the browser. The team never sees or manages a key.

For Vercel deployment, use serverless functions in an `api/` directory. For local dev, use Express with Vite proxy.

After this works, update the model string from `claude-3-5-sonnet-20240620` to `claude-sonnet-4-6` everywhere.

## Known Bugs

- `aiService.ts`: uses `dangerouslyAllowBrowser: true` and old model string
- `Splash.tsx`: uses `#E07065` for coral instead of `#D4614A`
- `package.json`: name is `react-example`, should be `hit-content-studio`
- `vite.config.ts`: references `GEMINI_API_KEY` and has em dash in a comment
- `.env.example`: references AI Studio variables, needs rewrite
- `Settings.tsx`: exposes API key input field, should show status indicator only after server migration

## Features to Add (in order)

1. Cible (target audience) selector in Generate screen: Professionnels de sante, Decideurs, Etudiants, Grand public, Partenaires, Academiques. Inject into AI system prompt.
2. Calendar wired to Firestore: real CRUD, link entries to drafts, click to open in Generate, status sync.
3. Draft Library: inline editing, reopen in Generate, export as text.
4. Newsletter content type in Generate.
5. PPTX generation in Visual Studio using pptxgenjs.

## Deployment

- GitHub: `student-creator/hit-content-studio`
- Vercel: connect to repo, set `ANTHROPIC_API_KEY` env var
- `.gitignore` must include: node_modules, dist, .env, any file with real keys

## Task Management

1. Write plan to tasks/todo.md before starting
2. Check in before executing
3. Mark items complete as you go
4. After corrections, update lessons.md so the same mistake never repeats

## Core Principles

- Make every change as simple as possible. Minimal code. Delete lines instead of adding when possible.
- No temporary fixes. Find root causes.
- Only touch what is necessary. If something works, leave it alone.
- Prove it works. Run the build. Run the type check. Test the feature. If you cannot verify it, it is not done.
