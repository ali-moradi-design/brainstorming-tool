# Graph Report - brainstorming-tool  (2026-10-29)

## Corpus Check
- 124 files · ~24,116 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 3, .conf 2, .css 2)

## Summary
- 541 nodes · 1370 edges · 31 communities (24 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 14 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7621f61f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- jest-environment-jsdom@^30.5.2
- idea/index.ts
- Button
- devDependencies
- react-i18next
- steps
- icons.tsx
- compilerOptions
- Ideabloom: session log and teaching notes
- package.json
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
- steps
- allowBuilds
- CLAUDE.md
- @testing-library/react

## God Nodes (most connected - your core abstractions)
1. `Button()` - 27 edges
2. `Canvas()` - 27 edges
3. `react` - 26 edges
4. `react-i18next` - 25 edges
5. `db` - 21 edges
6. `recordChange()` - 19 edges
7. `useIdeas()` - 17 edges
8. `compilerOptions` - 16 edges
9. `IdeaDetailsPanel` - 15 edges
10. `updateIdea()` - 14 edges

## Surprising Connections (you probably didn't know these)
- `Project` --references--> `IdeaEdge()`  [INFERRED]
  CLAUDE.md → src/entities/idea/IdeaEdge.tsx
- `Teaching plan (one stage per session)` --references--> `searchAll()`  [INFERRED]
  notes/session-log.md → src/features/global-search/search.ts
- `Concepts and gotchas learned (good teaching material)` --references--> `useStableItems()`  [INFERRED]
  notes/session-log.md → src/shared/lib/stableItems.ts
- `Concepts and gotchas learned (good teaching material)` --references--> `Button()`  [INFERRED]
  notes/session-log.md → src/shared/ui/Button.tsx
- `Concepts and gotchas learned (good teaching material)` --references--> `isSameIdea()`  [INFERRED]
  notes/session-log.md → src/entities/idea/compare.ts

## Import Cycles
- None detected.

## Communities (31 total, 7 thin omitted)

### Community 1 - "idea/index.ts"
Cohesion: 0.08
Nodes (52): @xyflow/react@^12.12.0, @xyflow/react, touchBoard(), addIdea(), byCreation(), listIdeas(), moveIdeas(), NewIdea (+44 more)

### Community 2 - "Button"
Cohesion: 0.08
Nodes (41): react, App(), BoardPage, useBoards(), BoardCard(), BoardListItem(), CreateBoardForm(), deleteBoard() (+33 more)

### Community 3 - "devDependencies"
Cohesion: 0.08
Nodes (25): devDependencies, eslint@^10.13.0, identity-obj-proxy@^3.0.0, prettier@^3.9.10, @swc/core@^1.16.18, @swc/jest@^0.2.39, tailwindcss@^4.3.3, @testing-library/user-event@^14.6.8 (+17 more)

### Community 4 - "react-i18next"
Cohesion: 0.23
Nodes (9): LanguageSwitch(), applyLanguage(), initI18n(), readStoredLanguage(), isLanguage(), LANG_STORAGE_KEY, LanguageCode, LANGUAGES (+1 more)

### Community 5 - "steps"
Cohesion: 0.10
Nodes (20): if, runs-on, steps, jobs, deploy, name, on, workflow_run (+12 more)

### Community 6 - "icons.tsx"
Cohesion: 0.14
Nodes (19): IDEA_COLORS, IdeaToolbar, Props, applyTheme(), readTheme(), Theme, THEME_STORAGE_KEY, ThemeState (+11 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, isolatedModules, jsx, lib, module, moduleResolution, noEmit, noFallthroughCasesInSwitch (+9 more)

### Community 8 - "Ideabloom: session log and teaching notes"
Cohesion: 0.25
Nodes (7): Decisions made with the user, How to run, Ideabloom: session log and teaching notes, Map of the code (`src/`, Feature-Sliced Design), Teaching plan (one stage per session), Teaching progress, What exists (everything is on `main`)

### Community 9 - "package.json"
Cohesion: 0.11
Nodes (24): dependencies, dexie@^4.4.6, dexie-react-hooks@^4.4.0, @fontsource-variable/inter@^5.3.0, @fontsource-variable/vazirmatn@^5.3.0, html-to-image@^1.11.13, i18next@^26.5.3, react@^19.3.1 (+16 more)

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
Cohesion: 0.08
Nodes (32): Props, Props, BRANCH_COLORS, createBoard(), Props, TEMPLATE_KEYS, TemplateBranch, TemplateKey (+24 more)

### Community 17 - "lib/index.ts"
Cohesion: 0.14
Nodes (28): Concepts and gotchas learned (good teaching material), react-i18next, isSameIdea(), idea, addLink(), removeLink(), useLinks(), addNote() (+20 more)

### Community 18 - "BoardPage.tsx"
Cohesion: 0.12
Nodes (23): zustand@^5.0.15, zustand, renameBoard(), useBoard(), useIdeas(), DETAILS_DELAY_MS, SelectionState, useSelection (+15 more)

### Community 19 - "eslint.config.js"
Cohesion: 0.12
Nodes (16): fsdOverrides, layers, noUpwardImports(), sliced, eslint-config-prettier@^10.1.8, @eslint/js@^10.0.1, eslint-plugin-react-hooks@^7.1.1, eslint-plugin-react-refresh@^0.5.7 (+8 more)

### Community 21 - "vite.config.ts"
Cohesion: 0.20
Nodes (7): @tailwindcss/vite@^4.3.3, vite@^8.3.4, @vitejs/plugin-react@^6.1.2, @tailwindcss/vite, vite, @vitejs/plugin-react, CSP

### Community 22 - "jest.config.ts"
Cohesion: 0.50
Nodes (3): config, jest@^30.5.2, jest

### Community 23 - "jest.setup.ts"
Cohesion: 0.40
Nodes (4): fake-indexeddb@^6.2.6, @testing-library/jest-dom@^7.0.1, fake-indexeddb, @testing-library/jest-dom

### Community 25 - "steps"
Cohesion: 0.10
Nodes (19): runs-on, steps, jobs, check, name, on, pull_request, push (+11 more)

### Community 27 - "allowBuilds"
Cohesion: 0.33
Nodes (5): allowBuilds, esbuild, @parcel/watcher, @swc/core, unrs-resolver

### Community 29 - "CLAUDE.md"
Cohesion: 0.50
Nodes (3): graphify, Project, Session workflow

## Knowledge Gaps
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react-i18next` connect `lib/index.ts` to `idea/index.ts`, `Button`, `react-i18next`, `icons.tsx`, `package.json`, `ExportMenu.tsx`, `api/index.ts`, `BoardPage.tsx`?**
  _High betweenness centrality (0.127) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Canvas()` (e.g. with `shallowEqual()` and `sameNode()`) actually correct?**
  _`Canvas()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Should `idea/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07857769973661106 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Button` to `idea/index.ts`, `icons.tsx`, `package.json`, `ExportMenu.tsx`, `api/index.ts`, `lib/index.ts`, `BoardPage.tsx`?**
  _High betweenness centrality (0.119) - this node is a cross-community bridge._
- **Should `Button` be split into smaller, more focused modules?**
  _Cohesion score 0.08243727598566308 - nodes in this community are weakly interconnected._
- **Why does `devDependencies` connect `devDependencies` to `jest-environment-jsdom@^30.5.2`, `package.json`, `eslint.config.js`, `brainstorm.spec.ts`, `vite.config.ts`, `jest.config.ts`, `jest.setup.ts`, `@testing-library/react`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._