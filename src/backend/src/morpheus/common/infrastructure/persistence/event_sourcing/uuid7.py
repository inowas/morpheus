import os
import time


def uuid7() -> str:
    # random bytes
    value = bytearray(os.urandom(16))

    # current timestamp in ms
    timestamp = int(time.time_ns() / 1000000)

    # timestamp
    value[0] = (timestamp >> 40) & 0xFF
    value[1] = (timestamp >> 32) & 0xFF
    value[2] = (timestamp >> 24) & 0xFF
    value[3] = (timestamp >> 16) & 0xFF
    value[4] = (timestamp >> 8) & 0xFF
    value[5] = timestamp & 0xFF

    # version and variant
    value[6] = (value[6] & 0x0F) | 0x70
    value[8] = (value[8] & 0x3F) | 0x80

    # Join the formatted hex values, split into appropriate sections
    hex_string = ''.join(f'{byte:02x}' for byte in value)
    return f'{hex_string[:8]}-{hex_string[8:12]}-{hex_string[12:16]}-{hex_string[16:20]}-{hex_string[20:]}'
