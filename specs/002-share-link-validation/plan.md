
# Implementation Plan: Share Link Validation with HMAC Signature

**Branch**: `002-share-link-validation` | **Date**: October 31, 2025 | **Spec**: [link](./spec.md)
**Input**: Feature specification from `/specs/002-share-link-validation/spec.md`

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
Implement HMAC SHA256 signature validation for watch party share links to ensure authenticity and prevent tampering. Add server-side signature generation during link creation and validation during access, with silent redirect for invalid signatures. No backward compatibility required since app isn't live yet.

## Technical Context
**Language/Version**: TypeScript 5.x with Next.js 14+ App Router  
**Primary Dependencies**: Next.js, Tailwind CSS, ShadCN/UI, Zod, Node.js crypto module  
**Storage**: Vercel KV for watch party data, TMDB API for movie data  
**Testing**: Jest for unit tests, Cucumber for E2E tests, Storybook for component documentation  
**Target Platform**: Vercel serverless deployment (Node.js runtime)  
**Project Type**: Web application (Next.js frontend + serverless API backend)  
**Performance Goals**: <200ms server-side signature validation, maintain existing URL size constraints  
**Constraints**: HMAC secret must stay server-side only, silent UX for security failures  
**Scale/Scope**: Extend existing URL encoding system, add 1 new service layer, update 3 existing files

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Principle I - Test-Driven Development**: ✅ PASS  
- Will create failing signature validation tests before implementation
- Contract tests for signature API endpoints
- Unit tests for HMAC functions using Red-Green-Refactor cycle

**Principle II - Clean Architecture with Folder-by-Feature**: ✅ PASS  
- New signature service follows existing clean architecture patterns
- Extends existing watch-party feature without cross-feature dependencies
- Domain logic (signature validation) separated from infrastructure (environment variables)

**Principle III - Atomic Design for UI Components**: ✅ PASS  
- No new UI components required for this security feature
- Existing components remain in atomic design hierarchy

**Principle IV - Storybook Documentation**: ✅ PASS  
- No new UI components, so no new Storybook requirements
- Existing components unaffected

**Principle V - Contract-First Integration**: ✅ PASS  
- Will define signature validation contract before implementation
- URL parameter schema validation using existing Zod patterns
- API endpoint contracts for signature generation

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
├── app/
│   ├── api/
│   │   └── watch-party/
│   │       └── create/route.ts     # Enhanced with signature generation
│   └── watch-party/
│       └── [id]/page.tsx           # Enhanced with signature validation
├── lib/
│   ├── env.ts                      # Add SHARE_LINK_SECRET
│   ├── signature.ts                # NEW: HMAC signature service
│   └── url-encoder.ts              # Enhanced with signature support
├── types/
│   └── shareable-url.ts            # Enhanced with signature schemas
└── features/
    └── watch-party/
        ├── components/             # Existing components (unchanged)
        ├── hooks/                  # Existing hooks (unchanged)  
        └── services/               # Existing services (unchanged)

tests/
├── contract/
│   └── signature-validation.test.ts # NEW: Contract tests for signatures
├── integration/
│   └── watch-party-flow.feature     # Enhanced with signature scenarios
└── unit/
    ├── signature.test.ts            # NEW: Unit tests for HMAC functions
    └── url-encoder.test.ts          # Enhanced with signature tests
```

**Structure Decision**: Web application structure with Next.js App Router. Extends existing watch-party feature with new signature service layer following clean architecture. No new feature folders needed - signature validation is part of the existing watch-party domain.

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

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Load `.specify/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs (contracts, data model, quickstart)
- Each contract → contract test task [P] (signature-generation-api, signature-validation, signature-service)
- Each entity → model creation task [P] (SignatureData, SignedShareLink, ValidationResult)
- Each user story → integration test task (valid/invalid signature scenarios)
- Implementation tasks to make tests pass (TDD order)

**Ordering Strategy**:
- TDD order: Contract tests → Unit tests → Implementation → Integration tests
- Dependency order: Environment setup → Core service → URL encoder → API routes → Page validation
- Mark [P] for parallel execution (independent files)

**Estimated Output**: 12-15 numbered, ordered tasks in tasks.md:
1. Environment setup (secret key, configuration)
2. [P] Core signature service contract tests
3. [P] Signature service implementation 
4. [P] URL encoder enhancement tests
5. URL encoder implementation
6. [P] API route enhancement tests
7. API route implementation
8. [P] Page validation tests
9. Page validation implementation
10. Integration test scenarios
11. Manual testing validation
12. Performance verification

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
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented (none required)

---
*Based on Constitution v2.1.1 - See `/memory/constitution.md`*
