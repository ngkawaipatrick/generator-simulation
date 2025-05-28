// Generator
// Converted from a Java Applet (08.05.1998)
// 03.12.2015 - 23.12.2015

// ****************************************************************************
// * Author: Walter Fendt (www.walter-fendt.de)                               *
// * This program may be used and distributed for non-commercial purposes,    *
// * even in modified form, as long as this notice is not removed.            *
// ****************************************************************************

// Language-dependent texts are stored in a separate file (e.g., generator_de.js).

// Colors:

var colorBackground = "#fce9a8";                           // Background color
var colorNorth = "#c74949";                                // Color for the north pole
var colorSouth = "#494cc7";                                // Color for the south pole
var colorContact = "#c0c0c0";                              // Color for contacts (no current)
var colorInsulator = "#000000";                            // Color for the insulator
var colorCurrent1 = "#00a8ff";                             // Color for current (wires)
var colorCurrent2 = "#ffc800";                             // Color for current (contacts)
var colorCurrent3 = "#400000";                             // Color for the inner side of a slip ring
var colorField = "#ff0000";                                // Color for the magnetic field
var colorMotion = "#1bb13e";                               // Color for motion
var colorVoltage = "#0000ff";                              // Color for voltage
var colorFlux = "#ff0000";                              // Color for voltage
var colorCrank = "#a8a8be";                                // Color for the crank
var colorResistor = "#a8a8be";                             // Color for the resistor
var colorVoltmeter = "#a8a8be";                             // Color for the resistor

// Other constants:

var FONT = "normal normal bold 12px sans-serif";           // Font
var PI = Math.PI;                                          // Shortcut for pi
var PI2 = 2 * Math.PI;                                     // Shortcut for 2 * pi
var PIH = Math.PI / 2;                                     // Shortcut for pi / 2
var DEG = Math.PI / 180;                                   // Degrees
var PHI = 235 * DEG;                                       // Azimuth angle (radians, between pi and 3 * pi / 2)
var THETA = 15 * DEG;                                      // Elevation angle (radians, between 0 and pi / 2)
var HC = 6;                                                // Half side length of a contact
var XM1 = 40;                                              // x-coordinate for horseshoe magnet
var YM1 = 5, YM2 = 300, YM3 = 400;                         // y-coordinates for horseshoe magnet
var ZM1 = 90, ZM2 = 110;                                   // z-coordinates for horseshoe magnet
var XW1 = 130, XW2 = 140, XW3 = 220, XW4 = 260;            // x-coordinates for wires
var YW1 = 0, YW2 = -90, YW3 = -110;                        // y-coordinates for wires
var ZW1 = -100, ZW2 = 75;                                  // z-coordinates for power source and wires
var YA1 = 80, YA2 = 200;                                   // y-coordinates for conductor loop
var ZA1 = 8, ZA2 = 30;                                     // z-coordinates for conductor loop
var XC1 = 0;                                               // x-coordinate for contacts and commutator
var YC1 = 0, YC2 = -40;                                    // y-coordinates for contacts and commutator
var ZC1 = 36;                                              // z-coordinates for contacts
var YC3 = -80, YC4 = -120;                                 // y-coordinates for crank (direct/alternating current)
var XV1 = 120, XV2 = 240;                                  // x-coordinates for voltmeter
var YV1 = -90, YV2 = -50;                                  // y-coordinates for voltmeter
var ZV1 = -120, ZV2 = 50, ZV3 = -50;                       // z-coordinates for voltmeter
var XR1 = 60, XR2 = 100;                                   // x-coordinates for consumer resistor
var U0 = 300, V0 = 250;                                    // Screen coordinates of the origin
var INSMAX = 15 * DEG;                                     // Angle for insulator
var THICK = 2;                                             // Line thickness for thick lines
// Attributes:

var canvas, ctx;                                           // Canvas, graphics context
var width, height;                                         // Dimensions of the canvas (pixels)
var rb1, rb2;                                              // Radio buttons
var bu1, bu2;                                              // Buttons
var sl;                                                    // Slider
var op;                                                    // Output field
var cb1, cb2, cb3;                                         // Checkboxes

var genDC;                                                 // Flag for DC generator (with commutator)
var on;                                                    // Flag for motion
var timer;                                                 // Timer for animation
var t0;                                                    // Reference time point
var t;                                                     // Time variable (s)
var omega;                                                 // Angular frequency (1/s)
var nPer;                                                  // Maximum number of periods
var direction;                                             // Rotation direction (1 for counterclockwise, -1 for clockwise)
var current;                                               // Current direction (0, 1, -1)
var alpha;                                                 // Rotation angle (radians)
var sinAlpha, cosAlpha;                                    // Trigonometric values
var uRot, vRot;                                            // Current coordinates for rotating parts
var vArrows;                                               // Flag: arrows for motion direction
var bArrows;                                               // Flag: arrows for magnetic field
var iArrows;                                               // Flag: arrows for induced current

var a1, a2, b1, b2, b3, c1, c2, c3;                        // Coefficients for parallel projection

// The spatial configuration is described by a Cartesian coordinate system (x, y, z).
// (Origin is at the center of the commutator, x-y plane is horizontal (rotation axis as y-axis), z-axis is upward)
// The calculation of screen coordinates (u, v) is performed using the equations:
// u = U0 + a1 * x + a2 * y
// v = V0 + b1 * x + b2 * y + b3 * z.
// The vector (c1, c2, c3) represents the direction to the viewer.

var pgNorth, pgSouth;                                      // Polygons for horseshoe magnet (north/south pole)
var pgContact1;                                            // Polygon for the upper slip contact
var pgContact2;                                            // Polygon for the lower slip contact (with commutator)
var pgContact3;                                            // Polygon for the lower slip contact (without commutator)
var pointContact1, pointContact2, pointContact3;           // Inner points of the slip contact polygons
var aEllipse, bEllipse;                                    // Major and minor axes of the commutator ellipses (pixels)
var deltaEllipse;                                          // Rotation angle of the commutator ellipses (radians)
var pgInsulator1, pgInsulator2;                            // Polygons for the commutator's insulation layer
var pgVoltmeter1;                                          // Polygon for the entire measuring device
var pgVoltmeter2;                                          // Polygon for the scale of the measuring device
var pgVoltmeter3;                                          // Polygon for the lower part of the measuring device
var pointVoltmeter;                                        // Inner point for the voltmeter

// Element of a button (from the HTML file):
// id ..... ID in the HTML command
// text ... Text (optional)

function getElement (id, text) {
  var e = document.getElementById(id);                     // Element
  if (text) e.innerHTML = text;                            // Set text if defined
  return e;                                                // Return value
}

// Start function:

function start () {
  V0 += 200;
  canvas = getElement("cv");                               // Canvas
  width = canvas.width; height = canvas.height;            // Dimensions (pixels)
  ctx = canvas.getContext("2d");                           // Graphics context
  rb1 = getElement("rb1a");                                // Radio button (without commutator)
  rb1.checked = true;                                      // Initially select this radio button
  getElement("rb1b", text01);                              // Explanation text (without commutator)
  rb2 = getElement("rb2a");                                // Radio button (with commutator)
  getElement("rb2b", text02);                              // Explanation text (with commutator)
  bu1 = getElement("bu1", text03);                         // Button (reverse direction)
  sl = getElement("sl");                                   // Slider (rotation speed)
  sl.value = 10;                                           // Initial state (6 rpm) corresponds to T = 10 s
  op = getElement("op");                                   // Output field (rotation speed)
  reactionSlider(false);                                   // Set omega, output the rotation speed
  bu2 = getElement("bu2", text04[1]);                      // Button (pause/resume)
  setButton2State(1);                                      // Initial state of the button
  cb1 = getElement("cb1a");                                // Checkbox (motion direction)
  getElement("cb1b", text05);                              // Explanation text (motion direction)
  cb2 = getElement("cb2a");                                // Checkbox (magnetic field)
  getElement("cb2b", text06);                              // Explanation text (magnetic field)
  cb3 = getElement("cb3a");                                // Checkbox (Lorentz force)
  getElement("cb3b", text07);                              // Explanation text (Lorentz force)
  cb1.checked = cb2.checked = cb3.checked = true;          // Initially enable all checkboxes
  getElement("author", author);                            // Author
  getElement("translator", translator);                    // Translator

  genDC = false;                                           // Initially an AC generator (without commutator)
  nPer = 5;                                                // Maximum number of periods in the diagram
  t = 0;                                                   // Time variable (s)
  alpha = 0; cosAlpha = 1; sinAlpha = 0;                   // Rotation angle (radians), trigonometric values
  vArrows = bArrows = iArrows = true;                      // Initially show arrows for motion, magnetic field, and current
  direction = 1;                                           // Initial rotation direction (counterclockwise)
  calcCoeff();                                             // Calculate coefficients for projection
  initPolygons();                                          // Prepare polygons
  calcEllipse();                                           // Prepare ellipse for commutator
  startAnimation();                                        // Start animation

  rb1.onclick = reactionRadio;                             // Reaction to radio button (without commutator)
  rb2.onclick = reactionRadio;                             // Reaction to radio button (with commutator)
  bu1.onclick = reactionReverse;                           // Reaction to button (reverse direction)
  sl.onchange = reactionSlider;                            // Reaction to slider
  sl.onclick = reactionSlider;                             // Reaction to slider
  bu2.onclick = reactionStart;                             // Reaction to button (pause/resume)
  cb1.onclick = reactionCheckbox;                          // Reaction to checkbox (motion direction)
  cb2.onclick = reactionCheckbox;                          // Reaction to checkbox (magnetic field)
  cb3.onclick = reactionCheckbox;                          // Reaction to checkbox (induced current)
}

