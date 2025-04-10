///<reference path="../lib/p5.global.d.ts" />

let cl = console.log;

// ========== Variables ==========

let stars = [];
let lasers = [];
let targets = [];

let lvl = 1;
let hc = 0;
let lives = 3;

let lvlIncreaseFactor = 10;
let targetSpawnRate = 60;
let targetVelocity = 4;

let playerImg = {
  // width: 430,
  // height: 490,
  link: undefined,
};

let plr;

let targetImg;

// ========== Preload ==========

function preload() {
  playerImg.link = loadImage("imgs/player.png");
  targetImg = {
    hp_3: loadImage("imgs/target-1-hp-3.png"),
    hp_2: loadImage("imgs/target-1-hp-2.png"),
    hp_1: loadImage("imgs/target-1-hp-1.png"),
  };
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

class player {
  constructor() {
    this.width = 86;
    this.halfWidth = this.width / 2;
    this.height = 98;
    this.x = 0;
    this.y = height - 130;
  }

  control() {
    if (mouseX <= this.halfWidth) {
      this.x = 0;
    } else if (mouseX >= width - this.halfWidth) {
      this.x = width - this.width;
    } else {
      this.x = mouseX - this.halfWidth;
    }
  }
  create() {
    image(playerImg.link, this.x, this.y, this.width, this.height);
  }
}

class laser {
  constructor(mX) {
    this.x = mX;
    this.y = plr.y + 25;
    this.velocity = 10;
    this.width = 5;
    this.height = 20;
    this.impact = false;
    this.passed = false;
  }

  shoot() {
    this.y -= this.velocity;
    if (this.y <= -17) {
      let index = lasers.indexOf(this);
      lasers.splice(index, 1);
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
    this.width = 96;
    this.height = 82;
    this.x = random(this.width, width - this.width);
    this.y = 0;
    this.velocity = random(targetVelocity, targetVelocity + 3);
    this.img = targetImg.hp_3;
    this.hp = 3;
    this.passed = false;
  }

  spawn() {
    if (this.hp === 2) {
      this.img = targetImg.hp_2;
    } else if (this.hp === 1) {
      this.img = targetImg.hp_1;
    } else {
    }
    image(this.img, this.x, this.y - this.height, this.width, this.height);
  }

  animate() {
    this.y += this.velocity;
    if (this.y >= height + this.height) {
      let index = targets.indexOf(this);
      targets.splice(index, 1);
    }
  }
}

// ========== Setup ==========

function setup() {
  createCanvas(1100, 650);

  // Bg
  for (let i = 0; i < 200; i++) {
    stars.push(new star());
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

  plr = new player();
  plr.control();
  plr.create();

  // Targets
  if (frameCount % targetSpawnRate === 0) {
    for (let i = 0; i < Math.min(1 + Math.floor(lvl / 5), 3); i++) {
      targets.push(new target());
    }
  }

  targets.forEach((target) => {
    target.spawn();
    target.animate();
  });

  // Lasers
  lasers.forEach((laser) => {
    laser.spawn();
    laser.shoot();
  });

  // Check Laser and Target Collision / Pass
  checkCollision();
  checkTargetPass();
  checkLaserPass();

  // Lvl Progress Bar
  push();
  progressBar();
  pop();

  // DOM Info Elements

  document.getElementById("lvl").innerText = lvl;
  document.getElementById("lives").innerText = lives.toFixed(1);
}

// COllision And Target Pass Check

function checkCollision() {
  lasers.forEach((laser) => {
    let lX = laser.x;
    let lY = laser.y;
    let lHalfHeight = laser.height / 2;
    let lHalfWidth = laser.width / 2;

    targets.forEach((target) => {
      let tLeft = target.x;
      let tRight = tLeft + 170;

      let lTop = lY - lHalfHeight;
      let lLeft = lX - lHalfWidth;
      let lRight = lX + lHalfWidth;

      let xAligned = lRight > tLeft && lLeft < tRight;
      let yAligned = lTop <= target.y;

      if (
        xAligned &&
        yAligned &&
        laser.impact === false &&
        laser.passed === false &&
        target.passed === false
      ) {
        updateTargetHp(target, laser);
        laser.impact = true;
      }
    });
  });
}

function checkTargetPass() {
  targets.forEach((target) => {
    if (target.y >= plr.y && target.passed === false) {
      lives -= 0.5;
      target.passed = true;
    }
    if (lives <= 0) {
      lives = 0;
      endGame();
    }
  });
}

function checkLaserPass() {
  lasers.forEach((laser) => {
    if (laser.y <= 0) {
      laser.passed = true;
    }
  });
}

// Remove target

function updateTargetHp(target, laser) {
  target.hp--;
  lasers.splice(lasers.indexOf(laser), 1);
  if (target.hp <= 0) {
    let index = targets.indexOf(target);
    targets.splice(index, 1);

    // Increase Hit Count
    increaseHc();
  }
}

// Increase Hit Count

function increaseHc() {
  hc++;
  if (hc % lvlIncreaseFactor === 0) {
    increaseLvl();
  }
}

// Increase Lvl and Difficulty

function increaseLvl() {
  lvl++;
  hc = 0;
  lvlIncreaseFactor++;
  targetVelocity += 0.5;

  if (targetSpawnRate > 45) {
    targetSpawnRate -= 5;
  }
}

// Progress Bar
function progressBar() {
  let barHeight = 300;
  let barWidth = 20;
  let yCenter = height / 2;
  let barY = yCenter - barHeight / 2;

  noStroke();
  fill(255, 50);
  rect(10, barY, barWidth, barHeight, 10);

  // Progress calculation
  let progress = (hc / lvlIncreaseFactor) * barHeight;
  progress = constrain(progress, 0, barHeight);

  fill(255, 0, 0, 80);
  let progressY = barY + barHeight - progress;
  rect(10, progressY, barWidth, progress, 10);
}

// ========== Mouse Clicked ==========

function mouseClicked() {
  lasers.push(new laser(mouseX - plr.halfWidth + 3));
  lasers.push(new laser(mouseX + plr.halfWidth - 3));
}

// ========== End Game ==========

function endGame() {
  cl("========== End Game ==========");
}
