
# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from file system structure or context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, `GEMINI.md` for Gemini CLI, `QWEN.md` for Qwen Code or `AGENTS.md` for opencode).
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary
**Primary Requirement**: Movie watch party platform with enhanced genre filtering that is only available when viewing popular movies (no active search term)

**Updated Genre Filtering Approach**: 
- Genre filters only visible when no search term is active (popular movies view)
- Genre filters trigger new API requests to filtered popular movies endpoint
- Returns to page 1 when filters applied/modified  
- Maintains filters during pagination
- Multiple genres combined with AND logic
- Search results show no genre filters - simplified search experience
- Page title updates to reflect current mode: "Popular Movies", "[Genre] Movies", or "Search Results"

**Technical Approach**: Next.js web application with TMDB API integration, stateless URL-encoded watch party data, simplified genre filtering only for popular movies (hidden during search)

## Technical Context
**Language/Version**: TypeScript with Next.js 14+ and React 18+
**Primary Dependencies**: Next.js, React, Tailwind CSS, ShadCN/UI components, TMDB API, Playwright for E2E testing
**Storage**: No server-side storage required - stateless architecture with URL-encoded data, localStorage for theme preferences
**Testing**: Jest for unit tests, Cucumber with Playwright for end-to-end browser automation, Storybook for component documentation
**Target Platform**: Web application deployed on Vercel with server-side rendering
**Project Type**: web (frontend + backend API routes)
**Performance Goals**: <2 second movie search response time, real-time countdown synchronization
**Constraints**: External API rate limits, Vercel free tier limitations, secure API key management, 2048 character URL limits
**Scale/Scope**: MVP for small groups, 100 concurrent users max, responsive design for mobile/desktop

## UI/UX Design Specifications
**Responsive Layout Strategy**: Mobile-first responsive design using Tailwind CSS breakpoints
**Movie Grid Responsive Breakpoints**:
- **Mobile (default)**: 2 columns (`grid-cols-2`)
- **Tablet (md: 768px+)**: 3 columns (`sm:grid-cols-3`) 
- **Desktop (lg: 1024px+)**: 6 columns (`lg:grid-cols-6`)
**Grid Implementation**: MovieGrid organism component with configurable `gridCols` prop
**Responsive Components**: All UI components follow mobile-first design principles with proper scaling
**Theme Support**: Dark/light mode toggle with system preference detection
**Accessibility**: WCAG 2.1 AA compliance with proper ARIA labels and keyboard navigation

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Principle I - Test-Driven Development (NON-NEGOTIABLE)**:
- [x] All tests written before implementation code (Jest unit tests, Cucumber E2E tests with Playwright)
- [x] Red-Green-Refactor cycle planned for each component
- [x] No production code without corresponding failing test

**Principle II - Clean Architecture with Folder-by-Feature**:
- [x] Feature boundaries clearly defined (movie-search, movie-details, watch-party features)
- [x] Dependencies flow inward toward domain core
- [x] Each feature is self-contained with minimal cross-feature dependencies
- [x] Folder structure follows clean architecture layers

**Principle III - Atomic Design for UI Components**:
- [x] UI components organized by atomic design hierarchy (atoms → molecules → organisms → templates → pages)
- [x] Component dependencies respect atomic design principles
- [x] Clear separation between design system (ShadCN) and feature-specific components

**Principle IV - Storybook Documentation (NON-NEGOTIABLE)**:
- [x] All UI components will have corresponding Storybook stories
- [x] Story coverage includes all component states and props (light/dark theme variations)
- [x] Component documentation strategy defined

**Principle V - Contract-First Integration**:
- [x] All integration points have explicit contracts defined (TMDB API, stateless URL encoding)
- [x] API endpoints documented before implementation (Next.js API routes)
- [x] Component interfaces specified before coding (TypeScript interfaces)

*Initial Constitution Check: PASS*

## Project Structure

### Documentation (this feature)
```
specs/[###-feature]/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (serverless functions)
│   │   ├── movies/
│   │   │   ├── search/    # Enhanced with multi-genre filtering support
│   │   │   ├── popular/   # NEW: Genre filtering support required
│   │   │   └── [id]/
│   │   └── genres/
│   ├── (home)/            # Home page route group
│   ├── movies/            # Movie details pages
│   │   └── [id]/
│   └── watch-party/       # Watch party pages
│       └── [encoded]/
├── features/              # Folder-by-feature organization
│   ├── movie-search/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   ├── movie-details/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   └── watch-party/
│       ├── components/
│       ├── hooks/
│       ├── services/
│       └── types/
├── components/            # Atomic design hierarchy
│   ├── atoms/
│   ├── molecules/
│   ├── organisms/
│   └── templates/
├── lib/                   # Utilities and configurations
│   ├── tmdb.ts           # TMDB API client
│   ├── utils.ts          # General utilities
│   └── validations.ts    # Zod schemas
└── types/                 # Global TypeScript types
    ├── movie.ts
    ├── watchparty.ts
    └── api.ts

tests/
├── contract/              # API contract tests
│   ├── movie-search-api.test.ts
│   ├── movie-details-api.test.ts
│   └── genres-api.test.ts
├── integration/           # Cucumber feature files
│   ├── movie-discovery.feature
│   ├── watch-party-flow.feature
│   └── countdown-timer.feature
├── step-definitions/      # Cucumber step definitions with Playwright
│   ├── movie-discovery.steps.ts
│   ├── watch-party-flow.steps.ts
│   ├── countdown-timer.steps.ts
│   └── support/          # Playwright setup and utilities
│       ├── world.ts      # Cucumber World with Playwright
│       ├── hooks.ts      # Before/After hooks
│       └── fixtures.ts   # Test data
├── unit/                  # Jest unit tests
│   ├── components/
│   │   ├── atoms/
│   │   ├── molecules/
│   │   ├── organisms/
│   │   └── templates/
│   ├── features/
│   │   ├── movie-search/
│   │   ├── movie-details/
│   │   └── watch-party/
│   └── lib/
└── playwright.config.ts  # Playwright configuration

.storybook/               # Storybook configuration
stories/                  # Component stories
├── atoms/
├── molecules/
├── organisms/
└── templates/
```

