from flask import Request


def extract_bearer_token_from(request: Request) -> str | None:
    authorization_header = request.headers.get('Authorization')
    if authorization_header is None:
        return None

    if not authorization_header.startswith('Bearer '):
        return None

    return authorization_header.removeprefix('Bearer ')
