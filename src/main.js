function setupCanvas(canvas) {
  // Get the device pixel ratio, falling back to 1.
  var dpr = window.devicePixelRatio || 1;
  // Get the size of the canvas in CSS pixels.
  var rect = canvas.getBoundingClientRect();
  // Give the canvas pixel dimensions of their CSS
  // size * the device pixel ratio.
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  var ctx = canvas.getContext("2d");
  // Scale all drawing operations by the dpr, so you
  // don't have to worry about the difference.
  ctx.scale(dpr, dpr);
  return ctx;
}

const canvas = document.getElementById("canvas");
const ctx = setupCanvas(canvas);

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

const GUTTER = 1;

const CORNERS_POSITIONS = [
  DIRECTIONS.TL,
  DIRECTIONS.TR,
  DIRECTIONS.BL,
  DIRECTIONS.BR,
];

/** START - Randomization functions */
function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function generateRandomColor(backgroundColorIndex, colorPaletteIndex) {
  const index = randomIntFromInterval(0, 2);
  return COLOR_PALETTES[colorPaletteIndex].filter(
    (c, i) => i !== backgroundColorIndex
  )[index];
}

function generateRandomCornerPosition() {
  const index = randomIntFromInterval(0, 3);
  return CORNERS_POSITIONS[index];
}

/** END - Randomization functions */

/** START - Drawing functions */
function generateCircle(ctx, radius, center, color = "#000000") {
  ctx.beginPath();
  ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
}

function generateArc(ctx, radius, center, position, color = "#000000") {
  ctx.beginPath();
  let startAngle;
  let endAngle;
  let corners = generateTriangleCorners(radius, center, position);
  switch (position) {
    case DIRECTIONS.TR:
      startAngle = 0.5 * Math.PI;
      endAngle = Math.PI;
      break;
    case DIRECTIONS.BL:
      startAngle = 1.5 * Math.PI;
      endAngle = 2 * Math.PI;
      break;
    case DIRECTIONS.BR:
      startAngle = Math.PI;
      endAngle = 1.5 * Math.PI;
      break;
    default:
    case DIRECTIONS.TL:
      startAngle = 0;
      endAngle = 0.5 * Math.PI;
      break;
  }
  ctx.arc(corners[0].x, corners[0].y, radius, startAngle, endAngle);
  ctx.moveTo(corners[1].x, corners[1].y);
  ctx.lineTo(corners[0].x, corners[0].y);
  ctx.lineTo(corners[2].x, corners[2].y);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
}

function generateTriangle(ctx, corners, color = "#000000") {
  ctx.beginPath();
  ctx.moveTo(corners[0].x, corners[0].y);
  ctx.lineTo(corners[1].x, corners[1].y);
  ctx.lineTo(corners[2].x, corners[2].y);
  ctx.lineTo(corners[0].x, corners[0].y);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
}

/** END - Drawing functions */

/** START - Computation functions */

function generateTriangleCorners(side, tlCorner, rightAngleCornerPosition) {
  const { x, y } = tlCorner;
  /**
   * corner[0] = Right angle corner
   * corner[1] = Corner vertically distant from right angle corner.
   * corner[2] = Corner horizontally distant from right angle corner.
   */
  switch (rightAngleCornerPosition) {
    case DIRECTIONS.TR:
      return [
        { x: x + side, y },
        { x: x + side, y: y + side },
        { x, y },
      ];
    case DIRECTIONS.BL:
      return [
        { x, y: y + side },
        { x: x, y: y },
        { x: x + side, y: y + side },
      ];
    case DIRECTIONS.BR:
      return [
        { x: x + side, y: y + side },
        { x: x + side, y },
        { x, y: y + side },
      ];
    case DIRECTIONS.TL:
    default:
      return [
        { x, y },
        { x, y: y + side },
        { x: x + side, y },
      ];
  }
}

