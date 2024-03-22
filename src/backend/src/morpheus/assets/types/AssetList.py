import dataclasses

from morpheus.assets.types.User import UserId


@dataclasses.dataclass(frozen=True)
class AssetListFilter:
    user_id: UserId | None
