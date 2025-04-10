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
    noStroke();
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

let moonRotation = 0;
let earthRotation = 0;
let earthRevolution = 0;
let moonRotationInc = -10;
let earthRotationInc = 30;
let earthRevolutionInc = (3 / 40) * -moonRotationInc;

let sunSize = 300;
let earthSize = 50;

let earthDis = 250;

function draw() {
  background(0);

  stars.forEach((star) => {
    star.create();
  });

  translate(width / 2, height / 2);

  noStroke();

  // Sun
  fill("#FFDA00");
  circle(0, 0, sunSize);

  for (let i = 0; i < 16; i++) {
    rotate(22.5);
    triangle(-30, 145, 0, 165, 30, 145);
  }

  push();

  resetMatrix();

  let lEyeX = width / 2 - 60;
  let lEyeY = height / 2 - 20;

  let earthX = width / 2 + earthDis * sin(earthRevolution);
  let earthY = height / 2 + earthDis * cos(earthRevolution);

  let lXDis = lEyeX - earthX;
  let lYDis = lEyeY - earthY;
  let lEyeRotation = atan2(lXDis, lYDis) + 180;

  translate(lEyeX, lEyeY);
  rotate(lEyeRotation);

  fill(255);
  circle(0, 0, 80);

  fill(0);
  circle(0, 15, 50);

  resetMatrix();

  let rEyeX = width / 2 + 60;
  let rEyeY = height / 2 - 20;

  let rXDis = rEyeX - earthX;
  let rYDis = rEyeY - earthY;
  let rEyeRotation = atan2(rXDis, rYDis) + 180;

  translate(rEyeX, rEyeY);
  rotate(rEyeRotation);

  fill(255);
  circle(0, 0, 80);

  fill(0);
  circle(0, 15, 50);

  pop();

  noFill();
  stroke(0);
  strokeWeight(5);
  arc(0, 50, 100, 50, 10, 170, OPEN);

  rotate(earthRevolution);

  // Earth
  noStroke();
  fill("#1aa7ec");
  circle(0, earthDis, earthSize);

  translate(0, earthDis);
  rotate(moonRotation);

  push();
  rotate(earthRotation);

  fill("green");
  ellipse(10, -10, 20, 15);
  ellipse(-10, 5, 20, 25);
  ellipse(5, 5, 20, 20);
  pop();

  // Moon
  fill(255);
  circle(50, 0, 15);

  moonRotation += moonRotationInc;
  earthRotation += earthRotationInc;
  earthRevolution += earthRevolutionInc;

  moonRotation = resetAngle(moonRotation);
  earthRotation = resetAngle(earthRotation);
  earthRevolution = resetAngle(earthRevolution);
}

function resetAngle(angle) {
  return angle % 360;
}
