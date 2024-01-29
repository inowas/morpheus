import unittest

from morpheus.modflow.types.boundaries.Boundary import BoundaryType, BoundaryId, BoundaryName


class BoundaryTest(unittest.TestCase):
    def test_boundary_id(self) -> None:
        boundary_id = BoundaryId.new()
        boundary_id_str = boundary_id.to_str()

        assert boundary_id_str == boundary_id.to_str()
        assert boundary_id_str == boundary_id.to_value()
        assert boundary_id == BoundaryId.from_str(boundary_id_str)
        assert boundary_id == BoundaryId.from_value(boundary_id_str)
        assert boundary_id != BoundaryId.new()

    def test_boundary_type(self) -> None:
        boundary_type = BoundaryType.constant_head()
        assert boundary_type.to_str() == 'constant_head'
        assert boundary_type.to_value() == 'constant_head'
        assert boundary_type == BoundaryType.from_str('constant_head')
        assert boundary_type == BoundaryType.from_value('constant_head')
        assert boundary_type == BoundaryType.constant_head()
        assert boundary_type != BoundaryType.drain()

        boundary_type = BoundaryType.drain()
        assert boundary_type.to_str() == 'drain'
        assert boundary_type.to_value() == 'drain'
        assert boundary_type == BoundaryType.from_str('drain')
        assert boundary_type == BoundaryType.from_value('drain')
        assert boundary_type == BoundaryType.drain()
        assert boundary_type != BoundaryType.constant_head()

        boundary_type = BoundaryType.general_head()
        assert boundary_type.to_str() == 'general_head'
        assert boundary_type.to_value() == 'general_head'
        assert boundary_type == BoundaryType.from_str('general_head')
        assert boundary_type == BoundaryType.from_value('general_head')
        assert boundary_type == BoundaryType.general_head()
        assert boundary_type != BoundaryType.constant_head()

        boundary_type = BoundaryType.recharge()
        assert boundary_type.to_str() == 'recharge'
        assert boundary_type.to_value() == 'recharge'
        assert boundary_type == BoundaryType.from_str('recharge')
        assert boundary_type == BoundaryType.from_value('recharge')
        assert boundary_type == BoundaryType.recharge()
        assert boundary_type != BoundaryType.constant_head()

        boundary_type = BoundaryType.river()
        assert boundary_type.to_str() == 'river'
        assert boundary_type.to_value() == 'river'
        assert boundary_type == BoundaryType.from_str('river')
        assert boundary_type == BoundaryType.from_value('river')
        assert boundary_type == BoundaryType.river()
        assert boundary_type != BoundaryType.constant_head()

        boundary_type = BoundaryType.well()
        assert boundary_type.to_str() == 'well'
        assert boundary_type.to_value() == 'well'
        assert boundary_type == BoundaryType.from_str('well')
        assert boundary_type == BoundaryType.from_value('well')
        assert boundary_type == BoundaryType.well()
        assert boundary_type != BoundaryType.constant_head()

    def test_boundary_name(self):
        boundary_name = BoundaryName('name')
        assert boundary_name.to_str() == 'name'
        assert boundary_name.to_value() == 'name'
        assert boundary_name == BoundaryName.from_str('name')
        assert boundary_name == BoundaryName.from_value('name')
        assert boundary_name == BoundaryName('name')
        assert boundary_name != BoundaryName('other name')
