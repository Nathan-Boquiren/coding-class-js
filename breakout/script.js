///<reference path="../lib/p5.global.d.ts" />

let cl = console.log;

// ===== Global Variables

let ball;
let paddle;

let gameStarted = false;
let lives = 5;
let score = 0;

// ===== block variables =====

let blocks = [];

let blockColors = [
  "red",
  " orange",
  "yellow",
  "green",
  "blue",
  "purple",
  "cyan",
];

let blockCol = 15;

// ===== Classes =====

class Block {
  constructor(x, y, clr, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.clr = clr;
    this.hit = false;
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
    this.x = mouseX - this.width / 2;
    this.y = height - 200;
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
// ===== setup =====

function setup() {
  createCanvas(windowWidth, windowHeight);

  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < blockCol; j++) {
      let blockWidth = width / blockCol;
      let blockHeight = 40;
      blocks.push(
        new Block(
          j * blockWidth,
          i * blockHeight,
          blockColors[i],
          blockWidth,
          blockHeight
        )
      );
    }
  }

  ball = new Ball();
  paddle = new Paddle();
}

// ===== draw =====

function draw() {
  background(0);

  // Text
  textFont("Press Start 2P");
  let centerMsg = lives > 0 ? "Click Mouse to Start Game" : "GAME OVER";

  if (!gameStarted) {
    fill(255);
    textAlign(CENTER);
    textSize(20);
    text(centerMsg, width / 2 - 150, height / 2 - 50, 300);
  }

  // Score and lives text
  textAlign(LEFT);
  text(scoreStr(), width / 2 - 100, height - 40);
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
}

// Make lives adn score strings

function heartStr() {
  let hearts = [];
  for (let i = 0; i < lives; i++) {
    hearts.push("❤️");
  }
  return hearts.join("");
}

function scoreStr() {
  return score < 10 ? "0" + score : score;
}

// bounce check for paddle, wall, and blocks

function checkPaddleBounce(b, p) {
  let pTopEdge = p.y + p.h / 2;
  let pLeftEdge = p.x;
  let pRightEdge = p.x + p.w;

  let bBottomEdge = b.y + b.r;
  let bTopEdge = b.y;
  let bXCenter = b.x + b.r;

  let xAligned = pLeftEdge <= bXCenter && pRightEdge >= bXCenter;
  let yAligned = pTopEdge >= bBottomEdge && bTopEdge >= pTopEdge - b.d;
  if (xAligned && yAligned) {
    let section = bXCenter - pLeftEdge;

    let leftBounce = section < p.w / 3;
    let middleBounce = section >= p.w / 3 && section < (p.w / 3) * 2;
    let rightBounce = section >= (p.w / 3) * 2;

    if (leftBounce) {
      b.vx = 15;
    } else if (middleBounce) {
      b.vx *= Math.abs(b.vx) === 15 ? 1 / 3 : 1;
    } else if (rightBounce) {
      b.vx = -15;
    } else {
      ("bounce");
    }
    b.vy *= -1;
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

      blks.splice(i, 1);
      increaseScore();
    }
  }
}

// Score increase

function increaseScore() {
  score++;
}

// Lives decrease

function decreaseLives() {
  lives = constrain(lives - 1, 0, 5);

  gameStarted = false;

  if (lives !== 0) {
    ball = new Ball();
  }
}

// ===== Mouse click to start game =====

function mouseClicked() {
  gameStarted = true;
}
