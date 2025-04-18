///<reference path="../lib/p5.global.d.ts" />

let cl = console.log;

var snake;
var food;

var size = 40;
var foodIconSize = 50;

let cols, rows;

class Snake {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.speed = 5;
    this.vx = 1;
    this.vy = 0;
    this.nextVX = 1;
    this.nextVY = 0;
    this.length = 1;
    this.history = [];
  }

  move() {
    if (this.x % size === 0 && this.y % size === 0) {
      this.vx = this.nextVX;
      this.vy = this.nextVY;
    }

    this.x += this.vx * this.speed;
    this.y += this.vy * this.speed;
    this.x = constrain(this.x, 0, width - size);
    this.y = constrain(this.y, 0, height - size);

    this.history.push(createVector(this.x, this.y));

    const maxFrames = this.length * (size / this.speed) + 1;
    if (this.history.length > maxFrames) {
      this.history.splice(0, this.history.length - maxFrames);
    }
  }

  show() {
    noStroke();
    fill(0, 255, 0);

    const framesPerCell = size / this.speed;

    for (let i = 1; i < this.length; i++) {
      const idx = this.history.length - 1 - i * framesPerCell;
      if (idx >= 0) {
        const pos = this.history[floor(idx)];
        square(pos.x, pos.y, size);
      }
    }

    square(this.x, this.y, size);
  }

  changeDirection(xDir, yDir) {
    this.nextVX = xDir;
    this.nextVY = yDir;
  }

  grow() {
    this.length++;
  }

  die() {
    this.length = 1;
    this.history = [];
  }
}

class Food {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.s = size;
  }
  update() {
    this.x = Math.floor(random(1, cols - 2)) * size;
    this.y = Math.floor(random(1, rows - 2)) * size;
  }
  show() {
    let icon = "🍎";
    textAlign(CENTER, CENTER);
    textSize(foodIconSize);
    text(icon, this.x + size / 2, this.y + size / 2);
  }
}

function setup() {
  cols = Math.floor(windowWidth / size);
  rows = Math.floor(windowHeight / size);
  createCanvas(cols * size, rows * size);

  snake = new Snake();
  food = new Food();

  food.update();
}

function draw() {
  background(0, 70, 50);

  snake.move();
  snake.show();

  food.show();

  if (snake.x === food.x && snake.y === food.y) {
    food.update();
    snake.grow();
  }

  for (let i = 0; i < snake.history.length - 1; i++) {
    const t = snake.history[i];

    if (snake.x === t.x && snake.y === t.y) {
      console.log("DIE");
      snake.die();
    }
  }
}

function keyPressed() {
  if (keyCode === UP_ARROW && snake.vy === 0) {
    snake.changeDirection(0, -1);
  } else if (keyCode === DOWN_ARROW && snake.vy === 0) {
    snake.changeDirection(0, 1);
  } else if (keyCode === LEFT_ARROW && snake.vx === 0) {
    snake.changeDirection(-1, 0);
  } else if (keyCode === RIGHT_ARROW && snake.vx === 0) {
    snake.changeDirection(1, 0);
  }
}