// Set the state of the start/pause/resume button:
// st ... Desired state
// Side effect: bu2.state

function setButton2State(st) {
  bu2.state = st;                                          // Save the state
  bu2.innerHTML = text04[st];                              // Update the text
}

// Toggle the start/pause/resume button:
// Side effect: bu2.state

function switchButton2() {
  var st = bu2.state;                                      // Current state
  if (st == 0) st = 1;                                     // If starting state, begin animation
  else st = 3 - st;                                        // Toggle between animation and pause
  setButton2State(st);                                     // Save the new state, update text
}

// Reaction to radio buttons (without/with commutator):
// Side effects: genDC, t, alpha, cosAlpha, sinAlpha

function reactionRadio() {
  genDC = rb2.checked;                                     // Flag for DC generator (with commutator)
  reset();                                                 // Reset to initial position
}

// Reaction to the start/pause/resume button:
// Side effects: t0, bu2.state, on, timer, t0

function reactionStart() {
  if (bu2.state != 1) t0 = new Date();                     // If animation is on, reset the starting time
  switchButton2();                                         // Change the state of the button
  if (bu2.state == 1) startAnimation();                    // Either resume animation...
  else stopAnimation();                                    // ...or stop it
}

// Reaction to the reverse direction button:
// Side effects: direction, t, alpha, cosAlpha, sinAlpha

function reactionReverse() {
  direction = -direction;                                  // Reverse the direction of current
  reset();                                                 // Reset to initial position
}

// Reset to the initial position:
// Side effects: t, alpha, cosAlpha, sinAlpha

function reset() {
  t = 0;                                                   // Reset time variable
  alpha = 0; cosAlpha = 1; sinAlpha = 0;                   // Reset rotation angle and trigonometric values
  if (!on) paint();                                        // If animation is off, redraw
}

// Reaction to the slider:
// r ... Flag for resetting to the initial position (optional)
// Side effects: omega, nPer, t, alpha, cosAlpha, sinAlpha

function reactionSlider(r) {
  var n = sl.value;                                        // Slider position
  omega = PI2 * n / 100;                                   // Angular frequency (1/s) corresponding to T = 100 s / n
  var s = (n * 0.6).toFixed(1);                            // String for rotation speed value
  s = s.replace(".", decimalSeparator);                    // Replace a period with a comma if necessary
  if (n == 0) s = "0";                                     // Special case for 0 (no decimal places)
  op.innerHTML = s + " " + rotationsPerMinute;             // Display rotation speed (rotations per minute)
  nPer = Math.floor(n / 2);                                // Maximum number of periods
  if (r != false) reset();                                 // If desired, reset to the initial position
}

// Reaction to checkboxes:
// Side effects: vArrows, bArrows, iArrows

function reactionCheckbox() {
  vArrows = cb1.checked;                                   // Arrows for motion direction
  bArrows = cb2.checked;                                   // Arrows for magnetic field
  iArrows = cb3.checked;                                   // Arrows for induced current
  if (!on) paint();                                        // If animation is off, redraw
}

// Start or resume animation:
// Side effects: on, timer, t0

function startAnimation() {
  on = true;                                               // Enable animation
  timer = setInterval(paint, 40);                          // Start timer with a 40 ms interval
  t0 = new Date();                                         // Reset the starting time
}

// Stop animation:
// Side effects: on, timer

function stopAnimation() {
  on = false;                                              // Disable animation
  clearInterval(timer);                                    // Deactivate timer
}

//-------------------------------------------------------------------------------------------------

// Initialize polygons:
// Side effects: pgSouth, pgNorth

function initPolygons() {
  pgSouth = new Array(8);                                  // Polygon for the south pole of the horseshoe magnet
  setPoint(pgSouth, 0, -XM1, YM3, 0);
  setPoint(pgSouth, 1, -XM1, YM3, -ZM2);
  setPoint(pgSouth, 2, -XM1, YM1, -ZM2);
  setPoint(pgSouth, 3, XM1, YM1, -ZM2);
  setPoint(pgSouth, 4, XM1, YM1, -ZM1);
  setPoint(pgSouth, 5, XM1, YM2, -ZM1);
  setPoint(pgSouth, 6, XM1, YM2, 0);
  setPoint(pgSouth, 7, -XM1, YM2, 0);

  pgNorth = new Array(9);                                  // Polygon for the north pole of the horseshoe magnet
  setPoint(pgNorth, 0, -XM1, YM3, 0);
  setPoint(pgNorth, 1, -XM1, YM2, 0);
  setPoint(pgNorth, 2, XM1, YM2, 0);
  var u0 = screenU(-XM1, YM1);
  var v0 = screenV(-XM1, YM1, ZM1);
  var u1 = screenU(-XM1, YM2);
  var v1 = screenV(-XM1, YM2, ZM1);
  var uS = screenU(XM1, YM2);
  var q = (uS - u0) / (u1 - u0);
  var vS = v0 + q * (v1 - v0);
  pgNorth[3] = { u: uS, v: vS };
  setPoint(pgNorth, 4, -XM1, YM1, ZM1);
  setPoint(pgNorth, 5, XM1, YM1, ZM1);
  setPoint(pgNorth, 6, XM1, YM1, ZM2);
  setPoint(pgNorth, 7, XM1, YM3, ZM2);
  setPoint(pgNorth, 8, -XM1, YM3, ZM2);

  pgContact1 = new Array(6);                               // Polygon for the upper slip contact
  pointContact1 = initContact(pgContact1, XC1, YC1, ZC1);  // Associated inner point
  pgContact2 = new Array(6);                               // Polygon for the lower slip contact (with commutator)
  pointContact2 = initContact(pgContact2, XC1, YC1, -ZC1); // Associated inner point
  pgContact3 = new Array(6);                               // Polygon for the lower slip contact (without commutator)
  pointContact3 = initContact(pgContact3, XC1, YC2, -ZC1); // Associated inner point

  pgVoltmeter1 = new Array(6);                             // Polygon for the entire voltmeter
  pointVoltmeter = initCuboid(pgVoltmeter1, XV1, XV2, YV1, YV2, ZV1, ZV2); // Associated inner point
  pgVoltmeter2 = new Array(4);                             // Polygon for the scale of the voltmeter
  setPoint(pgVoltmeter2, 0, XV1, YV1, ZV3);
  setPoint(pgVoltmeter2, 1, XV2, YV1, ZV3);
  setPoint(pgVoltmeter2, 2, XV2, YV1, ZV2);
  setPoint(pgVoltmeter2, 3, XV1, YV1, ZV2);

  pgVoltmeter3 = new Array(4);                             // Polygon for the lower part of the voltmeter
  pgVoltmeter3[0] = pgVoltmeter1[1];
  pgVoltmeter3[1] = pgVoltmeter1[2];
  pgVoltmeter3[2] = pgVoltmeter2[1];
  pgVoltmeter3[3] = pgVoltmeter2[0];

  pgInsulator1 = new Array(20);                            // Polygon for the insulator layer
  pgInsulator2 = new Array(20);                            // Polygon for the insulator layer
  for (i = 0; i < 20; i++) {                               // Temporary coordinates
    pgInsulator1[i] = { u: 0, v: 0 };
    pgInsulator2[i] = { u: 0, v: 0 };
  }
}

