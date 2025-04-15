///<reference path="../lib/p5.global.d.ts" />

var snake;
var food;

var size = 40;
var foodIconSize = 50;

let cols, rows;

class Snake {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.vx = 1;
    this.vy = 0;
    this.currentDir = "RIGHT";
    this.length = 1;
    this.tail = [];
  }

  move() {
    this.x = constrain(this.x + this.vx * size, 0, width - size);
    this.y = constrain(this.y + this.vy * size, 0, height - size);

    if (
      (this.x === 0 && this.currentDir === "LEFT") ||
      (this.x === width - size && this.currentDir === "RIGHT")
    ) {
      if (this.y < height / 2) {
        this.changeDirection(0, 1);
        this.currentDir = "DOWN";
      } else {
        this.changeDirection(0, -1);
        this.currentDir = "UP";
      }
    }
    if (
      (this.y === 0 && this.currentDir === "UP") ||
      (this.y === height - size && this.currentDir === "DOWN")
    ) {
      if (this.x < width / 2) {
        this.changeDirection(1, 0);
        this.currentDir = "RIGHT";
      } else {
        this.changeDirection(-1, 0);
        this.currentDir = "LEFT";
      }
    }

    this.tail.push(createVector(this.x, this.y));

    if (this.tail.length > this.length) {
      this.tail.shift();
    }
  }

  show() {
    noStroke();
    fill(0, 255, 0);

    for (let i = 0; i < this.tail.length; i++) {
      let t = this.tail[i];

      if (i === this.tail.length - 1) {
        square(this.x, this.y, size);
      } else {
        square(t.x, t.y, size);
      }
    }
  }

  changeDirection(x, y) {
    this.vx = x;
    this.vy = y;
  }

  grow() {
    this.length++;
  }

  die() {
    this.length = 1;
    this.tail = [];
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
  frameRate(10);

  food.update();
}

function draw() {
  background(0, 100);

  snake.move();
  snake.show();

  food.show();

  if (snake.x === food.x && snake.y === food.y) {
    food.update();
    snake.grow();
  }

  for (let i = 0; i < snake.tail.length - 1; i++) {
    const t = snake.tail[i];

    if (snake.x === t.x && snake.y === t.y) {
      console.log("DIE");
      snake.die();
    }
  }
}

function keyPressed() {
  if (keyCode === UP_ARROW && snake.currentDir !== "DOWN") {
    snake.changeDirection(0, -1);
    snake.currentDir = "UP";
  } else if (keyCode === DOWN_ARROW && snake.currentDir !== "UP") {
    snake.changeDirection(0, 1);
    snake.currentDir = "DOWN";
  } else if (keyCode === LEFT_ARROW && snake.currentDir !== "RIGHT") {
    snake.changeDirection(-1, 0);
    snake.currentDir = "LEFT";
  } else if (keyCode === RIGHT_ARROW && snake.currentDir !== "LEFT") {
    snake.changeDirection(1, 0);
    snake.currentDir = "RIGHT";
  }
}
