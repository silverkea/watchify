# Tasks: Movie Watch Party Platform MVP

**Input**: Design documents from `/specs/001-minimal-viable-product/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)
```
1. Load plan.md from feature directory ✓
   → Tech stack: Next.js 14+, TypeScript, Tailwind CSS, ShadCN/UI
   → Structure: Web app with folder-by-feature organization
2. Load design documents ✓:
   → data-model.md: Movie, Genre, CastMember, WatchParty, ShareableURLData
   → contracts/: 3 API endpoints (movie-search, movie-details, genres)
   → research.md: TMDB API, Vercel deployment, Jest/Cucumber testing
3. Generate tasks by category ✓:
   → Setup: Next.js project, dependencies, environment config
   → Tests: 3 contract tests, 3 integration scenarios, 1 unit test
   → Core: 5 data models, 3 API endpoints, UI components
   → Integration: TMDB service, URL encoding, theme system
   → Polish: unit tests, performance, documentation
4. Apply task rules ✓:
   → Different files = [P] for parallel execution
   → Tests before implementation (TDD principle)
5. Number tasks sequentially T001-T044
6. Dependencies verified: Tests → Models → Services → UI → Polish
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Next.js App Router**: `src/app/`, `src/components/`, `src/lib/`
- **Folder-by-feature**: `src/features/movie-search/`, `src/features/watch-party/`
- **Atomic Design**: `src/components/atoms/`, `molecules/`, `organisms/`

## Phase 3.1: Setup
- [ ] T001 Create Next.js project structure with TypeScript and folder-by-feature organization: src/app/, src/components/atoms|molecules|organisms/, src/features/movie-search|watch-party/, src/lib/, src/types/, tests/contract|integration|unit/
- [ ] T002 Install and configure dependencies: Tailwind CSS, ShadCN/UI, Zod, date-fns
- [ ] T003 [P] Configure ESLint, Prettier, and Jest testing environment
- [ ] T004 [P] Setup environment variables and .env.local template with TMDB API configuration
- [ ] T005 [P] Configure Tailwind CSS with dark/light theme support and neon color palette

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [ ] T006 [P] Contract test GET /api/movies/search in tests/contract/movie-search-api.test.ts
- [ ] T007 [P] Contract test GET /api/movies/[id] in tests/contract/movie-details-api.test.ts
- [ ] T008 [P] Contract test GET /api/genres in tests/contract/genres-api.test.ts
- [ ] T009 [P] Integration test: Movie search and grid display in tests/integration/movie-discovery.feature
- [ ] T010 [P] Integration test: Movie details and watch party creation in tests/integration/watch-party-flow.feature
- [ ] T011 [P] Integration test: Watch party countdown and sharing in tests/integration/countdown-timer.feature
- [ ] T012 [P] Unit test: URL encoding/decoding for watch party data in tests/unit/url-encoder.test.ts

## Phase 3.3: Data Models (ONLY after tests are failing)
- [ ] T013 [P] Movie interface and Zod schema in src/types/movie.ts
- [ ] T014 [P] Genre interface and Zod schema in src/types/genre.ts
- [ ] T015 [P] CastMember interface and Zod schema in src/types/cast.ts
- [ ] T016 [P] WatchParty interface and Zod schema in src/types/watch-party.ts
- [ ] T017 [P] ShareableURLData interface and Zod schema in src/types/shareable-url.ts

## Phase 3.4: External Services
- [ ] T018 [P] TMDB API client with caching in src/lib/tmdb.ts
- [ ] T019 [P] URL encoding/decoding service in src/lib/url-encoder.ts

## Phase 3.5: API Endpoints (Sequential - shared route files)
- [ ] T020 GET /api/movies/search route in src/app/api/movies/search/route.ts
- [ ] T021 GET /api/movies/[id] route in src/app/api/movies/[id]/route.ts
- [ ] T022 GET /api/genres route for genre filtering in src/app/api/genres/route.ts

## Phase 3.6: UI Components - Atoms
- [ ] T023 [P] Button component with variants in src/components/atoms/Button.tsx
- [ ] T024 [P] Input component with validation in src/components/atoms/Input.tsx
- [ ] T025 [P] Badge component for genres in src/components/atoms/Badge.tsx
- [ ] T026 [P] ThemeToggle component in src/components/atoms/ThemeToggle.tsx

