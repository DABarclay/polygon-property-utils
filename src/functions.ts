import { Position } from "./types";

type ShortestPoint = {
  distance: number;
  point: Position;
};

type BoundaryPoint = {
  skip: number;
  point: Position;
};

type PassBetweenPoints = {
  pass: boolean;
  distance: number;
  intersectionPoint: Position;
};

export function polygonArea(coordinates: Position[]): number {
  function degreesToRadians(degrees: number) {
    return (degrees * Math.PI) / 180;
  }

  function getConversionFactors(latitude: number) {
    // Conversion factor for longitude based on latitude
    const R = 111319; // Earth’s radius in meters at the equator
    const cosLat = Math.cos(degreesToRadians(latitude));
    return {
      longitudeFactor: R * cosLat,
      latitudeFactor: R, // Approximation for latitude
    };
  }

  var factor = getConversionFactors(coordinates[0][1]);

  if (
    coordinates[coordinates.length - 1][0] === coordinates[0][0] &&
    coordinates[coordinates.length - 1][1] === coordinates[0][1]
  ) {
    var total = 0;

    for (var i = 0, l = coordinates.length; i < l; i++) {
      var addX = coordinates[i][0] * factor.longitudeFactor;
      var addY =
        coordinates[i == coordinates.length - 1 ? 0 : i + 1][1] *
        factor.latitudeFactor;
      var subX =
        coordinates[i == coordinates.length - 1 ? 0 : i + 1][0] *
        factor.longitudeFactor;
      var subY = coordinates[i][1] * factor.latitudeFactor;

      total += addX * addY * 0.5;
      total -= subX * subY * 0.5;
    }

    return Number(((Math.abs(total) * 100) / 100).toFixed(2));
  }
  return 0;
}

export function polygonCentroid(coordinates: Position[]): Position | null {
  const n = coordinates.length;
  if (n < 3) return null; // Not a polygon

  const area = polygonArea(coordinates);
  if (area === 0) {
    console.log("Polygon is not closed");
    return null;
  } //Not a closed polygon

  let cx = 0,
    cy = 0,
    signedArea = 0;
  for (let i = 0; i < n - 1; i++) {
    const j = i + 1;
    const factor =
      coordinates[i][0] * coordinates[j][1] -
      coordinates[j][0] * coordinates[i][1];
    signedArea += factor;
    cx += (coordinates[i][0] + coordinates[j][0]) * factor;
    cy += (coordinates[i][1] + coordinates[j][1]) * factor;
  }
  signedArea *= 0.5;
  cx *= 1 / (6 * signedArea);
  cy *= 1 / (6 * signedArea);

  return [cx, cy];
}

export function isPointInPolygon(
  point: Position,
  coordinates: Position[]
): boolean {
  let isInside = false;
  const n = coordinates.length;
  let j = n - 1; // Last vertex is the previous one to the first

  for (let i = 0; i < n; i++) {
    const xi = coordinates[i][0],
      yi = coordinates[i][1];
    const xj = coordinates[j][0],
      yj = coordinates[j][1];

    const intersect =
      yi > point[1] != yj > point[1] &&
      point[0] < ((xj - xi) * (point[1] - yi)) / (yj - yi) + xi;

    if (intersect) {
      isInside = !isInside;
    }

    j = i; // j is previous vertex to i
  }

  return isInside;
}

export function polygonInternalLabel(coordinates: Position[]): Position | null {
  let centroid = polygonCentroid(coordinates);
  if (centroid === null) return null;

  if (isPointInPolygon(centroid, coordinates)) {
    return centroid;
  }

  let closestPoint: BoundaryPoint = closestPointOnBoundary(
    coordinates,
    centroid
  );

  var smallestDistance: PassBetweenPoints | undefined = undefined;

  for (let i = 0; coordinates.length - 1 > i; i++) {
    if (closestPoint.skip !== i) {
      const pass = doesLinePassBetweenPoints(
        centroid,
        closestPoint.point,
        coordinates[i],
        coordinates[i + 1]
      );

      if (pass.pass) {
        if (smallestDistance === undefined) {
          smallestDistance = pass;
        } else if (pass.distance < smallestDistance.distance) {
          smallestDistance = pass;
        }
      }
    }
  }

  if (smallestDistance === undefined) return closestPoint.point;

  var x = smallestDistance.intersectionPoint[0] - closestPoint.point[0];
  x = x * 0.3;

  var y = smallestDistance.intersectionPoint[1] - closestPoint.point[1];
  y = y * 0.3;

  let visualCentre: Position = [
    closestPoint.point[0] + x,
    closestPoint.point[1] + y,
  ];

  return visualCentre;
}

