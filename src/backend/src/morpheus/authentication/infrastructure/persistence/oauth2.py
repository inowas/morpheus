import time
from morpheus.authentication.infrastructure.oauth2.models import OAuth2Client
from morpheus.authentication.types.oauth2 import PublicClient
from morpheus.common.infrastructure.persistence.postgresql import BaseRepository


class ClientRepository(BaseRepository):
    def insert_public_client(self, public_client: PublicClient):
        oauth2_client = OAuth2Client()
        oauth2_client.client_id = public_client.id
        oauth2_client.client_id_issued_at = time.time()
        oauth2_client.client_secret = None
        oauth2_client.client_secret_expires_at = 0
        oauth2_client.user_id = None
        oauth2_client.set_client_metadata({
            "client_name": public_client.name,
            "grant_types": "password",
            "token_endpoint_auth_method": "none"
        })

        with self.session() as session:
            session.add(oauth2_client)
            session.commit()
