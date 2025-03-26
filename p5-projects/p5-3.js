///<reference path="../../lib/p5.global.d.ts" />

let cl = console.log;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(20, 20, 50);
  noStroke();
  fill("#FFD90F");
  ellipse(width / 2, height / 2, 550);

  resetMatrix();
  let angle1 = Math.atan((height / 2 - mouseY) / (width / 2 - 150 - mouseX));

  if (mouseX >= width / 2 - 150) {
    angle1 += Math.PI;
  }

  translate(width / 2 - 150, height / 2);
  rotate(angle1);

  fill(255);
  ellipse(0, 0, 200);

  fill(0);
  ellipse(-50, 0, 100);

  resetMatrix();

  let angle2 = Math.atan((height / 2 - mouseY) / (width / 2 + 150 - mouseX));

  if (mouseX >= width / 2 + 150) {
    angle2 += Math.PI;
  }

  translate(width / 2 + 150, height / 2);
  rotate(angle2);

  fill(255);
  ellipse(0, 0, 200);

  fill(0);
  ellipse(-50, 0, 100);

  resetMatrix();

  fill(255);
  arc(width / 2, height / 2 + 150, 200, 150, radians(10), radians(170), OPEN);
}