function closestPointOnBoundary(
  coordinates: Position[],
  centroid: Position
): BoundaryPoint {
  var shortestPoint: ShortestPoint = closestPointOnLine(
    coordinates[0],
    coordinates[1],
    centroid
  );

  let skip: number = 0;

  for (let i = 1; coordinates.length - 1 > i; i++) {
    let point = closestPointOnLine(
      coordinates[i],
      coordinates[i + 1],
      centroid
    );
    if (point.distance < shortestPoint.distance) {
      shortestPoint = point;
      skip = i;
    }
  }
  return {
    point: [shortestPoint.point[0], shortestPoint.point[1]],
    skip: skip,
  };
}

function closestPointOnLine(
  point1: Position,
  point2: Position,
  point: Position
): ShortestPoint {
  var A = point[0] - point1[0];
  var B = point[1] - point1[1];
  var C = point2[0] - point1[0];
  var D = point2[1] - point1[1];

  var dot = A * C + B * D;
  var len_sq = C * C + D * D;
  var param = -1;
  if (len_sq != 0)
    //in case of 0 length line
    param = dot / len_sq;

  var xx, yy;

  if (param < 0) {
    xx = point1[0];
    yy = point1[1];
  } else if (param > 1) {
    xx = point2[0];
    yy = point2[1];
  } else {
    xx = point1[0] + param * C;
    yy = point1[1] + param * D;
  }

  var dx = point[0] - xx;
  var dy = point[1] - yy;

  let result: ShortestPoint = {
    distance: Math.sqrt(dx * dx + dy * dy),
    point: [xx, yy],
  };

  return result;
}

function vectorFrom(p1: Position, p2: Position): Position {
  return [p2[0] - p1[0], p2[1] - p1[1]];
}

function crossProduct(v: Position, w: Position): number {
  return v[0] * w[1] - v[1] * w[0];
}

function doesLinePassBetweenPoints(
  central: Position,
  throughPoint: Position,
  boundary1: Position,
  boundary2: Position
): PassBetweenPoints {
  let direction = vectorFrom(central, throughPoint);
  let toBoundary1 = vectorFrom(central, boundary1);
  let toBoundary2 = vectorFrom(central, boundary2);

  let cross1 = crossProduct(direction, toBoundary1);
  let cross2 = crossProduct(direction, toBoundary2);

  let passesBetween = cross1 * cross2 < 0;

  if (passesBetween) {
    let intersection = findIntersection(
      central,
      direction,
      boundary1,
      boundary2
    );
    if (intersection) {
      let distance = distanceBetweenPoints(throughPoint, intersection);
      return {
        pass: true,
        distance: distance,
        intersectionPoint: intersection,
      };
    }
  }

  return { pass: false, distance: 0, intersectionPoint: [0, 0] };
}
function findIntersection(
  central: Position,
  direction: Position,
  boundary1: Position,
  boundary2: Position
): Position | null {
  let s = vectorFrom(boundary1, boundary2);
  let denominator = crossProduct(direction, s);

  // If denominator is 0, lines are parallel or coincident
  if (denominator === 0) return null;

  let boundaryVector = vectorFrom(central, boundary1);

  let t = crossProduct(boundaryVector, s) / denominator;

  // Calculate intersection point using parameter t
  return [central[0] + direction[0] * t, central[1] + direction[1] * t];
}

function distanceBetweenPoints(p1: Position, p2: Position): number {
  return Math.sqrt((p2[0] - p1[0]) ** 2 + (p2[1] - p1[1]) ** 2);
}
