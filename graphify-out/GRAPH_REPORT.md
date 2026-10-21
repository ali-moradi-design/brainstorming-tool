# Graph Report - brainstorming-tool  (2026-10-21)

## Corpus Check
- 78 files · ~96,107 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 3, .css 2)

## Summary
- 341 nodes · 756 edges · 24 communities (18 shown, 6 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `53e21c5a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- package.json
- idea/index.ts
- AppSidebar.tsx
- devDependencies
- react-i18next
- BackupMenu.tsx
- actions.test.ts
- compilerOptions
- store.ts
- dependencies
- compilerOptions
- scripts
- .prettierrc.json
- Brainstorm
- CLAUDE.md
- IdeaDetailsPanel.tsx
- eslint.config.js
- BoardPage.tsx
- vite.config.ts
- @playwright/test
- jest.config.ts
- jest.setup.ts
- pnpm

## God Nodes (most connected - your core abstractions)
1. `Button()` - 16 edges
2. `compilerOptions` - 16 edges
3. `react-i18next` - 15 edges
4. `react` - 13 edges
5. `Canvas()` - 13 edges
6. `listIdeas()` - 12 edges
7. `IdeaDetailsPanel()` - 12 edges
8. `db` - 11 edges
9. `AppSidebar()` - 11 edges
10. `scripts` - 10 edges

## Surprising Connections (you probably didn't know these)
- `Project` --references--> `IdeaEdge()`  [INFERRED]
  CLAUDE.md → src/entities/idea/IdeaEdge.tsx
- `Outline()` --calls--> `useIdeas()`  [EXTRACTED]
  src/widgets/app-sidebar/AppSidebar.tsx → src/entities/idea/api.ts
- `addIdea()` --calls--> `newId()`  [EXTRACTED]
  src/entities/idea/api.ts → src/shared/lib/id.ts
- `IdeaToolbar()` --calls--> `updateIdea()`  [EXTRACTED]
  src/features/idea-actions/IdeaToolbar.tsx → src/entities/idea/api.ts
- `Canvas()` --calls--> `updateIdea()`  [EXTRACTED]
  src/widgets/board-canvas/BoardCanvas.tsx → src/entities/idea/api.ts

## Import Cycles
- None detected.

## Communities (24 total, 6 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.10
Nodes (20): name, private, type, version, dexie, eslint, @fontsource-variable/inter, @fontsource-variable/vazirmatn (+12 more)

### Community 1 - "idea/index.ts"
Cohesion: 0.12
Nodes (36): @xyflow/react, touchBoard(), addIdea(), byCreation(), listIdeas(), moveIdeas(), NewIdea, removeIdeaTree() (+28 more)

### Community 2 - "AppSidebar.tsx"
Cohesion: 0.14
Nodes (24): zustand, App(), BoardPage, useBoards(), BoardCard(), BoardListItem(), SelectionState, useSelection (+16 more)

### Community 3 - "devDependencies"
Cohesion: 0.07
Nodes (28): devDependencies, eslint, eslint-config-prettier, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, fake-indexeddb, globals (+20 more)

### Community 4 - "react-i18next"
Cohesion: 0.18
Nodes (11): react-dom, react-i18next, LanguageSwitch(), applyLanguage(), initI18n(), readStoredLanguage(), isLanguage(), LANG_STORAGE_KEY (+3 more)

### Community 5 - "BackupMenu.tsx"
Cohesion: 0.54
Nodes (5): exportBackup(), importBackup(), BackupMenu(), DownloadIcon, UploadIcon

### Community 6 - "actions.test.ts"
Cohesion: 0.13
Nodes (19): createBoard(), CreateBoardForm(), Props, deleteBoard(), DeleteBoardButton(), IdeaToolbar(), Props, newId() (+11 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, isolatedModules, jsx, lib, module, moduleResolution, noEmit, noFallthroughCasesInSwitch (+9 more)

### Community 8 - "store.ts"
Cohesion: 0.23
Nodes (12): i18next, @testing-library/react, @testing-library/user-event, applyTheme(), readTheme(), Theme, THEME_STORAGE_KEY, ThemeState (+4 more)

### Community 9 - "dependencies"
Cohesion: 0.17
Nodes (12): dependencies, dexie, dexie-react-hooks, @fontsource-variable/inter, @fontsource-variable/vazirmatn, i18next, react, react-dom (+4 more)

### Community 10 - "compilerOptions"
Cohesion: 0.20
Nodes (9): compilerOptions, module, moduleResolution, noEmit, skipLibCheck, strict, target, types (+1 more)

### Community 11 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, build, dev, e2e, format, format:check, lint, preview (+2 more)

### Community 13 - ".prettierrc.json"
Cohesion: 0.50
Nodes (3): printWidth, singleQuote, trailingComma

### Community 14 - "Brainstorm"
Cohesion: 0.40
Nodes (4): Brainstorm, Features, Scripts, Stack

### Community 16 - "IdeaDetailsPanel.tsx"
Cohesion: 0.15
Nodes (19): dexie-react-hooks, react, Props, Props, updateIdea(), IDEA_COLORS, addNote(), removeNote() (+11 more)

### Community 17 - "eslint.config.js"
Cohesion: 0.20
Nodes (10): fsdOverrides, layers, noUpwardImports(), sliced, eslint-config-prettier, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh (+2 more)

### Community 18 - "BoardPage.tsx"
Cohesion: 0.52
Nodes (4): renameBoard(), useBoard(), BoardPage(), BoardCanvas()

### Community 19 - "vite.config.ts"
Cohesion: 0.40
Nodes (3): @tailwindcss/vite, vite, @vitejs/plugin-react

## Knowledge Gaps
- **14 isolated node(s):** `@fontsource-variable/inter`, `@fontsource-variable/vazirmatn`, `@swc/core`, `@swc/jest`, `@types/jest` (+9 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 135 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react-i18next` connect `react-i18next` to `package.json`, `idea/index.ts`, `AppSidebar.tsx`, `BackupMenu.tsx`, `actions.test.ts`, `store.ts`, `IdeaDetailsPanel.tsx`, `BoardPage.tsx`?**
  _High betweenness centrality (0.177) - this node is a cross-community bridge._
- **What connects `@fontsource-variable/inter`, `@fontsource-variable/vazirmatn`, `@swc/core` to the rest of the system?**
  _14 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.134) - this node is a cross-community bridge._
- **Should `idea/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11655874190564293 - nodes in this community are weakly interconnected._
- **Why does `react` connect `IdeaDetailsPanel.tsx` to `package.json`, `idea/index.ts`, `AppSidebar.tsx`, `react-i18next`, `BackupMenu.tsx`, `actions.test.ts`?**
  _High betweenness centrality (0.131) - this node is a cross-community bridge._
- **Should `AppSidebar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14453781512605043 - nodes in this community are weakly interconnected._