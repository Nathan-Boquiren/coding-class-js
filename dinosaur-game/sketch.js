///<reference path="../lib/p5.global.d.ts" />

let cl = console.log;

// ===== Preload Imgs =====
let obstacleSpriteSheet;
let obstacleImgs = [];
let cloudImgs = [];

let fireDay;
let fireNight;

let duckAnimation;

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
  // for (let i = 1; i <= 4; i++) {
  //   let img = loadImage(`imgs/duck-imgs/duck-${i}.png`);
  //   duckImgs.push(img);
  // }
  for (let i = 1; i <= 5; i++) {
    let img = loadImage(`imgs/cloud-imgs/cloud-${i}.png`);
    cloudImgs.push(img);
  }

  // fireSpriteSheet = loadImage("imgs/fire-spritesheet.png");
  obstacleSpriteSheet = loadImage("imgs/obstacles/rocks-spritesheet.png");

  duckAnimation = loadImage("imgs/duck.gif");

  fireDay = loadImage("imgs/fire-animation-day.gif");
  fireNight = loadImage("imgs/fire-animation-night.gif");
}

// ===== Classes =====

class Game {
  constructor() {
    this.horizon = height - 300;
    this.clouds = [];
    this.dots = [];
  }

  setup() {
    this.clouds.push(new Cloud());

    for (let i = 0; i < 20; i++) {
      this.dots.push(new Dot(random(width * 2), this.horizon + 10));
    }
  }

  draw(t, isNight) {
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
    line(0, this.horizon, width, this.horizon);
    rect(0, this.horizon, width, height - this.horizon);

    // Clouds
    if (frameCount % 400 === 0) {
      this.clouds.push(new Cloud());
    }

    for (const c of this.clouds) {
      c.create();
    }

    // Dots on ground
    for (const d of this.dots) {
      if (!duck.died) {
        d.animate();
      }
      d.show();
    }
  }
}

class Duck {
  constructor() {
    this.w = 116;
    this.h = 100;
    this.x = 500;
    this.y = game.horizon - this.h;
    this.jumpProgress = 0;
    this.jumping = false;
    this.died = false;

    this.img = duckAnimation;
    this.updateCollisionShape();
    // fire
    this.fireImgs = {
      day: fireDay,
      night: fireNight,
    };
    this.fW = 512 / 4;
    this.fH = 1024 / 4;
    this.fX = this.x - 30;
    this.fY = game.horizon - this.fH - 2;
  }

  updateCollisionShape() {
    this.cx = this.x + this.w / 2;
    this.cy = this.y + this.h / 2;
    this.r = this.h * 0.4;
  }

  animate() {
    if (duck.jumping) {
      const jumpDuration = 250 / difficultySpeed;
      const t = this.jumpProgress / jumpDuration;
      this.y = game.horizon - this.h - 150 * sin(PI * t);

      if (++this.jumpProgress > jumpDuration) {
        this.jumpProgress = 0;
        this.y = game.horizon - this.h;
        duck.jumping = false;
      }
    }
    this.updateCollisionShape();
  }

  show() {
    if (duck.died) {
      // prettier-ignore
      let fireImg = nightMode === false ? this.fireImgs.day : this.fireImgs.night;
      image(fireImg, this.fX, this.fY, this.fW, this.fH);
    } else {
      image(this.img, this.x, this.y, this.w, this.h);
    }
  }
}

class Obstacle {
  constructor(img) {
    this.w = 430 / 6;
    this.h = 498 / 6;
    this.x = width;
    this.y = game.horizon - this.h;
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
      duck.died = true;
      obstacles.splice(obstacles.indexOf(this), 1);
    }
  }

  show() {
    image(this.img, this.x, this.y, this.w, this.h);
  }
}

class Cloud {
  constructor() {
    this.x = width;
    this.y = random(height / 3.5);
    this.vx = 1.5;
    this.w = 821 / 5;
    this.h = 548 / 5;
    this.img = cloudImgs[Math.floor(Math.random() * cloudImgs.length)];
  }

  create() {
    if (!duck.died) {
      this.x -= this.vx;
    }

    if (this.x <= -this.w) {
      let i = game.clouds.indexOf(this);
      game.clouds.splice(i, 1);
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

// ===== Variables =====

let game;
let duck;

let obstacles = [];
let nextObstacleFrame;
const minSpawn = 50;
const maxSpawn = 180;

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
  game = new Game();
  game.setup();
  duck = new Duck();
  nextObstacleFrame = frameCount + floor(random(minSpawn, maxSpawn));

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
}

// ========== Draw ==========

function draw() {
  if (nightMode !== prevNightMode) {
    prevNightMode = nightMode;
    lerpAmt = 0;
  }

  lerpAmt = constrain(lerpAmt + deltaTime / transitionLength, 0, 1);
  game.draw(lerpAmt, nightMode);

  if (frameCount >= nextObstacleFrame) {
    const idx = Math.floor(Math.random() * obstacleImgs.length);
    const img = obstacleImgs[idx];
    obstacles.push(new Obstacle(img));
    nextObstacleFrame = frameCount + floor(random(minSpawn, maxSpawn));
  }

  for (o of obstacles) {
    if (!duck.died) o.animate();
    o.checkCollision();
    o.show();
  }

  if (!duck.died) {
    duck.animate();
  }

  duck.show();

  updateScore();
}

function updateScore() {
  if (!duck.died) {
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

// ===== Keyboard Event for Duck Jump =====

function keyPressed() {
  if (
    (keyCode === 32 && !duck.jumping) ||
    (keyCode === UP_ARROW && !duck.jumping) ||
    (keyCode === 87 && !duck.jumping)
  ) {
    duck.jumping = true;
  }
}
