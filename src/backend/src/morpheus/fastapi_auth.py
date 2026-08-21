from collections.abc import AsyncGenerator
from typing import Annotated

from fastapi import Depends, HTTPException, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from morpheus.authentication.outgoing import authenticate_token, identity_context
from morpheus.common.types.identity.Identity import Identity

bearer_scheme = HTTPBearer(scheme_name='bearerAuth', bearerFormat='JWT', auto_error=False)


async def require_identity(credentials: Annotated[HTTPAuthorizationCredentials | None, Security(bearer_scheme)]) -> AsyncGenerator[Identity, None]:
    context_token = identity_context.set(None)
    try:
        token = credentials.credentials if credentials is not None else None
        if token is None or not authenticate_token(token):
            raise HTTPException(status_code=401, detail='Unauthorized')

        identity = Identity.try_from_dict(identity_context.get())
        if identity is None:
            raise HTTPException(status_code=401, detail='Unauthorized')

        yield identity
    finally:
        identity_context.reset(context_token)


IdentityDependency = Annotated[Identity, Depends(require_identity)]