// Calculate coefficients for projection:
// Side effects: a1, a2, b1, b2, b3, c1, c2, c3

function calcCoeff() {
  a1 = -Math.sin(PHI); a2 = Math.cos(PHI);                 // Vector (a1, a2, 0) for horizontal screen coordinate
  b1 = Math.sin(THETA) * a2; b2 = -Math.sin(THETA) * a1;   // Vector (b1, b2, b3) for vertical screen coordinate
  b3 = -Math.cos(THETA);
  c1 = a2 * b3; c2 = -a1 * b3; c3 = a1 * b2 - a2 * b1;     // Vector (c1, c2, c3) to the viewer (cross product)
}

// Horizontal screen coordinate:
// (x, y, z) ... Spatial position

function screenU(x, y) {
  return U0 + a1 * x + a2 * y;
}

// Vertical screen coordinate:
// (x, y, z) ... Spatial position

function screenV(x, y, z) {
  return V0 + b1 * x + b2 * y + b3 * z;
}

// Define a polygon corner (version for non-moving parts):
// p ......... Array for screen coordinates of the polygon corners
// i ......... Index of the corner
// (x, y, z) ... Spatial position
// Side effects: p[i].u, p[i].v

function setPoint(p, i, x, y, z) {
  p[i] = { u: screenU(x, y), v: screenV(x, y, z) };
}

// Define a polygon corner (version for rotating parts):
// p ......... Array for screen coordinates of the polygon corners
// i ......... Index of the corner
// (x, y, z) ... Spatial position for alpha = 0
// Side effects: uRot, vRot, p[i].u, p[i].v

function setPointRot(p, i, x, y, z) {
  screenCoordsRot(x, y, z);                                // Calculate screen coordinates
  p[i].u = uRot; p[i].v = vRot;                            // Set the coordinates of the polygon corner
}

// Prepare a polygon for a cuboid oblique projection:
// pg ......... Polygon for outline
// xx1, xx2 ... Lower and upper bounds for the x-coordinate
// yy1, yy2 ... Lower and upper bounds for the y-coordinate
// zz1, zz2 ... Lower and upper bounds for the z-coordinate
// Return value: Inner point (screen coordinates u, v)

function initCuboid(pg, xx1, xx2, yy1, yy2, zz1, zz2) {
  pg[0] = { u: screenU(xx1, yy2), v: screenV(xx1, yy2, zz1) };  // Bottom left corner
  pg[1] = { u: screenU(xx1, yy1), v: screenV(xx1, yy1, zz1) };  // Bottom corner
  pg[2] = { u: screenU(xx2, yy1), v: screenV(xx2, yy1, zz1) };  // Bottom right corner
  pg[3] = { u: screenU(xx2, yy1), v: screenV(xx2, yy1, zz2) };  // Top right corner
  pg[4] = { u: screenU(xx2, yy2), v: screenV(xx2, yy2, zz2) };  // Top corner
  pg[5] = { u: screenU(xx1, yy2), v: screenV(xx1, yy2, zz2) };  // Top left corner
  return { u: screenU(xx1, yy1), v: screenV(xx1, yy1, zz2) };   // Inner point
}

// Prepare a slip contact (cube with side length 2 * HC):
// pg ........ Polygon for outline
// (x, y, z) ... Center point
// Return value: Inner point (screen coordinates u, v)

function initContact(pg, x, y, z) {
  return initCuboid(pg, x - HC, x + HC, y - HC, y + HC, z - HC, z + HC);
}

// Set the starting point (version for non-moving parts):
// (x, y, z) ... Spatial position

function moveTo(x, y, z) {
  ctx.moveTo(screenU(x, y), screenV(x, y, z));
}

// Prepare a line to a given point (version for non-moving parts):
// (x, y, z) ... Spatial position

function lineTo(x, y, z) {
  ctx.lineTo(screenU(x, y), screenV(x, y, z));
}

// Screen coordinates for a rotating part:
// (x, y, z) ... Coordinates in the initial position
// Side effects: uRot, vRot

function screenCoordsRot(x, y, z) {
  var xx = x * cosAlpha - z * sinAlpha;                    // x-coordinate after rotation
  var zz = x * sinAlpha + z * cosAlpha;                    // z-coordinate after rotation
  uRot = U0 + a1 * xx + a2 * y;                            // Horizontal screen coordinate (pixels)
  vRot = V0 + b1 * xx + b2 * y + b3 * zz;                  // Vertical screen coordinate (pixels)
}

// Set the starting point (version for rotating parts):
// (x, y, z) ... Coordinates in the initial position
// Side effects: uRot, vRot

function moveToRot(x, y, z) {
  screenCoordsRot(x, y, z);                                // Calculate screen coordinates
  ctx.moveTo(uRot, vRot);                                  // Set the starting position
}

// Prepare a line to a given point (version for rotating parts):
// (x, y, z) ... Coordinates in the initial position
// Side effects: uRot, vRot

function lineToRot(x, y, z) {
  screenCoordsRot(x, y, z);                                // Calculate screen coordinates
  ctx.lineTo(uRot, vRot);                                  // Prepare the line
}

// Calculations for commutator ellipses:
// Side effects: aEllipse, bEllipse, deltaEllipse

function calcEllipse() {
  var r = ZC1 - HC;                                        // Radius

  // The auxiliary variables c, d, and m are determined by the following conditions:
  // Ellipse passes through (c|mc) with infinite slope
  // Ellipse passes through point (0|d) with slope m
  var c = a1 * r, d = -b3 * r, m = b1 / a1;

  // Coefficients of the ellipse equation (c11 u^2 + 2 c12 uv + c22 v^2 + c0 = 0)
  var c11 = c * c * m * m + d * d;                         // Coefficient of u^2
  var c12 = -m * c * c;                                    // Coefficient of uv
  var c22 = c * c;                                         // Coefficient of v^2
  var c0 = -c * c * d * d;                                 // Constant term

  // Coefficients of the biquadratic equation (a^4 + bq * a^2 + cq = 0) for the major axis a
  var bq = -c * c * (1 + m * m) - d * d;                   // Coefficient of a^2
  var cq = c * c * d * d;                                  // Constant term
  var discr = bq * bq - 4 * cq;                            // Discriminant
  aEllipse = Math.sqrt((-bq - Math.sqrt(discr)) / 2);      // Major axis (pixels)
  bEllipse = c * d / aEllipse;                             // Minor axis (pixels)
  deltaEllipse = Math.atan(2 * c12 / (c22 - c11)) / 2;     // Rotation angle (radians, negative)
}

//-------------------------------------------------------------------------------------------------

// Create a new graphics path:
// w ... Line thickness (optional, default is 1)

function newPath(w) {
  ctx.beginPath();                                         // New path
  ctx.strokeStyle = "#000000";                             // Line color: black
  ctx.lineWidth = (w ? w : 1);                             // Line thickness
}

// Draw an arrow:
// x1, y1 ... Starting point
// x2, y2 ... Ending point
// w ........ Line thickness (optional)
// Note: The color is determined by ctx.strokeStyle.

