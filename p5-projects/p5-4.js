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
    circle((this.x += this.vx), (this.y += this.vy), this.diam);

    if (this.x <= this.radius || this.x >= width - this.radius) {
      this.vx = -this.vx;
    }
    if (this.y <= this.radius || this.y >= height - this.radius) {
      this.vy = -this.vy;
    }

    shapes.forEach((otherShape) => {
      if (otherShape !== this) {
        let distance = dist(this.x, this.y, otherShape.x, otherShape.y);
        if (distance < this.radius + otherShape.radius) {
          this.vx = -this.vx;
          this.vy = -this.vy;
        }
      }
    });
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function mouseClicked() {
  let randR = random(255);
  let randG = random(255);
  let randB = random(255);
  let randDiam = random(50, 200);
  let randXV = random(-20, 20);
  let randYV = random(-20, 20);

  shapes.push(
    new Shape(mouseX, mouseY, randXV, randYV, randDiam, randR, randG, randB)
  );
}

function draw() {
  background(0);
  shapes.forEach((shape) => {
    shape.draw();
  });
}
