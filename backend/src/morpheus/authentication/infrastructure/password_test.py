from morpheus.authentication.infrastructure.password import Password


def test_password_hashing():
    password = 'test_123'
    hashed_password = Password.hash(password)

    assert Password.verfiy(hashed_password, password) is True
    assert Password.verfiy(hashed_password, 'inowas') is False
    assert Password.verfiy(hashed_password, 'Test_123') is False


def test_password_strength_check():
    assert Password.strength('123').is_sufficient() is False
    assert Password.strength('123456789012345').is_sufficient() is False
