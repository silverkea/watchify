# Tasks: Movie Watch Party Platform MVP

**In## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**

### Contract Tests (API Testing)
- [x] T007 [P] Contract test GET /api/movies/search in tests/contract/movie-search-api.test.ts  
- [x] T008 [P] Contract test GET /api/movies/[id] in tests/contract/movie-details-api.test.ts
- [x] T009 [P] Contract test GET /api/genres in tests/contract/genres-api.test.ts
- [ ] T056 [P] Contract test GET /api/movies/popular with genre filtering in tests/contract/popular-movies-api.test.ts
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)
```
1. Load plan.md from feature directory ✓
   → Tech stack: Next.js 14+, TypeScript, Tailwind CSS, ShadCN/UI
   → Testing: Jest + Cucumber with Playwright for E2E browser automation
   → Structure: Web app with folder-by-feature organization
2. Load design documents ✓:
   → data-model.md: Movie, Genre, CastMember, WatchParty, ShareableURLData
   → contracts/: 4 API endpoints (movie-search, movie-details, genres, popular-movies with genre filtering)
   → research.md: TMDB API, Vercel deployment, Playwright vs alternatives
   → quickstart.md: TDD workflow with Playwright debugging tools
   → Enhanced genre filtering requirements: Genre filters only for popular movies (hidden during search), pagination reset, simplified UI
3. Generate tasks by category ✓:
   → Setup: Next.js project, Playwright browsers, dependencies
   → Tests: 5 contract tests, 4 Cucumber features with Playwright step definitions
   → Core: 5 data models, 4 API endpoints, UI components with conditional genre filtering (hidden during search)
   → Integration: Enhanced TMDB service, URL encoding, theme system
   → Polish: unit tests, Storybook stories, performance, simplified genre filtering validation
4. Apply task rules ✓:
   → Different files = [P] for parallel execution
   → Tests before implementation (TDD principle)
   → Playwright setup for cross-browser automation
5. Number tasks sequentially T001-T068
6. Dependencies verified: Setup → Tests → Models → Services → UI → Simplified Genre Filtering → Polish
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Next.js App Router**: `src/app/`, `src/components/`, `src/lib/`
- **Folder-by-feature**: `src/features/movie-search/`, `src/features/watch-party/`
- **Atomic Design**: `src/components/atoms/`, `molecules/`, `organisms/`

## Phase 3.1: Setup
- [x] T001 Create Next.js project structure with TypeScript and folder-by-feature organization: src/app/, src/components/atoms|molecules|organisms/, src/features/movie-search|watch-party/, src/lib/, src/types/, tests/contract|integration|step-definitions/
- [x] T002 Install and configure dependencies: Tailwind CSS, ShadCN/UI, Zod, date-fns, Playwright, Cucumber
- [x] T003 [P] Configure Playwright browsers and Cucumber integration in playwright.config.ts and cucumber.js
- [x] T004 [P] Configure ESLint, Prettier, and Jest testing environment
- [x] T005 [P] Setup environment variables and .env.local template with TMDB API configuration
- [x] T006 [P] Configure Tailwind CSS with dark/light theme support and neon color palette

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**

### Contract Tests (API Endpoints)
- [x] T007 [P] Contract test GET /api/movies/search in tests/contract/movie-search-api.test.ts
- [x] T008 [P] Contract test GET /api/movies/[id] in tests/contract/movie-details-api.test.ts
- [x] T009 [P] Contract test GET /api/genres in tests/contract/genres-api.test.ts

### E2E Tests (Cucumber + Playwright)  
- [x] T010 [P] Cucumber feature: Movie discovery flow in tests/integration/movie-discovery.feature
- [x] T011 [P] Cucumber feature: Watch party creation in tests/integration/watch-party-flow.feature
- [x] T012 [P] Cucumber feature: Countdown timer behavior in tests/integration/countdown-timer.feature
- [ ] T058 [P] Simplified Cucumber feature: Genre filtering only for popular movies in tests/integration/genre-filtering-popular.feature

### Playwright Step Definitions
- [x] T013 [P] Movie discovery steps in tests/step-definitions/movie-discovery.steps.ts
- [x] T014 [P] Watch party flow steps in tests/step-definitions/watch-party-flow.steps.ts
- [x] T015 [P] Countdown timer steps in tests/step-definitions/countdown-timer.steps.ts
- [x] T016 [P] Playwright World setup in tests/step-definitions/support/world.ts
- [x] T017 [P] Cucumber hooks with Playwright in tests/step-definitions/support/hooks.ts
- [ ] T059 [P] Genre filtering steps for popular movies only in tests/step-definitions/genre-filtering-popular.steps.ts
- [x] T018 [P] Unit test: URL encoding/decoding for watch party data in tests/unit/url-encoder.test.ts

## Phase 3.3: Data Models (ONLY after tests are failing)
- [x] T019 [P] Movie interface and Zod schema in src/types/movie.ts
- [x] T020 [P] Genre interface and Zod schema in src/types/genre.ts
- [x] T021 [P] CastMember interface and Zod schema in src/types/cast.ts
- [x] T022 [P] WatchParty interface and Zod schema in src/types/watch-party.ts
- [x] T023 [P] ShareableURLData interface and Zod schema in src/types/shareable-url.ts

## Phase 3.4: External Services
- [x] T024 [P] TMDB API client with caching in src/lib/tmdb.ts
- [x] T025 [P] URL encoding/decoding service in src/lib/url-encoder.ts
- [ ] T060 [P] Enhanced TMDB client: Add genre filtering support to getPopularMovies function in src/lib/tmdb.ts

## Phase 3.5: API Endpoints (Sequential - shared route files)
- [x] T026 GET /api/movies/search route in src/app/api/movies/search/route.ts
- [x] T027 GET /api/movies/[id] route in src/app/api/movies/[id]/route.ts
- [x] T028 GET /api/genres route for genre filtering in src/app/api/genres/route.ts
- [ ] T062 Update GET /api/movies/popular route to support genre filtering in src/app/api/movies/popular/route.ts

## Phase 3.6: UI Components - Atoms
- [x] T029 [P] Button component with variants in src/components/atoms/Button.tsx
- [x] T030 [P] Input component with validation in src/components/atoms/Input.tsx
- [x] T031 [P] Badge component for genres in src/components/atoms/Badge.tsx
- [x] T032 [P] ThemeToggle component in src/components/atoms/ThemeToggle.tsx

## Phase 3.7: UI Components - Molecules
- [x] T033 [P] SearchBox component in src/features/movie-search/components/SearchBox.tsx
- [x] T034 [P] MovieCard component in src/features/movie-search/components/MovieCard.tsx
- [x] T035 [P] CountdownTimer component in src/features/watch-party/components/CountdownTimer.tsx
- [x] T036 [P] DateTimePicker component in src/features/watch-party/components/DateTimePicker.tsx
- [x] T037 [P] GenreFilter component in src/features/movie-search/components/GenreFilter.tsx

## Phase 3.8: UI Components - Organisms & Pages
- [x] T038 MovieGrid organism in src/features/movie-search/components/MovieGrid.tsx
- [x] T039 Home page with search and grid in src/app/page.tsx
- [x] T040 Movie details page in src/app/movies/[id]/page.tsx
- [x] T041 Watch party page in src/app/watch-party/[id]/page.tsx
- [x] T071 [P] Header component with clickable logo navigation in src/components/organisms/Header/index.tsx
- [x] T072 [P] Theme-aware countdown timer styling for light/dark mode readability in src/features/watch-party/components/CountdownTimer.tsx
- [x] T073 [P] Simplified watch party UI without status badges in src/app/watch-party/[id]/page.tsx
- [x] T074 [P] Enhanced copy link button as full-width primary button in src/app/watch-party/[id]/page.tsx
- [x] T075 [P] Enhanced page size to 60 items by fetching 3 pages initially in src/app/page.tsx
- [x] T076 [P] Updated grid layout to 5 columns on desktop in src/features/movie-search/components/MovieGrid.tsx
- [ ] T064 Enhanced GenreFilter component: Hide when search term is active, show only for popular movies in src/features/movie-search/components/GenreFilter.tsx
- [ ] T065 Enhanced Home page: Hide genre filters during search, show for popular movies only in src/app/page.tsx
- [ ] T069 [P] Dynamic page title updates: "Popular Movies", "[Genre] Movies", or "Search Results" in src/app/page.tsx

## Phase 3.9: Integration & Polish
- [x] T042 [P] Theme provider setup in src/app/providers/theme-provider.tsx
- [x] T043 [P] Global styles and CSS variables in src/app/globals.css
- [x] T044 [P] Error boundaries and loading states for external API failures in src/components/error-boundary.tsx
- [x] T045 [P] Performance optimization: Image optimization and lazy loading
- [x] T046 [P] Unit tests for utility functions in tests/unit/
- [x] T047 [P] Storybook stories for all components
- [x] T048 Execute quickstart.md user journey validation with Playwright
- [ ] T066 [P] Unit tests for enhanced genre filtering logic in tests/unit/genre-filtering.test.ts
- [ ] T067 [P] Update popular-movies-api.md contract documentation
- [ ] T070 [P] Update enhanced-genre-filtering.feature to include dynamic title test scenarios
- [ ] T068 Final validation: Genre filtering triggers new searches, maintains filters during pagination, works with both search and popular movies
- [x] T049 [P] Performance testing with Playwright: <2 second search response time
- [x] T050 [P] Cross-browser testing: Chrome, Firefox, Safari with Playwright
- [x] T051 [P] Accessibility testing with Playwright and axe-core
- [x] T052 [P] Visual regression testing with Playwright screenshots
- [x] T053 [P] Mobile responsiveness testing with Playwright viewports
- [x] T054 [P] Update README.md with Playwright setup and debugging instructions
- [x] T055 [P] Create Playwright CI/CD pipeline configuration

## Dependencies
- Setup (T001-T006) before everything
- Contract Tests (T007-T009) before API Implementation (T026-T028)
- E2E Tests + Step Definitions (T010-T017) before Page Implementation (T039-T041)
- Unit Tests (T018) before Utility Implementation (T025)
- Data models (T019-T023) before services (T024-T025)
- Services (T024-T025) before API routes (T026-T028)
- Atoms (T029-T032) before molecules (T033-T037)
- Molecules (T033-T037) before organisms/pages (T038-T041)
- Core implementation before integration/polish (T042-T055)
- T038 (MovieGrid) depends on T034 (MovieCard) and T037 (GenreFilter)
- T039-T041 (Pages) depend on completed components from previous phases
- T071 (Header) can be implemented in parallel with other organisms
- T072-T074 (UI enhancements) depend on T035 (CountdownTimer) and T041 (Watch party page)
- T075-T076 (Display enhancements) depend on T038 (MovieGrid) and T039 (Home page)
- Playwright testing tasks (T048-T053) depend on UI implementation

## Parallel Execution Examples

### Phase 3.2: All Tests + Playwright Setup
```bash
# Contract tests, Cucumber features, and Playwright step definitions can run in parallel
Task: "Contract test GET /api/movies/search in tests/contract/movie-search-api.test.ts"
Task: "Contract test GET /api/movies/[id] in tests/contract/movie-details-api.test.ts"
Task: "Contract test GET /api/genres in tests/contract/genres-api.test.ts"
Task: "Cucumber feature: Movie discovery flow in tests/integration/movie-discovery.feature"
Task: "Cucumber feature: Watch party creation in tests/integration/watch-party-flow.feature"
Task: "Cucumber feature: Countdown timer behavior in tests/integration/countdown-timer.feature"
Task: "Movie discovery steps in tests/step-definitions/movie-discovery.steps.ts"
Task: "Watch party flow steps in tests/step-definitions/watch-party-flow.steps.ts"
Task: "Countdown timer steps in tests/step-definitions/countdown-timer.steps.ts"
Task: "Playwright World setup in tests/step-definitions/support/world.ts"
Task: "Cucumber hooks with Playwright in tests/step-definitions/support/hooks.ts"
Task: "Unit test: URL encoding/decoding for watch party data in tests/unit/url-encoder.test.ts"
```

### Phase 3.3: All Data Models Together
```bash
# All data models can run in parallel (different files)
Task: "Movie interface and Zod schema in src/types/movie.ts"
Task: "Genre interface and Zod schema in src/types/genre.ts"
Task: "CastMember interface and Zod schema in src/types/cast.ts"
Task: "WatchParty interface and Zod schema in src/types/watch-party.ts"
Task: "ShareableURLData interface and Zod schema in src/types/shareable-url.ts"
```

### Phase 3.6: All Atoms Together
```bash
# All atom components can run in parallel (different files)
Task: "Button component with variants in src/components/atoms/Button.tsx"
Task: "Input component with validation in src/components/atoms/Input.tsx"
Task: "Badge component for genres in src/components/atoms/Badge.tsx"
Task: "ThemeToggle component in src/components/atoms/ThemeToggle.tsx"
```

### Phase 3.9: Playwright Testing Suite
```bash
# All Playwright testing tasks can run in parallel (different test suites)
Task: "Performance testing with Playwright: <2 second search response time"
Task: "Cross-browser testing: Chrome, Firefox, Safari with Playwright"
Task: "Accessibility testing with Playwright and axe-core"
Task: "Visual regression testing with Playwright screenshots"
Task: "Mobile responsiveness testing with Playwright viewports"
```

## Critical Rules
- **TDD**: All tests (T007-T018) MUST be written and MUST FAIL before implementation
- **Constitution**: Each component needs unit tests AND Storybook stories
- **Folder-by-feature**: Group related files in feature directories
- **Atomic Design**: Follow atoms → molecules → organisms → templates hierarchy
- **Performance**: Search must complete within 2 seconds (tested with Playwright)
- **Error Handling**: External API failures must be handled gracefully with user-friendly messages
- **Cross-browser**: Playwright tests must pass on Chrome, Firefox, and Safari
- **Accessibility**: All components must pass axe-core accessibility tests via Playwright
- **Visual Consistency**: Playwright visual regression tests prevent UI breakage

## Playwright-Specific Notes
- **Browser Setup**: T003 configures Chromium, Firefox, Safari for cross-browser testing
- **Step Definitions**: T013-T017 create reusable page interactions for Cucumber scenarios
- **World Setup**: T016 configures shared browser context across Cucumber steps
- **Hooks**: T017 handles browser lifecycle, screenshot capture on failures
- **Debugging**: Use `npx playwright codegen localhost:3000` to record new interactions
- **CI/CD**: T055 sets up headless mode for automated testing, headed for development
- **Visual Testing**: T052 captures screenshots for regression testing
- **Performance**: T049 measures actual page load and interaction times
- **Mobile Testing**: T053 tests responsive design on various device viewports

## Validation Checklist
- [ ] All 3 API contracts have corresponding test files (T007-T009)
- [ ] All 5 data entities have TypeScript interfaces and Zod schemas (T019-T023)
- [ ] All 3 API endpoints are implemented (T026-T028)
- [ ] Movie search, details, genre filtering, and watch party user flows are covered in Cucumber features
- [ ] Playwright step definitions cover all user interactions (T013-T017)
- [ ] Dark/light theme system is complete and tested across browsers
- [ ] Performance requirements are met and verified with Playwright (T049)
- [ ] All components have unit tests, Storybook stories, and Playwright E2E coverage
- [ ] Cross-browser compatibility verified on Chrome, Firefox, Safari (T050)
- [ ] Accessibility standards met and tested with axe-core + Playwright (T051)
- [ ] Visual regression suite prevents UI breakage (T052)

## Notes
- Contract tests verify API request/response formats match specifications
- Cucumber features with Playwright cover complete user journeys from quickstart.md
- Sequential API route tasks prevent file conflicts in shared directories
- [P] tasks can be executed simultaneously for faster development
- Playwright provides superior debugging tools compared to Selenium alternatives
- Browser automation enables realistic user interaction testing
- Commit after each completed task for granular progress tracking
- Use `npx playwright show-report` to view detailed test results and traces

---
*Ready for execution - 57 numbered tasks with comprehensive Playwright E2E automation*