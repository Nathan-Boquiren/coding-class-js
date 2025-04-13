///<reference path="../lib/p5.global.d.ts" />

let cl = console.log;

function setup() {
  createCanvas(windowWidth, windowHeight);

  for (let i = 28; i >= 3; i--) {
    polygons.push(new Polygon(0, 0, i ** 2.1, i, i % 2 === 0));
  }
}

let polygons = [];

class Polygon {
  constructor(x, y, s, p, fill) {
    this.x = x;
    this.y = y;
    this.s = s;
    this.p = p;
    this.a = radians(360 / p);
    this.r = 0;
    this.rSpeed = 1 / pow(this.p, 2);
    this.fill = fill;
  }

  create() {
    if (this.fill) {
      fill(255);
    } else {
      fill(20);
    }
    beginShape();
    for (let i = 0; i < this.p; i++) {
      let angle = i * this.a;
      let xOff = sin(angle) * this.s;
      let yOff = cos(angle) * this.s;
      vertex(this.x + xOff, this.y + yOff);
    }
    endShape(CLOSE);
  }

  rotate() {
    rotate((this.r += this.rSpeed));
  }
}

function draw() {
  background(20);
  stroke(255);
  strokeWeight(2);
  noFill();

  translate(width / 2, height / 2);

  polygons.forEach((p) => {
    push();
    p.rotate();
    p.create();
    pop();
  });
}
