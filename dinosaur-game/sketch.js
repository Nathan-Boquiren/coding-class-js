///<reference path="../lib/p5.global.d.ts" />

let cl = console.log;

// ===== Preload Imgs =====

let duckImgs = [];
let fireSpriteSheet;
let fireFrames = [];
let obstacleSpriteSheet;
let obstacleImgs = [];
let cloudImgs = [];

const spriteData = [
  { x: 0, y: 171, w: 479, h: 154 },
  { x: 635, y: 0, w: 355, h: 325 },
  { x: 1177, y: 78, w: 448, h: 247 },

  { x: 16, y: 526, w: 386, h: 263 },
  { x: 635, y: 527, w: 401, h: 262 },
  { x: 1223, y: 588, w: 417, h: 201 },

  { x: 31, y: 929, w: 433, h: 309 },
  { x: 650, y: 929, w: 340, h: 309 },
  { x: 1208, y: 976, w: 448, h: 262 },
];

function preload() {
  for (let i = 1; i <= 4; i++) {
    let img = loadImage(`imgs/duck-imgs/duck-${i}.png`);
    duckImgs.push(img);
  }
  for (let i = 1; i <= 5; i++) {
    let img = loadImage(`imgs/cloud-imgs/cloud-${i}.png`);
    cloudImgs.push(img);
  }

  fireSpriteSheet = loadImage("imgs/fire-spritesheet.png");
  obstacleSpriteSheet = loadImage("imgs/obstacles/rocks-spritesheet.png");
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
    // fire
    this.fW = 512 / 4;
    this.fH = 1024 / 4;
    this.fX = this.x - 30;
    this.fY = horizon - this.fH;
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
    if (img) {
      if (duckDied) {
        image(img, this.fX, this.fY, this.fW, this.fH);
      } else {
        image(img, this.x, this.y, this.w, this.h);
      }
    }
  }
}

class Obstacle {
  constructor(img) {
    this.w = 430 / 6;
    this.h = 498 / 6;
    this.x = width;
    this.y = horizon - this.h;
    this.updateCollisionShape();
    this.img = img;
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
      deathFrame = frameCount;
    }
  }

  show() {
    image(this.img, this.x, this.y, this.w, this.h);
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
    if (!duckDied) {
      this.x -= this.vx;
    }

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
    return fireFrames[fireAnimIndex];
  } else {
    const framesPerImage = 6;
    const total = duckImgs.length;
    const i = Math.floor(frameCount / framesPerImage) % total;
    return duckImgs[i];
  }
}

// ===== Variables =====

let horizon;
let duck;
let duckJumping = false;
let duckDied = false;
let deathFrame = null;

let fireAnimIndex = 0;
let fireAnimTicker = 0;
const fireAnimDelay = 4;

let obstacles = [];
let nextObstacleFrame;
const minSpawn = 40;
const maxSpawn = 180;

let clouds = [];
let dots = [];

let score = 0;
let highScore = 0;

let difficultySpeed = 5;

let nightMode = false;
let prevNightMode = false;
let lerpAmt = 0;
const transitionLength = 500;

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

  setupImgFrames();
}

function setupImgFrames() {
  for (let i = 0; i < 9; i++) {
    let obstImg = obstacleSpriteSheet.get(
      spriteData[i].x,
      spriteData[i].y,
      spriteData[i].w,
      spriteData[i].h
    );
    obstacleImgs.push(obstImg);
  }

  for (let i = 0; i < 11; i++) {
    let fireFrame = fireSpriteSheet.get(512 * i, 0, 512, 1024);
    fireFrames.push(fireFrame);
  }
}

// ========== Draw ==========

function draw() {
  if (nightMode !== prevNightMode) {
    prevNightMode = nightMode;
    lerpAmt = 0;
  }

  lerpAmt = constrain(lerpAmt + deltaTime / transitionLength, 0, 1);

  createBackground(lerpAmt, nightMode);

  if (frameCount >= nextObstacleFrame) {
    const idx = Math.floor(Math.random() * obstacleImgs.length);
    const img = obstacleImgs[idx];
    obstacles.push(new Obstacle(img));
    nextObstacleFrame = frameCount + floor(random(minSpawn, maxSpawn));
  }

  for (o of obstacles) {
    if (!duckDied) o.animate();
    o.checkCollision();
    o.show();
  }

  if (!duckDied) {
    duck.animate();
  } else if (duckDied) {
    fireAnimTicker++;
    if (fireAnimTicker >= fireAnimDelay) {
      fireAnimTicker = 0;
      if (fireAnimIndex < fireFrames.length - 1) {
        fireAnimIndex++;
      }
    }
  }
  duck.show();

  updateScore();
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

function createBackground(t, isNight) {
  const dayClr = color(100, 150, 255);
  const nightClr = color(30, 30, 60);

  const from = isNight ? dayClr : nightClr;
  const to = isNight ? nightClr : dayClr;

  background(lerpColor(from, to, t));

  const fillClr = isNight
    ? lerpColor(color(150), color(60), t)
    : lerpColor(color(60), color(150), t);
  const strokeClr = isNight
    ? lerpColor(color(110), color(30), t)
    : lerpColor(color(30), color(110), t);

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
