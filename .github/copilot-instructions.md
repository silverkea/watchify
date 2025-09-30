# GitHub Copilot Instructions for Watchify

## Project Overview
Watchify follows strict architectural principles defined in `.specify/memory/constitution.md`. All code suggestions must comply with these constitutional requirements.

## Constitution Compliance
**CRITICAL**: Before suggesting any code, ensure it aligns with our constitutional principles:
- **Principle I**: Test-Driven Development (NON-NEGOTIABLE)
- **Principle II**: Clean Architecture with Folder-by-Feature
- **Principle III**: Atomic Design for UI Components  
- **Principle IV**: Storybook Documentation (NON-NEGOTIABLE)
- **Principle V**: Contract-First Integration

Refer to the full constitution at `.specify/memory/constitution.md` for complete details.

## Copilot-Specific Guidance

### Custom Development Workflow
This project uses structured development through custom prompts in `.github/prompts/`:
- **`constitution.prompt.md`** - For updating project governance and principles
- **`specify.prompt.md`** - For creating feature specifications from natural language
- **`plan.prompt.md`** - For generating implementation plans from specifications
- **`tasks.prompt.md`** - For breaking plans into executable tasks
- **`implement.prompt.md`** - For guided implementation of tasks
- **`analyze.prompt.md`** - For code analysis and review
- **`clarify.prompt.md`** - For resolving ambiguities in requirements

When suggesting development approaches, reference these structured workflows rather than ad-hoc development patterns.



---
*Based on Constitution v1.0.1 - For full architectural details, see `.specify/memory/constitution.md`*