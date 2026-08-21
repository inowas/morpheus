# Backend Agent Guide

Entry point for agents working on the Morpheus backend.

Read the documents in this order:

1. [Development Workflow](development-workflow.md)
2. [Verification](verification.md)
3. [Architecture](architecture.md)
4. [Request Handlers](request-handlers.md)
5. [API Contract](api-contract.md)
6. [Flask/FastAPI Migration](flask-fastapi-migration.md)
7. [Dependencies](dependencies.md)
8. [Security and Git](security-and-git.md)

## Working Rules

- Keep changes small and limited to the current task.
- Reproduce one failure before fixing it.
- Run the smallest relevant check after each change.
- Do not mix dependency updates, API changes, and framework migration work.
- Do not modify `.nexus/AGENTS.md`; Nexus generates it.