function getAdjacentCoordinate(distance, coordinates, direction) {
  const { T, R, B, L, TL, TR, BL, BR } = DIRECTIONS;
  let { x, y } = coordinates;
  switch (direction) {
    case T:
      y -= distance + GUTTER;
      break;
    case R:
      x += distance + GUTTER;
      break;
    case B:
      y += distance + GUTTER;
      break;
    case L:
      x -= distance + GUTTER;
      break;
    case TL:
      x -= distance + GUTTER;
      y -= distance + GUTTER;
      break;
    case TR:
      x += distance + GUTTER;
      y -= distance + GUTTER;
      break;
    case BL:
      x -= distance + GUTTER;
      y += distance + GUTTER;
      break;
    case BR:
      x += distance + GUTTER;
      y += distance + GUTTER;
      break;
    default:
      break;
  }
  return { x, y };
}

function getSquareCenter(side, tlCorner) {
  return {
    x: tlCorner.x + side / 2,
    y: tlCorner.y + side / 2,
  };
}

/** END - Computation functions */

/** START - Shape classes */

class Circle {
  constructor(ctx, backgroundColorIndex, colorPaletteIndex, diameter, corner) {
    this.ctx = ctx;
    this.colorPaletteIndex = colorPaletteIndex;
    this.backgroundColorIndex = backgroundColorIndex;
    this.radius = diameter / 2;
    this.corner = corner;
  }

  _stroke = () => {
    this.ctx.stroke();
  };

  _fill = () => {
    this.ctx.fill();
  };

  render = (draw) => {
    const center = getSquareCenter(2 * this.radius, this.corner);
    generateCircle(
      this.ctx,
      this.radius,
      center,
      generateRandomColor(this.backgroundColorIndex, this.colorPaletteIndex)
    );
    this._fill();
  };
}

class Arc {
  constructor(ctx, backgroundColorIndex, colorPaletteIndex, side, corner) {
    this.ctx = ctx;
    this.colorPaletteIndex = colorPaletteIndex;
    this.backgroundColorIndex = backgroundColorIndex;
    this.radius = side;
    this.corner = corner;
  }

  _stroke = () => {
    this.ctx.stroke();
  };

  _fill = () => {
    this.ctx.fill();
  };

  render(position) {
    const color = generateRandomColor(
      this.backgroundColorIndex,
      this.colorPaletteIndex
    );
    generateArc(this.ctx, this.radius, this.corner, position, color);
    this._fill();
  }
}

class Triangle {
  constructor(ctx, backgroundColorIndex, colorPaletteIndex, side, corner) {
    this.ctx = ctx;
    this.colorPaletteIndex = colorPaletteIndex;
    this.backgroundColorIndex = backgroundColorIndex;
    this.side = side;
    this.corner = corner;
  }

  _stroke = () => {
    this.ctx.stroke();
  };

  _fill = () => {
    this.ctx.fill();
  };

  render(position) {
    const corners = generateTriangleCorners(this.side, this.corner, position);
    const color = generateRandomColor(
      this.backgroundColorIndex,
      this.colorPaletteIndex
    );
    generateTriangle(this.ctx, corners, color);
    this._fill();
  }
}

const SHAPES = [Circle, Arc, Triangle];

const getRandomShape = () => {
  return SHAPES[randomIntFromInterval(0, SHAPES.length - 1)];
};

/** END - Shape classes */

const SIDE = 20;

const horizontalCount = Math.ceil(canvas.width / SIDE);
const verticalCount = Math.ceil(canvas.height / SIDE);

function generate() {
  let startCorner = { x: 0, y: 0 };
  let corner = startCorner;
  const colorPaletteIndex = randomIntFromInterval(0, COLOR_PALETTES.length - 1);
  const backgroundColorIndex = randomIntFromInterval(0, 3);
  ctx.fillStyle = COLOR_PALETTES[colorPaletteIndex][backgroundColorIndex];
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const renderRow = () => {
    for (let i = 0; i < horizontalCount; i++) {
      const shape = getRandomShape();
      let position = generateRandomCornerPosition();
      const instance = new shape(
        ctx,
        backgroundColorIndex,
        colorPaletteIndex,
        SIDE,
        corner
      );
      instance.render(position);
      corner = getAdjacentCoordinate(SIDE, corner, DIRECTIONS.R);
    }
  };

  const renderRows = () => {
    for (let i = 0; i < verticalCount; i++) {
      renderRow();
      startCorner = getAdjacentCoordinate(SIDE, startCorner, DIRECTIONS.B);
      corner = startCorner;
    }
  };
  renderRows();
}

generate();
canvas.addEventListener("click", generate);
