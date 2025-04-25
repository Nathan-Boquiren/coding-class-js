///<reference path="../lib/p5.global.d.ts" />

let cl = console.log;

let palatte = [];

let canvasSize = document.getElementById("canvasSize").value;
let currentClr = document.getElementById("current-clr").value;
const palatteContainer = document.getElementById("palatte");

class Grid {
  constructor(size) {
    size = parseInt(size, 10);
    this.blkSize = width / size;
    this.rowNum = floor(height / this.blkSize);
    this.colNum = floor(width / this.blkSize);
    this.blks = [];
  }
  create() {
    for (let x = 0; x < this.rowNum; x++) {
      for (let y = 0; y < this.colNum; y++) {
        // prettier-ignore
        this.blks.push(new Block(x * this.blkSize, y * this.blkSize, this.blkSize, '#ffffff'))
      }
    }
  }
}

class Block {
  constructor(x, y, s, clr) {
    this.x = x;
    this.y = y;
    this.s = s;
    this.halfSize = this.s / 2;
    this.clr = clr;
    this.painted = false;
  }

  create() {
    if (!this.painted) {
      stroke(150);
    } else {
      noStroke();
    }

    fill(color(this.clr));
    square(this.x, this.y, this.s);
  }

  paint(newClr) {
    this.clr = newClr;
  }
}

let grid;

function setup() {
  createCanvas(600, 600);
  grid = new Grid(canvasSize);
  grid.create();
}

function draw() {
  background(255);
  currentClr = document.getElementById("current-clr").value;

  for (const b of grid.blks) {
    b.create();
  }

  updatePalatte();
}

function mousePressed() {
  paintBlocks();
}

function mouseDragged() {
  paintBlocks();
}

function paintBlocks() {
  for (const b of grid.blks) {
    let d = dist(mouseX, mouseY, b.x + b.halfSize, b.y + b.halfSize);
    if (d <= b.halfSize) {
      b.paint(currentClr);
      b.painted = true;
    }
  }
}

function updatePalatte() {
  for (let i = 0; i < grid.blks.length; i++) {
    const blk = grid.blks[i];
    const clr = grid.blks[i].clr;
    if (!palatte.includes(clr) && blk.painted) {
      palatte.push(clr);
      palatte = [...new Set(palatte)];
      palatteContainer.innerHTML += `
      <span class="p-clr ${clr}" style="background-color: ${clr}"></span>
    `;
    }
  }
}

document.getElementById("canvasSize").addEventListener("input", () => {
  canvasSize = document.getElementById("canvasSize").value;
  setup();
});

document.querySelectorAll(".p-clr").forEach((pClr) => {
  pClr.addEventListener("click", () => {
    cl("clicked");
    // cl(pClr.classList);
  });
});
