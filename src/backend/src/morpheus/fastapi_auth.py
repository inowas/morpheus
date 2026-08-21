from collections.abc import AsyncGenerator
from typing import Annotated

from fastapi import Depends, Header, HTTPException

from morpheus.authentication.infrastructure.bearer_token import extract_bearer_token_from_header
from morpheus.authentication.outgoing import authenticate_token, identity_context
from morpheus.common.types.identity.Identity import Identity


async def require_identity(authorization: Annotated[str | None, Header()] = None) -> AsyncGenerator[Identity, None]:
    context_token = identity_context.set(None)
    try:
        token = extract_bearer_token_from_header(authorization)
        if token is None or not authenticate_token(token):
            raise HTTPException(status_code=401, detail='Unauthorized')

        identity = Identity.try_from_dict(identity_context.get())
        if identity is None:
            raise HTTPException(status_code=401, detail='Unauthorized')

        yield identity
    finally:
        identity_context.reset(context_token)


IdentityDependency = Annotated[Identity, Depends(require_identity)]
