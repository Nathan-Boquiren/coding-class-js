///<reference path="../lib/p5.global.d.ts" />

let cl = console.log;

let dots = [];

function setup() {
  createCanvas(windowWidth, windowHeight);

  let lineAmout = 0;

  const dotInterval = setInterval(() => {
    for (let i = 0; i < 1000; i++) {
      dots.push(new dot());
    }
    lineAmout++;
    if (lineAmout >= 3) {
      clearInterval(dotInterval);
    }
  }, 750);
}

function draw() {
  background(0);

  for (let i = 0; i < dots.length; i++) {
    const dot = dots[i];
    dot.show();
    dot.animate();
  }
}

class dot {
  constructor() {
    this.size = 10;
    this.velocity = random(1, 5);
    this.x = random(width);
    this.y = 0;
    this.color = 255;
  }
  animate() {
    let cursorDistance = abs(this.x - mouseX);
    this.velocity = map(cursorDistance, 0, width, 10, 1);
    this.color = map(cursorDistance, 0, width * 0.7, 255, 0);

    this.y += this.velocity;
    if (this.y >= height + 5) {
      this.y = 0 - 5;
    }
  }

  show() {
    noStroke();
    fill(this.color);

    ellipse(this.x, this.y, this.size);
  }
}
