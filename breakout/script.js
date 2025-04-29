///<reference path="../lib/p5.global.d.ts" />

let cl = console.log;

// ===== Global Variables =====

let gameStarted = false;
let lives = 5;
let score = 0;

let ball;
let paddle;
let halo;

let balls = [];
let blocks = [];
let particles = [];
let powerUps = [];

let blockCol = 15;
let ballSpeed = 3;

// ===== Stuff and Things =====

const blockColors = [
  "#FF0000",
  "#FF8C00",
  "#FFD700",
  "#32CD32",
  "",
  "#00CED1",
  "#1E90FF",
  "#8A2BE2",
  "#FF1493",
];
const powerUpTypes = [
  "extraBall",
  "extraLife",
  "extraLife",
  "upGravity",
  "upGravity",
  "downGravity",
  "downGravity",
  "curveEffect",
  "curveEffect",
];

const sfx = {
  paddle: new Audio("sfx/paddle.wav"),
  block: new Audio("sfx/block.wav"),
  life: new Audio("sfx/life.wav"),
  powerUp: new Audio("sfx/power-up.wav"),
};

// ===== Classes =====

class Block {
  constructor(x, y, clr, width, height, row, pu) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.clr = clr;
    this.row = row;
    switch (pu) {
      // prettier-ignore
      case "extraBall":
        this.pu = new extraBall(
          this.x + this.width / 2,
          this.y,
          this.clr,
          pu);
        break;
      // prettier-ignore
      case "extraLife":
        this.pu = new extraLife(
          this.x + this.width / 2,
          this.y,
          this.clr,
          pu);
        break;
      // prettier-ignore
      case "upGravity":
        this.pu = new upGravity(
          this.x + this.width / 2,
          this.y,
          this.clr,
          pu);
        break;
      // prettier-ignore
      case "downGravity":
        this.pu = new downGravity(
          this.x + this.width / 2,
          this.y,
          this.clr,
          pu
        );
        break;
      // prettier-ignore
      case "curveEffect":
        this.pu = new curveEffect(
          this.x + this.width / 2,
          this.y,
          this.clr,
          pu
        );
        break;
      case null:
        this.pu = null;
        break;
      default:
        break;
    }
  }
  create() {
    fill(this.clr);
    stroke(0);
    strokeWeight(2.5);
    rect(this.x, this.y, this.width, this.height, 8);
  }

  blockAnimation(x, y, clr) {
    for (let i = 0; i < 100; i++) {
      particles.push(new Particle(x, y, clr));
    }
  }
}

class Paddle {
  constructor() {
    this.w = 240;
    this.h = 24;
    this.x = mouseX - this.w / 2;
    this.y = height - 140;
    this.br = this.h / 2;
  }

  control() {
    this.x = constrain(mouseX - this.w / 2, 0, width - this.w);
  }

  create() {
    fill(255);
    noStroke();
    rect(this.x, this.y, this.w, this.h, this.br);
  }

  paddleAnimation(x) {
    halo = new PaddleHalo(x, this.y, this.w);
  }
}

class PaddleHalo {
  constructor(x, y, w) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = 24;
    this.r = this.h / 2;
    this.alpha = 200;
  }

  animate() {
    this.x = mouseX - this.w / 2;
    this.y -= 1;
    this.w += 2;
    this.h += 2;
    this.r = this.h / 2;
    this.alpha -= 10;
  }
  show() {
    fill(255, this.alpha);
    rect(this.x, this.y, this.w, this.h, this.r);
  }
}

class Ball {
  constructor(x = width / 2, y = 600, clr = 255) {
    this.x = x;
    this.y = y;
    this.vx = ballSpeed;
    this.vy = ballSpeed * -3;
    this.d = 24;
    this.r = this.d / 2;
    this.grav = -1;
    this.clr = clr;

    this.ang = 0;

    // edges
    this.top = this.y - this.r;
    this.btm = this.y + this.r;
    this.left = this.x - this.r;
    this.right = this.x + this.r;
  }
  move() {
    this.x = constrain((this.x += this.vx), this.r, width - this.r);
    this.y = constrain((this.y += this.vy), this.r, height - this.r);

    this.top = this.y - this.r;
    this.btm = this.y + this.r;
    this.left = this.x - this.r;
    this.right = this.x + this.r;

    this.paddleBounce();
    this.wallBounce();
    this.blockBounce();
  }

  paddleBounce() {
    let pTop = paddle.y;
    let pBottom = paddle.y + paddle.h;
    let pLeft = paddle.x;
    let pRight = paddle.x + paddle.w;

    let isColliding =
      this.btm >= pTop &&
      this.top <= pBottom &&
      this.right >= pLeft &&
      this.left <= pRight &&
      this.vy > 0;

    if (isColliding) {
      let section = this.x - pLeft;

      let leftBounce = section < paddle.w / 3;
      let middleBounce =
        section >= paddle.w / 3 && section < (paddle.w / 3) * 2;
      let rightBounce = section >= (paddle.w / 3) * 2;

      if (leftBounce) {
        this.vx = ballSpeed * 3;
      } else if (middleBounce) {
        this.vx *= Math.abs(this.vx) === ballSpeed * 3 ? 1 / 3 : 1;
      } else if (rightBounce) {
        this.vx = ballSpeed * -3;
      }

      this.vy *= -1;
      this.y = paddle.y - this.r;
      playSfx(`paddle`);

      paddle.paddleAnimation(this.x);

      //decrease paddle width
      paddle.w = constrain(paddle.w - 3, 50, 240);
    }
  }

