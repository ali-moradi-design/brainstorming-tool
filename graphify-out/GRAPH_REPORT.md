# Graph Report - brainstorming-tool  (2026-10-21)

## Corpus Check
- 64 files · ~15,263 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .css 2)

## Summary
- 293 nodes · 603 edges · 14 communities (13 shown, 1 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- package.json
- idea/index.ts
- BoardsPage.tsx
- devDependencies
- react-i18next
- api/index.ts
- icons.tsx
- compilerOptions
- store.ts
- dependencies
- compilerOptions
- scripts
- .prettierrc.json

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `react-i18next` - 14 edges
3. `Button()` - 12 edges
4. `react` - 11 edges
5. `listIdeas()` - 11 edges
6. `scripts` - 10 edges
7. `IdeaToolbar()` - 10 edges
8. `addChild()` - 10 edges
9. `BoardsPage()` - 10 edges
10. `Canvas()` - 10 edges

## Surprising Connections (you probably didn't know these)
- `App()` --calls--> `AppHeader()`  [EXTRACTED]
  src/app/App.tsx → src/widgets/app-header/AppHeader.tsx
- `addIdea()` --calls--> `newId()`  [EXTRACTED]
  src/entities/idea/api.ts → src/shared/lib/id.ts
- `IdeaToolbar()` --calls--> `updateIdea()`  [EXTRACTED]
  src/features/idea-actions/IdeaToolbar.tsx → src/entities/idea/api.ts
- `CreateBoardForm()` --calls--> `Button()`  [EXTRACTED]
  src/features/board-create/CreateBoardForm.tsx → src/shared/ui/Button.tsx
- `CreateBoardForm()` --calls--> `PlusIcon`  [EXTRACTED]
  src/features/board-create/CreateBoardForm.tsx → src/shared/ui/icons.tsx

## Import Cycles
- None detected.

## Communities (14 total, 1 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.05
Nodes (38): fsdOverrides, layers, noUpwardImports(), sliced, config, name, pnpm, onlyBuiltDependencies (+30 more)

### Community 1 - "idea/index.ts"
Cohesion: 0.16
Nodes (30): @xyflow/react, touchBoard(), addIdea(), byCreation(), childPosition(), listIdeas(), moveIdeas(), NewIdea (+22 more)

### Community 2 - "BoardsPage.tsx"
Cohesion: 0.16
Nodes (18): dexie-react-hooks, App(), BoardPage, renameBoard(), useBoard(), useBoards(), BoardCard(), BoardPage() (+10 more)

### Community 3 - "devDependencies"
Cohesion: 0.07
Nodes (28): devDependencies, eslint, eslint-config-prettier, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, fake-indexeddb, globals (+20 more)

### Community 4 - "react-i18next"
Cohesion: 0.15
Nodes (13): react-dom, react-i18next, LanguageSwitch(), applyLanguage(), initI18n(), readStoredLanguage(), isLanguage(), LANG_STORAGE_KEY (+5 more)

### Community 5 - "api/index.ts"
Cohesion: 0.17
Nodes (15): dexie, zod, Props, createBoard(), CreateBoardForm(), Backup, backupSchema, exportBackup() (+7 more)

### Community 6 - "icons.tsx"
Cohesion: 0.17
Nodes (15): react, IDEA_COLORS, deleteBoard(), DeleteBoardButton(), IdeaToolbar(), Props, Button(), Props (+7 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, isolatedModules, jsx, lib, module, moduleResolution, noEmit, noFallthroughCasesInSwitch (+9 more)

### Community 8 - "store.ts"
Cohesion: 0.21
Nodes (13): i18next, @testing-library/react, @testing-library/user-event, zustand, applyTheme(), readTheme(), Theme, THEME_STORAGE_KEY (+5 more)

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

## Knowledge Gaps
- **14 isolated node(s):** `@fontsource-variable/inter`, `@fontsource-variable/vazirmatn`, `@swc/core`, `@swc/jest`, `@types/jest` (+9 more)
  These have ≤1 connection - possible missing edges. (Counts symbols only; 120 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react-i18next` connect `react-i18next` to `package.json`, `idea/index.ts`, `BoardsPage.tsx`, `api/index.ts`, `icons.tsx`, `store.ts`?**
  _High betweenness centrality (0.187) - this node is a cross-community bridge._
- **What connects `@fontsource-variable/inter`, `@fontsource-variable/vazirmatn`, `@swc/core` to the rest of the system?**
  _14 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05087881591119334 - nodes in this community are weakly interconnected._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.154) - this node is a cross-community bridge._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._
- **Why does `react` connect `icons.tsx` to `package.json`, `idea/index.ts`, `BoardsPage.tsx`, `react-i18next`, `api/index.ts`?**
  _High betweenness centrality (0.132) - this node is a cross-community bridge._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._