## Phase 3.7: UI Components - Molecules
- [ ] T027 [P] SearchBox component in src/features/movie-search/components/SearchBox.tsx
- [ ] T028 [P] MovieCard component in src/features/movie-search/components/MovieCard.tsx
- [ ] T029 [P] CountdownTimer component in src/features/watch-party/components/CountdownTimer.tsx
- [ ] T030 [P] DateTimePicker component in src/features/watch-party/components/DateTimePicker.tsx
- [ ] T031 [P] GenreFilter component in src/features/movie-search/components/GenreFilter.tsx

## Phase 3.8: UI Components - Organisms & Pages
- [ ] T032 MovieGrid organism in src/features/movie-search/components/MovieGrid.tsx
- [ ] T033 Home page with search and grid in src/app/page.tsx
- [ ] T034 Movie details page in src/app/movies/[id]/page.tsx
- [ ] T035 Watch party page in src/app/watch-party/[id]/page.tsx

## Phase 3.9: Integration & Polish
- [ ] T036 [P] Theme provider setup in src/app/providers/theme-provider.tsx
- [ ] T037 [P] Global styles and CSS variables in src/app/globals.css
- [ ] T038 [P] Error boundaries and loading states for external API failures in src/components/error-boundary.tsx
- [ ] T039 [P] Performance optimization: Image optimization and lazy loading
- [ ] T040 [P] Unit tests for utility functions in tests/unit/
- [ ] T041 [P] Storybook stories for all components
- [ ] T042 Execute quickstart.md user journey validation
- [ ] T043 [P] Performance testing: <2 second search response time
- [ ] T044 [P] Update README.md with setup and deployment instructions

## Dependencies
- Setup (T001-T005) before everything
- Tests (T006-T012) before implementation (T013+)
- Data models (T013-T017) before services (T018-T019)
- Services (T018-T019) before API routes (T020-T022)
- Atoms (T023-T026) before molecules (T027-T031)
- Molecules (T027-T031) before organisms/pages (T032-T035)
- Core implementation before integration/polish (T036-T044)
- T032 (MovieGrid) depends on T028 (MovieCard) and T031 (GenreFilter)
- T033-T035 (Pages) depend on completed components from previous phases

## Parallel Execution Examples

### Phase 3.2: Launch all contract tests together
```bash
# All contract tests can run in parallel (different files)
Task: "Contract test GET /api/movies/search in tests/contract/movie-search-api.test.ts"
Task: "Contract test GET /api/movies/[id] in tests/contract/movie-details-api.test.ts"
Task: "Contract test GET /api/genres in tests/contract/genres-api.test.ts"
Task: "Unit test: URL encoding/decoding for watch party data in tests/unit/url-encoder.test.ts"
```

### Phase 3.3: Launch all data models together
```bash
# All data models can run in parallel (different files)
Task: "Movie interface and Zod schema in src/types/movie.ts"
Task: "Genre interface and Zod schema in src/types/genre.ts"
Task: "CastMember interface and Zod schema in src/types/cast.ts"
Task: "WatchParty interface and Zod schema in src/types/watch-party.ts"
Task: "ShareableURLData interface and Zod schema in src/types/shareable-url.ts"
```

### Phase 3.6: Launch all atoms together
```bash
# All atom components can run in parallel (different files)
Task: "Button component with variants in src/components/atoms/Button.tsx"
Task: "Input component with validation in src/components/atoms/Input.tsx"
Task: "Badge component for genres in src/components/atoms/Badge.tsx"
Task: "ThemeToggle component in src/components/atoms/ThemeToggle.tsx"
```

## Critical Rules
- **TDD**: All tests (T006-T012) MUST be written and MUST FAIL before implementation
- **Constitution**: Each component needs unit tests AND Storybook stories
- **Folder-by-feature**: Group related files in feature directories
- **Atomic Design**: Follow atoms → molecules → organisms → templates hierarchy
- **Performance**: Search must complete within 2 seconds (requirement from quickstart.md)
- **Error Handling**: External API failures must be handled gracefully with user-friendly messages

## Validation Checklist
- [ ] All 5 API contracts have corresponding test files
- [ ] All 5 data entities have TypeScript interfaces and Zod schemas
- [ ] All 5 API endpoints are implemented
- [ ] Movie search, details, genre filtering, and watch party user flows are covered
- [ ] Dark/light theme system is complete
- [ ] Performance requirements are met
- [ ] All components have unit tests and Storybook stories

## Notes
- Contract tests verify API request/response formats match specifications
- Integration tests cover complete user journeys from quickstart.md
- Sequential API route tasks prevent file conflicts in shared directories
- [P] tasks can be executed simultaneously for faster development
- Commit after each completed task for granular progress tracking