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
