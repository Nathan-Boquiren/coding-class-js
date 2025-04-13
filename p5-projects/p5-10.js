///<reference path="../lib/p5.global.d.ts" />

let cl = console.log;

const num = 5000;

let bParticles = [];
let rParticles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < num; i++) {
    bParticles.push(createVector(random(width), random(height)));
  }

  stroke(100, 255, 255, 30);
  strokeWeight(1);
  background(0);
}

function draw() {
  for (const p of bParticles) {
    point(p.x, p.y);

    let noiseValue = noise(p.x * 0.01, p.y * 0.01);
    let angle = noiseValue * radians(360);

    p.x += cos(angle);
    p.y += sin(angle);

    if (!onScreen(p)) {
      p.x = random(width);
      p.y = random(height);
    }
  }
}
function onScreen(v) {
  return v.x >= 0 && v.x <= width && v.y >= 0 && v.y <= height;
}