function arrow(x1, y1, x2, y2, w) {
  if (!w) w = 1;                                           // Default line thickness if undefined
  var dx = x2 - x1, dy = y2 - y1;                          // Vector coordinates
  var length = Math.sqrt(dx * dx + dy * dy);               // Length
  if (length == 0) return;                                 // Exit if length is zero
  dx /= length; dy /= length;                              // Unit vector
  var s = 2.5 * w + 7.5;                                   // Length of the arrowhead
  var xSp = x2 - s * dx, ySp = y2 - s * dy;                // Helper point for arrowhead
  var h = 0.5 * w + 3.5;                                   // Half-width of the arrowhead
  var xSp1 = xSp - h * dy, ySp1 = ySp + h * dx;            // Corner of the arrowhead
  var xSp2 = xSp + h * dy, ySp2 = ySp - h * dx;            // Corner of the arrowhead
  xSp = x2 - 0.6 * s * dx; ySp = y2 - 0.6 * s * dy;        // Indented corner of the arrowhead

  ctx.beginPath();                                         // New graphics path
  ctx.lineWidth = w;                                       // Line thickness
  ctx.moveTo(x1, y1);                                      // Starting point
  if (length < 5) ctx.lineTo(x2, y2);                      // If arrow is short, continue to the endpoint...
  else ctx.lineTo(xSp, ySp);                               // ...otherwise continue to the indented corner
  ctx.stroke();                                            // Draw the line
  if (length < 5) return;                                  // If the arrow is short, skip the arrowhead

  ctx.beginPath();                                         // New path for the arrowhead
  ctx.lineWidth = 1;                                       // Reset line thickness
  ctx.fillStyle = ctx.strokeStyle;                         // Fill color matches line color
  ctx.moveTo(xSp, ySp);                                    // Starting point (indented corner)
  ctx.lineTo(xSp1, ySp1);                                  // Continue to one side
  ctx.lineTo(x2, y2);                                      // Continue to the tip
  ctx.lineTo(xSp2, ySp2);                                  // Continue to the other side
  ctx.closePath();                                         // Close the path
  ctx.fill();                                              // Draw the arrowhead
}

// Rotating line:
// (x1, y1, z1) ... Starting point (coordinates in initial position)
// (x2, y2, z2) ... Ending point (coordinates in initial position)
// c ............ Line color
// w ............ Line thickness

function lineRot(x1, y1, z1, x2, y2, z2, c, w) {
  newPath(w);                                              // New graphics path
  ctx.strokeStyle = c;                                     // Line color
  moveToRot(x1, y1, z1);                                   // Starting point
  lineToRot(x2, y2, z2);                                   // Endpoint
  ctx.stroke();                                            // Draw the line
}

// Rotating arrow:
// (x1, y1, z1) ... Starting point (coordinates in initial position)
// (x2, y2, z2) ... Ending point (coordinates in initial position)

function arrowRot(x1, y1, z1, x2, y2, z2) {
  var xx1 = x1 * cosAlpha - z1 * sinAlpha;                 // x-coordinate of the starting point after rotation
  var zz1 = x1 * sinAlpha + z1 * cosAlpha;                 // z-coordinate of the starting point after rotation
  var xx2 = x2 * cosAlpha - z2 * sinAlpha;                 // x-coordinate of the endpoint after rotation
  var zz2 = x2 * sinAlpha + z2 * cosAlpha;                 // z-coordinate of the endpoint after rotation
  var u1 = screenU(xx1, y1), v1 = screenV(xx1, y1, zz1);   // Screen coordinates of the starting point
  var u2 = screenU(xx2, y2), v2 = screenV(xx2, y2, zz2);   // Screen coordinates of the endpoint
  arrow(u1, v1, u2, v2, THICK);                            // Draw the arrow
}

// Arrow on an existing connection line (version for non-moving parts):
// (x1, y1, z1) ... Spatial position of the first point
// (x2, y2, z2) ... Spatial position of the second point
// q ............ Fraction
// d ............ Flag for an arrow from the first to the second point

function arrowLine(x1, y1, z1, x2, y2, z2, q, d) {
  var u1 = screenU(x1, y1), v1 = screenV(x1, y1, z1);      // Screen coordinates of the first point
  var u2 = screenU(x2, y2), v2 = screenV(x2, y2, z2);      // Screen coordinates of the second point
  var du = u2 - u1, dv = v2 - v1;                          // Connection vector
  if (d) arrow(u1, v1, u1 + q * du, v1 + q * dv, THICK);   // Either arrow from the first point to the second...
  else arrow(u2, v2, u2 - q * du, v2 - q * dv, THICK);     // ...or arrow from the second point to the first
}

// Arrow on an existing connection line (version for rotating parts):
// (x1, y1, z1) ... Spatial position of the first point
// (x2, y2, z2) ... Spatial position of the second point
// q ............ Fraction
// d ............ Flag for an arrow from the first to the second point

function arrowLineRot(x1, y1, z1, x2, y2, z2, q, d) {
  var xx1 = x1 * cosAlpha - z1 * sinAlpha;                 // x-coordinate of the first point after rotation
  var zz1 = x1 * sinAlpha + z1 * cosAlpha;                 // z-coordinate of the first point after rotation
  var xx2 = x2 * cosAlpha - z2 * sinAlpha;                 // x-coordinate of the second point after rotation
  var zz2 = x2 * sinAlpha + z2 * cosAlpha;                 // z-coordinate of the second point after rotation
  arrowLine(xx1, y1, zz1, xx2, y2, zz2, q, d);             // Draw the arrow
}

// Draw a polygon:
// p ... Array with coordinates of the corners
// c ... Fill color

function drawPolygon(p, c) {
  newPath();                                               // New path (default values)
  ctx.fillStyle = c;                                       // Fill color
  ctx.moveTo(p[0].u, p[0].v);                              // Move to the first corner
  for (var i = 1; i < p.length; i++)                       // For all other corners...
    ctx.lineTo(p[i].u, p[i].v);                            // Add line to the path
  ctx.closePath();                                         // Close the path
  ctx.fill(); ctx.stroke();                                // Fill the polygon and draw the border
}

// Connection line between two points:
// (u1, v1), (u2, v2) ... Screen coordinates of the endpoints

function line(u1, v1, u2, v2) {
  newPath();                                               // New path (default values)
  ctx.moveTo(u1, v1); ctx.lineTo(u2, v2);                  // Prepare the line
  ctx.stroke();                                            // Draw the line
}

// Connection line from an inner point of a polygon to one of its corners:
// (u, v) ... Screen coordinates of the inner point
// p ....... Array of polygon corners
// i ....... Index of the polygon corner

function lineP(u, v, p, i) {
  line(u, v, p[i].u, p[i].v);                              // Draw the line
}

// Filled circle:
// (u, v) ... Center point (pixels)
// r ....... Radius (pixels)
// c ....... Fill color

function circle(u, v, r, c) {
  newPath();                                               // New graphics path (default values)
  ctx.fillStyle = c;                                       // Fill color
  ctx.arc(u, v, r, 0, PI2, true);                          // Prepare the circle
  ctx.fill();                                              // Fill the circle
}

// South pole of the horseshoe magnet (bottom):

function magnetSouth() {
  drawPolygon(pgSouth, colorSouth);                        // Filled polygon
  var u1 = screenU(-XM1, YM2);                             // 1st inner point (left), horizontal screen coordinate
  var v1 = screenV(-XM1, YM2, -ZM1);                       // 1st inner point (left), vertical screen coordinate
  lineP(u1, v1, pgSouth, 5);                               // Line from the 1st inner point to the top-right
  lineP(u1, v1, pgSouth, 7);                               // Line from the 1st inner point to the top
  var u2 = screenU(-XM1, YM1);                             // 2nd inner point (right), horizontal screen coordinate
  var v2 = screenV(-XM1, YM1, -ZM1);                       // 2nd inner point (right), vertical screen coordinate
  lineP(u2, v2, pgSouth, 2);                               // Line from the 2nd inner point to the bottom
  lineP(u2, v2, pgSouth, 4);                               // Line from the 2nd inner point to the top-right
  line(u1, v1, u2, v2);                                    // Line between the two inner points
}

// North pole of the horseshoe magnet (top):

function magnetNorth() {
  drawPolygon(pgNorth, colorNorth);                        // Filled polygon
  var u1 = screenU(-XM1, YM2);                             // 1st inner point (left), horizontal screen coordinate
  var v1 = screenV(-XM1, YM2, ZM1);                        // 1st inner point (left), vertical screen coordinate
  lineP(u1, v1, pgNorth, 1);                               // Line from the 1st inner point to the bottom
  lineP(u1, v1, pgNorth, 3);                               // Line from the 1st inner point to the bottom-right
  var u2 = screenU(-XM1, YM1);                             // 2nd inner point (right), horizontal screen coordinate
  var v2 = screenV(-XM1, YM1, ZM2);                        // 2nd inner point (right), vertical screen coordinate
  lineP(u2, v2, pgNorth, 4);                               // Line from the 2nd inner point to the bottom
  lineP(u2, v2, pgNorth, 6);                               // Line from the 2nd inner point to the top-right
  lineP(u2, v2, pgNorth, 8);                               // Line from the 2nd inner point to the top-left
}

