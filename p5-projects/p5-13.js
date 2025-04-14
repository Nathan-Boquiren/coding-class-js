///<reference path="../lib/p5.global.d.ts" />

let cl = console.log;

let squares = [];

let size = 100;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);

  angleMode(DEGREES);

  for (let i = 0; i < Math.floor(height / size); i++) {
    for (let j = 0; j < Math.floor(width / size); j++) {
      let x = j * size + random(-i, i);
      let y = i * size + random(-i, i);
      let r = random(-i * 3, i * 3);
      let clr = 255 - random(i * 15);
      squares.push(new Square(x, y, r, clr));
    }
  }
}

class Square {
  constructor(x, y, r, clr) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.clr = clr;
  }

  draw() {
    push();
    translate(this.x, this.y);
    rotate(this.r);
    fill(this.clr);
    square(0, 0, size);
    pop();
  }
}

function draw() {
  background(0);
  for (let i = 0; i < squares.length; i++) {
    const s = squares[i];
    s.draw();
  }
}

// function mouseMoved() {
//   squares.forEach((s) => {
//     let d = Math.abs(dist(s.x, s.y, mouseX, mouseY));
//     if (d <= 100) {
//       let r = random(-10, 10);
//       s.r += r;
//       s.x += r;
//       s.y += r;
//       s.clr -= r;
//     }
//   });
// }
