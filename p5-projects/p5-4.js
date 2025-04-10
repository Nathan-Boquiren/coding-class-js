///<reference path="../lib/p5.global.d.ts" />

let cl = console.log;

let shapes = [];

class Shape {
  constructor(x = 0, y = 0, vx = 0, vy = 0, diam, r, g, b) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.diam = diam;
    this.r = r;
    this.g = g;
    this.b = b;
    this.birthed = false;
    this.radius = this.diam / 2;
  }

  draw() {
    noStroke();
    fill(this.r, this.g, this.b);
    circle((this.x += this.vx), (this.y += this.vy), this.diam);

    if (
      (this.x <= this.radius && !this.birthed) ||
      (this.x >= width - this.radius && !this.birthed)
    ) {
      this.vx = -this.vx;
      this.birthed = true;
      newShape(this.x, this.y);
    }
    if (
      (this.y <= this.radius && !this.birthed) ||
      (this.y >= height - this.radius && !this.birthed)
    ) {
      this.vy = -this.vy;
      this.birthed = true;
      newShape(this.x, this.y);
    }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function newShape(x, y) {
  let randR = random(255);
  let randG = random(255);
  let randB = random(255);
  let randDiam = random(50, 200);
  let randXV = random(-20, 20);
  let randYV = random(-20, 20);

  shapes.push(new Shape(x, y, randXV, randYV, randDiam, randR, randG, randB));
}
function mouseClicked() {
  newShape(mouseX, mouseY);
}

function draw() {
  background(0);
  for (const shape of shapes) {
    shape.draw();
  }
}
