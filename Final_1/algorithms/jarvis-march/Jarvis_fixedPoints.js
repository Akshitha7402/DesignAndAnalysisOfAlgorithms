/*
Akshitha Bajjuri 2020B2A71973H
Vidhi Sajnani 2020B1A71625H 
Siva Naga Rajdhanush Lella 2020B3A70545H
Ramakrishna C 2020B5A72287H
Sanaatan R 2021A7PS2902H
*/

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
} 

let points = [];
let hullPoints = [];
const numPoints = 50; // The fixed number of points you want to generate

function setup() {
    createCanvas(800, 600);
    background(200);
    
    // Generate random points
    generateRandomPoints(numPoints);
    
    const startButton = document.getElementById('startButton');
    const refreshButton = document.getElementById('refreshButton');
    startButton.addEventListener('click', async () => {
        if (points.length > 1) {
            hullPoints = ConvexHull(points); // Calculate the convex hull
            drawHull(); // Draw the convex hull
        } else {
            alert("Please click to create at least 2 points.");
        }
    });

    refreshButton.addEventListener('click', () => {
        points = []; // Clear the points array
        hullPoints = []; // Clear the hull points array
        clear(); // Clear the p5.js canvas
        background(200); // Redraw the background
        generateRandomPoints(numPoints); // Generate new random points
    });
}

function generateRandomPoints(numPoints) {
    for (let i = 0; i < numPoints; i++) {
        let x = random(10, width - 10); // Avoid generating points too close to the edge
        let y = random(10, height - 10); // Avoid generating points too close to the edge
        let point = new Point(x, y);
        points.push(point);
        fill(0);
        ellipse(x, y, 10, 10); // Draw the new point
    }
}

// Include the rest of your functions (drawLine, drawHull, mousePressed, distance, crossProduct, ConvexHull) here as they were in your previous submission.
function drawLine(p1, p2) 
  {
    //console.log("hey");
    stroke(128, 0, 128); 
    strokeWeight(2);
    line(p1.x, p1.y, p2.x, p2.y);
  }
  
  function drawHull() 
  {
    clear(); // Clear the canvas for redrawing
    background(200);
    stroke(0); // Set line color to black for points
    strokeWeight(2); // Set line weight for points
    fill(0); // Black color for points
    
    // Draw all points
    for (let point of points) {
        ellipse(point.x, point.y, 10, 10); // Display each stored point
    }
  
    // Draw the convex hull lines in black
    stroke(0); // Set line color to black for the convex hull
    strokeWeight(2); // Set line thickness
    noFill(); // Do not fill the polygon
    
    beginShape();
    for (let point of hullPoints) {
        vertex(point.x, point.y);
    }
    endShape(CLOSE);
  }
  
  function mousePressed() 
  {
    if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
        points.push(new Point(mouseX, mouseY)); // Add point on mouse click
        fill(0);
        ellipse(mouseX, mouseY, 10, 10); // Draw the new point
    }
  }
  
  function distance(a, b, c) 
  {
    let y1 = a.y - b.y;
    let y2 = a.y - c.y;
    let x1 = a.x - b.x;
    let x2 = a.x - c.x;
  
    return Math.sign((y1 * y1 + x1 * x1) - (y2 * y2 + x2 * x2));
  }
  
  function crossProduct(a, b, c) 
  {
    let y1 = a.y - b.y;
    let y2 = a.y - c.y;
    let x1 = a.x - b.x;
    let x2 = a.x - c.x;
  
    return y2 * x1 - y1 * x2;
  }
  
  function ConvexHull(points) 
  {
    // Pick start with the leftmost point
    let start = points[0];
    for (let i = 0; i < points.length; i++) 
    {
      if (points[i].x < start.x) 
      {
        start = points[i];
      }
    }
    
    let current = start;
    // Result set
    let convexHullArray = new Set();
    convexHullArray.add(start);
    let collinearPoints = [];
  
    while (true) 
    {
      //console.log("1.Hello world!");
      let nextTarget = points[0];
      for (let i = 1; i < points.length; i++) 
      {
        //drawLine(points[i], current);
        if (points[i] === current) 
        {
          continue;
        }
  
        let val = crossProduct(current, nextTarget, points[i]);
        
        if (val > 0) 
        {
          nextTarget = points[i];
          // Reset collinear points because we have a new left point now
          collinearPoints = [];
        } 
        else if (val === 0) 
        {
          if (distance(current, nextTarget, points[i]) < 0) 
          {
            collinearPoints.push(nextTarget);
            nextTarget = points[i];
          } 
          else 
          {
            collinearPoints.push(points[i]);
          }
        }
      }
  
      // Add all points in collinear points to result
      for (let p of collinearPoints) 
      {
        convexHullArray.add(p);
      }
      // If your next target is the same as the start => you have covered all the points
      if (nextTarget === start) 
      {
        break;
      }
  
      convexHullArray.add(nextTarget);
      current = nextTarget;
    }
    //console.log("Hello world!");
    
    return Array.from(convexHullArray);
  }