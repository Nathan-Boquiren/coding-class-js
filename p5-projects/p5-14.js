///<reference path="../lib/p5.global.d.ts" />

var audio;
var fft;
var btn;

function togglePlay() {
  if (audio.isPlaying()) {
    audio.pause();
  } else {
    audio.play();
  }
}

function preload() {
  audio = loadSound("audio-3.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  btn = createButton("toggle");
  btn.position(width / 2 - btn.width / 2, 800);
  btn.mousePressed(togglePlay);
  fft = new p5.FFT(0.9, 256);
  // angleMode(DEGREES);
}

let a = 0;

function draw() {
  background(0);

  translate(width / 2, height / 2);

  let spectrum = fft.analyze();
  noStroke();
  colorMode(HSB);

  let angleStep = 360 / spectrum.length;

  rotate(radians(a));
  a += 0.3;

  for (let i = 0; i < spectrum.length; i++) {
    let amp = spectrum[i];
    let radius = map(amp, 0, 256, 10, 400);
    let hue = map(i, 0, spectrum.length, 0, 360);

    push();
    rotate(i * angleStep);
    fill(hue, 255, 255);
    rect(0, 0, 10, radius, 5);
    pop();
  }
}
