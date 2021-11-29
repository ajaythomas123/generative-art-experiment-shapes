const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const DIRECTIONS = {
  T: "top",
  R: "right",
  B: "bottom",
  L: "left",
  TL: "topLeft",
  TR: "topRight",
  BL: "bottomLeft",
  BR: "bottomRight",
};

const CORNERS_POSITIONS = [DIRECTIONS.TL, DIRECTIONS.TR, DIRECTIONS.BL, DIRECTIONS.BR];

/** START - Randomization functions */
function generateRandomColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

function randomIntFromInterval(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function generateRandomCornerPosition() {
  return CORNERS_POSITIONS[randomIntFromInterval(0, 3)];
}

/** END - Randomization functions */

/** START - Drawing functions */
function generateCircle(ctx, radius, center, color = "#000000") {
  ctx.beginPath();
  ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.stroke();
  ctx.fill();
}

function generateArc(ctx, radius, center, position, color = '#000000') {
  ctx.beginPath();
  let startAngle;
  let endAngle;
  switch (position) {
    case DIRECTIONS.TR:
      startAngle = 1.5 * Math.PI;
      endAngle = Math.PI;
      break;
    case DIRECTIONS.BL:
      startAngle = 0.5 * Math.PI;
      endAngle = 0;
      break;
    case DIRECTIONS.BR:
      startAngle = Math.PI;
      endAngle = 0.5 * Math.PI;
      break;
    default:
    case DIRECTIONS.TL:
      startAngle = 0;
      endAngle = 1.5 * Math.PI;
      break;
  }
  ctx.arc(center.x, center.y, radius, startAngle, endAngle);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.stroke();
  ctx.fill();
}

function generateTriangle(ctx, corners, color = "#000000") {
  ctx.beginPath();
  ctx.moveTo(corners[0].x, corners[0].y);
  ctx.lineTo(corners[1].x, corners[1].y);
  ctx.lineTo(corners[2].x, corners[2].y);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.stroke();
  ctx.fill();
}

/** END - Drawing functions */

/** START - Computation functions */

function generateTriangleCorners(side, tlCorner, rightAngleCornerPosition) {
  const { x, y } = tlCorner;
  switch (rightAngleCornerPosition) {
    case DIRECTIONS.TR:
      return [{ x: x + side, y }, { x: x + side, y: y + side }, { x, y }];
    case DIRECTIONS.BL:
      return [{ x, y: y + side }, { x: x, y: y }, { x: x + side, y: y + side }];
    case DIRECTIONS.BR:
      return [{ x: x + side, y: y + side }, { x: x + side, y }, { x, y: y + side }];
    case DIRECTIONS.TL:
    default:
      return [{ x, y }, { x, y: y + side }, { x: x + side, y }];
  }
}

function getAdjacentCoordinate(distance, coordinates, direction) {
  const { T, R, B, L, TL, TR, BL, BR } = DIRECTIONS;
  let { x, y } = coordinates;
  switch (direction) {
    case T:
      y -= distance + 1;
      break;
    case R:
      x += distance + 1;
      break;
    case B:
      y += distance + 1;
      break;
    case L:
      x -= distance + 1;
      break;
    case TL:
      x -= distance + 1;
      y -= distance + 1;
      break;
    case TR:
      x += distance + 1;
      y -= distance + 1;
      break;
    case BL:
      x -= distance + 1;
      y += distance + 1;
      break;
    case BR:
      x += distance + 1;
      y += distance + 1;
      break;
    default:
      break;
  }
  return { x, y };
}

function getSquareCenter(side, tlCorner) {
  console.log(tlCorner, side)
  return {
    x: tlCorner.x + side / 2,
    y: tlCorner.y + side / 2,
  };
}

/** END - Computation functions */

/** START - Shape classes */

class Circle {
  constructor(ctx, work, diameter, corner) {
    const previousWork = work || [];
    this.ctx = ctx;
    this.radius = diameter / 2;
    this.corner = corner;
    this.work = [...previousWork, this];
  }

  getTop = () => {
    const newCorner = getAdjacentCoordinate(
      2 * this.radius,
      this.corner,
      DIRECTIONS.T
    );
    return new Circle(this.ctx, this.work, this.radius, newCorner);
  };

  getRight = () => {
    const newCorner = getAdjacentCoordinate(
      2 * this.radius,
      this.corner,
      DIRECTIONS.R
    );
    return new Circle(this.ctx, this.work, this.radius, newCorner);
  };

  getBottom = () => {
    const newCorner = getAdjacentCoordinate(
      2 * this.radius,
      this.corner,
      DIRECTIONS.B
    );
    return new Circle(this.ctx, this.work, this.radius, newCorner);
  };

  getLeft = () => {
    const newCorner = getAdjacentCoordinate(
      2 * this.radius,
      this.corner,
      DIRECTIONS.L
    );
    return new Circle(this.ctx, this.work, this.radius, newCorner);
  };

  render = (draw) => {
    const center = getSquareCenter(2 * this.radius, this.corner);
    if (draw) {
      generateCircle(this.ctx, this.radius, center, generateRandomColor());
    } else {
      this.work.forEach((circle) => circle.render(true));
    }
  };
}

class Triangle {
  constructor(ctx, work, side, corner) {
    const previousWork = work || [];
    this.ctx = ctx;
    this.side = side;
    this.corner = corner;
    this.work = [...previousWork, this];
  }

  render(position) {
    const corners = generateTriangleCorners(this.side, this.corner, position);
    const color = generateRandomColor();
    generateTriangle(this.ctx, corners, color);
  }
}

/** END - Shape classes */


// Write shitty code below this line
const SIDE = 40;
let startCorner = { x: 0, y: 0 };
let corner = startCorner;

const SHAPES = [Circle, Triangle];
const renderLoop = () => {
  for (let i = 0; i < 11; i++) {
    const shapeRandomNumber = randomIntFromInterval(0, 1);
    const shape = SHAPES[shapeRandomNumber];
    let position = generateRandomCornerPosition();
    const instance = new shape(ctx, [], SIDE, corner);
    instance.render(position);
    corner = getAdjacentCoordinate(SIDE, corner, DIRECTIONS.R);
  }
}

renderLoop();
startCorner = getAdjacentCoordinate(SIDE, startCorner, DIRECTIONS.B)
corner = startCorner
renderLoop();
startCorner = getAdjacentCoordinate(SIDE, startCorner, DIRECTIONS.B)
corner = startCorner
renderLoop();
startCorner = getAdjacentCoordinate(SIDE, startCorner, DIRECTIONS.B)
corner = startCorner
renderLoop();
startCorner = getAdjacentCoordinate(SIDE, startCorner, DIRECTIONS.B)
corner = startCorner
renderLoop();
startCorner = getAdjacentCoordinate(SIDE, startCorner, DIRECTIONS.B)
corner = startCorner
renderLoop();
startCorner = getAdjacentCoordinate(SIDE, startCorner, DIRECTIONS.B)
corner = startCorner
renderLoop();
startCorner = getAdjacentCoordinate(SIDE, startCorner, DIRECTIONS.B)
corner = startCorner
renderLoop();
startCorner = getAdjacentCoordinate(SIDE, startCorner, DIRECTIONS.B)
corner = startCorner
renderLoop();
