///<reference path="../lib/p5.global.d.ts" />

let cl = console.log;

let dots = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  angleMode(DEGREES);
  for (let i = 0; i < 6; i++) {
    dots.push(new Dot(i));
  }

  background(0);
}

class Dot {
  constructor(i) {
    this.y = 0;
    this.yInc = 1;
    this.angle = 60 * i;
    this.angleInc = 1;
    this.diam = 10;
    this.dInc = 0.1;

    let hue = map(i, 0, 6, 0, 360);
    this.clr = color(hue, 100, 100);
  }

  animate() {
    push();
    rotate(this.angle);
    noStroke();
    fill(this.clr);
    circle(0, this.y, this.diam);
    pop();

    this.angle += this.angleInc;
    this.y += this.yInc;
    this.diam += this.dInc;

    if (this.y >= height / 2 - this.diam / 2 || this.y <= 0) {
      this.yInc *= -1;
      this.dInc *= -1;
    }
    // if (this.y <= 0) {
    //   this.angleInc *= -1;
    // }
  }
}

function draw() {
  // background(0);
  let xCenter = width / 2;
  let yCenter = height / 2;
  translate(xCenter, yCenter);
  dots.forEach((Dot) => {
    Dot.animate();
  });
}
