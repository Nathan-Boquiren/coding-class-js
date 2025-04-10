///<reference path="../lib/p5.global.d.ts" />

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(240);
}
let color = 255;
let cInc = 15;
let x = 0;
let y = 0;
let yInc = 10;
let xInc = 10;
let d = 10;
let rInc = 10;

function draw() {
  // background(0);
  noStroke();

  drawCircle(x, y, color);
  drawCircle(x, height - y, 255 - color);
  drawCircle(width - x, height - y, color);
  drawCircle(width - x, y, 255 - color);

  if (color >= 255) {
    cInc = -15;
  } else if (color <= 0) {
    cInc = 15;
  }

  if (y >= height - d / 2) {
    yInc = -Math.abs(yInc);
    color += cInc;
    d += rInc;
  } else if (y <= d / 2) {
    yInc = Math.abs(yInc);
    color += cInc;
    d += rInc;
  } else if (x >= width - d / 2) {
    xInc = -Math.abs(xInc);
    color += cInc;
    d += rInc;
  } else if (x <= d / 2) {
    xInc = Math.abs(xInc);
    color += cInc;
    d += rInc;
  }

  x += xInc;
  y += yInc;
}

function drawCircle(x, y, color) {
  // fill(color, 255 - color, 255 - color / 2);
  fill(color, 255 - color / 2, 255 - color);
  // fill(255 - color, 255 - color / 2, color);
  // fill(255 - color / 2, 255 - color, color);

  ellipse(x, y, d);
}
