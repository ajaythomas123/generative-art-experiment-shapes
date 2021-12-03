import { DIRECTIONS } from './constants';

function getSquareCenter(side, tlCorner) {
  return {
    x: tlCorner.x + side / 2,
    y: tlCorner.y + side / 2,
  };
}

function generateTriangleCorners(side, tlCorner, rightVertexPosition) {
  const { x, y } = tlCorner;
  /**
   * corner[0] = Right-angled vertex
   * corner[1] = Vertex vertically distant from right-angled vertex.
   * corner[2] = Vertex horizontally distant from right angle vertex.
   */
  switch (rightVertexPosition) {
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

export class Circle {
  constructor(ctx, iterators, diameter, corner) {
    this.ctx = ctx;
    this.iterators = iterators;
    this.radius = diameter / 2;
    this.corner = corner;
  }

  _stroke = () => {
    this.ctx.stroke();
  };

  _fill = () => {
    this.ctx.fill();
  };

  render = () => {
    const center = getSquareCenter(2 * this.radius, this.corner);
    const color = this.iterators.color.next();
    generateCircle(
      this.ctx,
      this.radius,
      center,
      color
    );
    this._fill();
  };
}

export class Arc {
  constructor(ctx, iterators, side, center) {
    this.ctx = ctx;
    this.iterators = iterators;
    this.radius = side;
    this.center = center;
  }

  _stroke = () => {
    this.ctx.stroke();
  };

  _fill = () => {
    this.ctx.fill();
  };

  render() {
    const color = this.iterators.color.next();
    const position = this.iterators.position.next();
    generateArc(this.ctx, this.radius, this.center, position, color);
    this._fill();
  }
}

export class Triangle {
  constructor(ctx, iterators, side, righVertex) {
    this.ctx = ctx;
    this.iterators = iterators;
    this.side = side;
    this.righVertex = righVertex;
  }

  _stroke = () => {
    this.ctx.stroke();
  };

  _fill = () => {
    this.ctx.fill();
  };

  render() {
    const color = this.iterators.color.next();
    const position = this.iterators.position.next()
    const corners = generateTriangleCorners(this.side, this.righVertex, position);

    generateTriangle(this.ctx, corners, color);
    this._fill();
  }
}
