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

