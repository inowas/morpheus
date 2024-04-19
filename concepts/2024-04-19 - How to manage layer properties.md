# Problem — The raw idea, a use case, or something we’ve seen that motivates us to work on this

A groundwater model consists of horizontal layers with (a rectlinear grid with a fixed numer of rows and columns which can differ in their width and heigt) and layer specific properties. 

Flow values in three dimensions: 

* kx, ky, kz or 
* hk, vka, hka

Storage Values:

* ss and sa

These values can be available in three different formats:

* one value for all cells
* raster data (uploaded as reasterfile, geotiff)
* vector data with on value per element (uploaded in geojson format)

The user should have the possibility to upload and manage this data.


# Appetite — How much time we want to spend and how that constrains the solution

We have to implement this! And it shold take not more than 1 week.

# Solution — The core elements we came up with, presented in a form that’s easy for people to immediately understand

These layer specific properties can be represented by an object with the following structure:

```typescript
interface IPropertyType {
	raster?: IRaster;
	value: number;
	zones?: IZone[];
}

interface IRaster {
	data?: number[][]
	asset? {
		asset_id: string;
		asset_type: 'raster';
		band: number;
	}
}

interface IZone {
	type: "Feature",
	geometry: Polygon | Multipolygon,
	properties: {
		name: string
		value: number;
  }
}
```

To store the asset information could be optional. 


# Rabbit holes and No-gos


