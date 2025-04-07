///<reference path="../lib/p5.global.d.ts" />

let cl = console.log;

// ========== Variables ==========

let stars = [];
let lasers = [];
let targets = [];

let lvl = 1;
let lives = 3;

let targetSpawnInterval = 5;

let playerImg = {
  width: 430,
  height: 490,
  link: undefined,
};

let targetImg = {
  width: 530,
  height: 480,
  links: [undefined, undefined, undefined],
};

// ========== Preload ==========

function preload() {
  playerImg.link = loadImage("imgs/player.png");
  targetImg.links[0] = loadImage("imgs/target-1.png");
  targetImg.links[1] = loadImage("imgs/target-2.png");
  targetImg.links[2] = loadImage("imgs/target-3.png");
}

// ========== Classes ==========

class star {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.size = random(1, 5);
    this.velocity = 2;
  }

  create() {
    fill(255);
    noStroke();
    square(this.x, this.y, this.size);
  }
  animate() {
    this.y += this.velocity;
    if (this.y >= height + this.size / 2) {
      this.y = -this.size / 2;
    }
  }
}

class laser {
  constructor(mX) {
    this.x = mX;
    this.y = height - 290;
    this.velocity = 10;
    this.width = 10;
    this.height = 35;
  }

  shoot() {
    this.y -= this.velocity;
    if (this.y <= -17) {
      let laserIndex = lasers.indexOf(this);
      lasers.splice(laserIndex, 1);
    }
  }

  spawn() {
    fill(255);
    stroke("red");
    strokeWeight(3);
    rect(this.x - this.width / 2, this.y, this.width, this.height);
  }
}

class target {
  constructor() {
    this.x = random(width);
    this.y = 0;
    this.img = targetImg;
  }
  spawn() {
    image(this.img.links[0], this.x, this.y, this.img.width, this.img.height);
  }
}

// ========== Setup ==========

function setup() {
  // createCanvas(1000, 600);
  createCanvas(windowWidth, windowHeight);

  // Bg
  for (let i = 0; i < 200; i++) {
    stars.push(new star());
  }

  // Targets first wave
  for (let i = 0; i < 10; i++) {
    targets.push(new target());
  }
}

// ========== Draw ==========

function draw() {
  background(0);

  // Animate bg
  stars.forEach((star) => {
    star.create();
    star.animate();
  });

  // Player
  image(playerImg.link, mouseX - 70, height - 250, 140, 140 * (49 / 43));

  // Lasers
  lasers.forEach((laser) => {
    laser.spawn();
    laser.shoot();
  });

  // Targets

  if (frameCount % 60 === 0) {
    targets.forEach((target) => {
      target.spawn();
      target.move();
    });
  }
}

// ========== Mouse Clicked ==========

function mouseClicked() {
  lasers.push(new laser(mouseX));
  // lasers.push(new laser(mouseX + 70));
}
