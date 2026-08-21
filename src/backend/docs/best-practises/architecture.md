# Architecture

The backend is organized by domain and follows a layered structure.

- `application/`: use cases, queries, and commands.
- `domain/`: domain objects and business rules.
- `infrastructure/`: persistence, external services, and filesystem access.
- `presentation/`: request handlers and transport-facing models.
- `incoming/`: inbound ports exposed to other modules or transport adapters.
- `outgoing/`: outbound ports used by application and presentation code.
- `types/`: shared domain types and value objects.
- `routes/`: Flask route registration only.

Keep business logic out of route functions. Routes translate transport input,
call a request handler, and translate the result into a response.

Application and domain code must not import Flask, FastAPI, Starlette, Werkzeug,
or another transport framework.

Request handlers may depend on application ports. Infrastructure details such as
MongoDB, RabbitMQ, and filesystem paths stay behind application or infrastructure
boundaries.