// Color for wire segments (depending on current flow):

function colorCurrent() {
  return (current != 0 ? colorCurrent1 : "#000000");
}

// Half of the armature (with current arrow):
// i = 1: Armature half that is initially at the top
// i = 2: Armature half that is initially at the bottom

function halfArmature(i) {
  var dir = 0;                                             // Direction of the current arrow (-1, 0, or +1)
  var sign = 3 - 2 * i;                                    // Sign of z in the initial position
  if (cosAlpha > 0 && current != 0) dir = direction;       // Current arrow direction if armature half is on top
  if (cosAlpha < 0 && current != 0) dir = -direction;      // Current arrow direction if armature half is at the bottom
  newPath(THICK);                                          // New graphics path
  ctx.strokeStyle = colorCurrent();                        // Line color depending on current flow
  var z1 = sign * ZA1, z2 = sign * ZA2;                    // z-coordinates (inside and outside)
  moveToRot(0, 0, z1);                                     // Starting point at lead
  lineToRot(0, YA1, z1);                                   // Line to rectangle
  lineToRot(0, YA1, z2);                                   // Line outward
  lineToRot(0, YA2, z2);                                   // Line to the back
  lineToRot(0, YA2, 0);                                    // Line back to the rotation axis
  ctx.stroke();                                            // Draw the lines
  if (iArrows && current != 0 && omega > 0)                // If applicable...
    arrowLineRot(0, YA1, z2, 0, YA2, z2, 0.75, sign * dir < 0); // Arrowhead (conventional current direction)
}

// Arrow for motion direction:
// i = 1: Armature half that is initially at the top
// i = 2: Armature half that is initially at the bottom

function movementArrow(i) {
  if (!vArrows || omega <= 0) return;                      // If the arrow is not applicable, exit
  var dir = (3 - 2 * i) * direction;                       // Factor for rotation direction (1 or -1)
  newPath();                                               // New graphics path (default values)
  ctx.strokeStyle = colorMotion;                           // Color for motion
  var y = (YA1 + YA2) / 2;                                 // y-coordinate
  if (i == 1) arrowRot(0, y, ZA2, -40 * dir, y, ZA2);      // Arrow for the first armature half
  if (i == 2) arrowRot(0, y, -ZA2, -40 * dir, y, -ZA2);    // Arrow for the second armature half
}

// Magnetic field lines:
// i1 ... First index
// i2 ... Last index

function fieldLines(i1, i2) {
  if (!cb2.checked) return;                                // If the checkbox is not activated, exit
  ctx.beginPath();                                         // New path
  ctx.lineWidth = THICK;                                   // Line thickness
  ctx.strokeStyle = colorField;                            // Color for magnetic field
  var y0 = (YA2 + YA1) / 2;                                // y-coordinate for the middle field line
  for (i = i1; i <= i2; i++) {                             // For all lines...
    var y1 = y0 + i * 36;                                  // Calculate y-coordinate
    moveTo(0, y1, -ZM1);                                   // Calculate starting point
    lineTo(0, y1, ZM1);                                    // Prepare the line
  }
  ctx.stroke();                                            // Draw the lines
  for (i = i1; i <= i2; i++) {                             // For all lines...
    var y1 = y0 + i * 36;                                  // Calculate y-coordinate
    arrowLine(0, y1, ZM1, 0, y1, -ZM1, 0.25, true);        // Draw upper arrowhead
    arrowLine(0, y1, ZM1, 0, y1, -ZM1, 0.85, true);        // Draw lower arrowhead
  }
}

// Add an elliptical arc to the graphics path:
// (u, v) ... Center point (pixels)
// a, b .... Semi-major and semi-minor axes (pixels)
// delta ... Rotation angle (radians)
// w0 ...... Start angle (radians)
// w1 ...... End angle (radians)

function addEllipticalArc(u, v, a, b, delta, w0, w1) {
  ctx.save();                                              // Save the current graphics context
  ctx.translate(u, v);                                     // Translate
  ctx.rotate(-delta);                                      // Rotate
  ctx.scale(a, b);                                         // Scale
  ctx.arc(0, 0, 1, w0, w1, true);                         // Part of the unit circle (becomes part of the ellipse)
  ctx.restore();                                           // Restore the previous graphics context
}

// Oblique projection of a circular cylinder for the commutator:
// y ... y-coordinate (center point, on the y-axis)
// c ... Fill color

function cylinder(y, c) {
  var u = screenU(0, y + HC), v = screenV(0, y + HC, 0);    // Center point of the rear ellipse
  newPath();                                               // New graphics path (default values)
  ctx.fillStyle = c;                                       // Fill color
  addEllipticalArc(u, v, aEllipse, bEllipse, deltaEllipse, 1.5 * PI, 0.5 * PI);  // Rear half-ellipse (left)
  u = screenU(0, y - HC); v = screenV(0, y - HC, 0);       // Center point of the front ellipse
  ctx.lineTo(u + bEllipse * Math.sin(deltaEllipse), v + bEllipse * Math.cos(deltaEllipse));  // Connecting line
  addEllipticalArc(u, v, aEllipse, bEllipse, deltaEllipse, 0.5 * PI, 1.5 * PI);  // Front half-ellipse (right)
  ctx.closePath();                                         // Back to the starting point
  ctx.fill(); ctx.stroke();                                // Fill the area and draw the border
  newPath();                                               // New graphics path (default values)
  addEllipticalArc(u, v, aEllipse, bEllipse, deltaEllipse, 0, PI2);  // Front ellipse
  ctx.stroke();                                            // Draw the border of the front ellipse
}

// Oblique projection of a hollow cylinder for slip rings:
// y ... y-coordinate (center point, on the y-axis)
// c ... Fill color

function ring(y, c) {
  var u0 = screenU(0, y + HC), v0 = screenV(0, y + HC, 0); // Center point of the rear ellipse
  newPath();                                               // New graphics path (default values)
  ctx.fillStyle = c;                                       // Fill color (outer surface)
  addEllipticalArc(u0, v0, aEllipse, bEllipse, deltaEllipse, 1.5 * PI, 0.5 * PI);   // Rear half-ellipse (outer, left)
  var u1 = screenU(0, y - HC), v1 = screenV(0, y - HC, 0); // Center point of the front ellipse
  ctx.lineTo(u1 + bEllipse * Math.sin(deltaEllipse), v1 + bEllipse * Math.cos(deltaEllipse)); // Connecting line
  addEllipticalArc(u1, v1, aEllipse, bEllipse, deltaEllipse, 0.5 * PI, 1.5 * PI);   // Front half-ellipse (outer, right)
  ctx.lineTo(u0 - bEllipse * Math.sin(deltaEllipse), v0 - bEllipse * Math.cos(deltaEllipse)); // Connecting line
  ctx.moveTo(u1 - 0.75 * aEllipse * Math.cos(deltaEllipse), v1 + 0.75 * aEllipse * Math.sin(deltaEllipse)); // Starting point
  addEllipticalArc(u1, v1, -0.75 * aEllipse, 0.75 * bEllipse, deltaEllipse, 0, PI2); // Front ellipse (inner)
  ctx.fill(); ctx.stroke();                                // Fill the ring and draw the border
  newPath();                                               // New graphics path (default values)
  ctx.fillStyle = colorCurrent3;                           // Fill color (inner surface)
  addEllipticalArc(u1, v1, 0.75 * aEllipse, 0.75 * bEllipse, deltaEllipse, 0.5 * PI, 1.5 * PI); // Front half-ellipse (inner, front)
  addEllipticalArc(u0, v0, -0.75 * aEllipse, 0.75 * bEllipse, deltaEllipse, 1.45 * PI, 0.55 * PI); // Rear elliptical arc (inner)
  ctx.fill(); ctx.stroke();                                // Fill the surface and draw the border
  newPath();                                               // New graphics path (default values)
  addEllipticalArc(u1, v1, aEllipse, bEllipse, deltaEllipse, 0, PI2); // Front ellipse (outer)
  ctx.stroke();                                            // Draw the border of the front ellipse
}

// Marker for slip ring:
// y ... y-coordinate of the front surface

