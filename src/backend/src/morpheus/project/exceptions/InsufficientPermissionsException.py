class InsufficientPermissionsException(Exception):
    def __init__(self, message='Insufficient permissions'):
        self.message = message
        super().__init__(self.message)
