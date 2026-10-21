# Graph Report - brainstorming-tool  (2026-10-21)

## Corpus Check
- 109 files · ~183,034 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 3, .css 2, .webmanifest 1)

## Summary
- 470 nodes · 1164 edges · 28 communities (21 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c96a81d0`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- package.json
- idea/index.ts
- AppSidebar.tsx
- devDependencies
- react-i18next
- BackupMenu.tsx
- icons.tsx
- compilerOptions
- store.ts
- dependencies
- compilerOptions
- scripts
- .prettierrc.json
- Brainstorm
- ExportMenu.tsx
- api/index.ts
- lib/index.ts
- createBoard.ts
- eslint.config.js
- brainstorm.spec.ts
- vite.config.ts
- jest.config.ts
- jest.setup.ts
- pnpm
- IdeaEdge.tsx

## God Nodes (most connected - your core abstractions)
1. `react-i18next` - 24 edges
2. `Button()` - 24 edges
3. `db` - 20 edges
4. `Canvas()` - 19 edges
5. `react` - 18 edges
6. `useIdeas()` - 17 edges
7. `recordChange()` - 17 edges
8. `compilerOptions` - 16 edges
9. `updateIdea()` - 14 edges
10. `BoardBar()` - 14 edges

## Surprising Connections (you probably didn't know these)
- `Project` --references--> `IdeaEdge()`  [INFERRED]
  CLAUDE.md → src/entities/idea/IdeaEdge.tsx
- `LinksSection()` --calls--> `useIdeas()`  [EXTRACTED]
  src/features/idea-details/LinksSection.tsx → src/entities/idea/api.ts
- `TagsSection()` --calls--> `useIdeas()`  [EXTRACTED]
  src/features/idea-details/TagsSection.tsx → src/entities/idea/api.ts
- `BoardBar()` --calls--> `useIdeas()`  [EXTRACTED]
  src/widgets/board-bar/BoardBar.tsx → src/entities/idea/api.ts
- `addIdea()` --calls--> `newId()`  [EXTRACTED]
  src/entities/idea/api.ts → src/shared/lib/id.ts

## Import Cycles
- None detected.

## Communities (28 total, 7 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.10
Nodes (20): name, private, type, version, dexie, eslint, @fontsource-variable/inter, @fontsource-variable/vazirmatn (+12 more)

### Community 1 - "idea/index.ts"
Cohesion: 0.08
Nodes (43): @xyflow/react, addIdea(), byCreation(), listIdeas(), moveIdeas(), NewIdea, removeIdeaTree(), updateIdea() (+35 more)

### Community 2 - "AppSidebar.tsx"
Cohesion: 0.07
Nodes (28): react-dom, App(), BoardPage, BoardCard(), searchAll(), SearchHit, snippetOf(), Dialog() (+20 more)

### Community 3 - "devDependencies"
Cohesion: 0.07
Nodes (28): devDependencies, eslint, eslint-config-prettier, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, fake-indexeddb, globals (+20 more)

### Community 4 - "react-i18next"
Cohesion: 0.21
Nodes (10): i18next, LanguageSwitch(), applyLanguage(), initI18n(), readStoredLanguage(), isLanguage(), LANG_STORAGE_KEY, LanguageCode (+2 more)

### Community 5 - "BackupMenu.tsx"
Cohesion: 0.35
Nodes (8): zod, Backup, backupSchema, exportBackup(), importBackup(), BackupMenu(), DownloadIcon, UploadIcon

### Community 6 - "icons.tsx"
Cohesion: 0.11
Nodes (26): react, IDEA_COLORS, allTags(), deleteBoard(), DeleteBoardButton(), IdeaToolbar(), Props, Button() (+18 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, isolatedModules, jsx, lib, module, moduleResolution, noEmit, noFallthroughCasesInSwitch (+9 more)

### Community 8 - "store.ts"
Cohesion: 0.20
Nodes (13): @testing-library/react, @testing-library/user-event, zustand, SelectionState, applyTheme(), readTheme(), Theme, THEME_STORAGE_KEY (+5 more)

### Community 9 - "dependencies"
Cohesion: 0.15
Nodes (13): dependencies, dexie, dexie-react-hooks, @fontsource-variable/inter, @fontsource-variable/vazirmatn, html-to-image, i18next, react (+5 more)

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
Nodes (4): Features, Ideabloom, Scripts, Stack

### Community 15 - "ExportMenu.tsx"
Cohesion: 0.33
Nodes (10): getCanvasNodes(), ExportMenu(), MenuItem(), slug(), downloadText(), downloadUrl(), ImageFormat, renderBoardImage() (+2 more)

### Community 16 - "api/index.ts"
Cohesion: 0.09
Nodes (28): dexie-react-hooks, renameBoard(), touchBoard(), useBoard(), useBoards(), Props, BoardListItem(), Props (+20 more)

### Community 17 - "lib/index.ts"
Cohesion: 0.26
Nodes (12): react-i18next, change(), fieldClass, FieldsSection(), IdeaDetailsPanel(), Props, LinksSection(), NotesSection() (+4 more)

### Community 18 - "createBoard.ts"
Cohesion: 0.29
Nodes (7): BRANCH_COLORS, createBoard(), CreateBoardForm(), Props, TEMPLATE_KEYS, TemplateBranch, TemplateKey

### Community 19 - "eslint.config.js"
Cohesion: 0.20
Nodes (10): fsdOverrides, layers, noUpwardImports(), sliced, eslint-config-prettier, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh (+2 more)

### Community 21 - "vite.config.ts"
Cohesion: 0.40
Nodes (3): @tailwindcss/vite, vite, @vitejs/plugin-react

### Community 27 - "IdeaEdge.tsx"
Cohesion: 0.32
Nodes (6): graphify, Project, borderPoint(), IdeaEdge(), Rect, rectOf()

## Knowledge Gaps
- **14 isolated node(s):** `@fontsource-variable/inter`, `@fontsource-variable/vazirmatn`, `@swc/core`, `@swc/jest`, `@types/jest` (+9 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 174 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react-i18next` connect `lib/index.ts` to `package.json`, `idea/index.ts`, `AppSidebar.tsx`, `react-i18next`, `BackupMenu.tsx`, `icons.tsx`, `store.ts`, `ExportMenu.tsx`, `api/index.ts`, `createBoard.ts`?**
  _High betweenness centrality (0.187) - this node is a cross-community bridge._
- **What connects `@fontsource-variable/inter`, `@fontsource-variable/vazirmatn`, `@swc/core` to the rest of the system?**
  _14 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._
- **Why does `react` connect `icons.tsx` to `package.json`, `idea/index.ts`, `AppSidebar.tsx`, `BackupMenu.tsx`, `ExportMenu.tsx`, `api/index.ts`, `lib/index.ts`, `createBoard.ts`?**
  _High betweenness centrality (0.123) - this node is a cross-community bridge._
- **Should `idea/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07746478873239436 - nodes in this community are weakly interconnected._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.101) - this node is a cross-community bridge._
- **Should `AppSidebar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07078039927404718 - nodes in this community are weakly interconnected._