function mark(y) {
  var r = 0.87 * (ZC1 - HC);                               // Radius
  var x = -r * sinAlpha, z = r * cosAlpha;                 // Spatial coordinates
  var uM = screenU(x, y), vM = screenV(x, y, z);           // Screen coordinates
  circle(uM, vM, 2, "#ffffff");                            // Marker (white circle)
}

// Left (rear) slip ring for AC generator:

function leftRing() {
  if (sinAlpha > 0)                                        // If the lead is in the left half...
    lineRot(0, YC1, ZA1, 0, YC1, 0.75 * (ZC1 - HC), colorCurrent1, 2); // Short wire segment to the inner surface
  ring(YC1, colorCurrent2);                                // Oblique projection of the hollow cylinder
  mark(YC1 - HC);                                          // Marker (white circle)
  if (sinAlpha < 0)                                        // If the lead is in the right half...
    lineRot(0, YC1, ZA1, 0, YC1, 0.75 * (ZC1 - HC), colorCurrent1, 2); // Short wire segment to the inner surface
  if (!genDC)                                              // If it is an AC generator...
    lineRot(0, YC1, -ZA1, 0, YC2, -ZA1, colorCurrent1, 2); // Extend the lead for the right slip ring
}

// Right (front) slip ring for AC generator:

function rightRing() {
  lineRot(0, YC2, -ZA1, 0, YC2, 0.75 * (-ZC1 + HC), colorCurrent1, 2); // Short wire segment to the inner surface
  ring(YC2, colorCurrent2);                                  // Oblique projection of the hollow cylinder
  mark(YC2 - HC);                                            // Marker (white circle)
  if (sinAlpha > 0)                                          // If the lead is in the right half...
    lineRot(0, YC2, -ZA1, 0, YC2, 0.75 * (-ZC1 + HC), colorCurrent1, 2); // Short wire segment to the inner surface
}

// Commutator:

function commutator() {
  var color = (current != 0 ? colorCurrent2 : colorContact); // Color for the circular cylinder
  cylinder(YC1, color);                                     // Oblique projection of the circular cylinder

  // The insulation layer is approximated by two polygons, one on the front face (pgInsulator1)
  // and one on the lateral surface (pgInsulator2).

  var dw = INSMAX / 5;                                      // Angle for polygon corners (radians)
  var r = ZC1 - HC;                                         // Radius
  for (i = 0; i < 20; i++) {                                // For all polygon corners (front face)...
    var w = (i < 10 ? (i - 5) * dw : (i - 15) * dw + PI);   // Calculate angle
    var xx = r * Math.cos(w);                               // Calculate x-coordinate of the polygon corner
    var zz = r * Math.sin(w);                               // Calculate z-coordinate of the polygon corner
    setPointRot(pgInsulator1, i, xx, -HC, zz);              // Save screen coordinates of the corner
  }

  // The variable `seite` determines which side of the commutator is visible.
  var seite = c1 * cosAlpha + c3 * sinAlpha;                // Dot product
  for (i = 0; i < 10; i++) {                                // For the first 10 polygon corners (lateral surface)...
    var w = (i - 5) * dw;                                   // Calculate angle
    if (seite > 0) w += PI;                                 // If the wrong side, add pi
    var xx = r * Math.cos(w);                               // Calculate x-coordinate of the polygon corner
    var zz = r * Math.sin(w);                               // Calculate z-coordinate of the polygon corner
    setPointRot(pgInsulator2, i, xx, -HC, zz);              // Save screen coordinates for the front side corner
    setPointRot(pgInsulator2, 19 - i, xx, HC, zz);          // Save screen coordinates for the rear side corner
  }

  drawPolygon(pgInsulator1, colorInsulator);                // Draw the polygon on the front face
  drawPolygon(pgInsulator2, colorInsulator);                // Draw the polygon on the lateral surface
}

// Hand crank:
// y ... y-coordinate (center point of the crank disc, on the y-axis)

function crank(y) {
  cylinder(y, colorCrank);                                  // Crank disc
  var r = 24;                                              // Distance from center to crank handle
  var x = -r * sinAlpha, z = r * cosAlpha;                 // Spatial coordinates of the crank handle
  var u0 = screenU(x, y - HC), v0 = screenV(x, y - HC, z); // Screen coordinates of the crank handle
  newPath();                                               // New graphics path (default values)
  ctx.fillStyle = colorCrank;                              // Fill color
  var a = aEllipse / 12, b = bEllipse / 12;                // Semi-major and semi-minor axes for the crank handle
  addEllipticalArc(u0, v0, a, b, deltaEllipse, 1.5 * PI, 0.5 * PI);  // Rear half-ellipse (left)
  var u1 = screenU(x, y - 36), v1 = screenV(x, y - 36, z); // Center point of the front ellipse
  ctx.lineTo(u1 + b * Math.sin(deltaEllipse), v1 + b * Math.cos(deltaEllipse)); // Connecting line
  addEllipticalArc(u1, v1, a, b, deltaEllipse, 0.5 * PI, 1.5 * PI);  // Front half-ellipse (right)
  ctx.closePath();                                         // Back to the starting point
  ctx.fill(); ctx.stroke();                                // Fill the area and draw the border
  newPath();                                               // New graphics path (default values)
  addEllipticalArc(u1, v1, a, b, deltaEllipse, 0, PI2);    // Front ellipse
  ctx.stroke();                                            // Draw the border of the front ellipse
}

// Draw contact:
// pg ... Polygon
// pt ... Inner point

function contact(pg, pt) {
  var col = (current != 0 ? colorCurrent2 : colorContact);   // Color (with or without current)
  drawPolygon(pg, col);                                      // Filled polygon with border
  var u = pt.u, v = pt.v;                                    // Inner point
  lineP(u, v, pg, 1);                                        // Line from the inner point to the bottom
  lineP(u, v, pg, 3);                                        // Line from the inner point to the top-right
  lineP(u, v, pg, 5);                                        // Line from the inner point to the top-left
}

// Voltmeter (with leads and current arrows):
// rv ... Relative voltage (between -1 and +1)

function voltmeter(rv) {
  drawPolygon(pgVoltmeter1, colorVoltmeter);                   // Polygon for the case
  var u = pointVoltmeter.u, v = pointVoltmeter.v;            // Inner point
  lineP(u, v, pgVoltmeter1, 1);                              // Line from the inner point to the bottom
  lineP(u, v, pgVoltmeter1, 3);                              // Line from the inner point to the top-right
  lineP(u, v, pgVoltmeter1, 5);                              // Line from the inner point to the top-left
  drawPolygon(pgVoltmeter2, "#ffffff");                      // Parallelogram for the scale
  newPath(THICK);                                            // New graphics path for the needle
  var x0 = (XW2 + XW3) / 2;                                  // x-coordinate of the middle position
  var wMax = 0.36;                                           // Maximum deflection angle (radians)
  var w = wMax * rv;                                         // Current deflection angle (radians)
  moveTo(x0, YW2, ZW1);                                      // Starting point of the needle (bottom)
  lineTo(x0 + 125 * Math.sin(w), YW2, ZW1 + 125 * Math.cos(w)); // End point of the needle (top)
  ctx.stroke();                                              // Draw the needle
  drawPolygon(pgVoltmeter3, colorVoltmeter);                   // Refill the lower part to partially cover the needle
  u = screenU(XW2, YW2); v = screenV(XW2, YW2, ZW1);         // Screen coordinates of the left socket (pixels)
  circle(u, v, 3, "#000000");                                // Left socket
  u = screenU(XW3, YW2); v = screenV(XW3, YW2, ZW1);         // Screen coordinates of the right socket (pixels)
  circle(u, v, 3, "#000000");                                // Right socket
  newPath(THICK);                                            // New graphics path for leads
  ctx.strokeStyle = colorCurrent();                          // Line color depends on current flow
  moveTo(XW2, YW2, ZW1);                                     // Starting point (left socket)
  lineTo(XW2, YW3, ZW1);                                     // Continue upward toward the viewer
  lineTo(XC1, YW3, ZW1);                                     // Continue left
  moveTo(XW3, YW2, ZW1);                                     // New starting point (right socket)
  lineTo(XW3, YW3, ZW1);                                     // Continue upward toward the viewer
  lineTo(XW4, YW3, ZW1);                                     // Continue right
  ctx.stroke();                                              // Draw the leads
  if (iArrows && current != 0)                               // If applicable...
    arrowLine(XC1, YW3, ZW1, XW2, YW3, ZW1, 0.6 + current * 0.3, current < 0); // Arrowhead for current direction
  newPath(3);                                                // New graphics path for symbols
  moveTo(XW2 - 8, YW2, ZW1 + 15);                            // Starting point (left end of the minus sign)
  lineTo(XW2 + 8, YW2, ZW1 + 15);                            // Continue to the right end of the minus sign
  moveTo(XW3 - 8, YW2, ZW1 + 15);                            // Starting point (left end of the plus sign)
  lineTo(XW3 + 8, YW2, ZW1 + 15);                            // Continue to the right end of the plus sign
  moveTo(XW3, YW2, ZW1 + 23);                                // Starting point (top end of the plus sign)
  lineTo(XW3, YW2, ZW1 + 7);                                 // Continue to the bottom end of the plus sign
  moveTo(x0 - 7, YW2, ZW1 + 23);                             // Starting point (left top end of 'V')
  lineTo(x0, YW2, ZW1 + 5);                                  // Continue to the bottom of the 'V'
  lineTo(x0 + 7, YW2, ZW1 + 23);                             // Continue to the right top end of the 'V'
  ctx.stroke();                                              // Draw the symbols '-', '+', and 'V'
  newPath(2);                                                // New graphics path for the scale
  for (var i = -2; i <= 2; i++) {                            // For all scale marks...
    if (i == 0) continue;                                    // Skip the middle position
    w = i * wMax / 2;                                        // Angle (radians)
    var sin = Math.sin(w), cos = Math.cos(w);                // Trigonometric values
    moveTo(x0 + 130 * sin, YW2, ZW1 + 130 * cos);            // Starting point (bottom)
    lineTo(x0 + 140 * sin, YW2, ZW1 + 140 * cos);            // Continue to the end point (top)
  }
  ctx.stroke();                                              // Draw the scale marks
  ctx.fillStyle = "#000000";                                 // Text color
  ctx.textAlign = "center";                                  // Text alignment
  ctx.fillText("0", screenU(x0, YW2), screenV(x0, YW2, ZW1 + 130));  // Zero mark
}

