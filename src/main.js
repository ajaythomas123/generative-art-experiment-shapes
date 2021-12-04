import "./styles.css";
import COLOR_PALETTES from "./colors";
import { DIRECTIONS } from "./constants";
import { getRandomIterator } from './random';
import { Arc, Circle, Triangle } from "./shapes";
const CORNERS_POSITIONS = [
  DIRECTIONS.TL,
  DIRECTIONS.TR,
  DIRECTIONS.BL,
  DIRECTIONS.BR,
];

const SHAPES = [Arc, Circle, Triangle];
const overlay = document.getElementById('overlay');
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
let ctx = setupCanvas(canvas);

function getSeeds() {
  return {
    shape: Math.random() * 2 ** 32,
    colorPalette: Math.random() * 2 ** 32,
    backgroundColor: Math.random() * 2 ** 32,
    shapeColor: Math.random() * 2 ** 32,
    position: Math.random() * 2 ** 32
  };
};

let SEEDS = getSeeds();

function getAdjacentCoordinate(distance, gutter, coordinates, direction) {
  const { T, R, B, L, TL, TR, BL, BR } = DIRECTIONS;
  let { x, y } = coordinates;
  switch (direction) {
    case T:
      y -= distance + gutter;
      break;
    case R:
      x += distance + gutter;
      break;
    case B:
      y += distance + gutter;
      break;
    case L:
      x -= distance + gutter;
      break;
    case TL:
      x -= distance + gutter;
      y -= distance + gutter;
      break;
    case TR:
      x += distance + gutter;
      y -= distance + gutter;
      break;
    case BL:
      x -= distance + gutter;
      y += distance + gutter;
      break;
    case BR:
      x += distance + gutter;
      y += distance + gutter;
      break;
    default:
      break;
  }
  return { x, y };
}



/** END - Computation functions */

const SIDE = 20;
const GUTTER = 1;

function generate(seeds) {
  const horizontalCount = Math.ceil(canvas.width / SIDE);
  const verticalCount = Math.ceil(canvas.height / SIDE);

  const shapeIterator = getRandomIterator(SHAPES, seeds.shape);
  const colorPaletteIterator = getRandomIterator(COLOR_PALETTES, seeds.colorPalette);
  const colorPalette = colorPaletteIterator.next();
  const backgroundColorIterator = getRandomIterator(colorPalette, seeds.backgroundColor);
  const backgroundColor = backgroundColorIterator.next();
  const shapeColors = colorPalette.filter(color => color !== backgroundColor);
  const iterators = {
    color: getRandomIterator(shapeColors, seeds.shapeColor),
    position: getRandomIterator(CORNERS_POSITIONS, seeds.position)
  };

  let startCorner = { x: 0, y: 0 };
  let corner = startCorner;

  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const renderRow = () => {
    for (let i = 0; i < horizontalCount; i++) {
      const shape = shapeIterator.next();
      const instance = new shape(
        ctx,
        iterators,
        SIDE,
        corner
      );
      instance.render();
      corner = getAdjacentCoordinate(SIDE, GUTTER, corner, DIRECTIONS.R);
    }
  };

  const renderRows = () => {
    for (let i = 0; i < verticalCount; i++) {
      renderRow();
      startCorner = getAdjacentCoordinate(SIDE, GUTTER, startCorner, DIRECTIONS.B);
      corner = startCorner;
    }
  };
  renderRows();
}

function hideOverlay() {
  overlay.classList.add('hide');
}

function clickListener() {
  hideOverlay();
  SEEDS = getSeeds();
  requestAnimationFrame(() => {
    generate(SEEDS);
  });
}

function keyListener(e) {
  if (e.code === "Space") {
    hideOverlay();
    SEEDS = getSeeds();
    requestAnimationFrame(() => {
      generate(SEEDS);
    });
  }
}

function resizeListener() {
  ctx = setupCanvas(canvas);
  generate(SEEDS);
}

generate(SEEDS);

canvas.addEventListener('click', clickListener);
overlay.addEventListener('click', clickListener);
document.addEventListener('keypress', keyListener);
window.addEventListener("resize", resizeListener);
