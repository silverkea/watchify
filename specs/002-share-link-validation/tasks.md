# Tasks: Share Link Validation with HMAC Signature

**Input**: Design documents from `/specs/002-share-link-validation/`
**Prerequisites**: plan.md, research.md, data-model.md, contracts/, quickstart.md

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → Tech stack: TypeScript 5.x, Next.js 14+, Node.js crypto module
   → Structure: Web application (Next.js frontend + serverless API backend)
2. Load design documents:
   → data-model.md: SignatureData, SignatureResult, SignedShareLink entities
   → contracts/: signature-generation-api, signature-validation, signature-service
   → research.md: HMAC decisions, security requirements
3. Generate tasks by category:
   → Setup: environment configuration, dependencies
   → Tests: 3 contract tests, integration scenarios
   → Core: signature service, URL encoder enhancement, API/page updates
   → Integration: environment validation, error handling
   → Polish: performance validation, security testing
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (url-encoder.ts not parallel)
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001-T015)
6. CRITICAL: All tests MUST fail before implementation
7. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Phase 3.1: Setup
- [ ] T001 Environment setup: Generate SHARE_LINK_SECRET and add to .env.local
- [ ] T002 Update environment configuration in src/lib/env.ts with secret validation

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [ ] T003 [P] Contract test for signature service in tests/contract/signature-service.test.ts
- [ ] T004 [P] Contract test for signature generation API in tests/contract/signature-generation-api.test.ts  
- [ ] T005 [P] Contract test for signature validation in tests/contract/signature-validation.test.ts
- [ ] T006 [P] Integration test for valid signature flow in tests/integration/watch-party-flow.feature
- [ ] T007 [P] Integration test for invalid signature scenarios in tests/integration/watch-party-flow.feature
- [ ] T008 [P] Unit tests for HMAC functions in tests/unit/signature.test.ts

## Phase 3.3: Core Implementation (ONLY after tests are failing)
- [ ] T009 [P] Create SignatureData, SignatureResult, SignedShareLink types in src/types/shareable-url.ts
- [ ] T010 [P] Implement HMAC signature service in src/lib/signature.ts
- [ ] T011 Enhance URL encoder with signature generation in src/lib/url-encoder.ts
- [ ] T012 Enhance URL encoder with signature validation in src/lib/url-encoder.ts
- [ ] T013 Update watch party creation API with signature generation in src/app/api/watch-party/create/route.ts
- [ ] T014 Update watch party page with signature validation in src/app/watch-party/[id]/page.tsx

## Phase 3.4: Integration & Polish
- [ ] T015 [P] Performance and security validation testing per quickstart.md verification checklist

## Dependencies
- T001-T002 (Setup) before all tests
- T003-T008 (Tests) before T009-T014 (Implementation)
- T009 (Types) before T010 (Service)
- T010 (Service) before T011-T012 (URL encoder)
- T011-T012 (URL encoder) before T013-T014 (API/Page)
- T013-T014 (Implementation) before T015 (Validation)

## Parallel Execution Examples

### Phase 3.2: Contract Tests (Run Together)
```bash
# All contract and unit tests can run in parallel
Task: "Contract test for signature service in tests/contract/signature-service.test.ts"
Task: "Contract test for signature generation API in tests/contract/signature-generation-api.test.ts"
Task: "Contract test for signature validation in tests/contract/signature-validation.test.ts"
Task: "Integration test for valid signature flow in tests/integration/watch-party-flow.feature"
Task: "Integration test for invalid signature scenarios in tests/integration/watch-party-flow.feature"
Task: "Unit tests for HMAC functions in tests/unit/signature.test.ts"
```

### Phase 3.3: Core Implementation (Sequential for shared files)
```bash
# Types and service can run in parallel
Task: "Create SignatureData, SignatureResult, SignedShareLink types in src/types/shareable-url.ts"
Task: "Implement HMAC signature service in src/lib/signature.ts"

# URL encoder tasks must be sequential (same file)
Task: "Enhance URL encoder with signature generation in src/lib/url-encoder.ts"
# THEN
Task: "Enhance URL encoder with signature validation in src/lib/url-encoder.ts"

# API and page updates can run in parallel (different files)
Task: "Update watch party creation API with signature generation in src/app/api/watch-party/create/route.ts"
Task: "Update watch party page with signature validation in src/app/watch-party/[id]/page.tsx"
```

