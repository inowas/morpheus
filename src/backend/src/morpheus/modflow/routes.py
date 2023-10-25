from flask import Blueprint, request
from flask_cors import CORS, cross_origin

from morpheus.modflow.infrastructure.persistence.ModflowModelRepository import ModflowModelRepository


def register_routes(blueprint: Blueprint):
    CORS(blueprint, supports_credentials=True)

    @blueprint.route('', methods=['GET'])
    @blueprint.route('/', methods=['GET'])
    @cross_origin()
    def read_root():
        return 'OK', 200

    @blueprint.route('/ping', methods=['GET'])
    @cross_origin()
    def ping():
        return 'OK', 200

    @blueprint.route('/collections', methods=['GET'])
    @cross_origin()
    def get_collections():
        repository = ModflowModelRepository()
        repository.create_collection('test')
        return repository.list_collection_names(), 200
