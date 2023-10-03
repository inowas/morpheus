from morpheus.authentication.infrastructure.password import password_strength, verify_password, hash_password


def test_password_hashing():
    password = 'test_123'
    hashed_password = hash_password(password)

    assert verify_password(hashed_password, password) is True
    assert verify_password(hashed_password, 'inowas') is False
    assert verify_password(hashed_password, 'Test_123') is False


def test_password_strength_check():
    assert password_strength('123').is_sufficient() is False
    assert password_strength('123456789012345').is_sufficient() is False
    assert password_strength('1234567890123456').is_sufficient() is True
