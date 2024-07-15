# Polygon Utilities

This JavaScript module provides a set of utility functions for calculating properties of polygons using geographical coordinates. These properties include the area and centroid of a polygon, checking if a point is inside a polygon and determining an internal label point for polygons.

## Installation

No installation is required. Simply import the functions into your JavaScript or TypeScript project.

## Functions

### `polygonArea(coordinates: Position[]): number`

Calculates the area of a polygon provided as an array of `Position` coordinates. The function requires that the polygon is closed, i.e., the last coordinate is the same as the first.

#### Parameters:

- `coordinates`: Array of `[longitude, latitude]` pairs.

#### Returns:

- The area of the polygon in square meters (m^2).

### `polygonCentroid(coordinates: Position[]): Position | null`

Calculates the centroid (geometric center) of a polygon defined by an array of `Position` coordinates.

#### Parameters:

- `coordinates`: Array of `[longitude, latitude]` pairs.

#### Returns:

- A `Position` array `[longitude, latitude]` representing the centroid, or `null` if the polygon is not closed.

### `isPointInPolygon(point: Position, coordinates: Position[]): boolean`

Determines whether a given point is inside a polygon.

#### Parameters:

- `point`: A `Position` `[longitude, latitude]`.
- `coordinates`: Array of `[longitude, latitude]` pairs defining the polygon.

#### Returns:

- `true` if the point is inside the polygon, `false` otherwise.

### `polygonInternalLabel(coordinates: Position[]): Position | null`

Calculates an ideal point for labeling purposes inside a polygon. (Locates closest boundary from the centroid and draws a line through the polygon to find the next intersection and returns a location 1/3 distance from the first intersection towards the second intersection.)

#### Parameters:

- `coordinates`: Array of `[longitude, latitude]` pairs defining the polygon.

#### Returns:

- A `Position` `[longitude, latitude]` that is suitable for placing a label inside the polygon, or `null` if no suitable point can be found.

## Types

### `Position`

A tuple representing a geographical coordinate, where the first element is the longitude and the second is the latitude.

```typescript
type Position = [number, number];
```
