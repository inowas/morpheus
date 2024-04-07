from typing import Any


class CommandHandlerBase:
    @staticmethod
    def handle(command: Any):
        raise NotImplementedError
