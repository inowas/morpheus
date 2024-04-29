import io
import matplotlib
import matplotlib.pyplot as plt
import numpy as np
from morpheus.project.types.discretization.spatial.Raster import Raster

matplotlib.use('agg')


class ImageCreationService:
    @staticmethod
    def create_image_from_raster(raster: Raster, v_min=None, v_max=None, cmap='jet_r', image_format='png') -> io.BytesIO:
        bytes_image = io.BytesIO()
        data = np.array(raster.get_data(), dtype=np.float32)
        data = np.where(data == raster.get_nodata_value(), np.nan, data)

        if v_min is None:
            v_min = np.nanmin(data) - np.nanstd(data)

        if v_max is None:
            v_max = np.nanmax(data) + np.nanstd(data)

        if v_min == v_max:
            v_min -= 1
            v_max += 1

        plt.imsave(bytes_image, data, format=image_format, cmap=cmap, vmin=v_min, vmax=v_max)
        bytes_image.seek(0)
        return bytes_image

    @staticmethod
    def create_colorbar_from_data(data: list[list[float]] | float, v_min=None, v_max=None, cmap='jet_r') -> io.BytesIO:
        bytes_image = io.BytesIO()

        if isinstance(data, (int, float)):
            arr_data = np.array([[data]], dtype=np.float32)
        else:
            arr_data = np.array(data, dtype=np.float32)
            arr_data = np.where(arr_data == np.nan, np.nan, arr_data)

        if v_min is None:
            v_min = np.nanmin(arr_data) - np.nanstd(arr_data)

        if v_max is None:
            v_max = np.nanmax(arr_data) + np.nanstd(arr_data)

        if v_min == v_max:
            v_min -= 1
            v_max += 1

        fig, (ax) = plt.subplots(nrows=1, ncols=1)
        fig.patch.set_facecolor('None')
        fig.patch.set_alpha(0.0)
        im = ax.imshow(arr_data, cmap=cmap, vmin=v_min, vmax=v_max)
        plt.colorbar(im, ax=ax)
        ax.remove()

        plt.savefig(bytes_image, format='png', bbox_inches='tight')
        bytes_image.seek(0)
        return bytes_image
