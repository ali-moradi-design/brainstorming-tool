# Graph Report - brainstorming-tool  (2026-10-21)

## Corpus Check
- 78 files · ~96,107 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 3, .css 2)

## Summary
- 370 nodes · 730 edges · 18 communities (17 shown, 1 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c49da78e`
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
- IdeaEdge.tsx
- IdeaDetailsPanel.tsx
- BoardsPage.tsx

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `react-i18next` - 15 edges
3. `react` - 13 edges
4. `listIdeas()` - 12 edges
5. `db` - 11 edges
6. `Button()` - 10 edges
7. `scripts` - 10 edges
8. `updateIdea()` - 9 edges
9. `IdeaDetailsPanel()` - 9 edges
10. `addChild()` - 8 edges

## Surprising Connections (you probably didn't know these)
- `Project` --references--> `IdeaEdge()`  [INFERRED]
  CLAUDE.md → src/entities/idea/IdeaEdge.tsx
- `Outline()` --calls--> `useIdeas()`  [EXTRACTED]
  src/widgets/app-sidebar/AppSidebar.tsx → src/entities/idea/api.ts
- `Canvas()` --calls--> `useIdeas()`  [EXTRACTED]
  src/widgets/board-canvas/BoardCanvas.tsx → src/entities/idea/api.ts
- `IdeaToolbar()` --calls--> `updateIdea()`  [EXTRACTED]
  src/features/idea-actions/IdeaToolbar.tsx → src/entities/idea/api.ts
- `Outline()` --calls--> `buildOutline()`  [EXTRACTED]
  src/widgets/app-sidebar/AppSidebar.tsx → src/entities/idea/layout.ts

## Import Cycles
- None detected.

## Communities (18 total, 1 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.05
Nodes (38): fsdOverrides, layers, noUpwardImports(), sliced, config, name, pnpm, onlyBuiltDependencies (+30 more)

### Community 1 - "idea/index.ts"
Cohesion: 0.13
Nodes (28): dexie-react-hooks, touchBoard(), addIdea(), byCreation(), listIdeas(), moveIdeas(), NewIdea, removeIdeaTree() (+20 more)

### Community 2 - "AppSidebar.tsx"
Cohesion: 0.07
Nodes (18): react-dom, zustand, App(), BoardPage, renameBoard(), useBoard(), BoardListItem(), SelectionState (+10 more)

### Community 3 - "devDependencies"
Cohesion: 0.07
Nodes (28): devDependencies, eslint, eslint-config-prettier, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, fake-indexeddb, globals (+20 more)

### Community 4 - "react-i18next"
Cohesion: 0.22
Nodes (10): react-i18next, LanguageSwitch(), applyLanguage(), initI18n(), readStoredLanguage(), isLanguage(), LANG_STORAGE_KEY, LanguageCode (+2 more)

### Community 5 - "BackupMenu.tsx"
Cohesion: 0.31
Nodes (8): zod, Backup, backupSchema, exportBackup(), importBackup(), BackupMenu(), DownloadIcon, UploadIcon

### Community 6 - "actions.test.ts"
Cohesion: 0.15
Nodes (16): IDEA_COLORS, deleteBoard(), DeleteBoardButton(), IdeaToolbar(), Props, Button(), Props, Variant (+8 more)

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

### Community 15 - "IdeaEdge.tsx"
Cohesion: 0.28
Nodes (7): graphify, Project, @xyflow/react, borderPoint(), IdeaEdge(), Rect, rectOf()

### Community 16 - "IdeaDetailsPanel.tsx"
Cohesion: 0.11
Nodes (21): dexie, react, Props, Props, updateIdea(), addNote(), removeNote(), updateNote() (+13 more)

### Community 17 - "BoardsPage.tsx"
Cohesion: 0.19
Nodes (13): useBoards(), BoardCard(), createBoard(), CreateBoardForm(), Props, BoardsPage(), newId(), boardPath() (+5 more)

## Knowledge Gaps
- **14 isolated node(s):** `eslint`, `@fontsource-variable/inter`, `@fontsource-variable/vazirmatn`, `identity-obj-proxy`, `jest-environment-jsdom` (+9 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 162 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react-i18next` connect `react-i18next` to `package.json`, `AppSidebar.tsx`, `BackupMenu.tsx`, `actions.test.ts`, `store.ts`, `IdeaDetailsPanel.tsx`, `BoardsPage.tsx`?**
  _High betweenness centrality (0.200) - this node is a cross-community bridge._
- **What connects `eslint`, `@fontsource-variable/inter`, `@fontsource-variable/vazirmatn` to the rest of the system?**
  _14 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05087881591119334 - nodes in this community are weakly interconnected._
- **Why does `react` connect `IdeaDetailsPanel.tsx` to `package.json`, `idea/index.ts`, `AppSidebar.tsx`, `BackupMenu.tsx`, `actions.test.ts`, `BoardsPage.tsx`?**
  _High betweenness centrality (0.140) - this node is a cross-community bridge._
- **Should `idea/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12564102564102564 - nodes in this community are weakly interconnected._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.125) - this node is a cross-community bridge._
- **Should `AppSidebar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06826241134751773 - nodes in this community are weakly interconnected._