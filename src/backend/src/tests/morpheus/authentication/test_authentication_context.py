from flask import Flask

from morpheus.authentication.outgoing import authenticate, get_identity


def test_identity_context_does_not_leak_between_requests():
    app = Flask(__name__)

    @authenticate(requires_logged_in_user=False)
    def handler():
        return get_identity()

    with app.test_request_context('/'):
        assert handler() is None
        assert get_identity() is None
