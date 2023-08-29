import hashlib
import os


class PasswordStrength:
    def __init__(self, sufficient: bool):
        self._sufficient = sufficient

    def is_sufficient(self) -> bool:
        return self._sufficient

    @classmethod
    def sufficient(cls):
        return cls(True)

    @classmethod
    def not_sufficient(cls):
        return cls(False)


def hash_password(plain_password: str) -> str:
    salt = os.urandom(16).hex()
    salted_hash = _generate_hash_with_salt(plain_password, salt)

    return f"{salt}${salted_hash}"


def verify_password(hashed_password: str, plain_password: str) -> bool:
    try:
        salt, actual_hash = hashed_password.split('$', 1)
    except ValueError:
        return False

    expected_hash = _generate_hash_with_salt(plain_password, salt)

    return expected_hash == actual_hash


def _generate_hash_with_salt(plain_password: str, salt: str):
    return hashlib.scrypt(plain_password.encode('utf-8'), salt=salt.encode('utf-8'), n=2 ** 14, r=8, p=1).hex()


def password_strength(password: str) -> PasswordStrength:
    if len(password) > 15:
        return PasswordStrength.sufficient()

    return PasswordStrength.not_sufficient()
