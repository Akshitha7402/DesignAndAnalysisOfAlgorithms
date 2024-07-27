/*
Akshitha Bajjuri 2020B2A71973H
Vidhi Sajnani 2020B1A71625H 
Siva Naga Rajdhanush Lella 2020B3A70545H
Ramakrishna C 2020B5A72287H
Sanaatan R 2021A7PS2902H
*/

const w = 600;
const h = 500;
const pad_size = 100;
const num_of_points = 50;
const velocityRange = 2;

class Point {
  
  constructor(x, y, vx = 0, vy = 0) 
  {
    this.x = x;
    this.y = y;
    this.vx = vx; // Velocity in x-direction
    this.vy = vy; // Velocity in y-direction
  }

  // Method to move the point based on its velocity
  move() {
    this.x += this.vx;
    this.y += this.vy;

    // Check for canvas boundaries and reverse velocity if necessary
    if (this.x > width || this.x < 0) {
      this.vx *= -1;
      this.x = Math.max(0, Math.min(this.x, width)); // Ensure the point stays within bounds
    }
    if (this.y > height || this.y < 0) {
      this.vy *= -1;
      this.y = Math.max(0, Math.min(this.y, height)); // Ensure the point stays within bounds
    }
  }
}

var points = [];
var hull = [];

var bg_color = 31;
var point_color = [255, 255, 255, 255];
var line_color = [128, 0, 128, 255];
var fill_color = [200, 150, 255, 100];


function setup() {

  let cnv = createCanvas(w, h);
  cnv.parent('canvas-container'); // This parents the canvas to the div with id 'canvas-container'
  background(200);
  // Generate initial points with random positions and velocities
  for (let i = 0; i < num_of_points; i++) {
    let x = random(pad_size, width - pad_size);
    let y = random(pad_size, height - pad_size);
    let vx = random(-velocityRange, velocityRange);
    let vy = random(-velocityRange, velocityRange);

    // Create a new Point object and add it to the points array
    points.push(new Point(x, y, vx, vy));
  }
}

function draw() {

  background(bg_color);
  move_points(points);

  // No need to map to x_y_points anymore; we'll work directly with Point objects
  hull = ConvexHull2(points); // Call the Kirkpatrick-Seidel algorithm with Point objects
  draw_convex_hull(hull, fill_color, line_color);
  draw_points(points, point_color, 5);

}

function draw_convex_hull(hullPoints, FC, LC) {
  stroke(LC);
  fill(FC);
  beginShape();
  for (let p of hullPoints) {
    vertex(p.x, p.y); // Use p.x and p.y instead of p[0] and p[1]
  }
  endShape(CLOSE);
}

function move_points(points) {
  // Iterate over the array of Point objects and move each one
  for (let i = 0; i < points.length; i++) {
    points[i].move();
  }
}

function draw_points(points, color, size) {
  stroke(color);
  strokeWeight(size);
  for (let p of points) {
    point(p.x, p.y); 
  }
}

function ConvexHull2(points) 
{
    // Result set
    let convexHull = [];
    // Assuming the Point class and other necessary functions are defined in the script

    let [plmin, pumin, pumax, plmax] = [points[0], points[0], points[0], points[0]];

    points.forEach(point => {
        // Adjust plmin, pumin, pumax, plmax as necessary
        if (point.x < plmin.x) {
            plmin = point;
            pumin = point;
          } else if (point.x > plmax.x) {
            plmax = point;
            pumax = point;
          } else if (point.x === plmin.x) {
            if (point.y > pumin.y) pumin = point;
            else if (point.y < plmin.y) plmin = point;
          } else if (point.x === plmax.x) {
            if (point.y > pumax.y) pumax = point;
            else if (point.y < plmax.y) plmax = point;
          }
    });

    let upperT = getUpperT(pumin, pumax, points);
    let lowerT = getLowerT(plmin, plmax, points);
    let UH = upperHull(pumin, pumax, upperT);
    let LH = lowerHull(plmin, plmax, lowerT);
    console.log(new Set(UH));
    console.log(new Set(LH));
    convexHull = [...UH, ...LH];

    sortPointsClockwise(convexHull);
    convexHull = removeDuplicatePoints(convexHull);
    
    return convexHull;
}

function computeSlope(a, b) {
  if (a.x !== b.x) return (a.y - b.y) / (a.x - b.x);
  else console.log("undefined slope");
}

function comparePoints(a, b) {
  if (a.x === b.x) return a.y < b.y;
  else return a.x < b.x;
}

function abss(a) {
  return Math.abs(a);
}

