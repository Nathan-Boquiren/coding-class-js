///<reference path="../lib/p5.global.d.ts" />

let shape = {
  x: 200,
  y: 200,
  vx: 6,
  vy: 7,
  size: 50,
  sizeIncrement: 20,

  draw: function () {
    shape.x += shape.vx;
    shape.y += shape.vy;

    if (shape.x < 0 || shape.x > width) {
      shape.vx = -shape.vx;
      shape.changeSize();
    }

    if (shape.y < 0 || shape.y > height) {
      shape.vy = -shape.vy;
      shape.changeSize();
    }

    fill("red");
    circle(shape.x, shape.y, shape.size);
  },
  changeSize: function () {
    shape.size += shape.sizeIncrement;
    if (shape.size > 200 || shape.size < 50) {
      shape.sizeIncrement = -shape.sizeIncrement;
    }
  },
};

var setup = function () {
  createCanvas(600, 400);
};

var draw = function () {
  background(220);
  shape.draw();
};
