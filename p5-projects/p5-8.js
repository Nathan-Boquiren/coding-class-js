///<reference path="../lib/p5.global.d.ts" />

let cl = console.log;

let stars = [];

class Star {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.size = random(1, 4);
  }
  create() {
    fill(255);
    square(this.x, this.y, this.size);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  angleMode(DEGREES);

  for (let i = 0; i < 300; i++) {
    stars.push(new Star());
  }
}

let sunAngle = 0;
let earthAngleInc = 10;
let sunAngleInc = (3 / 40) * earthAngleInc;
let earthAngle = 0;

let sunSize = 300;
let earthSize = 50;

function draw() {
  background(0);

  stars.forEach((star) => {
    star.create();
  });

  translate(width / 2, height / 2);
  rotate(sunAngle);

  push();

  pop();

  // Sun
  fill("yellow");
  circle(0, 0, sunSize);

  // Earth
  fill("green");
  circle(0, 250, earthSize);

  translate(0, 250);
  rotate(earthAngle);
  // Moon

  fill(255);
  circle(50, 0, 15);

  sunAngle += sunAngleInc;
  earthAngle += earthAngleInc;
}
