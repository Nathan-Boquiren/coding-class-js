///<reference path="../lib/p5.global.d.ts" />

let cl = console.log;

const skyClrs = ["#4f5bd5", "#962fbf", "#d62976", "#fa7e1e", "#feda75"];

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
}

let barHeight = 160;
let sunY = 450;

function draw() {
  let halfHeight = height / 2;
  noStroke();

  for (let i = 0; i < skyClrs.length - 1; i++) {
    let clr = color(skyClrs[i]);
    let nextClr = color(skyClrs[i + 1]);

    for (let j = i * barHeight; j < i * barHeight + barHeight; j++) {
      let lerpClr = lerpColor(clr, nextClr, 0.01 * (j % barHeight));
      stroke(lerpClr);
      line(0, j, width, j);
    }
  }

  fill(255, 221, 117, 180);
  circle(width / 2, sunY, 500);

  for (let i = 1; i <= 10; i++) {
    let xOffset = (frameCount - i * 10) * 2 * (i / 2);

    createLayer(
      xOffset,
      halfHeight + 100 + i * 10,
      color(200 - i * 20, 150 - i * 20, 255),
      7,
      3
    );

    if (i === 4) {
      drawBoat();
    }
  }
}

function createLayer(xOff, yOff, clr, amp, waveLength) {
  noStroke();
  let c = color(clr);
  c.setAlpha(100);
  fill(c);

  beginShape();
  for (let i = 0; i <= width; i++) {
    let y = sin((i + xOff) * waveLength) * amp + yOff;

    vertex(i, y);
  }

  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);
}

let boatX = 1500;

let boatA = 0;

function drawBoat() {
  push();

  let boatY = height / 2 + 180;
  translate(boatX, boatY);
  rotate(sin(boatA) * 7);
  scale(0.8);

  fill(139, 69, 19);

  arc(0, -150, 300, 300, 30, 150, CHORD);

  rectMode(CENTER);
  rect(10, -175, 10, 200, 5, 5, 0, 0);

  fill(255);

  triangle(
    cos(150) * 150,
    sin(150) * 150 - 160,
    2,
    -270,
    2,
    sin(150) * 150 - 160
  );
  triangle(
    cos(30) * 150,
    sin(30) * 150 - 160,
    18,
    -270,
    18,
    sin(150) * 150 - 160
  );

  pop();
  boatX -= 2;
  boatA += 5;
  if (boatX <= -150) {
    boatX = width + 150;
  }
}