function getPivotValue(arr, low, high) {
  if (high - low + 1 <= 5) {
    let subArray = arr.slice(low, high + 1);
    subArray.sort((a, b) => a - b);
    let n = high - low + 1;
    let median = subArray[Math.floor(n / 2)];
    if (n % 2 === 0) {
      median = (median + subArray[Math.floor(n / 2) - 1]) / 2.0;
    }
    return median;
  }

  let medians = [];
  for (let i = low; i <= high; i += 5) {
    let end = Math.min(i + 4, high);
    let subArray = arr.slice(i, end + 1);
    subArray.sort((a, b) => a - b);
    medians.push(subArray[Math.floor((end - i) / 2)]);
  }

  return getPivotValue(medians, 0, medians.length - 1);
}

function partition(arr, low, high) {
let pivot = getPivotValue(arr, low, high);
while (low <= high) {
  while (arr[low] < pivot) {
    low++;
  }
  while (arr[high] > pivot) {
    high--;
  }
  if (arr[low] === arr[high]) {
    low++;
  } else if (low < high) {
    let temp = arr[low];
    arr[low] = arr[high];
    arr[high] = temp;
  }
}
return high;
}

function findMedianUtil(arr, k, low, high) {

  if(k <= 0 || k > high - low + 1) {
    return Number.MAX_VALUE;
  }

  if (arr.length <= 10) 
  {
    arr.sort((a, b) => a - b);
    if (arr.length % 2 !== 0) {
      return arr[Math.floor(arr.length / 2)];
    }
    else {
      let midIndex = arr.length / 2;
      return (arr[midIndex] + arr[midIndex - 1]) / 2;
    }
  }

  let m = partition(arr, low, high);
  let length = m - low + 1;
  if (length === k) 
  {
    return arr[m];
  } 
  else if (length > k) 
  {
    return findMedianUtil(arr, k, low, m - 1);
  } 
  else
  {
    return findMedianUtil(arr, k - length, m + 1, high);
  }
}

function findMedian(arr) {
  //return arr[0];
  return findMedianUtil(arr, Math.floor(arr.length / 2) + 1, 0, arr.length - 1);
}

function getUpperT(pumin, pumax, points) {
  let upperT = [];
  let p1p2Slope = computeSlope(pumin, pumax);

  upperT.push(pumin);
  upperT.push(pumax);

  points.forEach((currPt) => {
    if (currPt.x > pumin.x && currPt.x < pumax.x) {
      let p1CurrSlope = computeSlope(pumin, currPt);
      if (p1CurrSlope > p1p2Slope) {
        upperT.push(currPt);
      }
    }
  });

  console.log("\nget_Upper_T",upperT);
  return upperT;
}

function getLowerT(plmin, plmax, points) {
  let lowerT = [];
  let p1p2Slope = computeSlope(plmin, plmax);

  lowerT.push(plmin);
  lowerT.push(plmax);

  points.forEach((currPt) => {
    if (currPt.x > plmin.x && currPt.x < plmax.x) {
      let p1CurrSlope = computeSlope(plmin, currPt);
      if (p1CurrSlope < p1p2Slope) {
        lowerT.push(currPt);
      }
    }
  });

  console.log("\nget_Lower_T",lowerT);

  return lowerT;
}

