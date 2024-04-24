from .Layer import LayerProperties, LayerPropertyValues, LayerPropertyRaster, LayerPropertyDefaultValue


def test_vertical_anisotropy() -> None:
    layer_data = LayerProperties(
        kx=LayerPropertyValues.from_value(value=1.0),
        ky=LayerPropertyValues.from_value(value=2.0),
        kz=LayerPropertyValues.from_value(value=3.0),
        hani=None,
        vani=None,
        specific_storage=LayerPropertyValues.from_value(value=4.0),
        specific_yield=LayerPropertyValues.from_value(value=5.0),
        initial_head=LayerPropertyValues.from_value(value=6.0),
        top=LayerPropertyValues.from_value(value=7.0),
        bottom=LayerPropertyValues.from_value(value=8.0),
    )

    assert layer_data.get_vertical_anisotropy() == LayerPropertyValues.from_value(value=3.0).get_data()

    layer_data = LayerProperties(
        kx=LayerPropertyValues.from_value(value=1.0),
        ky=LayerPropertyValues.from_value(value=2.0),
        kz=LayerPropertyValues(
            value=LayerPropertyDefaultValue(value=3.0),
            raster=LayerPropertyRaster.from_data(data=[[1.0, 2.0, 3.0], [4.0, 5.0, 6.0]])
        ),
        hani=None,
        vani=None,
        specific_storage=LayerPropertyValues.from_value(value=4.0),
        specific_yield=LayerPropertyValues.from_value(value=5.0),
        initial_head=LayerPropertyValues.from_value(value=6.0),
        top=LayerPropertyValues.from_value(value=7.0),
        bottom=LayerPropertyValues.from_value(value=8.0),
    )

    assert layer_data.get_vertical_anisotropy() == [[1.0, 2.0, 3.0], [4.0, 5.0, 6.0]]

    layer_data = LayerProperties(
        kx=LayerPropertyValues(
            value=LayerPropertyDefaultValue(value=1.0),
            raster=LayerPropertyRaster.from_data(data=[[1.5, 3.0, 4.5], [6.0, 7.5, 9.0]])
        ),
        ky=LayerPropertyValues.from_value(value=2.0),
        kz=LayerPropertyValues(
            value=LayerPropertyDefaultValue(value=1.0),
            raster=LayerPropertyRaster.from_data(data=[[1.5, 3.0, 4.5], [6.0, 7.5, 9.0]])
        ),
        hani=None,
        vani=None,
        specific_storage=LayerPropertyValues.from_value(value=4.0),
        specific_yield=LayerPropertyValues.from_value(value=5.0),
        initial_head=LayerPropertyValues.from_value(value=6.0),
        top=LayerPropertyValues.from_value(value=7.0),
        bottom=LayerPropertyValues.from_value(value=8.0),
    )

    assert layer_data.get_vertical_anisotropy() == [[1.0, 1.0, 1.0], [1.0, 1.0, 1.0]]


def test_get_transmissivity() -> None:
    layer_data = LayerProperties(
        kx=LayerPropertyValues.from_value(value=1.0),
        ky=LayerPropertyValues.from_value(value=2.0),
        kz=LayerPropertyValues.from_value(value=3.0),
        hani=None,
        vani=None,
        specific_storage=LayerPropertyValues.from_value(value=4.0),
        specific_yield=LayerPropertyValues.from_value(value=5.0),
        initial_head=LayerPropertyValues.from_value(value=6.0),
        top=LayerPropertyValues.from_value(value=10.0),
        bottom=LayerPropertyValues.from_value(value=5.0),
    )

    assert layer_data.get_transmissivity(top=LayerPropertyValues.from_value(value=10)) == 5

    layer_data = LayerProperties(
        kx=LayerPropertyValues(
            value=LayerPropertyDefaultValue(value=1.0),
            raster=LayerPropertyRaster.from_data(data=[[1.0, 2.0, 1.0], [1.0, 2.0, 1.0]])
        ),
        ky=LayerPropertyValues.from_value(value=2.0),
        kz=LayerPropertyValues.from_value(value=3.0),
        hani=None,
        vani=None,
        specific_storage=LayerPropertyValues.from_value(value=4.0),
        specific_yield=LayerPropertyValues.from_value(value=5.0),
        initial_head=LayerPropertyValues.from_value(value=6.0),
        top=LayerPropertyValues.from_value(value=10.0),
        bottom=LayerPropertyValues.from_value(value=5.0),
    )

    assert layer_data.get_transmissivity(top=LayerPropertyValues.from_value(value=10)) == [[5.0, 10.0, 5.0], [5.0, 10.0, 5.0]]

    layer_data = LayerProperties(
        kx=LayerPropertyValues(
            value=LayerPropertyDefaultValue(value=1.0),
            raster=LayerPropertyRaster.from_data(data=[[1.0, 2.0, 1.0], [1.0, 2.0, 1.0]])
        ),
        ky=LayerPropertyValues.from_value(value=2.0),
        kz=LayerPropertyValues.from_value(value=3.0),
        hani=None,
        vani=None,
        specific_storage=LayerPropertyValues.from_value(value=4.0),
        specific_yield=LayerPropertyValues.from_value(value=5.0),
        initial_head=LayerPropertyValues.from_value(value=6.0),
        top=LayerPropertyValues(
            value=LayerPropertyDefaultValue(value=0),
            raster=LayerPropertyRaster.from_data(data=[[10.0, 10.0, 10.0], [10.0, 10.0, 10.0]])
        ),
        bottom=LayerPropertyValues.from_value(value=5)
    )

    assert layer_data.get_transmissivity(
        top=LayerPropertyValues(
            value=LayerPropertyDefaultValue(value=0),
            raster=LayerPropertyRaster.from_data([[10.0, 10.0, 10.0], [10.0, 10.0, 10.0]])
        )) == [[5.0, 10.0, 5.0], [5.0, 10.0, 5.0]]

    layer_data = LayerProperties(
        kx=LayerPropertyValues(
            value=LayerPropertyDefaultValue(value=1.0),
            raster=LayerPropertyRaster.from_data(data=[[1.0, 2.0, 1.0], [1.0, 2.0, 1.0]])
        ),
        ky=LayerPropertyValues.from_value(value=2.0),
        kz=LayerPropertyValues.from_value(value=3.0),
        hani=None,
        vani=None,
        specific_storage=LayerPropertyValues.from_value(value=4.0),
        specific_yield=LayerPropertyValues.from_value(value=5.0),
        initial_head=LayerPropertyValues.from_value(value=6.0),
        top=LayerPropertyValues(
            value=LayerPropertyDefaultValue(value=0),
            raster=LayerPropertyRaster.from_data(data=[[10.0, 10.0, 10.0], [10.0, 10.0, 10.0]])
        ),
        bottom=LayerPropertyValues(
            value=LayerPropertyDefaultValue(value=5),
            raster=LayerPropertyRaster.from_data(data=[[5.0, 5.0, 5.0], [5.0, 5.0, 5.0]])
        )
    )

    assert layer_data.get_transmissivity(LayerPropertyValues(
        value=LayerPropertyDefaultValue(value=0),
        raster=LayerPropertyRaster.from_data([[10.0, 10.0, 10.0], [10.0, 10.0, 10.0]]))
    ) == [[5.0, 10.0, 5.0], [5.0, 10.0, 5.0]]
