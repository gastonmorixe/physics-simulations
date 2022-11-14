// TODO 1. While dragging, should feel stiff, like a rubber band. Decay real dx/dy and dy/dx. The more it drags, the more it decays. It's somehow proportional to the oposite of the distance, decaying.
// TODO 2. Spring system
// TODO 3. Remove, Attach, Deattach a spring and mass in RT.
// TODO 4. Mouse click act as a force (attract, repele)

import { System } from "./System"

console.clear()

const sys = new System()

function setup() {
  createCanvas(400, 400 + 500)
  // frameRate(10)
  // rectMode(CENTER);
  sys.setup()
}

function draw() {
  background(180)
  sys.draw()
}
