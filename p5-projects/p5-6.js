///<reference path="../lib/p5.global.d.ts" />

let cl = console.log;

let dots = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
}

function draw() {
  background(0);
  dots.push(new dot());
  dots.forEach((dot) => {
    dot.animate();
    dot.show();
  });
}

class dot {
  constructor() {
    this.size = 32;
    this.radius = this.size / 2;
    this.xVelocity = random(-5, 5);
    this.yVelocity = random(-5, 5);
    this.x = mouseX;
    this.y = mouseY;
    this.color = 255;
    this.angle = random(360);
  }

  animate() {
    this.x += this.xVelocity;
    this.y += this.yVelocity;
    this.color -= 2;

    let xBounce = this.x >= width - this.radius || this.x <= this.radius;
    let yBounce = this.y >= height - this.radius || this.y <= this.radius;

    if (xBounce) {
      this.xVelocity *= -1;
    }
    if (yBounce) {
      this.yVelocity *= -1;
    }
    if (xBounce || yBounce) {
      this.size -= 4;

      if (this.size <= 0) {
        let i = dots.indexOf(this);
        dots.splice(i, 1);
      }
    }
  }
  show() {
    fill(this.color);
    noStroke();
    circle(this.x, this.y, this.size);
  }
}
