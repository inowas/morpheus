from .Layer import LayerProperties, LayerPropertyValue, LayerPropertyRaster


def test_vertical_anisotropy() -> None:
    layer_data = LayerProperties(
        kx=LayerPropertyValue(value=1.0),
        ky=LayerPropertyValue(value=2.0),
        kz=LayerPropertyValue(value=3.0),
        specific_storage=LayerPropertyValue(value=4.0),
        specific_yield=LayerPropertyValue(value=5.0),
        initial_head=LayerPropertyValue(value=6.0),
        top=LayerPropertyValue(value=7.0),
        bottom=LayerPropertyValue(value=8.0),
    )

    assert layer_data.get_vertical_anisotropy() == LayerPropertyValue(value=3.0).get_data()

    layer_data = LayerProperties(
        kx=LayerPropertyValue(value=1.0),
        ky=LayerPropertyValue(value=2.0),
        kz=LayerPropertyValue(value=3.0, raster=LayerPropertyRaster(data=[[1.0, 2.0, 3.0], [4.0, 5.0, 6.0]])),
        specific_storage=LayerPropertyValue(value=4.0),
        specific_yield=LayerPropertyValue(value=5.0),
        initial_head=LayerPropertyValue(value=6.0),
        top=LayerPropertyValue(value=7.0),
        bottom=LayerPropertyValue(value=8.0),
    )

    assert layer_data.get_vertical_anisotropy() == [[1.0, 2.0, 3.0], [4.0, 5.0, 6.0]]

    layer_data = LayerProperties(
        kx=LayerPropertyValue(value=1.0, raster=LayerPropertyRaster(data=[[1.5, 3.0, 4.5], [6.0, 7.5, 9.0]])),
        ky=LayerPropertyValue(value=2.0),
        kz=LayerPropertyValue(value=1.0, raster=LayerPropertyRaster(data=[[1.5, 3.0, 4.5], [6.0, 7.5, 9.0]])),
        specific_storage=LayerPropertyValue(value=4.0),
        specific_yield=LayerPropertyValue(value=5.0),
        initial_head=LayerPropertyValue(value=6.0),
        top=LayerPropertyValue(value=7.0),
        bottom=LayerPropertyValue(value=8.0),
    )

    assert layer_data.get_vertical_anisotropy() == [[1.0, 1.0, 1.0], [1.0, 1.0, 1.0]]


def test_get_transmissivity() -> None:
    layer_data = LayerProperties(
        kx=LayerPropertyValue(value=1.0),
        ky=LayerPropertyValue(value=2.0),
        kz=LayerPropertyValue(value=3.0),
        specific_storage=LayerPropertyValue(value=4.0),
        specific_yield=LayerPropertyValue(value=5.0),
        initial_head=LayerPropertyValue(value=6.0),
        top=LayerPropertyValue(value=10.0),
        bottom=LayerPropertyValue(value=5.0),
    )

    assert layer_data.get_transmissivity(top=LayerPropertyValue(value=10)) == 5

    layer_data = LayerProperties(
        kx=LayerPropertyValue(value=1.0, raster=LayerPropertyRaster(data=[[1.0, 2.0, 1.0], [1.0, 2.0, 1.0]], )),
        ky=LayerPropertyValue(value=2.0),
        kz=LayerPropertyValue(value=3.0),
        specific_storage=LayerPropertyValue(value=4.0),
        specific_yield=LayerPropertyValue(value=5.0),
        initial_head=LayerPropertyValue(value=6.0),
        top=LayerPropertyValue(value=10.0),
        bottom=LayerPropertyValue(value=5.0),
    )

    assert layer_data.get_transmissivity(top=LayerPropertyValue(value=10)) == [[5.0, 10.0, 5.0], [5.0, 10.0, 5.0]]

    layer_data = LayerProperties(
        kx=LayerPropertyValue(value=1.0, raster=LayerPropertyRaster(data=[[1.0, 2.0, 1.0], [1.0, 2.0, 1.0]])),
        ky=LayerPropertyValue(value=2.0),
        kz=LayerPropertyValue(value=3.0),
        specific_storage=LayerPropertyValue(value=4.0),
        specific_yield=LayerPropertyValue(value=5.0),
        initial_head=LayerPropertyValue(value=6.0),
        top=LayerPropertyValue(value=0, raster=LayerPropertyRaster(data=[[10.0, 10.0, 10.0], [10.0, 10.0, 10.0]])),
        bottom=LayerPropertyValue(value=5)
    )

    assert layer_data.get_transmissivity(top=LayerPropertyValue(value=0, raster=LayerPropertyRaster([[10.0, 10.0, 10.0], [10.0, 10.0, 10.0]]))) == \
           [[5.0, 10.0, 5.0], [5.0, 10.0, 5.0]]

    layer_data = LayerProperties(
        kx=LayerPropertyValue(value=1.0, raster=LayerPropertyRaster(data=[[1.0, 2.0, 1.0], [1.0, 2.0, 1.0]])),
        ky=LayerPropertyValue(value=2.0),
        kz=LayerPropertyValue(value=3.0),
        specific_storage=LayerPropertyValue(value=4.0),
        specific_yield=LayerPropertyValue(value=5.0),
        initial_head=LayerPropertyValue(value=6.0),
        top=LayerPropertyValue(value=0, raster=LayerPropertyRaster(data=[[10.0, 10.0, 10.0], [10.0, 10.0, 10.0]])),
        bottom=LayerPropertyValue(value=5, raster=LayerPropertyRaster(data=[[5.0, 5.0, 5.0], [5.0, 5.0, 5.0]]))
    )

    assert layer_data.get_transmissivity(LayerPropertyValue(value=0, raster=LayerPropertyRaster([[10.0, 10.0, 10.0], [10.0, 10.0, 10.0]]))) == \
           [[5.0, 10.0, 5.0], [5.0, 10.0, 5.0]]
