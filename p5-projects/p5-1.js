///<reference path="../../../lib/p5.global.d.ts" />

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  noStroke();
  let horizon = 550;

  background("#ff9924");

  fill("#ff3300");
  ellipse(1100, 470, 300);
  fill("#fffd89");
  ellipse(850, 300, 150);

  drawMountainLayer("#D17A52", horizon, 0);
  drawMountainLayer("#C55A3E", horizon + 10, 1000);
  drawMountainLayer("#8A2E13", horizon + 20, 2000);
  drawMountainLayer("#70270F", horizon + 30, 5000);
  drawMountainLayer("#1A0F0A", horizon + 70, 10000);
}

function drawMountainLayer(color, verticalOffset, rand) {
  fill(color);
  beginShape();
  var xoff = 0;
  for (let x = 0 - rand; x < width; x++) {
    var y = noise(xoff) * (height / 20) + verticalOffset;
    vertex(x, y);

    xoff += 0.005;
  }
  vertex(width, height);
  vertex(0, height);

  endShape();
}
