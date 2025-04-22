///<reference path="../lib/p5.global.d.ts" />

class Game {
  constructor() {
    this.lives = 3;
    this.score = 0;
  }
  draw() {
    // draw scoreboard
  }
}

class Paddle {
  constructor() {
    this.x = 0;
    this.y = height - 60;
    this.width = 160;
    this.height = 20;
  }
  draw() {
    // this.x = mouseX - this.width / 2;
    this.x = ball.x - this.width / 2;
    fill("white");
    rect(this.x, this.y, this.width, this.height);
  }
}

class Ball {
  constructor() {
    this.x = random(0, width);
    this.y = height - 100;
    this.vx = 5;
    this.vy = -5;
  }
  draw() {
    if (this.x > width || this.x < 0) {
      this.vx = -this.vx;
    }
    if (this.y > height || this.y < 0) {
      this.vy = -this.vy;
    }

    if (
      this.y >= paddle.y &&
      this.y <= paddle.y + paddle.height &&
      this.x >= paddle.x &&
      this.x <= paddle.x + paddle.width
    ) {
      this.y = paddle.y - 10;
      this.vy = -this.vy;
    }

    fill("red");
    circle((this.x += this.vx), (this.y += this.vy), 20);
  }
}

class Target {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = targetWidth;
    this.height = 20;
  }
  draw() {
    if (
      ball.y <= this.y + this.height &&
      ball.y >= this.y &&
      ball.x >= this.x &&
      ball.x <= this.x + this.width
    ) {
      ball.vy = -ball.vy;

      let i = targets.indexOf(this);
      targets.splice(i, 1);
      game.score++;
    }

    fill("blue");
    noStroke();
    rect(this.x, this.y, this.width, this.height);
  }
}

let game;
let paddle;
let ball;
let targets = [];

let targetWidth;

var setup = function () {
  createCanvas(windowWidth, windowHeight);

  targetWidth = width / 12;
  let targetHeight = 20;

  game = new Game();
  paddle = new Paddle();
  ball = new Ball();

  for (let x = 0; x < 12; x++) {
    for (let y = 0; y <= 5; y++) {
      targets.push(new Target(x * targetWidth, y * targetHeight));
    }
  }
};

var draw = function () {
  background(66);
  // draw game
  game.draw();
  // draw ball
  ball.draw();
  // draw targets
  for (let target of targets) {
    target.draw();
  }
  // draw paddle
  paddle.draw();
};