**Structure Decision**: Web application structure with Next.js App Router, folder-by-feature organization, and Playwright integration for Cucumber E2E tests. The testing structure supports three levels: contract tests for API endpoints, Cucumber E2E tests with Playwright for user workflows, and Jest unit tests for components and utilities.

## Phase 0: Outline & Research
1. **Extract unknowns from Technical Context** above:
   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

2. **Generate and dispatch research agents**:
   ```
   For each unknown in Technical Context:
     Task: "Research {unknown} for {feature context}"
   For each technology choice:
     Task: "Find best practices for {tech} in {domain}"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

## Phase 1: Design & Contracts
*Prerequisites: research.md complete*

1. **Extract entities from feature spec** → `data-model.md`:
   - Entity name, fields, relationships
   - Validation rules from requirements
   - State transitions if applicable

2. **Generate API contracts** from functional requirements:
   - For each user action → endpoint
   - Use standard REST/GraphQL patterns
   - Output OpenAPI/GraphQL schema to `/contracts/`

3. **Generate contract tests** from contracts:
   - One test file per endpoint
   - Assert request/response schemas
   - Tests must fail (no implementation yet)

4. **Extract test scenarios** from user stories:
   - Each story → integration test scenario
   - Quickstart test = story validation steps

5. **Update agent file incrementally** (O(1) operation):
   - Run `.specify/scripts/powershell/update-agent-context.ps1 -AgentType copilot`
     **IMPORTANT**: Execute it exactly as specified above. Do not add or remove any arguments.
   - If exists: Add only NEW tech from current plan
   - Preserve manual additions between markers
   - Update recent changes (keep last 3)
   - Keep under 150 lines for token efficiency
   - Output to repository root

**Output**: data-model.md, /contracts/*, failing tests, quickstart.md, agent-specific file

**Genre Filtering Implementation Strategy**:
- Update popular movies API contract to support genre parameter(s)
- Update TMDB library to handle genre filtering for popular movies (use /discover/movie endpoint)
- Modify frontend to hide genre filters when search term is active
- Show genre filters only when viewing popular movies (no search term)
- Ensure pagination maintains active genre filters for popular movies
- Simplify search API - remove genre filtering complexity
- Create contract tests for popular movies genre filtering scenarios
- Implement dynamic page title updates based on current mode:
  - "Popular Movies" when no genres selected
  - "[Genre] Movies" when genres selected in popular view
  - "Search Results" when showing search results
- Update UI to conditionally render genre filters based on search state
  - "[Genre] Movies" for single genre (e.g., "Action Movies")
  - "[Genre1], [Genre2] Movies" for multiple genres (e.g., "Action, Comedy Movies")
- Update UI components to display contextual titles reflecting current filtering state

**UI/UX Enhancement Strategy** (Implemented during development):
- Create unified Header component with clickable Watchify logo for consistent navigation
- Implement theme-aware CountdownTimer with optimized contrast for light/dark modes
- Simplify watch party page UI by removing status badges and participant counts  
- Enhance copy link functionality with full-width primary button including copy icon
- Apply simplified status logic using date comparison instead of complex state management
- Ensure visual consistency across all pages with shared header component
- Optimize content discovery by loading 60 movies initially (3 pages × 20 items) instead of 20
- Improve desktop viewing with 5-column grid layout while maintaining mobile responsiveness

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Load `.specify/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs (contracts, data model, quickstart)
- Each contract → contract test task [P]
- Each entity → model creation task [P] 
- Each user story → integration test task
- Genre filtering simplification tasks:
  - Update popular movies API contract [P]
  - Update TMDB library for genre filtering [P] 
  - Update frontend to hide genre filters during search
  - Update UI to show genre filters only for popular movies
  - Update pagination to maintain filters for popular movies
  - Remove genre filtering from search API contract [P]
  - Create genre filtering contract tests for popular movies only [P]
  - Implement dynamic page title updates: "Popular Movies", "[Genre] Movies", "Search Results" [P]
  - Update search result UI to show "Search Results" title
  - Simplify search implementation - remove genre complexity
- Implementation tasks to make tests pass

**Ordering Strategy**:
- TDD order: Tests before implementation 
- Dependency order: Models before services before UI
- Mark [P] for parallel execution (independent files)

**Estimated Output**: 30-35 numbered, ordered tasks in tasks.md (increased due to genre filtering enhancements)

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |


## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [x] Phase 3: Tasks generated (/tasks command)
- [x] Phase 4: Core implementation complete (T001-T055 + T071-T074)
- [ ] Phase 5: Full validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [x] Core implementation complete with UI/UX enhancements
- [x] No complexity deviations requiring documentation

---
*Based on Constitution v2.1.1 - See `/memory/constitution.md`*
