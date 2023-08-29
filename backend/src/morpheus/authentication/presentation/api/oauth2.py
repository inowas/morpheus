from flask import request
from morpheus.authentication.infrastructure.oauth2.server import oauth2_server


class IssueOAuth2TokenRequestHandler:
    def handle(self):
        # if we have a json body write its content to form values (as oauth2_server does not understand json)
        if request.is_json:
            setattr(request, "form", request.json)
        return oauth2_server.create_token_response()


class RevokeOAuth2TokenRequestHandler:
    def handle(self):
        # if we have a json body write its content to form values (as oauth2_server does not understand json)
        if request.is_json:
            setattr(request, "form", request.json)
        return oauth2_server.create_endpoint_response('revocation')