  wallBounce() {
    if (this.left <= 0 || this.right >= width) {
      this.vx *= -1;
    }
    if (this.top <= 0) {
      this.vy *= -1;
    }
    if (this.btm >= height) {
      decreaseLives();
    }
  }

  blockBounce() {
    blocks = blocks.filter((block) => {
      const closestX = constrain(this.x, block.x, block.x + block.width);
      const closestY = constrain(this.y, block.y, block.y + block.height);

      const dx = this.x - closestX;
      const dy = this.y - closestY;
      const distSq = dx * dx + dy * dy;

      if (distSq >= this.r * this.r) return true;

      if (abs(dx) > abs(dy)) {
        this.vx *= -1;
        this.x += dx > 0 ? this.r - abs(dx) : -(this.r - abs(dx));
      } else {
        this.vy *= -1;
        this.y += dy > 0 ? this.r - abs(dy) : -(this.r - abs(dy));
      }

      if (block.pu !== null) {
        powerUps.push(block.pu);
      }

      block.blockAnimation(
        block.x + block.width / 2,
        block.y + block.height / 2,
        block.clr
      );
      playSfx("block");

      const rowCleared = checkRow(block, block.row);
      increaseScore(rowCleared ? 50 : 10);
      if (rowCleared) ballSpeed += 0.5;

      return false;
    });
  }

  create() {
    drawingContext.save();

    drawingContext.shadowBlur = 20;
    drawingContext.shadowColor = color(255, 255, 255, 150);

    fill(color(this.clr));
    noStroke();
    circle(this.x, this.y, this.d);

    drawingContext.restore();
  }
}

class upBall extends Ball {
  move() {
    this.vy += this.grav;
    if (this.y <= this.r) {
      let ogBall = balls[0];
      balls.length = 0;
      balls.push(new Ball(ogBall.x, ogBall.y, ogBall.clr));
    }
    super.move();
  }
}

class downBall extends Ball {
  move() {
    this.vy -= this.grav;
    super.move();
  }
}

class curveBall extends Ball {
  move() {
    this.ang += 0.1;
    const wobble = this.vx * sin(this.ang) * 3;
    this.x += wobble;
    super.move();
  }
}

class Particle {
  constructor(x, y, clr) {
    this.x = x;
    this.y = y;
    this.vx = random(-5, 5);
    this.vy = random(-5, 5);
    this.clr = clr;
    this.alpha = 255;
  }
  animate() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 5;

    if (this.alpha <= 0) {
      let i = particles.indexOf(this);
      particles.splice(i, 1);
    }
  }
  show() {
    let clr = color(this.clr);
    clr.setAlpha(this.alpha);
    fill(clr);
    circle(this.x, this.y, 8);
  }
}

// PowerUp Classes

class PowerUp {
  constructor(x, y, clr, type) {
    this.x = x;
    this.y = y;
    this.clr = clr;
    this.vx = random(-3, 3);
    this.vy = 5;
    this.r = 10;

    switch (type) {
      case "extraBall":
        this.type = "Extra Ball!";
        break;
      case "extraLife":
        this.type = "Extra Life!";
        break;
      case "upGravity":
        this.type = "Negative Gravity!";
        break;
      case "downGravity":
        this.type = "Gravity!";
        break;
      case "curveEffect":
        this.type = "Curve Ball!";
        break;
      default:
        break;
    }

    this.top = this.y - this.r;
    this.btm = this.y + this.r;
    this.left = this.x - this.r;
    this.right = this.x + this.r;

    this.active = true;
    this.textActive = true;
    this.startTimeCalculated = false;
    this.startTxtTime = 0;
    this.a = 0;
    this.fill = color(255);
  }

  move() {
    this.x += this.vx;
    this.y += this.vy;

    this.top = this.y - this.r;
    this.btm = this.y + this.r;
    this.left = this.x - this.r;
    this.right = this.x + this.r;

    if (this.y >= height) {
      this.remove();
    }

    this.paddleBounce();
  }

  paddleBounce() {
    let pTop = paddle.y;
    let pBottom = paddle.y + paddle.h;
    let pLeft = paddle.x;
    let pRight = paddle.x + paddle.w;

    let isColliding =
      this.btm >= pTop &&
      this.top <= pBottom &&
      this.right >= pLeft &&
      this.left <= pRight &&
      this.vy > 0;

    if (isColliding) {
      this.effect();
      this.active = false;
      playSfx("powerUp");

      this.animateTxt();

      paddle.paddleAnimation(this.x);
    }
  }

  remove() {
    let i = powerUps.indexOf(this);
    powerUps.splice(i, 1);
  }

