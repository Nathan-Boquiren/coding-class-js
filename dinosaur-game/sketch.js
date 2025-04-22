///<reference path="../lib/p5.global.d.ts" />

let cl = console.log;

// ===== Preload Imgs =====

let duckImgs = [];
let duckDeadImg;
let obstacleImgs = [];

function preload() {
  for (let i = 1; i <= 4; i++) {
    let img = loadImage(`imgs/duck-${i}.png`);
    duckImgs.push(img);
  }

  duckDeadImg = loadImage("imgs/duck-dead.png");

  for (let i = 1; i <= 1; i++) {
    let img = loadImage(`imgs/obstacle-${i}.png`);
    obstacleImgs.push(img);
  }
}

// ===== Classes =====

class Duck {
  constructor() {
    this.w = 116;
    this.h = 100;
    this.x = 500;
    this.y = horizon - this.h;
    this.jumpProgress = 0;
  }

  animate() {
    if (duckJumping) {
      let jumpDuration = 50;
      let t = this.jumpProgress / jumpDuration;
      this.y = horizon - this.h - 150 * sin(PI * t);

      this.jumpProgress++;
      if (this.jumpProgress > jumpDuration) {
        this.jumpProgress = 0;
        this.y = horizon - this.h;
        duckJumping = false;
      }
    }
  }

  show() {
    let img = getCurrentFrame();
    image(img, this.x, this.y, this.w, this.h);
  }
}

class Obstacle {
  constructor() {
    this.w = 430 / 6;
    this.h = 498 / 6;
    this.x = width;
    this.y = horizon - this.h;
  }
  animate() {
    this.x -= 6;
    if (this.x < 0) {
      let i = obstacles.indexOf(this);
      obstacles.splice(i, 0);
    }
  }

  checkCollision() {
    if (
      this.x + 30 <= duck.x + duck.w &&
      this.x + this.w - 30 >= duck.x &&
      this.y <= duck.y + duck.h &&
      this.y + this.h >= duck.y
    ) {
      duckDied = true;
    }
  }

  show() {
    let img = obstacleImgs[0];
    noFill();
    stroke(0);
    rect(this.x, this.y, this.w, this.h);
    image(img, this.x, this.y, this.w, this.h);
  }
}

// Get duck frame
function getCurrentFrame() {
  if (duckDied) {
    return duckDeadImg;
  } else {
    const framesPerImage = 6;
    const totalImages = duckImgs.length;
    const i = Math.floor(frameCount / framesPerImage) % totalImages;

    return duckImgs[i];
  }
}

// ===== Variables =====

let horizon;
let duck;
let duckJumping = false;

let obstacles = [];

let duckDied = false;

// ========== Setup ==========

function setup() {
  createCanvas(windowWidth, windowHeight);
  horizon = height - 300;
  duck = new Duck();
}

// ========== Draw ==========

function draw() {
  background(255);
  stroke(128);
  strokeWeight(3);
  line(0, horizon, width, horizon);

  if (!duckDied) {
    duck.animate();
  }
  duck.show();

  if (frameCount % 120 === 0) {
    obstacles.push(new Obstacle());
  }

  for (const o of obstacles) {
    if (!duckDied) {
      o.animate();
    }
    o.checkCollision();
    o.show();
  }
}
// ===== Keyboard Event for Duck Jump =====

function keyPressed() {
  if (
    (keyCode === 32 && !duckJumping) ||
    (keyCode === UP_ARROW && !duckJumping)
  ) {
    duckJumping = true;
  }
}