function upperBridge(upperT, median) {
  
  console.log("In upperBridge upperT:",upperT);
  upperT.sort((a, b) => comparePoints(a, b) ? -1 : 1);
  let candidates = [];
  let pairs = [];
  let slopes = [];

  if (upperT.length === 2) {
    //console.log("\n2.");
    if (upperT[0].x < upperT[1].x) {
      //console.log(`\n(${upperT[0].x}, ${upperT[0].y})`);
      //console.log(`\n(${upperT[1].x}, ${upperT[1].y})`);
      return [upperT[0], upperT[1]];
    }
  }else if (upperT.length % 2 === 0) {
    //console.log("\n3.");
    for (let i = 0; i < upperT.length; i += 2) {
      pairs.push([upperT[i], upperT[i + 1]]);
    }
  } else {
    //console.log("\n here");
    candidates.push(upperT[0]);
    for (let i = 1; i < upperT.length; i += 2) {
      pairs.push([upperT[i], upperT[i + 1]]);
    }
  }

  pairs.forEach(pair => {
    let [pi, pj] = pair;
    if (pi.x === pj.x) {
      if (pi.y > pj.y) {
        candidates.push(pi);
      } else {
        candidates.push(pj);
      }
    } else {
      let k = computeSlope(pi, pj);
      slopes.push(k);
    }
  });

  let medianSlope = slopes.length === 1 ? slopes[0] : findMedian(slopes);
  let small = [], equal = [], large = [];

  pairs.forEach(([p1, p2]) => {
    if (p1.x !== p2.x) {
      let slope = computeSlope(p1, p2);
      if (Math.abs(slope - medianSlope) < 0.001) {
        equal.push([p1, p2]);
      } else if (slope < medianSlope) {
        small.push([p1, p2]);
      } else {
        large.push([p1, p2]);
      }
    }
  });

  let max = Number.MIN_SAFE_INTEGER;
  let pmin = new Point(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
  let pmax = new Point(Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER);

  upperT.forEach(pi => {
    let currIntercept = pi.y - medianSlope * pi.x;
    if (currIntercept > max) max = currIntercept;
  });

  upperT.forEach(pi => {
    let currIntercept = pi.y - medianSlope * pi.x;
    if (Math.abs(currIntercept - max) < 0.001) {
      if (pi.x < pmin.x) pmin = pi;
      if (pi.x > pmax.x) pmax = pi;
    }
  });

  if (pmin.x <= median && pmax.x > median) {
    return [pmin, pmax];
  } else if (pmax.x <= median) {
    large.forEach(item => candidates.push(item[1]));
    equal.forEach(item => candidates.push(item[1]));
    small.forEach(item => {
      candidates.push(item[0]);
      candidates.push(item[1]);
    });
    return upperBridge(candidates, median);
  } else if (pmin.x > median) {
    small.forEach(item => candidates.push(item[0]));
    equal.forEach(item => candidates.push(item[0]));
    large.forEach(item => {
      candidates.push(item[0]);
      candidates.push(item[1]);
    });
    return upperBridge(candidates, median);
  }
  
}

function lowerBridge(lowerT, median) 
{
  console.log("In lowerBridge lowerT:",lowerT);
  lowerT.sort((a, b) => comparePoints(a, b) ? -1 : 1);
  let candidates = [];
  let pairs = [];
  let slopes = [];
  //return [lowerT[0], lowerT[1]];
  if (lowerT.length === 2) {
      if (lowerT[0].x < lowerT[1].x) {
          return [lowerT[0], lowerT[1]];
      }
  } else if (lowerT.length % 2 === 0) {
      for (let i = 0; i < lowerT.length; i += 2) {
          pairs.push([lowerT[i], lowerT[i + 1]]);
      }
  } else {
      candidates.push(lowerT[0]);
      for (let i = 1; i < lowerT.length; i += 2) {
          pairs.push([lowerT[i], lowerT[i + 1]]);
      }
  }

  pairs.forEach(([pi, pj]) => {
      if (pi.x === pj.x) {
          if (pi.y > pj.y) {
              candidates.push(pj);
          } else {
              candidates.push(pi);
          }
      } else {
          let k = computeSlope(pi, pj);
          slopes.push(k);
      }
  });

  let medianSlope = slopes.length === 1 ? slopes[0] : findMedian(slopes);
  let SMALL = [], EQUAL = [], LARGE = [];

  pairs.forEach(([p1, p2]) => {
    if (p1.x !== p2.x) {
      let slope = computeSlope(p1, p2);
      if (Math.abs(slope - medianSlope) < 0.001) {
          EQUAL.push([p1, p2]);
      } else if (slope < medianSlope) {
          SMALL.push([p1, p2]);
      } else {
          LARGE.push([p1, p2]);
      }
    }
  });

  let MIN = Number.MAX_SAFE_INTEGER;
  let pmin = new Point(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
  let pmax = new Point(Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER);

  lowerT.forEach(pi => {
      let currIntercept = pi.y - medianSlope * pi.x;
      if (currIntercept < MIN) {
          MIN = currIntercept;
      }
  });

  lowerT.forEach(pi => {
      let currIntercept = pi.y - medianSlope * pi.x;
      if (Math.abs(currIntercept - MIN) < 0.001) {
          if (pi.x < pmin.x) pmin = pi;
          if (pi.x > pmax.x) pmax = pi;
      }
  });

  if (pmin.x <= median && pmax.x > median) {
      return [pmin, pmax];
  } else if (pmax.x <= median) {
      LARGE.forEach(pair => {
          candidates.push(pair[0], pair[1]);
      });
      EQUAL.forEach(pair => {
          candidates.push(pair[1]);
      });
      SMALL.forEach(pair => {
          candidates.push(pair[1]);
      });
      return lowerBridge(candidates, median);
  } else if (pmin.x > median) {
      SMALL.forEach(pair => {
          candidates.push(pair[0], pair[1]);
      });
      EQUAL.forEach(pair => {
          candidates.push(pair[0]);
      });
      LARGE.forEach(pair => {
          candidates.push(pair[0]);
      });
      return lowerBridge(candidates, median);
  }
}

function upperHull(pmin, pmax, upperT) {
  console.log("upperHull");
  let upperHullArray = []; // final upper hull is stored here
  let n = upperT.length;
  let arr = upperT.map(point => point.x); // extract x coordinates
  let median;

  if (n === 1) {
    median = arr[0];
  } else {
    median = findMedian(arr);
  }

  let upperBridgeResult = upperBridge(upperT, median);
  let pl = upperBridgeResult[0];
  let pr = upperBridgeResult[1];
  console.log("upperBridgeResult", upperBridgeResult);

  // Ensure pl is to the left of pr
  if (pl.x > pr.x) {
    [pl, pr] = [pr, pl]; // Swap using destructuring
  }

  upperHullArray.push(pl, pr);

  // Compute Tleft that is between pmin and pl outside the pmin-pl line
  if (pmin.x !== pl.x && pmin.y !== pl.y) {
    let upperTLeft = getUpperT(pmin, pl, upperT);
    let UHLeft = upperHull(pmin, pl, upperTLeft);
    UHLeft.forEach(point => upperHullArray.push(point));
  }

  // Compute Tright that is between pr and pmax outside the pr-pmax line
  if (pmax.x !== pr.x && pmax.y !== pr.y) {
    let upperTRight = getUpperT(pr, pmax, upperT);
    let UHRight = upperHull(pr, pmax, upperTRight);
    UHRight.forEach(point => upperHullArray.push(point));
  }

  return upperHullArray;
}

function lowerHull(pmin, pmax, lowerT) {
  console.log("lowerHull");
  let lowerHull_arr = [];
  let n = lowerT.length;
  let arr = lowerT.map(point => point.x);
  let median;

  if (n === 1) {
    median = arr[0];
  } else {
    median = findMedian(arr);
  }

  let lowerBridgeResult = lowerBridge(lowerT, median);
  let pl = lowerBridgeResult[0];
  let pr = lowerBridgeResult[1];
  //console.log("lowerBridgeResult",lowerBridgeResult);
  // Ensure pl is to the left of pr
  if (pl.x > pr.x) {
    [pl, pr] = [pr, pl]; // Swap using destructuring
  }

  lowerHull_arr.push(pl, pr);

  // Compute Tleft that is between pmin and pl outside the pminpl line
  if (pmin.x !== pl.x && pmin.y !== pl.y) {
    let lowerTLeft = getLowerT(pmin, pl, lowerT);
    let LHLeft = lowerHull(pmin, pl, lowerTLeft);
    LHLeft.forEach(point => lowerHull_arr.push(point));
  }

  if (pmax.x !== pr.x && pmax.y !== pr.y) {
    let lowerTRight = getLowerT(pr, pmax, lowerT);
    let LHRight = lowerHull(pr, pmax, lowerTRight);
    LHRight.forEach(point => lowerHull_arr.push(point));
  }

  return lowerHull_arr;
}

// Use this function to sort points in a clockwise order around their centroid
function sortPointsClockwise(points) {
  let centroid = findCentroid(points);

  points.sort((a, b) => {
    let angleA = calculateAngle(centroid, a);
    let angleB = calculateAngle(centroid, b);

    if (angleA === angleB) {
      return (Math.pow(a.x - centroid.x, 2) + Math.pow(a.y - centroid.y, 2)) -
             (Math.pow(b.x - centroid.x, 2) + Math.pow(b.y - centroid.y, 2));
    }
    return angleA - angleB;
  });
}

function findCentroid(points) 
{
  let sumX = 0, sumY = 0;
  points.forEach(p => {
    sumX += p.x;
    sumY += p.y;
  });
  return new Point(sumX / points.length, sumY / points.length);
}

function calculateAngle(centroid, point) {
  return Math.atan2(point.y - centroid.y, point.x - centroid.x);
}

function removeDuplicatePoints(hull) {
  const uniquePointsMap = new Map();
  
  hull.forEach(point => {
    const pointKey = `${point.x}-${point.y}`;
    if (!uniquePointsMap.has(pointKey)) {
      uniquePointsMap.set(pointKey, point);
    }
  });

  // Convert the Map values back to an array
  return Array.from(uniquePointsMap.values());
}