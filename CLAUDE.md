## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:

- When graphify-out/graph.json exists, run `graphify query "<question>"` before your first grep, search or source-file read for a codebase question, and put this rule in every subagent prompt that explores code. Read raw files only for lines the graph or an earlier read already located. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
- A committed graphify-out/graph.json is rewritten whole on every build, so a large diff to it in a pull request is expected. Do not flag it as churn or suggest skipping the graph rebuild or its hooks.

## Project

Local-first brainstorming (mind map) app. All data lives in IndexedDB (Dexie); `localStorage` only
holds theme (`bt:theme`) and language (`bt:lang`).

- Stack: Vite, React, TypeScript, Tailwind v4, `@xyflow/react`, Dexie, Zustand, i18next, Zod. Package manager: pnpm.
- Architecture: Feature-Sliced Design in `src/` (`app > pages > widgets > features > entities > shared`).
  A layer imports only from layers below it, and slices only through their `index.ts`
  (enforced by ESLint `no-restricted-imports`).
- Theme: palette tokens in `src/app/styles/theme.css`; light and dark via `data-theme` on `<html>`.
  Use semantic tokens, never raw hex values, in components.
- i18n: `en`, `es`, `fa` in `src/shared/i18n/locales`. `fa` is RTL: use logical Tailwind classes (`ms-`, `me-`, `text-start`).
  A Jest test fails if the locale files do not have identical keys.
- Checks: `pnpm lint`, `pnpm typecheck`, `pnpm test` (Jest), `pnpm e2e` (Playwright; set `CHROMIUM_PATH` to use a custom browser).
- UI: radial mind map (`@xyflow/react`, floating `IdeaEdge`), collapsible sidebar (projects + outline), details panel per idea
  (description on the idea, many notes in the `notes` table). Selection is shared through `useSelection` (entities/idea).
- Dexie schema is versioned in `src/shared/api/db.ts`: add a new `db.version(n)` for every change. Old backups must still import (Zod defaults).
- Brand: Ideabloom (logo in `src/shared/ui/Logo.tsx`, `public/favicon.svg`). Undo/redo: call `recordChange(boardId)` from `@/shared/lib` BEFORE every mutation of ideas/notes/links.
- Details panel is split into sections in `features/idea-details` so its layout can be swapped (mockups in `docs/ui-options/details`).
