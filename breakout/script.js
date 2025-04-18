///<reference path="../lib/p5.global.d.ts" />

let cl = console.log;

// ===== Global Variables =====

let ball;
let paddle;

let gameStarted = false;
let lives = 5;
let score = 0;

// bounce animation variables
let halo;
let particles = [];

let sfx = {
  paddle: new Audio("sfx/paddle.wav"),
  block: new Audio("sfx/block.wav"),
  life: new Audio("sfx/life.wav"),
};

// ===== block variables =====
let blocks = [];
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
let blockCol = 15;
// let angle = 0;

// ===== Classes =====

class Block {
  constructor(x, y, clr, width, height, row) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.clr = clr;
    this.row = row;
  }
  create() {
    fill(this.clr);
    stroke(0);
    strokeWeight(3);
    rect(this.x, this.y, this.width, this.height, 10);
  }
  remove() {
    let index = blocks.indexOf(this);
    blocks.splice(index, 1);
  }
}

class Paddle {
  constructor() {
    this.w = 200;
    this.h = 30;
    this.x = mouseX - this.w / 2;
    this.y = height - 200;
    this.br = this.h / 2;
  }

  control() {
    this.x = constrain(mouseX - this.w / 2, 0, width - this.w);
    // this.w = sin(angle) * 100 + 200;
    // angle += 0.1;
  }

  create() {
    fill(255);
    noStroke();
    rect(this.x, this.y, this.w, this.h, this.br);
  }
}

class Ball {
  constructor() {
    this.x = width / 2;
    this.y = 600;
    this.vx = 5;
    this.vy = -15;
    this.d = 30;
    this.r = this.d / 2;
  }
  move() {
    this.x += this.vx;
    this.y += this.vy;

    this.x = constrain(this.x, this.r, width - this.r);
    this.y = constrain(this.y, this.r, height - this.r);
  }
  create() {
    fill(255);
    noStroke();
    circle(this.x, this.y, this.d);
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
    circle(this.x, this.y, 10);
  }
}

class paddleHalo {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 200;
    this.h = 30;
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

// ===== setup =====
function setup() {
  createCanvas(windowWidth, windowHeight);

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < blockCol; j++) {
      let blockWidth = width / blockCol;
      let blockHeight = 40;

      if (i !== 4) {
        blocks.push(
          new Block(
            j * blockWidth,
            i * blockHeight,
            blockColors[i],
            blockWidth,
            blockHeight,
            i + 1
          )
        );
      }
    }
  }

  ball = new Ball();
  paddle = new Paddle();
}

let angle = 0;

// ===== draw =====
function draw() {
  background(0, 150);

  // Text
  textFont("Press Start 2P");

  let centerMsg = getCenterMsg();

  let txtClr = color(255);
  txtClr.setAlpha(255);
  fill(txtClr);
  if (!gameStarted) {
    textAlign(CENTER);
    textSize(30);
    text(centerMsg, width / 2 - 250, height / 2 - 50, 500);
  }

  // Score and lives text
  textAlign(LEFT);
  text(scoreStr(), width / 2 - 250, height - 40);
  text(heartStr(), width / 2 + 100, height - 40);

  for (const block of blocks) {
    block.create();
  }

  //   Paddle Bouncer thingy
  paddle.control();
  paddle.create();

  //   Ball
  if (gameStarted) {
    ball.move();
  }

  ball.create();

  checkPaddleBounce(ball, paddle);
  checkWallBounce(ball);
  checkBlockBounce(ball, blocks);

  // bounce animations

  particles.forEach((particle) => {
    particle.animate();
    particle.show();
  });

  if (halo) {
    halo.animate();
    halo.show();
  }

  if (blocks.length === 0) {
    gameStarted = false;
  }
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
  return String(score).padStart(3, "0");
}

function getCenterMsg() {
  let msg;
  if (lives < 0) {
    msg = "GAME OVER";
  } else if (lives > 0 && blocks.length <= 0) {
    msg = "YOU WIN!";
  } else {
    msg = "Click Mouse to Start Game";
  }
  return msg;
}

