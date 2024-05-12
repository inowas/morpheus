import io

import matplotlib
import matplotlib.pyplot as plt
import numpy as np

matplotlib.use('agg')


class ImageCreationService:
    @staticmethod
    def create_image_from_data(data: list[list[float]], no_data_value: float | None = -9999.0, v_min=None, v_max=None, cmap='jet_r', image_format='png') -> io.BytesIO:
        bytes_image = io.BytesIO()

        img_data = np.array(data, dtype=np.float32)
        img_data = np.where(img_data == no_data_value, np.nan, img_data)

        if v_min is None:
            v_min = np.nanmin(img_data) - np.nanstd(img_data)

        if v_max is None:
            v_max = np.nanmax(img_data) + np.nanstd(img_data)

        if v_min == np.nan:
            v_min = np.nanmin(img_data)

        if v_max == np.nan:
            v_max = np.nanmax(img_data)

        if v_min == v_max:
            v_min -= 1
            v_max += 1

        plt.imsave(bytes_image, img_data, format=image_format, cmap=cmap, vmin=v_min, vmax=v_max)
        bytes_image.seek(0)
        return bytes_image

    @staticmethod
    def create_colorbar_from_data(data: list[list[float]] | float, v_min=None, v_max=None, cmap='jet_r', no_data_value: float | None = -9999.0) -> io.BytesIO:
        bytes_image = io.BytesIO()

        if isinstance(data, (int, float)):
            img_data = np.array([[data]], dtype=np.float32)
        else:
            img_data = np.array(data, dtype=np.float32)
            img_data = np.where(img_data == no_data_value, np.nan, img_data)

        if v_min is None:
            v_min = np.nanmin(img_data) - np.nanstd(img_data)

        if v_max is None:
            v_max = np.nanmax(img_data) + np.nanstd(img_data)

        if v_min == np.nan:
            v_min = np.nanmin(data)

        if v_max == np.nan:
            v_max = np.nanmax(data)

        if v_min == v_max:
            v_min -= 1
            v_max += 1

        fig, (ax) = plt.subplots(nrows=1, ncols=1)
        fig.patch.set_facecolor('None')
        fig.patch.set_alpha(0.0)
        im = ax.imshow(img_data, cmap=cmap, vmin=v_min, vmax=v_max)
        plt.colorbar(im, ax=ax)
        ax.remove()

        plt.savefig(bytes_image, format='png', bbox_inches='tight')
        bytes_image.seek(0)
        return bytes_image
