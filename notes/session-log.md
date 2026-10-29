# Ideabloom: session log and teaching notes

Read this first when the user asks to be taught the code. The user is a React developer who
wants the code explained **step by step, in Persian** (see the language rules in CLAUDE.md and
the user's preferences). Teach one stage per session, do not jump ahead, and tick the stage off
in "Teaching progress" at the end of the session.

## What exists (everything is on `main`)

Ideabloom: a local-first mind-map app (name and logo made in this project). Data lives in
IndexedDB; nothing leaves the browser.

- Radial mind map on a canvas, projects in a collapsible sidebar (project list + outline)
- Idea details as a bottom sheet (model "C" chosen by the user): title, description, tags, color,
  separate notes, links to other ideas
- Search (Ctrl+K), undo/redo, collapse branches, free links, tags + filter, list view,
  templates (SWOT, Six Hats, Pros/Cons, 5W1H, Project plan)
- Export PNG/SVG/Markdown, JSON backup/restore, offline PWA
- Languages: English, Spanish, Persian (RTL). Light/dark themes from the palette
  `#132a13 #31572c #4f772d #90a955 #ecf39e` (greens; earlier palettes were navy/blue and blue/cream/amber/orange)
- Tooling: pnpm, ESLint (+FSD import rules), Prettier, Jest, Playwright, GitHub Actions CI + deploy,
  graphify knowledge graph, Nginx config and security review (SECURITY.md)

## Map of the code (`src/`, Feature-Sliced Design)

```
app/        App.tsx (shell), main.tsx (entry, i18n init, service worker), styles/ (Tailwind, theme tokens)
pages/      boards (home), board (project page: canvas or list + details sheet)
widgets/    app-sidebar, top-controls, board-bar, board-canvas, idea-list
features/   board-create (+templates), board-delete, idea-actions, idea-details,
            global-search, export-board, data-backup, theme-switch, language-switch
entities/   board, idea (layout, selection/view stores, node, edge), note, link
shared/     api (Dexie db, snapshot), lib (router, id, history), i18n, ui (Button, icons, Logo)
```

Rule: a layer imports only from layers below it, and a slice only through its `index.ts`.
ESLint enforces it (`no-restricted-imports`). Cross-slice needs go through a higher layer
(e.g. the page composes widgets; `selection` store lives in entities so sidebar and canvas share it).

## Teaching plan (one stage per session)

1. Tooling and project setup: pnpm, Vite, TypeScript config, path alias `@/`, ESLint flat config, Prettier
2. Architecture: Feature-Sliced Design, layers, public API, why the lint rule exists
3. Data layer: Dexie schema + versions + migrations, `snapshot.ts`, `history.ts` (undo/redo), backup + Zod
4. Theme and i18n: CSS variables, `data-theme`, Tailwind tokens, i18next, RTL and logical classes
5. Entities: `layout.ts` (radial layout math, childPosition, outline), stores (Zustand), IdeaNode/IdeaEdge
6. Features: create board + templates, idea-actions, details sections, links, tags
7. Search and export: `searchAll`, command palette dialog, html-to-image export, Markdown
8. Widgets and canvas: React Flow integration (controlled nodes, drag state, floating edges, focus handling)
9. Pages, routing, lazy loading, PWA (manifest + service worker)
10. Testing: Jest + fake-indexeddb, Playwright, how flaky tests were diagnosed
11. Security and deployment: CSP, Nginx, CI/CD, SECURITY.md
12. Working with graphify to save tokens

## Teaching progress

- [ ] 1 - [ ] 2 - [ ] 3 - [ ] 4 - [ ] 5 - [ ] 6 - [ ] 7 - [ ] 8 - [ ] 9 - [ ] 10 - [ ] 11 - [ ] 12

## Decisions made with the user

- Mind map (radial) instead of sticky notes; details model "C" = bottom sheet under the canvas
- Name: Ideabloom (same Latin brand in all languages). Palette: forest greens to pale lime (logo, favicon, PNG icons follow it)
- Sync between devices deliberately NOT built (needs a server); everything is local-first
- Hosting follows the roadmap repo: static build rsynced to `/srv/static/ideabloom`, Nginx on the
  host, certbot, subdomain `ideabloom.ali-moradi-develop.com`, SSH port 9011
- Branches: work on `claude/compassionate-edison-fo8hde`, then merge into `main`

## Concepts and gotchas learned (good teaching material)

- React Flow nodes stay `visibility: hidden` until measured, so `focus()` right after mount fails; retry for a few frames
- `nodesFocusable={false}` + a `tabIndex={-1}` wrapper keeps keyboard shortcuts working
- Unmounting a focused textarea fires blur: Enter/Esc plus blur gave a double commit (Esc even saved). Fixed with a `finished` ref
- `dir="auto"` on an element flips its own `inset-inline-start`; position a wrapper instead
- A controlled `<select>` resets while you `await`; read `e.target.value` BEFORE the first await (real bug: link to an empty id)
- Uncontrolled inputs (`defaultValue`) need a `key` tied to the stored value to refresh after async saves
- Undo/redo is snapshot-based per board: call `recordChange(boardId)` BEFORE each mutation
- `pgrep -f` / `pkill -f` match their own shell; use the `[v]ite` bracket trick
- Playwright: scope role queries (`getByRole('option')` also matched the template `<select>`), wait for saves before reload,
  and size the viewport for the details sheet
- Re-render audit (React DevTools hook counting rendered fibers): React Flow re-renders every node when
  any prop of `<ReactFlow>` changes identity (inline `onNodeClick` etc.) or when a node object is new.
  Fix: stable handlers (`useEvent`), constant option objects, `useStableItems` keeps unchanged node/edge
  objects, node data has no functions (actions come from `IdeaNodeActionsContext`), `memo` on IdeaNode,
  toolbar, BoardBar, IdeaList, BoardCanvas and the details panel (compared with `isSameIdea`)
- Controlled React Flow nodes must carry `measured` (from `dimensions` changes). Without it every new
  node object lost its size and, with `nodeOrigin` 0.5, was drawn half its size off: dragging jumped
- Opening the details sheet shrinks the canvas and moves its bottom toolbar under the pointer, so a
  double-click hit a color button. A click on the map now opens the sheet after 300 ms (`detailsId`)
- Two Tailwind utilities for one property do not override by class order: `Button` drops its default
  `h-9`/`px-3` when the caller passes its own (icon buttons were squeezed to 10px)
- The tag filter is cleared when the project changes (it used to dim every idea of the next project)
- TypeScript 7 is not supported by typescript-eslint yet, so the project uses TypeScript 5.9
- The sandbox browser build differs from Playwright's expected one: set `CHROMIUM_PATH`

## How to run

```bash
pnpm install
pnpm dev            # http://localhost:5173
pnpm lint && pnpm typecheck && pnpm test
CHROMIUM_PATH=<chrome path, only if needed> pnpm e2e
graphify query "<question>"   # read the graph before grepping
```
