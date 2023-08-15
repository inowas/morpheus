import hashlib
import os

class PasswordStrength:
    def __init__(self, sufficient: True | False):
        self.sufficient = sufficient

    def is_sufficient(self) -> True | False:
        return self.sufficient

    @classmethod
    def sufficient(cls):
        return cls(True)

    @classmethod
    def not_sufficient(cls):
        return cls(False)

class Password:
    @classmethod
    def hash(cls, plain_password: str) -> str:
        salt = os.urandom(16).hex()
        salted_hash = cls._generate_hash_with_salt(plain_password, salt)

        return f"{salt}${salted_hash}"

    @classmethod
    def verfiy(cls, hashed_password: str, plain_password: str) -> True | False:
        try:
            salt, actual_hash = hashed_password.split('$', 1)
        except ValueError:
            return False

        expected_hash = cls._generate_hash_with_salt(plain_password, salt)

        return expected_hash == actual_hash

    @classmethod
    def _generate_hash_with_salt(cls, plain_password: str, salt: str):
        return hashlib.scrypt(plain_password.encode('utf-8'), salt=salt.encode('utf-8'), n=2 ** 14, r=8, p=1).hex()

    @classmethod
    def strength(cls, password: str) -> PasswordStrength:
        if len(password) > 15:
            return PasswordStrength.sufficient()

        return PasswordStrength.not_sufficient()