// Wires from the upper contact toward the right socket of the measuring device:

function wires1() {
  newPath(THICK);                                          // New graphics path
  ctx.strokeStyle = colorCurrent();                        // Line color depends on current flow
  moveTo(0, YW1, ZC1 + HC);                                // Starting point (top of the upper contact)
  lineTo(0, YW1, ZW2);                                     // Continue upward
  lineTo(XW1, YW1, ZW2);                                   // Continue right (toward the measuring device)
  lineTo(XW1, YW1, ZW1);                                   // Continue downward
  lineTo(XW4, YW1, ZW1);                                   // Continue right (behind the measuring device)
  lineTo(XW4, YW3, ZW1);                                   // Continue toward the viewer (right of the measuring device)
  ctx.stroke();                                            // Draw the wires
  if (iArrows && current != 0)                             // If applicable...
    arrowLine(0, YW1, ZW2, XW1, YW1, ZW2, 0.5, current > 0); // Arrowhead for current direction
}

// Wires from the lower contact toward the left socket of the measuring device:

function wires2() {
  newPath(THICK);                                          // New graphics path
  ctx.strokeStyle = colorCurrent();                        // Line color depends on current flow
  var y = (genDC ? YC1 : YC2);                             // y-coordinate of the lower contact
  moveTo(XC1, y, -ZC1 - HC);                               // Starting point (bottom of the lower contact)
  lineTo(XC1, y, ZW1);                                     // Continue downward
  lineTo(XC1, YW3, ZW1);                                   // Continue toward the measuring device (left socket)
  ctx.stroke();                                            // Draw the wires
}

// Resistor (consumer) with leads:

function resistor() {
  var c = colorCurrent();                                  // Color depends on current flow
  var uR = screenU(XW1, YC1), vR = screenV(XW1, YC1, ZW1); // Screen coordinates for the right node
  circle(uR, vR, 3, c);                                    // Right node
  newPath(THICK);                                          // New graphics path
  ctx.strokeStyle = c;                                     // Line color
  moveTo(XR2, YC1, ZW1);                                   // Starting point (right end of the resistor)
  lineTo(XW1, YC1, ZW1);                                   // Continue to the right node
  ctx.stroke();                                            // Draw the right lead
  newPath();                                               // New graphics path
  ctx.fillStyle = colorResistor;                           // Color for the resistor
  var u0 = screenU(XR1, YC1), v0 = screenV(XR1, YC1, ZW1); // Screen coordinates for the left end of the resistor
  var d = 100 * DEG;                                       // Rotation angle (radians)
  addEllipticalArc(u0, v0, 10, 8, d, 0, PI);               // Left half-ellipse
  var u1 = screenU(XR2, YC1), v1 = screenV(XR2, YC1, ZW1); // Screen coordinates for the right end of the resistor
  addEllipticalArc(u1, v1, 10, 8, d, PI, 0);               // Right half-ellipse
  ctx.closePath();                                         // Close the graphics path
  ctx.fill(); ctx.stroke();                                // Fill the area and draw the border
  newPath();                                               // New graphics path
  addEllipticalArc(u0, v0, 10, 8, d, 0, PI2);              // Complete ellipse (left)
  ctx.stroke();                                            // Draw the ellipse
  ctx.fillStyle = "#000000";                               // Text color
  ctx.textAlign = "center";                                // Text alignment
  ctx.fillText(symbolResistor, 0.4 * u0 + 0.6 * u1, 0.4 * v0 + 0.6 * v1 + 4); // Draw the resistor symbol
  var y = (genDC ? YC1 : YC2);                             // y-coordinate of the left node
  var uL = screenU(0, y), vL = screenV(0, y, ZW1);         // Screen coordinates for the left node
  circle(uL, vL, 3, c);                                    // Left node
  newPath(THICK);                                          // New graphics path
  ctx.strokeStyle = c;                                     // Line color
  moveTo(0, y, ZW1);                                       // Starting point (left node)
  lineTo(0, YC1, ZW1);                                     // Wire toward the resistor (for AC generator only)
  lineTo(XR1, YC1, ZW1);                                   // Continue to the left end of the resistor
  ctx.stroke();                                            // Draw the left lead
}

// Helper function:
// du ... Screen coordinate relative to the origin (pixels)
// f1 ... Factor for the time axis
// f2 ... Factor for the voltage axis
// Return value: Screen coordinate relative to the origin (pixels, positive upwards)

function dvDiagram(du, f1, f2) {
  var dv = f2 * Math.cos(du * f1);                         // Screen coordinate relative to the origin (pixels)
  if (genDC) dv = Math.abs(dv);                            // If commutator is used, take the absolute value
  return direction * dv;                                   // Return value (sign depends on rotation direction)
}

function dfluxDiagram(du, f1, f2) {
  var dv = 5 * Math.sin(du * f1);                         // Screen coordinate relative to the origin (pixels)
  if (genDC) dv = Math.abs(dv);                            // If commutator is used, take the absolute value
  return direction * dv;                                   // Return value (sign depends on rotation direction)
}

// Diagram:
// (u, v) ... Origin (pixels)

function diagram(u, v) {
  newPath();                                               // New graphics path (default values)
  arrow(u - 10, v, u + 215, v);                            // Horizontal axis (time t)
  var pixT = 4;                                            // Conversion factor (pixels per second)
  for (var i = 1; i <= 5; i++) {                           // For all ticks on the t-axis (spaced 10 seconds apart)...
    var uT = u + i * 10 * pixT;                            // Horizontal screen coordinate (pixels)
    line(uT, v - 3, uT, v + 3);                            // Draw the tick
  }
  ctx.fillStyle = "#000000";                               // Text color: black
  ctx.textAlign = "center";                                // Text alignment: centered
  ctx.fillText(symbolTime, u + 210, v + 15);               // Label the t-axis
  arrow(u, v + 45, u, v - 45);                             // Vertical axis (voltage U)
  for (i = -2; i <= 2; i++) {                              // For all ticks on the U-axis...
    var vT = v + i * 15;                                   // Vertical screen coordinate (pixels)
    line(u - 3, vT, u + 3, vT);                            // Draw the tick
  }
  ctx.textAlign = "right";                                 // Text alignment: right-aligned
  ctx.fillText("Induced emf ɛ", u - 5, v - 35);              // Label the U-axis
  var a = 75 * omega / PI;                                 // Amplitude (pixels)
  var f1 = omega / pixT;                                   // Factor for the time axis
  newPath();                                               // New graphics path (default values)
  ctx.moveTo(u, v - direction * a);                        // Starting point of the polyline
  var uu = u;                                              // Horizontal screen coordinate
  while (uu < u + 200) {                                   // While the right edge is not yet reached...
    uu += 0.5;                                             // Increase the horizontal screen coordinate
    var vv = v - dvDiagram(uu - u, f1, a);                 // Vertical screen coordinate
    ctx.lineTo(uu, vv);                                    // Prepare the line of the polyline
  }
  ctx.stroke();                                            // Draw the polyline (approximation of the curve)
  var u0 = u + t * pixT;                                   // Horizontal screen coordinate for the current time
  var v0 = v - dvDiagram(u0 - u, f1, a);                   // Vertical screen coordinate for the current voltage
  circle(u0, v0, 2.5, colorVoltage);                       // Marker for the current values
}

