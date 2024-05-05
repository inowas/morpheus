# Problem — The raw idea, a use case, or something we’ve seen that motivates us to work on this

A groundwater model consists of horizontal layers with (a rectlinear grid with a fixed numer of rows and columns which
can differ in their width and heigt) and layer specific properties.

Conductivity in two different formats:

* kx, ky, kz or
* hk, vka, hka

has to be treated somehow.

Storage Values:

* ss and sa

These values can be available in three different formats:

* one value for all cells
* raster data (uploaded as rasterfile, geotiff)
* vector data with on value per element (uploaded in geojson format)

The user should have the possibility to upload and manage this data.

# Appetite — How much time we want to spend and how that constrains the solution

We have to implement this! And it shold take not more than 1 week.

# Solution — The core elements we came up with, presented in a form that’s easy for people to immediately understand

These layer specific properties are represented in the backend by an object with the following structure (shows as
typescript!), internally the values are stored in python dataclasses.

```typescript
interface IPropertyType {
  value: number;
  raster?: IRaster;
  zones?: IZone[];
}

interface IRaster {
  data: number[][]
  reference?: {
    asset_id: string;
    asset_type: 'raster';
    band: number;
  }
}

interface IZone {
  geometry: Polygon | Multipolygon;
  affected_cells: IAffectedCells;
  name: string;
  value: number;
}
```

For the simplicity we use hk, hani and vka as conductivity properties.

# Uploading a value

The user should have the possibility to upload a value for all cells. This value will be stored in the property object.
A value has always to be set as fallback value. If the user uploads vector data or raster date with holes,
the value will be used for the cells without a value.

Write command:

```yaml

```

# Uploading a Raster

The user should have the possibility to upload the raster data as geotiff and the vector data as geojson.

To upload raster data the user has to select the file and the band.
The uploaded file will be stored as an asset and the reference to this asset will be stored in the property object.
The data-property of the raster object will be filled on the server after raster interpolation

# Uploading zones (vector data)

The user can upload vector data as geojson (Polygon or Multipolygon). The value will be stored in the property object.
On the server the affected cells will be calculated and stored in the property object.

# Rabbit holes and No-gos

* Nothing at the moment

# Get data over the api

We can return two different data formats for the uploaded data:

As image (png-file) in two different formats:

1. as raster data (asc-type) rotation = 0 and equal cell size
   URL: /api/v1/projects/{project_id}/models/{model_id}/layers/{layer_id}/properties/{property_id}/image&format=raster
   URL:
   /api/v1/projects/{project_id}/models/{model_id}/layers/{layer_id}/properties/{property_id}/image&format=raster_colorbar
2. as model grid data (rotated) with equal cell size
   URL: URL:
   /api/v1/projects/{project_id}/models/{model_id}/layers/{layer_id}/properties/{property_id}/image&format=grid
   URL: URL:
   /api/v1/projects/{project_id}/models/{model_id}/layers/{layer_id}/properties/{property_id}/image&format=grid_colorbar

As json-data in three different formats:

1. as raster data (asc-type) with rotation 0 and equal cell size
   URL: /api/v1/projects/{project_id}/models/{model_id}/layers/{layer_id}/properties/{property_id}&format=raster
2. as mo del grid data with rotation value and equal cell size
   URL: /api/v1/projects/{project_id}/models/{model_id}/layers/{layer_id}/properties/{property_id}&format=grid
3. as model grid data with rotation value the original cell size
   URL:
   /api/v1/projects/{project_id}/models/{model_id}/layers/{layer_id}/properties/{property_id}&format=grid_original

# Esri Ascii Grid format

The Esri Ascii Grid format is a simple, text-based grid format that can be used to store gridded data. The format
consists of a two-line header followed by a matrix of numeric values. The header contains the following information:

* ncols: the number of columns in the grid
* nrows: the number of rows in the grid
* xllcorner: the x-coordinate of the lower-left corner of the grid
* yllcorner: the y-coordinate of the lower-left corner of the grid
* cellsize: the size of each cell in the grid
* nodata_value: the value that represents missing data in the grid
* The matrix of numeric values represents the gridded data, with each row of the matrix corresponding to a row in the
  grid.
* The Esri Ascii Grid format is commonly used in GIS applications to store elevation data, land cover data, and other
  types of gridded data.

Example:

```
ncols         4
nrows         6
xllcorner     0.0
yllcorner     0.0
cellsize      1.0
NODATA_value  -9999
-9999  2 4 5
-9999  1 2 3
-9999  2 4 5
-9999  1 2 3
-9999  2 4 5
-9999  1 2 3
```
