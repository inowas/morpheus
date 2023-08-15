from abc import ABC, abstractmethod


class CommandResult:
    def __init__(self, success: True | False, result_code: int = 0):
        self.success = success
        self.code = result_code

    def get_code(self) -> int:
        return self.code

    def is_success(self) -> True | False:
        return self.success

    @classmethod
    def success(cls):
        return cls(True)

    @classmethod
    def failure(cls, code: int):
        return cls(False, code)


class CliCommand(ABC):
    @abstractmethod
    def execute(self) -> CommandResult:
        pass
