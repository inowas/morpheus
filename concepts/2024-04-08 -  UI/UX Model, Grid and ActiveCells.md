# Problem — The raw idea, a use case, or something we’ve seen that motivates us to work on this

The user should be able to see the grid and have the possibility to manipulate active cells in the UI/UX.
Clicking on a cell should toggle its active state.
Drawing a rectangle should toggle the active state of all cells within the rectangle.
The selection and deselection of cells should be working without backend calls.

# Appetite — How much time we want to spend and how that constrains the solution

We want to spend 2 days on this.

# Solution — The core elements we came up with, presented in a form that’s easy for people to immediately understand

## How to render the grid

Best would be to render all rows and all columns as geojon features (Polygons).
For this we have render only m+n features, where m is the number of rows and n is the number of columns.

With this we can determine the cell that that is clicked by iterating over the rows and columns and checking if the
point clicked is within the bounds of the geometry of the row or column.

Also, it is possible to calculate the geometry of the cell underlying the clicked point by calculating the intersection
of the row and column geometry.

To retrieve the information from the server, we can implement the following API-Call:

```
'/api/v1/project/{projectId}/model/spatial-discretization/grid?format=geojson'
```

The response will be a GeoJSON FeatureCollection with the following structure:

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              0,
              0
            ],
            [
              1,
              0
            ],
            [
              1,
              1
            ],
            [
              0,
              1
            ],
            [
              0,
              0
            ]
          ]
        ]
      },
      "properties": {
        "row": 0
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              0,
              0
            ],
            [
              1,
              0
            ],
            [
              1,
              1
            ],
            [
              0,
              1
            ],
            [
              0,
              0
            ]
          ]
        ]
      },
      "properties": {
        "col": 0
      }
    }
  ]
}
```

## How to render the active cells

We need to render the active cells as a separate layer on top of the grid

Instead of rendering the active cells cell by cell, we can render the active cells as a single geometry that is the
union of all active cells. This way we only need to render one geometry instead of n*m geometries.

To retrieve the information from the server, we can implement the following API-Call:

```
'/api/v1/project/{projectId}/model/spatial-discretization/active-cells?format=geojson'
```

The response will be a GeoJSON FeatureCollection with the following structure:

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "MultiPolygon",
        "coordinates": [
          [
            [
              [
                0,
                0
              ],
              [
                1,
                0
              ],
              [
                1,
                1
              ],
              [
                0,
                1
              ],
              [
                0,
                0
              ]
            ]
          ]
        ]
      }
    }
  ]
}
```

## How to toggle the active state of a cell

To toggle the active state of a cell, we need to determine in the frontend which cell was clicked.
We determine the cell by iterating over the rows and columns and checking if the clicked point is within.

Now we have the row and column of the clicked cell and can check if the cell is active or not.
We then calculate the geometry of the cell by intersecting the row and column geometry.

Next to the active-cell geometry we hold a list of changes to the current active cells object.
This list contains the cells that are differing from the active cells object.

When the user clicks on a cell, we need to determine if the cell is currently set as active or not.
If the cell is active we check if the cell is yet in the list of changes. If it is not in the list of changes we add it
to the list of changes. If it's in the list of changes we remove it from the list of changes.

When a rectangle is drawn, we need to determine all cells that are within the rectangle and toggle them.

# Rabbit holes — Details about the solution worth calling out to avoid problems

- Avoid using geoman here if possible. It is a very powerful library but it is also very complex and can lead to
  performance issues.

# No-gos — Anything specifically excluded from the concept: functionality or use cases we intentionally aren’t covering to fit the appetite or make the problem tractable

- We are not going to implement create geometries in frontend from the GridObject and ActiveCells.
- We will let the backend handle the creation of the geojson geometries from the GridObject and ActiveCells.
