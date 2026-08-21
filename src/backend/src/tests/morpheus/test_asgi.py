from fastapi.testclient import TestClient

from morpheus.asgi import app

client = TestClient(app)


def test_healthcheck():
    response = client.get('/healthcheck')

    assert response.status_code == 200
    assert response.text == 'OK'


def test_schema():
    response = client.get('/schema')

    assert response.status_code == 200
    assert '/healthcheck' in response.json()['paths']
