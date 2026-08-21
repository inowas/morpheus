# Request Handlers

Request handlers belong in the `presentation` layer and should expose typed
request and response models.

Use Pydantic with `BaseModel` and `Field`, following the existing User module:

```python
from pydantic import BaseModel, Field


class ExampleResponse(BaseModel):
    value: str = Field(..., examples=['example'])
```

Handlers should:

- Validate or receive typed request data.
- Read identity through the module's incoming port.
- Call application-layer handlers.
- Return typed, serializable response data.
- Avoid direct database, broker, and filesystem access.

Transport routes should stay thin. Flask and FastAPI adapters may translate
framework-specific request and response objects, but should not duplicate domain
logic.
