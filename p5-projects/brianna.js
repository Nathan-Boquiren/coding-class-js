///<reference path="../lib/p5.global.d.ts" />

var setup = function () {
  createCanvas(600, 400);
};

class Shape {
  constructor() {
    this.x = 300;
    this.y = 200;
    this.vx = -7;
    this.vy = -6;
    this.size = 100;
  }

  draw() {
    fill("red");
    circle((this.x += this.vx), (this.y += this.vy), this.size);

    if (this.x < 0 || this.x > width) {
      this.vx = -this.vx;
      this.size += 10;
    }

    if (this.y < 0 || this.y > height) {
      this.vy = -this.vy;
      this.size += 20;
    }
  }
}

var draw = function () {
  background(200);
  this.draw();
};
