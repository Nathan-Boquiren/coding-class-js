///<reference path="../lib/p5.global.d.ts" />

let cl = console.log;

// ===== Preload Imgs =====

let duckImgs = [];
let duckDeadImg;
let obstacleImgs = [];
let cloudImgs = [];

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

  for (let i = 1; i <= 5; i++) {
    let img = loadImage(`imgs/cloud-${i}.png`);
    cloudImgs.push(img);
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
    this.updateCollisionShape();
  }

  updateCollisionShape() {
    this.cx = this.x + this.w / 2;
    this.cy = this.y + this.h / 2;
    this.r = this.h * 0.4; // tweak this so the circle hugs the duck
  }

  animate() {
    if (duckJumping) {
      const jumpDuration = 50;
      const t = this.jumpProgress / jumpDuration;
      this.y = horizon - this.h - 150 * sin(PI * t);

      if (++this.jumpProgress > jumpDuration) {
        this.jumpProgress = 0;
        this.y = horizon - this.h;
        duckJumping = false;
      }
    }
    this.updateCollisionShape();
  }

  show() {
    const img = getCurrentFrame();
    image(img, this.x, this.y, this.w, this.h);
  }
}

class Obstacle {
  constructor() {
    this.w = 430 / 6;
    this.h = 498 / 6;
    this.x = width;
    this.y = horizon - this.h;
    this.updateCollisionShape();
  }

  updateCollisionShape() {
    this.cx = this.x + this.w / 2;
    this.cy = this.y + this.h / 2;
    this.r = this.w * 0.5; // cone is tall & skinny, so radius ≈ half width
  }

  animate() {
    this.x -= 6;
    this.updateCollisionShape();
    if (this.x < -this.w) {
      obstacles.splice(obstacles.indexOf(this), 1);
    }
  }

  checkCollision() {
    const dx = duck.cx - this.cx;
    const dy = duck.cy - this.cy;
    const distSq = dx * dx + dy * dy;
    const radSum = duck.r + this.r;
    if (distSq <= radSum * radSum) {
      duckDied = true;
    }
  }

  show() {
    const img = obstacleImgs[0];
    image(img, this.x, this.y, this.w, this.h);
  }
}

class Cloud {
  constructor() {
    this.x = width;
    this.y = random(height / 3);
    this.vx = 1.5;
    this.w = 821 / 5;
    this.h = 548 / 5;
    this.img = cloudImgs[Math.floor(Math.random() * cloudImgs.length)];
  }

  create() {
    this.x -= this.vx;
    if (this.x <= -this.w) {
      let i = clouds.indexOf(this);
      clouds.splice(i, 1);
    }
    image(this.img, this.x, this.y, this.w, this.h);
  }
}

class Dot {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = random(10);
    this.h = 3;
  }
  animate() {
    this.x -= 6;
    if (this.x < -this.w) {
      this.x = width;
    }
  }
  show() {
    fill(128);
    rect(this.x, this.y, this.w, this.h);
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
let nextObstacleFrame;
const minSpawn = 40;
const maxSpawn = 180;

let duckDied = false;

let clouds = [];
let dots = [];

let score = 0;

// ========== Setup ==========

function setup() {
  createCanvas(windowWidth, windowHeight);
  horizon = height - 300;
  duck = new Duck();
  clouds.push(new Cloud());

  nextObstacleFrame = frameCount + floor(random(minSpawn, maxSpawn));

  for (let i = 0; i < 20; i++) {
    dots.push(new Dot(random(width * 2), horizon + 10));
  }
}

// ========== Draw ==========

function draw() {
  createBackground();

  if (!duckDied) {
    duck.animate();
  }
  duck.show();

  if (frameCount >= nextObstacleFrame) {
    obstacles.push(new Obstacle());
    nextObstacleFrame = frameCount + floor(random(minSpawn, maxSpawn));
  }

  for (let o of obstacles) {
    if (!duckDied) o.animate();
    o.checkCollision();
    o.show();
  }
}

// Create background
function createBackground() {
  background(255);

  // Horizon
  stroke(128);
  strokeWeight(3);
  line(0, horizon, width, horizon);

  // Clouds
  if (frameCount % 400 === 0) {
    clouds.push(new Cloud());
  }
  for (const c of clouds) {
    c.create();
  }

  // Dots on ground
  for (const d of dots) {
    if (!duckDied) {
      d.animate();
    }

    d.show();
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
