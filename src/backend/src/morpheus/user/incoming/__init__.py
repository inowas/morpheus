import morpheus.authentication.outgoing as authentication_outgoing
from morpheus.common.types.identity.Identity import Identity

authenticate = authentication_outgoing.authenticate


def get_identity() -> Identity | None:
    return Identity.try_from_dict(authentication_outgoing.get_identity())
