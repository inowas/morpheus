from .Layer import LayerData


def test_vertical_anisotropy() -> None:
    layer_data = LayerData(
        kx=1,
        ky=2,
        kz=3,
        specific_storage=4,
        specific_yield=5,
        initial_head=6,
        top=7,
        bottom=8,
    )

    assert layer_data.get_vertical_anisotropy() == 3

    layer_data = LayerData(
        kx=1.5,
        ky=2,
        kz=[[1.5, 3.0, 4.5], [6.0, 7.5, 9.0]],
        specific_storage=4,
        specific_yield=5,
        initial_head=6,
        top=7,
        bottom=8,
    )

    assert layer_data.get_vertical_anisotropy() == [[1.0, 2.0, 3.0], [4.0, 5.0, 6.0]]

    layer_data = LayerData(
        kx=[[1.5, 3.0, 4.5], [6.0, 7.5, 9.0]],
        ky=2,
        kz=[[1.5, 3.0, 4.5], [6.0, 7.5, 9.0]],
        specific_storage=4,
        specific_yield=5,
        initial_head=6,
        top=7,
        bottom=8,
    )

    assert layer_data.get_vertical_anisotropy() == [[1.0, 1.0, 1.0], [1.0, 1.0, 1.0]]


def test_get_transmissivity() -> None:
    layer_data = LayerData(
        kx=1.0,
        ky=2.0,
        kz=3.0,
        specific_storage=4,
        specific_yield=5,
        initial_head=6,
        top=10,
        bottom=5,
    )

    assert layer_data.get_transmissivity(10.0) == 5

    layer_data = LayerData(
        kx=[[1.0, 2.0, 1.0], [1.0, 2.0, 1.0]],
        ky=2.0,
        kz=3.0,
        specific_storage=4,
        specific_yield=5,
        initial_head=6,
        top=10,
        bottom=5,
    )

    assert layer_data.get_transmissivity(10.0) == [[5.0, 10.0, 5.0], [5.0, 10.0, 5.0]]

    layer_data = LayerData(
        kx=[[1.0, 2.0, 1.0], [1.0, 2.0, 1.0]],
        ky=2.0,
        kz=3.0,
        specific_storage=4,
        specific_yield=5,
        initial_head=6,
        top=[[10.0, 10.0, 10.0], [10.0, 10.0, 10.0]],
        bottom=5,
    )

    assert layer_data.get_transmissivity([[10.0, 10.0, 10.0], [10.0, 10.0, 10.0]]) == [[5.0, 10.0, 5.0], [5.0, 10.0, 5.0]]

    layer_data = LayerData(
        kx=[[1.0, 2.0, 1.0], [1.0, 2.0, 1.0]],
        ky=2.0,
        kz=3.0,
        specific_storage=4,
        specific_yield=5,
        initial_head=6,
        top=[[10.0, 10.0, 10.0], [10.0, 10.0, 10.0]],
        bottom=[[5.0, 5.0, 5.0], [5.0, 5.0, 5.0]],
    )

    assert layer_data.get_transmissivity([[10.0, 10.0, 10.0], [10.0, 10.0, 10.0]]) == [[5.0, 10.0, 5.0], [5.0, 10.0, 5.0]]
