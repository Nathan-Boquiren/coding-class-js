///<reference path="../lib/p5.global.d.ts" />

let cl = console.log;

// ===== Variables =====

let game;
let paddle;
let halo;
let balls = [];
let blocks = [];
let particles = [];
let powerUps = [];

// ===== Stuff and Things =====
let ballSpeed = 3;
const maxBallSpeed = 7;
const blockCol = 15;
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
const sfx = {
  paddle: new Audio("sfx/paddle.wav"),
  block: new Audio("sfx/block.wav"),
  life: new Audio("sfx/life.wav"),
  powerUp: new Audio("sfx/power-up.wav"),
};
let powerUpTypes = [];

// ===== Classes =====

class Game {
  constructor() {
    this.lives = 5;
    this.score = 0;
    this.started = false;
  }
  drawCenterTxt() {
    let centerMsg = this.getCenterMsg();
    textFont("Press Start 2P");
    fill(255, 255);
    if (!this.started) {
      textAlign(CENTER, CENTER);
      textSize(24);
      text(centerMsg, width / 2, height / 2);
    }
  }
  getCenterMsg() {
    let msg;
    if (this.lives <= 0) {
      msg = "GAME OVER";
    } else if (this.lives > 0 && blocks.length <= 0) {
      msg = "YOU WIN!";
    } else {
      msg = "Click Mouse to Start Game";
    }
    return msg;
  }
  drawScoreBoard() {
    textAlign(CENTER, CENTER);
    textSize(24);
    text(String(this.score).padStart(4, "0"), width / 2 - 200, height - 50);
    text("❤️".repeat(this.lives), width / 2 + 200, height - 50);
  }
  increaseScore(amount) {
    this.score += amount;
  }
  decreaseLives() {
    if (this.lives > 1) {
      this.lives -= 1;
      balls[0] = new Ball();
      powerUps.length = 0;
      playSfx("life");
    } else {
      this.lives = 0;
      this.started = false;
      powerUps.length = 0;
      balls.length = 0;
    }
  }
}

class Block {
  constructor(x, y, clr, width, height, row, i) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.xCenter = this.x + this.width / 2;
    this.clr = clr;
    this.row = row;
    if (powerUpTypes[i]) {
      const PuClass = powerUpTypes[i].class;
      this.pu = new PuClass(this.x + this.width / 2, this.y, i);
      this.newBall = powerUpTypes[i].type === "extraBall";
    } else {
      this.pu = null;
    }
  }
  create() {
    fill(this.clr);
    stroke(0);
    strokeWeight(2.5);
    rect(this.x, this.y, this.width, this.height, 8);
  }
  remove() {
    const i = blocks.indexOf(this);
    if (i !== -1) {
      blocks.splice(i, 1);
    }
  }
  blockAnimation(x, y, clr) {
    for (let i = 0; i < 100; i++) {
      particles.push(new Particle(x, y, clr));
    }
  }
  collision() {
    if (this.pu && !this.newBall) {
      powerUps.push(this.pu);
    } else if (this.pu && this.newBall) {
      this.pu.effect();
      this.pu.animateTxt();
    }

    this.blockAnimation(
      this.x + this.width / 2,
      this.y + this.height / 2,
      this.clr
    );
    playSfx("block");
    this.remove();
  }
}

