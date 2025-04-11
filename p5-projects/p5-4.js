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
    this.radius = this.diam / 2;
  }

  draw() {
    noStroke();
    fill(this.r, this.g, this.b);
    circle(this.x, this.y, this.diam);

    if (
      (this.x <= this.radius && !this.birthed) ||
      (this.x >= width - this.radius && !this.birthed)
    ) {
      this.vx = -this.vx * 0.9;
      this.x = constrain(this.x, this.radius, width - this.radius);
    }
    if (
      (this.y <= this.radius && !this.birthed) ||
      (this.y >= height - this.radius && !this.birthed)
    ) {
      this.vy = -this.vy * 0.9;
      this.y = constrain(this.y, this.radius, height - this.radius);
    }

    shapes.forEach((otherShape) => {
      if (otherShape !== this) {
        let distance = dist(this.x, this.y, otherShape.x, otherShape.y);
        if (distance < this.radius + otherShape.radius) {
          let angle = atan2(this.y - otherShape.y, this.x - otherShape.x);
          let speed1 = dist(0, 0, this.vx, this.vy);
          let speed2 = dist(0, 0, otherShape.vx, otherShape.vy);

          this.vx = speed2 * cos(angle);
          this.vy = speed2 * sin(angle);

          otherShape.vx = speed1 * cos(angle + PI);
          otherShape.vy = speed1 * sin(angle + PI);
        }
      }
    });

    this.x += this.vx;
    this.y += this.vy;
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
