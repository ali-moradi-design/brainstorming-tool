# Graph Report - brainstorming-tool  (2026-10-21)

## Corpus Check
- 113 files · ~177,475 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 3, .conf 2, .css 2)

## Summary
- 464 nodes · 1209 edges · 29 communities (21 shown, 8 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7d0abdb1`
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
- SearchDialog.tsx
- dependencies
- compilerOptions
- scripts
- .prettierrc.json
- Ideabloom
- ExportMenu.tsx
- api/index.ts
- lib/index.ts
- BoardPage.tsx
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
3. `db` - 21 edges
4. `Canvas()` - 21 edges
5. `recordChange()` - 19 edges
6. `react` - 18 edges
7. `useIdeas()` - 17 edges
8. `compilerOptions` - 16 edges
9. `updateIdea()` - 14 edges
10. `IdeaDetailsPanel()` - 14 edges

## Surprising Connections (you probably didn't know these)
- `Project` --references--> `IdeaEdge()`  [INFERRED]
  CLAUDE.md → src/entities/idea/IdeaEdge.tsx
- `Teaching plan (one stage per session)` --references--> `searchAll()`  [INFERRED]
  notes/session-log.md → src/features/global-search/search.ts
- `App()` --calls--> `SearchDialog()`  [EXTRACTED]
  src/app/App.tsx → src/features/global-search/SearchDialog.tsx
- `TagsSection()` --calls--> `useIdeas()`  [EXTRACTED]
  src/features/idea-details/TagsSection.tsx → src/entities/idea/api.ts
- `BoardPage()` --calls--> `useIdeas()`  [EXTRACTED]
  src/pages/board/BoardPage.tsx → src/entities/idea/api.ts

## Import Cycles
- None detected.

## Communities (29 total, 8 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.09
Nodes (21): name, private, type, version, dexie, eslint, @fontsource-variable/inter, @fontsource-variable/vazirmatn (+13 more)

### Community 1 - "idea/index.ts"
Cohesion: 0.11
Nodes (42): @xyflow/react, touchBoard(), addIdea(), byCreation(), listIdeas(), moveIdeas(), NewIdea, removeIdeaTree() (+34 more)

### Community 2 - "AppSidebar.tsx"
Cohesion: 0.13
Nodes (25): react, App(), BoardPage, useBoards(), BoardCard(), BoardListItem(), Props, CreateBoardForm() (+17 more)

### Community 3 - "devDependencies"
Cohesion: 0.07
Nodes (28): devDependencies, eslint, eslint-config-prettier, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, fake-indexeddb, globals (+20 more)

### Community 4 - "react-i18next"
Cohesion: 0.22
Nodes (10): react-i18next, LanguageSwitch(), applyLanguage(), initI18n(), readStoredLanguage(), isLanguage(), LANG_STORAGE_KEY, LanguageCode (+2 more)

### Community 5 - "BackupMenu.tsx"
Cohesion: 0.18
Nodes (14): zod, Backup, backupSchema, coord, exportBackup(), id, importBackup(), MAX_BACKUP_BYTES (+6 more)

### Community 6 - "icons.tsx"
Cohesion: 0.09
Nodes (30): i18next, @testing-library/react, @testing-library/user-event, zustand, IDEA_COLORS, SelectionState, IdeaToolbar(), Props (+22 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, isolatedModules, jsx, lib, module, moduleResolution, noEmit, noFallthroughCasesInSwitch (+9 more)

### Community 8 - "SearchDialog.tsx"
Cohesion: 0.15
Nodes (17): Concepts and gotchas learned (good teaching material), Decisions made with the user, How to run, Ideabloom: session log and teaching notes, Map of the code (`src/`, Feature-Sliced Design), Teaching plan (one stage per session), Teaching progress, What exists (everything is on `main`) (+9 more)

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

### Community 14 - "Ideabloom"
Cohesion: 0.17
Nodes (10): Deploying and security, Features, Ideabloom, Scripts, Stack, Known limits, Reporting, Security notes for Ideabloom (+2 more)

### Community 15 - "ExportMenu.tsx"
Cohesion: 0.33
Nodes (10): getCanvasNodes(), ExportMenu(), MenuItem(), slug(), downloadText(), downloadUrl(), ImageFormat, renderBoardImage() (+2 more)

### Community 16 - "api/index.ts"
Cohesion: 0.13
Nodes (20): dexie-react-hooks, Props, BRANCH_COLORS, createBoard(), Props, TEMPLATE_KEYS, TemplateBranch, TemplateKey (+12 more)

### Community 17 - "lib/index.ts"
Cohesion: 0.23
Nodes (16): allTags(), addNote(), removeNote(), updateNote(), useIdeaNotes(), change(), ColorField(), DescriptionField() (+8 more)

### Community 18 - "BoardPage.tsx"
Cohesion: 0.19
Nodes (16): renameBoard(), useBoard(), buildOutline(), useSelection, useViewState, useNoteCounts(), BoardPage(), ListIcon (+8 more)

### Community 19 - "eslint.config.js"
Cohesion: 0.20
Nodes (10): fsdOverrides, layers, noUpwardImports(), sliced, eslint-config-prettier, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh (+2 more)

### Community 21 - "vite.config.ts"
Cohesion: 0.29
Nodes (4): @tailwindcss/vite, vite, @vitejs/plugin-react, CSP

### Community 27 - "IdeaEdge.tsx"
Cohesion: 0.28
Nodes (7): graphify, Project, Session workflow, borderPoint(), IdeaEdge(), Rect, rectOf()

## Knowledge Gaps
- **14 isolated node(s):** `@fontsource-variable/inter`, `@fontsource-variable/vazirmatn`, `@swc/core`, `@swc/jest`, `@types/jest` (+9 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 166 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react-i18next` connect `react-i18next` to `package.json`, `idea/index.ts`, `AppSidebar.tsx`, `BackupMenu.tsx`, `icons.tsx`, `SearchDialog.tsx`, `ExportMenu.tsx`, `api/index.ts`, `lib/index.ts`, `BoardPage.tsx`?**
  _High betweenness centrality (0.177) - this node is a cross-community bridge._
- **What connects `@fontsource-variable/inter`, `@fontsource-variable/vazirmatn`, `@swc/core` to the rest of the system?**
  _14 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._
- **Why does `react` connect `AppSidebar.tsx` to `package.json`, `idea/index.ts`, `BackupMenu.tsx`, `icons.tsx`, `SearchDialog.tsx`, `ExportMenu.tsx`, `api/index.ts`, `lib/index.ts`, `BoardPage.tsx`?**
  _High betweenness centrality (0.116) - this node is a cross-community bridge._
- **Should `idea/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11403508771929824 - nodes in this community are weakly interconnected._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.100) - this node is a cross-community bridge._
- **Should `AppSidebar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13076923076923078 - nodes in this community are weakly interconnected._