// bounce check for paddle, wall, and blocks

function checkPaddleBounce(b, p) {
  let pTop = p.y;
  let pBottom = p.y + p.h;
  let pLeft = p.x;
  let pRight = p.x + p.w;

  let bTop = b.y - b.r;
  let bBottom = b.y + b.r;
  let bLeft = b.x - b.r;
  let bRight = b.x + b.r;

  let isColliding =
    bBottom >= pTop &&
    bTop <= pBottom &&
    bRight >= pLeft &&
    bLeft <= pRight &&
    b.vy > 0;

  if (isColliding) {
    let bXCenter = b.x;
    let section = bXCenter - pLeft;

    let leftBounce = section < p.w / 3;
    let middleBounce = section >= p.w / 3 && section < (p.w / 3) * 2;
    let rightBounce = section >= (p.w / 3) * 2;

    if (leftBounce) {
      b.vx = 15;
    } else if (middleBounce) {
      b.vx *= Math.abs(b.vx) === 15 ? 1 / 3 : 1;
    } else if (rightBounce) {
      b.vx = -15;
    }

    // let relativeIntersectX = b.x - (p.x + p.w / 2);
    // let normalized = relativeIntersectX / (p.w / 2);
    // let maxSpeed = 15;
    // b.vx = normalized * maxSpeed;

    b.vy *= -1;
    b.y = p.y - b.r;
    playSfx(`paddle`);

    paddleAnimation(b.x, p.y);
  }
}

function checkWallBounce(b) {
  let bLeft = b.x - b.r;
  let bRight = b.x + b.r;
  let bTop = b.y - b.r;
  let bBottom = b.y + b.r;

  if (bLeft <= 0 || bRight >= width) {
    b.vx *= -1;
  }

  if (bTop <= 0) {
    b.vy *= -1;
  }

  if (bBottom >= height) {
    decreaseLives();
  }
}

function checkBlockBounce(b, blks) {
  for (let i = blks.length - 1; i >= 0; i--) {
    let block = blks[i];

    let blockLeft = block.x;
    let blockRight = block.x + block.width;
    let blockTop = block.y;
    let blockBottom = block.y + block.height;

    let closestX = constrain(b.x, blockLeft, blockRight);
    let closestY = constrain(b.y, blockTop, blockBottom);

    let distX = b.x - closestX;
    let distY = b.y - closestY;
    let distance = sqrt(distX * distX + distY * distY);

    if (distance < b.r) {
      let overlapX = b.r - abs(distX);
      let overlapY = b.r - abs(distY);

      if (overlapX < overlapY) {
        b.vx *= -1;
        b.x += distX > 0 ? overlapX : -overlapX;
      } else {
        b.vy *= -1;
        b.y += distY > 0 ? overlapY : -overlapY;
      }

      let removedBlock = blks[i];

      blockAnimation(
        removedBlock.x + removedBlock.width / 2,
        removedBlock.y + removedBlock.height / 2,
        removedBlock.clr
      );

      blks.splice(i, 1);

      let rowComplete = checkRow(removedBlock, removedBlock.row);

      playSfx(`block`);

      if (rowComplete === true) {
        increaseScore(50);
        cl("row complete");
      } else {
        increaseScore(10);
      }
    }
  }
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

// Play pop sfx
function playSfx(type) {
  if (sfx[type]) {
    sfx[type].currentTime = 0;
    sfx[type].play();
  }
}

// Paddle and Block bounce animations
function blockAnimation(x, y, clr) {
  for (let i = 0; i < 100; i++) {
    particles.push(new Particle(x, y, clr));
  }
}

function paddleAnimation(x, y) {
  halo = new paddleHalo(x, y);
}

// Score increase
function increaseScore(amount) {
  score += amount;
}

// Lives decrease
function decreaseLives() {
  lives = constrain(lives - 1, 0, 5);

  gameStarted = false;

  if (lives !== 0) {
    playSfx(`life`);
    ball = new Ball();
  }
}

// ===== Mouse click to start game =====
function mouseClicked() {
  gameStarted = true;
}