  create() {
    drawingContext.save();
    drawingContext.shadowBlur = 20;
    drawingContext.shadowColor = color(255, 0, 0, 150);
    stroke(255, 0, 0);
    strokeWeight(3);
    fill(0);
    square(this.x - 20, this.y - 20, 40, 5);

    textAlign(CENTER, CENTER);
    textSize(30);
    text("❓", this.x, this.y - 5);

    drawingContext.restore();
  }

  animateTxt() {
    if (!this.startTimeCalculated) {
      this.startTxtTime = frameCount;
      this.startTimeCalculated = true;
    }
    let deltaTime = frameCount - this.startTxtTime;
    if (this.textActive) {
      this.a = -(17 / 60) * deltaTime ** 2 + 17 * deltaTime;
      this.fill.setAlpha(this.a);

      push();
      fill(this.fill);
      textAlign(CENTER, CENTER);
      text(this.type, width / 2, height / 2);
      pop();
      if (deltaTime >= 60) {
        this.textActive = false;
      }
    }
  }

  effect() {}
}

class extraBall extends PowerUp {
  effect() {
    let og = balls[0];
    balls.push(new Ball(og.x, og.y, og.clr));
  }
}

class extraLife extends PowerUp {
  effect() {
    lives++;
  }
}

class upGravity extends PowerUp {
  effect() {
    let ogBall = balls[0];
    balls.length = 0;
    balls.push(new upBall(ogBall.x, ogBall.y, ogBall.clr));
  }
}

class downGravity extends PowerUp {
  effect() {
    let ogBall = balls[0];
    balls.length = 0;
    balls.push(new downBall(ogBall.x, ogBall.y, ogBall.clr));
  }
}

class curveEffect extends PowerUp {
  effect() {
    let ogBall = balls[0];
    balls.length = 0;
    balls.push(new curveBall(ogBall.x, ogBall.y, ogBall.clr));
  }
}

// ===== setup =====

function setup() {
  createCanvas(windowWidth, windowHeight);

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < blockCol; j++) {
      let blockWidth = width / blockCol;
      let blockHeight = 35;

      let pu = null;

      let rand = random();

      if (rand < 0.09) {
        pu = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
      }

      if (i !== 4) {
        blocks.push(
          new Block(
            j * blockWidth,
            i * blockHeight,
            blockColors[i],
            blockWidth,
            blockHeight,
            i + 1,
            pu
          )
        );
      }
    }
  }

  balls.push(new Ball());
  paddle = new Paddle();
}

// ===== draw =====

function draw() {
  background(0, 150);

  // Text
  showCenterTxt();

  // Score and lives text
  textAlign(CENTER, CENTER);
  textSize(24);
  text(scoreStr(), width / 2 - 200, height - 50);
  text(heartStr(), width / 2 + 200, height - 50);

  // create blocks

  for (const b of blocks) {
    b.create();
  }

  //   Paddle Bouncer thingy
  paddle.control();
  paddle.create();

  //   Ball
  if (gameStarted) {
    for (const b of balls) {
      b.move();
    }

    // power ups
    for (const pU of powerUps) {
      if (pU.active) {
        pU.move();
        pU.create();
      } else if (pU.textActive) {
        pU.animateTxt();
      } else {
        pU.remove();
      }
    }
  }

  for (const b of balls) {
    b.create();
  }

  // bounce animations
  for (const p of particles) {
    p.animate();
    p.show();
  }

  if (halo) {
    halo.animate();
    halo.show();
  }

  if (blocks.length === 0) {
    gameStarted = false;
  }
}

function showCenterTxt() {
  let centerMsg = getCenterMsg();
  textFont("Press Start 2P");
  let txtClr = color(255);
  txtClr.setAlpha(255);
  fill(txtClr);
  if (!gameStarted) {
    textAlign(CENTER, CENTER);
    textSize(24);
    text(centerMsg, width / 2, height / 2);
  }
}

function getCenterMsg() {
  let msg;
  if (lives <= 0) {
    msg = "GAME OVER";
  } else if (lives > 0 && blocks.length <= 0) {
    msg = "YOU WIN!";
  } else {
    msg = "Click Mouse to Start Game";
  }
  return msg;
}

// Make lives and score strings
function heartStr() {
  let hearts = [];
  for (let i = 0; i < lives; i++) {
    hearts.push("❤️");
  }
  return hearts.join("");
}

function scoreStr() {
  return String(score).padStart(4, "0");
}

// Check if row is complete
function checkRow(currentBlk, rowNum) {
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i] !== currentBlk && blocks[i].row === rowNum) {
      return false;
    }
  }
  return true;
}

// ===== Style =====

// Play SFX
function playSfx(type) {
  if (sfx[type]) {
    sfx[type].currentTime = 0;
    sfx[type].play();
  }
}

// Score increase
function increaseScore(amount) {
  score += amount;
}

// Lives decrease
function decreaseLives() {
  lives = constrain(lives - 1, 0, 5);

  gameStarted = false;

  powerUps.length = 0;

  if (lives !== 0) {
    playSfx(`life`);
    balls.length = 0;
    balls.push(new Ball());
  }
}

// ===== Mouse click to start game =====
function mouseClicked() {
  gameStarted = true;
}
