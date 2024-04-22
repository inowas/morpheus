# Raster interpolations

## Problem

Given a raster image, we want to interpolate it to our rectilinear rotated grid.
Also we need for visualization to generate an image raster to visualize the data in a cartesian grid.

Here is a visualization of the problem:

```
                                                           ┌───────────────────────────┐
┌───────────────────────────┐                              │▫▫▫▫▫▫▫▫▫▫▫▫▫Λ▫▫▫▫▫▫▫▫▫▫▫▫▫│
│▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫│                              │▫▫▫▫▫▫▫▫▫▫▫▫╱◊╲▫▫▫▫▫▫▫▫▫▫▫▫│
│▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫│                              │▫▫▫▫▫▫▫▫▫▫▫╱◊◊◊╲▫▫▫▫▫▫▫▫▫▫▫│
│▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫│                              │▫▫▫▫▫▫▫▫▫▫╱◊◊◊◊◊╲▫▫▫▫▫▫▫▫▫▫│
│▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫│                              │▫▫▫▫▫▫▫▫▫╱◊◊◊◊◊◊◊╲▫▫▫▫▫▫▫▫▫│           ╔═════════════╗             ┌──────────────────────┐
│▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫│                              │▫▫▫▫▫▫▫▫╱◊◊◊◊◊◊◊◊◊╲▫▫▫▫▫▫▫▫│           ║██ModelGrid██║             │□□□□□□□□□□□□□□□□□□□□□□│
│▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫│                              │▫▫▫▫▫▫▫╱◊◊◊◊◊◊◊◊◊◊◊╲▫▫▫▫▫▫▫│           ║█████to █████║             │□□□□□□□□□□□□□□□□□□□□□□│
│▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫│                              │▫▫▫▫▫▫╱◊◊◊◊◊◊◊◊◊◊◊◊◊╲▫▫▫▫▫▫│     ━━━━━━╣█Image with██╠━━━━━━▶      │□□□□□□□□□□□□□□□□□□□□□□│
│▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫│                              │▫▫▫▫▫╱◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊╲▫▫▫▫▫│           ║██Rotation ██║             │□□□□□□□□□□□□□□□□□□□□□□│
│▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫│                              │▫▫▫▫╱◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊╲▫▫▫▫│           ║████angle████║             │□□□□□□□□□□□□□□□□□□□□□□│
│▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫│                              │▫▫▫╱◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊╲▫▫▫│           ╚═════════════╝             └──────────────────────┘
│▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫│         ╔═══════════╗        │▫▫╱◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊╲▫▫│
│▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫│         ║██Raster ██║        │▫╱◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊╲▫│
│▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫│     ━━━━╣████to ████╠━━━▶    │▕◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊▏│                                       ┌─────────────┐
│▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫│         ║█ModelGrid█║        │▫╲◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊╱▫│                                       │      ◊      │
│▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫│         ╚═══════════╝        │▫▫╲◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊╱▫▫│                                       │     ◊◊◊     │
│▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫│                              │▫▫▫╲◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊╱▫▫▫│                                       │    ◊◊◊◊◊    │
│▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫│                              │▫▫▫▫╲◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊╱▫▫▫▫│           ╔═════════════╗             │   ◊◊◊◊◊◊◊   │
│▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫│                              │▫▫▫▫▫╲◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊╱▫▫▫▫▫│           ║██ModelGrid██║             │  ◊◊◊◊◊◊◊◊◊  │
│▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫│                              │▫▫▫▫▫▫╲◊◊◊◊◊◊◊◊◊◊◊◊◊╱▫▫▫▫▫▫│           ║█████to █████║             │ ◊◊◊◊◊◊◊◊◊◊◊ │
│▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫│                              │▫▫▫▫▫▫▫╲◊◊◊◊◊◊◊◊◊◊◊╱▫▫▫▫▫▫▫│     ━━━━━━╣█Image with██╠━━━━━━▶      │◊◊◊◊◊◊◊◊◊◊◊◊◊│
│▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫│                              │▫▫▫▫▫▫▫▫╲◊◊◊◊◊◊◊◊◊╱▫▫▫▫▫▫▫▫│           ║█Transparent ║             │ ◊◊◊◊◊◊◊◊◊◊◊ │
│▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫│                              │▫▫▫▫▫▫▫▫▫╲◊◊◊◊◊◊◊╱▫▫▫▫▫▫▫▫▫│           ║████Cells████║             │  ◊◊◊◊◊◊◊◊◊  │
│▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫│                              │▫▫▫▫▫▫▫▫▫▫╲◊◊◊◊◊╱▫▫▫▫▫▫▫▫▫▫│           ╚═════════════╝             │   ◊◊◊◊◊◊◊   │
│▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫│                              │▫▫▫▫▫▫▫▫▫▫▫╲◊◊◊╱▫▫▫▫▫▫▫▫▫▫▫│                                       │    ◊◊◊◊◊    │
│▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫│                              │▫▫▫▫▫▫▫▫▫▫▫▫╲◊╱▫▫▫▫▫▫▫▫▫▫▫▫│                                       │     ◊◊◊     │
│▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫│                              │▫▫▫▫▫▫▫▫▫▫▫▫▫V▫▫▫▫▫▫▫▫▫▫▫▫▫│                                       │      ◊      │
└───────────────────────────┘                              └───────────────────────────┘                                       └─────────────┘

          TiffFile:                                                 Model-Grid:
        * no rotation                                             * with rotation
   * different resolution                                       * rectilinear grid
      * cartesian grid

```

To import raster data to our model, we need to interpolate the raster data to our model grid.
To export data for visualization, we need to interpolate the model data to a cartesian grid.
In this case, we can have two possibilities:

* export the raster data to a cartesian grid with a rotation angle
* export the model data to the bounding box ouf the model grid without rotation

Let's define the names of the three different algorithms:

* `RasterToModelGrid` - Interpolates the raster data to the model grid
* `ModelGridToRaster` - Interpolates the model data to the raster grid with an additional rotation angle
* `ModelGridToCartesian` - Interpolates the model data to a cartesian grid

## Appetite

We want to spend one day to implement the three algorithms.

## Solution

We can use the `scipy.interpolate` module to interpolate the data.

The `RasterToModelGrid` algorithm can be implemented using the `RectBivariateSpline` class.
The `ModelGridToRaster` algorithm can be implemented using the `RectBivariateSpline` class with an additional rotation angle.
The `ModelGridToCartesian` algorithm can be implemented using the `RectBivariateSpline` class.

## Output

The output of the three algorithms is a new raster image with the interpolated data.