function diagram2(u, v) {
  newPath();                                               // New graphics path (default values)
  arrow(u - 10, v, u + 215, v);                            // Horizontal axis (time t)
  var pixT = 4;                                            // Conversion factor (pixels per second)
  for (var i = 1; i <= 5; i++) {                           // For all ticks on the t-axis (spaced 10 seconds apart)...
    var uT = u + i * 10 * pixT;                            // Horizontal screen coordinate (pixels)
    line(uT, v - 3, uT, v + 3);                            // Draw the tick
  }
  ctx.fillStyle = "#000000";                               // Text color: black
  ctx.textAlign = "center";                                // Text alignment: centered
  ctx.fillText(symbolTime, u + 210, v + 15);               // Label the t-axis
  arrow(u, v + 45, u, v - 45);                             // Vertical axis (voltage U)
  for (i = -2; i <= 2; i++) {                              // For all ticks on the U-axis...
    var vT = v + i * 15;                                   // Vertical screen coordinate (pixels)
    line(u - 3, vT, u + 3, vT);                            // Draw the tick
  }
  ctx.textAlign = "right";                                 // Text alignment: right-aligned
  ctx.fillText("Magnetic flux φ", u - 5, v - 35);              // Label the U-axis
  var a = 75 * omega / PI;                                 // Amplitude (pixels)
  var f1 = omega / pixT;                                   // Factor for the time axis
  newPath();                                               // New graphics path (default values)
  ctx.moveTo(u, v - direction * a);                        // Starting point of the polyline
  var uu = u;                                              // Horizontal screen coordinate
  while (uu < u + 200) {                                   // While the right edge is not yet reached...
    uu += 0.5;                                             // Increase the horizontal screen coordinate
    var vv = v - dfluxDiagram(uu - u, f1, a);                 // Vertical screen coordinate
    ctx.lineTo(uu, vv);                                    // Prepare the line of the polyline
  }
  ctx.stroke();                                            // Draw the polyline (approximation of the curve)
  var u0 = u + t * pixT;                                   // Horizontal screen coordinate for the current time
  var v0 = v - dfluxDiagram(u0 - u, f1, a);                   // Vertical screen coordinate for the current voltage
  circle(u0, v0, 2.5, colorFlux);                       // Marker for the current values
}

// Graphics rendering:
// Side effects: current, t, t0, alpha, cosAlpha, sinAlpha, current...

function paint() {
  ctx.fillStyle = colorBackground;                         // Background color
  ctx.fillRect(0, 0, width, height);                       // Fill the background
  ctx.font = FONT;                                         // Set the font
  current = 0;                                             // Direction of induced current, preliminary value
  if (cosAlpha > 0) current = 1;                           // Current direction if the marker is on top
  else if (cosAlpha < 0) current = -1;                     // Current direction if the marker is at the bottom
  if (genDC) current = Math.abs(current);                  // If DC generator, take the absolute value
  current *= direction;                                    // Adjust current direction based on rotation direction

  if (on && omega > 0) {                                   // If in motion...
    var t1 = new Date();                                   // Current time
    var dt = (t1 - t0) / 1000;                             // Elapsed time (seconds)
    t += dt;                                               // Update the time variable
    t0 = t1;                                               // Set the new reference time
    alpha += direction * omega * dt;                      // Update the rotation angle
    var n = Math.floor(alpha / PI2);                       // Number of full rotations
    if (alpha >= 0) alpha -= n * PI2;                      // If alpha is positive, ensure alpha < 2 * pi
    else alpha -= (n - 1) * PI2;                           // If alpha is negative, ensure alpha >= 0
    if (omega > 0 && t > nPer * PI2 / omega)               // If time variable is too large...
      t -= nPer * PI2 / omega;                             // Reduce t
    cosAlpha = Math.cos(alpha);                            // Update cosine value
    sinAlpha = Math.sin(alpha);                            // Update sine value
  }

  var dw = (genDC ? 0.05 : 0);                             // Tolerance for sinAlpha due to insulation layer
  if (Math.abs(sinAlpha) > 1 - dw) current = 0;            // No current when insulation layer contacts

  magnetSouth();                                           // Draw the south pole of the horseshoe magnet
  var qu = Math.floor(alpha / PIH);                        // Quadrant (0 to 3) for counterclockwise rotation
  if (direction == -1) qu = (qu % 2 == 0 ? qu + 1 : qu - 1); // Quadrant (0 to 3) for clockwise rotation
  switch (qu) {                                            // Depending on the quadrant (mutual obstructions!)...
    case 0:
      movementArrow(2);                                    // Rear motion direction arrow
      halfArmature(2);                                     // Rear armature half
      fieldLines(-2, 2);                                   // All field lines
      halfArmature(1);                                     // Front armature half
      movementArrow(1); break;                             // Front motion direction arrow
    case 1:
      fieldLines(2, 2);                                    // Field line far left
      halfArmature(2);                                     // Rear armature half
      fieldLines(0, 1);                                    // Field lines half-left and center
      movementArrow(2);                                    // Rear motion direction arrow
      movementArrow(1);                                    // Front motion direction arrow
      fieldLines(-2, -1);                                  // Field lines half-right and far right
      halfArmature(1); break;                              // Front armature half
    case 2:
      movementArrow(1);                                    // Rear motion direction arrow
      halfArmature(1);                                     // Rear armature half
      fieldLines(-2, 2);                                   // All field lines
      halfArmature(2);                                     // Front armature half
      movementArrow(2); break;                             // Front motion direction arrow
    case 3:
      fieldLines(2, 2);                                    // Field line far left
      halfArmature(1);                                     // Rear armature half
      fieldLines(0, 1);                                    // Field lines half-left and center
      movementArrow(1);                                    // Rear motion direction arrow
      movementArrow(2);                                    // Front motion direction arrow
      fieldLines(-2, -1);                                  // Field lines half-right and far right
      halfArmature(2); break;                              // Front armature half
  }
  magnetNorth();                                           // Draw the north pole of the horseshoe magnet
  wires2();                                                // Draw wires to the left socket of the voltmeter
  if (genDC) {                                             // If DC generator (with commutator)...
    contact(pgContact2, pointContact2);                    // Lower slip contact
    commutator();                                          // Commutator
    contact(pgContact1, pointContact1);                    // Upper slip contact
    resistor();                                            // Resistor
    wires1();                                              // Draw wires to the right socket of the voltmeter
    crank(YC3);                                            // Hand crank
    voltmeter(direction * 5 * omega * Math.abs(cosAlpha) / PI2); // Voltmeter
  } else {                                                 // If AC generator (without commutator)...
    contact(pgContact3, pointContact3);                    // Lower slip contact
    leftRing(); rightRing();                               // Slip rings
    contact(pgContact1, pointContact1);                    // Upper slip contact
    resistor();                                            // Resistor
    wires1();                                              // Draw wires to the right socket of the voltmeter
    crank(YC4);                                            // Hand crank
    voltmeter(direction * 5 * omega * cosAlpha / PI2);     // Voltmeter
  }
  diagram2(360, 65);                                        // Flux vs. time diagram
  diagram(360, 165);                                        // Voltage vs. time diagram
}

document.addEventListener("DOMContentLoaded", start, false); // Call the start method after the page loads
