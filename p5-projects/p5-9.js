///<reference path="../lib/p5.global.d.ts" />

let cl = console.log;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(20);
}

let perlin1 = 0;
let perlin2 = 1000;

let points = [];

let clr = 255;

let clrInc = -1;

function draw() {
  background(20);
  noStroke();
  var x = noise(perlin1) * width;
  var y = noise(perlin2) * height;
  points.push(createVector(x, y));

  beginShape();
  fill(clr, 255 - clr, 128 + clr);
  for (let i = 0; i < points.length; i++) {
    let p = points[i];
    vertex(p.x, p.y);
  }

  if (points.length >= 100) {
    points.shift();
  }

  endShape();
  perlin1 += 0.01;
  perlin2 += 0.01;

  if (clr <= 0) {
    clrInc = 1;
  } else if (clr >= 255) {
    clrInc = -1;
  }

  clr += clrInc;
}
