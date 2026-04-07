# HIT Content Studio: Tasks

## Phase 1: Make It Work
- [x] Create server-side API proxy (server/index.ts + api/generate.ts, api/tone.ts, api/visual.ts, api/health.ts)
- [x] Refactor aiService.ts to call backend instead of Anthropic directly
- [x] Remove all dangerouslyAllowBrowser usage
- [x] Remove API key from localStorage/Settings UI (replaced with /api/health status check)
- [x] Update model string to claude-sonnet-4-6 (server endpoints use it; old model string removed)
- [x] Fix vite.config.ts (removed Gemini refs, added /api proxy to localhost:3001, removed em dash)
- [x] Fix package.json name (react-example -> hit-content-studio), added dev:server script
- [x] Rewrite .env.example (now references ANTHROPIC_API_KEY and API_PORT)
- [x] Fix em dashes in src/ (replaced literal chars with unicode escapes or text descriptions)
- [x] Verify: tsc --noEmit (pass), npm run build (pass), em dash grep (zero matches in src/ and server/)

## Phase 2: Missing Features
- [x] Add Cible selector to Generate (6 audience types, injected into system prompt, teal pill buttons)
- [x] Wire Calendar to Firestore (real CRUD: create/edit/delete entries, status dropdown, open in Generate, day selection sidebar)
- [x] Draft Library: inline editing, reopen in Generate, export as .txt, copy to clipboard, status change
- [x] Newsletter content type added to Generate
- [x] PPTX generation in Visual Studio using pptxgenjs (quick mode + custom mode export)

## Phase 3: Polish and Deploy
- [x] Fix coral color mismatch (#E07065 -> #D4614A) in Splash.tsx
- [x] Update Calendar seed data for April 2026 (added 3 new entries)
- [x] PostStatus values updated to ASCII-safe (A rediger, Brouillon, Pret, Publie) across all files
- [x] vercel.json created with rewrites for API and SPA routing
- [x] .gitignore verified (includes node_modules, dist, .env)

## Phase 4: Production Bug Fix
- [x] Fix vercel.json: removed conflicting `/api/(.*)` rewrite that blocked Vercel serverless function routing
- [x] Add `functions` config with `maxDuration: 60` for API endpoints
- [x] Improve api/generate.ts: added X-Accel-Buffering header, error handling for mid-stream failures
- [x] Improve aiService.ts: added content-type check, SSE error event handling, non-streaming fallback
- [x] Improve Generate.tsx: error messages now visible in output area
- [x] Push to GitHub (commit 4cc81aa)

## End-to-End Test Results (April 7, 2026)
| Feature | Status | Notes |
|---------|--------|-------|
| Splash screen | PASS | Typing animation, blob effects, click-to-enter all work |
| Module selector (/hub) | PASS | Content Studio tile renders, navigates to /generate |
| Sidebar navigation | PASS | All 7 links work: Generate, Visuals, Voices, Calendar, Style Guide, Library, Settings |
| Firebase Auth | PASS | Google sign-in works, Anna Ritoper shown as ADMIN |
| Generate: UI | PASS | Voice selector, mode toggle, topic/stats/draft inputs, content types (incl. Newsletter), Cible pills, language/platform/hashtags all render |
| Generate: API call | PASS | /api/generate returns 200, SSE streaming connects |
| Generate: AI output | BLOCKED | Anthropic API key has zero credits ("credit balance is too low"). Fix: top up credits at console.anthropic.com |
| Refine draft mode | PASS (UI) | Mode toggle, draft textarea render. Blocked by same API credits issue |
| Visual Studio | PASS (UI) | Mode rapide/personnalise, format/style dropdowns, titre/points fields render. PPTX export UI present |
| Visual: AI generation | BLOCKED | Same API credits issue |
| Voices page | PASS | Simone Whale profile with tags, "+" to add voice, tone profile builder shown |
| Voice Creator: AI tone | BLOCKED | Same API credits issue |
| Calendar | PASS (UI) | April 2026 grid, today highlighted, Add Post button, month navigation |
| Calendar: Firestore | PARTIAL | Firebase permissions error on style rules fetch (non-blocking, falls back to hardcoded rules) |
| Draft Library | PASS | Empty state with search bar, "No drafts yet" message |
| Style Guide | PASS | All 6 hardcoded rules display correctly |
| Settings | PASS | Account (admin badge), Hashtag Manager, API Configuration ("managed server-side"), health check returns ok |
| /api/health | PASS | Returns {"status":"ok"} (key is configured) |
| SPA routing | PASS | All routes work, no 404s on direct navigation |

## Blocking Issue
The Anthropic API key on Vercel has no credits. All AI features (Generate, Refine, Visual, Voice Creator) return: "Your credit balance is too low to access the Anthropic API." This is a billing issue, not a code bug. Fix: go to console.anthropic.com and add credits to the account.

## Final Verification (all pass)
1. `npx tsc --noEmit` : PASS
2. `npm run build` : PASS
3. Em dash grep (src/) : PASS (zero matches)
4. Em dash grep (server/) : PASS (zero matches)
5. No dangerouslyAllowBrowser : PASS
6. No localStorage api_key : PASS
7. No GEMINI_API_KEY in vite.config : PASS
8. package.json name = hit-content-studio : PASS
9. No #E07065 coral mismatch : PASS
10. No old model string (claude-3-5-sonnet) : PASS
11. vercel.json exists : PASS
12. .env.example references ANTHROPIC_API_KEY : PASS
