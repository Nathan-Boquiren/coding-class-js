///<reference path="../lib/p5.global.d.ts" />

let cl = console.log;

let palatte = [];

let canvasSize = document.getElementById("canvasSize").value;
let currentClr = document.getElementById("current-clr").value;

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
        this.blks.push(new Block(x * this.blkSize, y * this.blkSize, this.blkSize, 255))
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
    this.clr = color(clr);
  }

  create() {
    stroke(150);
    fill(this.clr);
    square(this.x, this.y, this.s);
  }

  paint(newClr) {
    this.clr = newClr;
  }
}

let grid;

function setup() {
  createCanvas(600, 600);
  let initialSize = document.getElementById("canvasSize").value;
  grid = new Grid(initialSize);
  grid.create();
}

function draw() {
  background(100);
  currentClr = color(document.getElementById("current-clr").value);

  for (const b of grid.blks) {
    b.create();
  }
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
    if (d <= b.halfSize) b.paint(currentClr);
  }
}
