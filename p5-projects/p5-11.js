///<reference path="../lib/p5.global.d.ts" />

let cl = console.log;

let blocks = [];

class Block {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.direction;
    this.v = 60;
    this.s = 60;
    this.clr = color(255);
  }

  move() {
    if (this.direction === "UP") {
      this.y -= this.v;
    } else if (this.direction === "DOWN") {
      this.y += this.v;
    } else if (this.direction === "LEFT") {
      this.x -= this.v;
    } else if (this.direction === "RIGHT") {
      this.x += this.v;
    }
    // this.x = constrain(this.x, 0, width);
    // this.y = constrain(this.y, 0, height);
  }

  draw() {
    stroke(20);
    strokeWeight(2);
    fill(this.clr);
    square(this.x, this.y, this.s, 10);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(20);

  for (let i = 0; i < 8; i++) {
    blocks.push(new Block(60, i * 60 + 120));
  }
}

function draw() {
  background(20);
  createGrid();

  for (const b of blocks) {
    if (frameCount % 30 === 0) {
      b.move();
    }

    b.draw();
  }

  for (let i = blocks.length - 1; i < blocks.length; i--) {
    const b = blocks[i];
  }
}

function keyPressed() {
  let d;
  if (keyCode === UP_ARROW || key === "w") {
    d = "UP";
  } else if (keyCode === DOWN_ARROW || key === "s") {
    d = "DOWN";
  } else if (keyCode === LEFT_ARROW || key === "a") {
    d = "LEFT";
  } else if (keyCode === RIGHT_ARROW || key === "d") {
    d = "RIGHT";
  }

  for (const b of blocks) {
    b.direction = d;
  }
}

function createGrid() {
  stroke(255, 100);

  for (let i = 0; i <= width; i += 60) {
    line(i, 0, i, height);
  }

  for (let j = 0; j <= height; j += 60) {
    line(0, j, width, j);
  }
}