class Particle {
  constructor(x, y, clr) {
    this.pos = createVector(x, y);
    this.vel = createVector(random(-5, 5), random(-5, 5));
    this.clr = color(clr);
    this.alpha = 255;
  }
  animate() {
    this.pos.add(this.vel);
    this.alpha -= 5;
    if (this.alpha <= 0) {
      let i = particles.indexOf(this);
      particles.splice(i, 1);
    }
  }
  show() {
    this.clr.setAlpha(this.alpha);
    fill(this.clr);
    circle(this.pos.x, this.pos.y, 8);
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
  bounceAnimation() {
    halo = new PaddleHalo(this.x, this.y, this.w);
  }
  collision() {
    playSfx(`paddle`);
    this.bounceAnimation();
    this.w = constrain(this.w - 2, 100, width);
  }
}

class PaddleHalo {
  constructor(x, y, w) {
    this.pos = createVector(x, y);
    this.w = w;
    this.h = 24;
    this.r = this.h / 2;
    this.alpha = 200;
  }
  animate() {
    this.pos.x = mouseX - this.w / 2;
    this.pos.y -= 1;
    this.w += 2;
    this.h += 2;
    this.r = this.h / 2;
    this.alpha -= 10;
  }
  show() {
    fill(255, this.alpha);
    rect(this.pos.x, this.pos.y, this.w, this.h, this.r);
  }
}

class Ball {
  constructor(x = width / 2, y = 600) {
    this.pos = createVector(x, y);
    this.vel = createVector(ballSpeed, ballSpeed * -3);
    this.d = 24;
    this.r = this.d / 2;
    this.grav = -0.8;
    this.clr = 255;
    this.ang = 0;
  }
  move() {
    this.pos.add(this.vel);
    this.pos.x = constrain(this.pos.x, this.r, width - this.r);
    this.pos.y = constrain(this.pos.y, this.r, height - this.r);

    this.top = this.pos.y - this.r;
    this.btm = this.pos.y + this.r;
    this.left = this.pos.x - this.r;
    this.right = this.pos.x + this.r;

    this.paddleBounce();
    this.wallBounce();
    this.blockBounce();
  }
  paddleBounce() {
    const isColliding =
      this.btm >= paddle.y &&
      this.top <= paddle.y + paddle.h &&
      this.right >= paddle.x &&
      this.left <= paddle.x + paddle.w &&
      this.vel.y > 0;

    if (!isColliding) return;

    const section = this.pos.x - paddle.x;
    const third = paddle.w / 3;
    const leftBounce = section < third;
    const middleBounce = section < third * 2;
    const rightBounce = section >= third * 2;

    if (leftBounce) {
      this.vel.x = ballSpeed * 3;
    } else if (middleBounce) {
      this.vel.x *= Math.abs(this.vel.x) === ballSpeed * 3 ? 1 / 3 : 1;
    } else if (rightBounce) {
      this.vel.x = ballSpeed * -3;
    }
    this.vel.y *= -1;
    this.pos.y = paddle.y - this.r;

    paddle.collision();
  }
  wallBounce() {
    if (this.left <= 0 || this.right >= width) {
      this.vel.x *= -1;
    }
    if (this.top <= 0) {
      this.vel.y *= -1;
    }
    if (this.btm >= height) {
      game.decreaseLives();
      if (balls.indexOf(this) >= 1) {
        balls.splice(balls.indexOf(this), 1);
      }
    }
  }
  blockBounce() {
    let collided = false;
    for (let i = blocks.length - 1; i >= 0 && !collided; i--) {
      const block = blocks[i];
      const closestX = constrain(this.pos.x, block.x, block.x + block.width);
      const closestY = constrain(this.pos.y, block.y, block.y + block.height);
      const dx = this.pos.x - closestX;
      const dy = this.pos.y - closestY;
      const distSq = dx * dx + dy * dy;
      if (distSq >= this.r * this.r) continue;
      if (abs(dx) > abs(dy)) {
        this.vel.x *= -1;
        this.pos.x += dx > 0 ? this.r - abs(dx) : -(this.r - abs(dx));
      } else {
        this.vel.y *= -1;
        this.pos.y += dy > 0 ? this.r - abs(dy) : -(this.r - abs(dy));
      }
      block.collision();
      const rowCleared = checkRow(block, block.row);

      if (rowCleared) {
        game.increaseScore(50);
        const oldSpeed = ballSpeed;
        ballSpeed = constrain(oldSpeed * 1.13, 3, maxBallSpeed);
        const factor = ballSpeed / oldSpeed;
        balls.forEach((b) => b.vel.mult(factor));
      } else {
        game.increaseScore(15);
      }
      collided = true;
    }
  }
  create() {
    drawingContext.save();
    drawingContext.shadowBlur = 20;
    drawingContext.shadowColor = color(255, 255, 255, 150);
    fill(color(this.clr));
    noStroke();
    circle(this.pos.x, this.pos.y, this.d);
    drawingContext.restore();
  }
}

class upBall extends Ball {
  move() {
    this.vel.y += this.grav;
    this.vel.y = constrain(this.vel.y, -ballSpeed * 3, ballSpeed * 3);
    if (this.pos.y <= this.r) {
      let i = balls.indexOf(this);
      if (i !== -1) {
        balls[i] = new Ball(this.pos.x, this.pos.y);
      }
    }
    super.move();
  }
}

class downBall extends Ball {
  move() {
    this.vel.y -= this.grav;
    super.move();
  }
}

class curveBall extends Ball {
  constructor(x, y, vel) {
    super(x, y);
    this.vel = vel.copy();
    this.ang = 0;
  }
  move() {
    this.ang += 0.1;
    const wobble = this.vel.x * sin(this.ang) * 2;
    this.pos.x += wobble;
    super.move();
  }
}

class PowerUp {
  constructor(x, y, i) {
    this.x = x;
    this.y = y;
    this.vx = random(-3, 3);
    this.vy = 5;
    this.r = 10;
    this.type = powerUpTypes[i].type;
    this.label = powerUpTypes[i].label || "";
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

    if (this.left <= 0 || this.right >= width) {
      this.vx *= -1;
    }
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
      paddle.collision();
      this.animateTxt();
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
      text(this.label, width / 2, height / 2);
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
    balls.push(new Ball(this.x, this.y));
  }
}

class extraLife extends PowerUp {
  effect() {
    game.lives++;
  }
}

class upGravity extends PowerUp {
  effect() {
    let og = balls[0];
    balls[0] = new upBall(og.pos.x, og.pos.y);
  }
}

class downGravity extends PowerUp {
  effect() {
    let og = balls[0];
    balls[0] = new downBall(og.pos.x, og.pos.y);
  }
}

class curveEffect extends PowerUp {
  effect() {
    let og = balls[0];
    balls[0] = new curveBall(og.pos.x, og.pos.y, og.vel);
  }
}

class stretchPaddle extends PowerUp {
  effect() {
    paddle.w += 50;
  }
}

powerUpTypes = [
  { type: "extraBall", label: "Extra Ball!", class: extraBall },
  { type: "extraLife", label: "Extra Life!", class: extraLife },
  { type: "extraLife", label: "Extra Life!", class: extraLife },
  { type: "upGravity", label: "Negative Gravity!", class: upGravity },
  { type: "upGravity", label: "Negative Gravity!", class: upGravity },
  { type: "downGravity", label: "Gravity!", class: downGravity },
  { type: "downGravity", label: "Gravity!", class: downGravity },
  { type: "curveEffect", label: "Curve Ball!", class: curveEffect },
  { type: "curveEffect", label: "Curve Ball!", class: curveEffect },
  { type: "stretchPaddle", label: "Stretch Paddle!", class: stretchPaddle },
  { type: "stretchPaddle", label: "Stretch Paddle!", class: stretchPaddle },
];

// ===== Main Functions =====
function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < blockCol; j++) {
      const blockWidth = width / blockCol;
      const blockHeight = 35;
      let pu = null;
      let rand = random();
      if (rand < 0.1) {
        pu = floor(random(powerUpTypes.length));
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
  game = new Game();
  balls.push(new Ball());
  paddle = new Paddle();
}

function draw() {
  background(0, 150);
  game.drawCenterTxt();
  game.drawScoreBoard();

  // create blocks
  for (const b of blocks) {
    b.create();
  }

  // Paddle Bouncer thingy
  paddle.control();
  paddle.create();

  // Ball
  if (game.started) {
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
    game.started = false;
  }
}

function checkRow(currentBlk, rowNum) {
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i] !== currentBlk && blocks[i].row === rowNum) {
      return false;
    }
  }
  return true;
}

// Play SFX
function playSfx(type) {
  if (sfx[type]) {
    sfx[type].currentTime = 0;
    sfx[type].play();
  }
}

// ===== Start game =====
function mouseClicked() {
  game.started = true;
}