## Detailed Task Specifications

### T001: Environment Setup
**File**: `.env.local`  
**Action**: Generate secure 32+ character secret key and add SHARE_LINK_SECRET environment variable
**Verification**: Key is at least 32 characters, properly formatted for environment variable

### T002: Environment Configuration
**File**: `src/lib/env.ts`  
**Action**: Add SHARE_LINK_SECRET validation with error for missing/short keys
**Verification**: Application throws error on startup if secret missing or <32 chars

### T003: Signature Service Contract Test
**File**: `tests/contract/signature-service.test.ts`  
**Action**: Create failing tests for generateSignature, validateSignature, and config functions
**Verification**: Tests fail with "not implemented" errors

### T004: Signature Generation API Contract Test  
**File**: `tests/contract/signature-generation-api.test.ts`
**Action**: Create failing tests for enhanced POST /api/watch-party/create with signature
**Verification**: Tests fail due to missing signature in response

### T005: Signature Validation Contract Test
**File**: `tests/contract/signature-validation.test.ts`
**Action**: Create failing tests for page route signature validation behavior
**Verification**: Tests fail due to missing signature validation logic

### T006: Valid Signature Integration Test
**File**: `tests/integration/watch-party-flow.feature`
**Action**: Add Cucumber scenarios for valid signature end-to-end flow
**Verification**: Scenarios fail due to missing signature implementation

### T007: Invalid Signature Integration Test
**File**: `tests/integration/watch-party-flow.feature`
**Action**: Add Cucumber scenarios for invalid/missing signature redirect behavior
**Verification**: Scenarios fail due to missing validation logic

### T008: HMAC Unit Tests
**File**: `tests/unit/signature.test.ts`
**Action**: Create failing unit tests for HMAC generation, validation, and edge cases
**Verification**: Tests fail with module not found errors

### T009: Signature Type Definitions
**File**: `src/types/shareable-url.ts`
**Action**: Add SignatureData, SignatureResult, SignedShareLink interfaces and Zod schemas
**Verification**: Types compile and export correctly

### T010: HMAC Signature Service
**File**: `src/lib/signature.ts`
**Action**: Implement generateSignature, validateSignature, and configuration functions
**Verification**: Contract tests T003 and unit tests T008 pass

### T011: URL Encoder Signature Generation
**File**: `src/lib/url-encoder.ts`
**Action**: Enhance generateWatchPartyURL to include signature parameter
**Verification**: Generated URLs include valid signature parameter

### T012: URL Encoder Signature Validation
**File**: `src/lib/url-encoder.ts`
**Action**: Enhance parseWatchPartyURL to validate signatures before decoding
**Verification**: Invalid signatures throw errors, valid signatures decode successfully

### T013: API Route Enhancement
**File**: `src/app/api/watch-party/create/route.ts`
**Action**: Update POST endpoint to generate signed URLs using enhanced encoder
**Verification**: API contract test T004 passes, response includes signed URL

### T014: Page Route Enhancement
**File**: `src/app/watch-party/[id]/page.tsx`
**Action**: Add server-side signature validation with silent redirect on failure
**Verification**: Validation contract test T005 passes, invalid signatures redirect

### T015: Performance & Security Validation
**Files**: Multiple test files
**Action**: Run quickstart.md verification checklist, performance tests, security validation
**Verification**: All checklist items pass, <200ms validation time, no security issues

## Notes
- All tests MUST fail before starting implementation (TDD requirement)
- URL encoder tasks (T011-T012) cannot run in parallel (same file)
- API and page updates (T013-T014) can run in parallel (different files)
- Commit after each completed task
- Secret key must never be committed to version control

## Validation Checklist
*GATE: Checked before marking complete*

- [x] All 3 contracts have corresponding test tasks (T003-T005)
- [x] All 3 entities have type definition tasks (T009)
- [x] All tests come before implementation (T003-T008 before T009-T014)
- [x] Parallel tasks target different files
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task
- [x] TDD workflow enforced (failing tests first)