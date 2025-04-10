///<reference path="../lib/p5.global.d.ts" />

let cl = console.log;

// ===== blocks =====

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
    stroke(20);
    strokeWeight(3);
    rect(this.x, this.y, this.width, this.height, 10);
  }
  remove() {
    let index = blocks.indexOf(this);
    blocks.splice(index, 1);
  }
}

// ===== paddle =====

class Paddle {
  constructor() {
    this.x = mouseX - 150 / 2;
    this.y = height - 100;
    this.w = 150;
    this.h = 30;
    this.br = this.h / 2;
  }

  control() {
    this.x = mouseX - 150 / 2;
  }

  create() {
    fill(255);
    noStroke();
    rect(this.x, this.y, this.w, this.h, this.br);
  }
}

// ===== ball =====

class Ball {
  constructor() {
    this.x = width / 2;
    this.y = 400;
    this.vx = 5;
    this.vy = 15;
    this.d = 30;
    this.r = this.d / 2;
  }
  move() {
    this.x += this.vx;
    this.y += this.vy;
  }
  create() {
    fill(255);
    noStroke();
    circle(this.x, this.y, this.d);
  }
}

let ball;
let paddle;

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

function draw() {
  background(20);

  for (const block of blocks) {
    block.create();
  }

  //   Paddle Bouncer thingy
  paddle.control();
  paddle.create();

  //   Ball
  ball.move();
  ball.create();

  checkPaddleBounce(ball, paddle);
  checkWallBounce(ball);
  checkBlockBounce(ball, blocks);
}

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
    return (b.vy *= -1);
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

  if (bTop <= 0 || bBottom >= height) {
    b.vy *= -1;
  }
}

function checkBlockBounce(b, blks) {
  let bLeft = b.x - b.r;
  let bRight = b.x + b.r;
  let bTop = b.y - b.r;
  let bBottom = b.y + b.r;

  for (const block of blks) {
    let blockLeft = block.x;
    let blockRight = block.x + block.width;
    let blockBottom = block.y + b.r;
    let blockTop = block.y;

    let xAligned = blockLeft <= bLeft && blockRight >= bRight;
    let yAligned =
      (blockBottom <= bTop && bTop <= blockBottom + b.d) ||
      (blockTop >= bBottom && bBottom >= blockTop - b.r);

    if (xAligned && yAligned) {
      b.vy *= -1;
      let index = blks.indexOf(block);
      blks.splice(index, 1);
    }
  }
}
