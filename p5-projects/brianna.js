///<reference path="../lib/p5.global.d.ts" />

var setup = function () {
  createCanvas(600, 400);
};

let shape = {
  x: 300,
  y: 200,
  vx: -5,
  vy: 5,
  size: 100,
  sizeIncrement: 1,

  draw: function () {
    fill("red");
    circle((shape.x += shape.vx), (shape.y += shape.vy), shape.size);

    let radius = shape.size / 2;

    if (shape.size >= 200) {
      shape.sizeIncrement = -1;
    } else if (shape.size <= 50) {
      shape.sizeIncrement = 1;
    }

    if (shape.x <= radius || shape.x >= width - radius) {
      shape.vx = -shape.vx;
      shape.size += shape.sizeIncrement * 20;
    }

    if (shape.y <= radius || shape.y >= height - radius) {
      shape.vy = -shape.vy;
      shape.size += shape.sizeIncrement * 20;
    }
  },
};

var draw = function () {
  background(200);
  shape.draw();
};
