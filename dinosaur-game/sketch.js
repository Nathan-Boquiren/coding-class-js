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
    this.r = this.h * 0.4;
  }

  animate() {
    if (duckJumping) {
      const jumpDuration = 250 / difficultySpeed;
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
    this.r = this.w * 0.5;
  }

  animate() {
    this.x -= difficultySpeed;
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
    this.x -= difficultySpeed;
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
let highScore = 0;

let difficultySpeed = 5;

let nightMode = false;
let prevNightMode = false;
let lerpAmt = 0;
const TRANSITION_MS = 500;

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

  let saved = localStorage.getItem("highScore");
  if (saved !== null) {
    highScore = int(saved);
  }

  prevNightMode = nightMode;
}

// ========== Draw ==========

function draw() {
  if (nightMode !== prevNightMode) {
    prevNightMode = nightMode;
    lerpAmt = 0;
  }

  lerpAmt = constrain(lerpAmt + deltaTime / TRANSITION_MS, 0, 1);

  createBackground(lerpAmt, nightMode);

  updateScore();

  if (!duckDied) {
    duck.animate();
  }
  duck.show();

  if (frameCount >= nextObstacleFrame) {
    obstacles.push(new Obstacle());
    nextObstacleFrame = frameCount + floor(random(minSpawn, maxSpawn));
  }

  for (o of obstacles) {
    if (!duckDied) o.animate();
    o.checkCollision();
    o.show();
  }
}

function updateScore() {
  if (!duckDied) {
    score++;
  }

  if (score % 250 === 0) {
    difficultySpeed += 0.25;
  }

  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
  }

  // night mode
  if (score % 1500 === 0) {
    nightMode = nightMode === true ? false : true;
  }

  // Currnt score
  fill(255);
  noStroke();
  textFont("Press Start 2P");
  textStyle(NORMAL);
  textSize(20);

  let scoreText = score.toString().padStart(5, "0");
  text(scoreText, width - 150, 60);

  // Highscore
  let highScoreTxt = highScore.toString().padStart(5, "0");
  fill(255, 150);
  text("HI", width - 360, 60);
  text(highScoreTxt, width - 300, 60);
}

// Create background
function createBackground(t, isNight) {
  const dayClr = color(100, 150, 255);
  const nightClr = color(30, 30, 60);

  const from = isNight ? dayClr : nightClr;
  const to = isNight ? nightClr : dayClr;

  background(lerpColor(from, to, t));

  const fillClr = isNight
    ? lerpColor(color(200), color(60), t)
    : lerpColor(color(60), color(200), t);
  const strokeClr = isNight
    ? lerpColor(color(128), color(30), t)
    : lerpColor(color(30), color(128), t);

  fill(fillClr);
  stroke(strokeClr);
  strokeWeight(3);
  line(0, horizon, width, horizon);
  rect(0, horizon, width, height - horizon);

  // Clouds
  if (frameCount % 400 === 0) {
    clouds.push(new Cloud());
  }

  for (c of clouds) {
    c.create();
  }

  // Dots on ground
  for (d of dots) {
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
    (keyCode === UP_ARROW && !duckJumping) ||
    (keyCode === 87 && !duckJumping)
  ) {
    duckJumping = true;
  }
}
