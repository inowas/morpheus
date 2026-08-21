from collections.abc import Mapping


def extract_bearer_token_from_header(authorization_header: str | None) -> str | None:
    if authorization_header is None:
        return None

    if not authorization_header.startswith('Bearer '):
        return None

    return authorization_header.removeprefix('Bearer ')


def extract_bearer_token_from(request) -> str | None:
    headers = request.headers if hasattr(request, 'headers') else request
    authorization_header = headers.get('Authorization') if isinstance(headers, Mapping) else None
    return extract_bearer_token_from_header(authorization_header)
