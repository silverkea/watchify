<!--
Sync Impact Report:
- Version change: [none] → 1.0.0 (initial constitution)
- List of modified principles: Initial creation of all principles
- Added sections: All core principles, architecture constraints, development workflow
- Removed sections: None
- Templates requiring updates:
  ✅ plan-template.md: Constitution Check section updated with specific principle gates
  ✅ spec-template.md: Requirements alignment maintained (no changes needed)
  ✅ tasks-template.md: TDD workflow aligns with Principle I (no changes needed)
- Follow-up TODOs: Set actual ratification date when project formally adopts constitution
-->

# Watchify Constitution

## Core Principles

### I. Test-Driven Development (NON-NEGOTIABLE)
TDD MUST be followed for all code: Write failing test → Implement minimal code to pass → Refactor with passing tests → Continue. Red-Green-Refactor cycle is strictly enforced. No production code may be written without a corresponding failing test first.

Rationale: Ensures code quality, prevents regressions, and drives better design through testability requirements.

### II. Clean Architecture with Folder-by-Feature
Code organization MUST follow clean architecture principles with folder-by-feature structure. Each feature contains its own domain logic, use cases, and adapters. Dependencies flow inward toward the domain core. Features are self-contained with clear boundaries.

Rationale: Promotes maintainability, testability, and allows teams to work independently on different features.

### III. Atomic Design for UI Components
All UI components MUST follow atomic design methodology: Atoms (basic elements) → Molecules (simple groups) → Organisms (complex groups) → Templates (page structure) → Pages (specific instances). Each level builds upon the previous.

Rationale: Creates a scalable, consistent design system that promotes reusability and maintainability.

### IV. Storybook Documentation (NON-NEGOTIABLE)
Every UI component MUST be documented in Storybook with all relevant states, props, and usage examples. Components cannot be considered complete without Storybook stories.

Rationale: Ensures component discoverability, promotes reuse, enables visual testing, and serves as living documentation.

### V. Contract-First Integration
All feature integrations MUST define explicit contracts before implementation. API endpoints, component interfaces, and data models require documented contracts with validation.

Rationale: Enables parallel development, reduces integration issues, and ensures clear communication between teams.

## Architecture Constraints

All code MUST be organized using folder-by-feature structure where each feature directory contains:
- Domain entities and business logic
- Use cases and application services  
- Interface adapters (controllers, presenters, gateways)
- Infrastructure implementations
- Feature-specific tests

UI components MUST be organized in atomic design hierarchy:
- `atoms/` - Basic building blocks (buttons, inputs, labels)
- `molecules/` - Simple component groups (search box, card header)
- `organisms/` - Complex component sections (navigation, product list)
- `templates/` - Page layouts without specific content
- `pages/` - Specific page instances with real content

## Development Workflow

### Testing Requirements
- Unit tests MUST cover all business logic and use cases
- Integration tests MUST verify feature contracts and boundaries
- Component tests MUST validate UI behavior and accessibility
- E2E tests MUST cover critical user journeys

### Code Review Gates
- All tests MUST pass before review
- Storybook stories MUST be present for UI components
- Architecture decisions MUST align with clean architecture principles
- Feature boundaries MUST be respected (no cross-feature dependencies)

### Quality Standards
- Code coverage MUST be maintained above 90% for business logic
- All UI components MUST have corresponding Storybook stories
- Breaking changes MUST be documented and versioned appropriately
- Performance regressions MUST be prevented through automated testing

## Governance

This constitution supersedes all other development practices. Amendments require:
1. Documentation of the proposed change and rationale
2. Impact assessment on existing code and processes
3. Team consensus through formal review process
4. Migration plan for existing code if applicable

All pull requests and code reviews MUST verify compliance with these principles. Violations require justification or refactoring. When in doubt, favor simplicity and adherence to these core principles.

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE): Set when project formally adopts | **Last Amended**: 2025-09-30