import { Thing } from "./Thing"

export class FixedThing extends Thing {
  get endPos() {
    return p5.Vector.add(this.position, createVector(0, width / 2))
  }

  setup() {
    super.setup()
  }

  draw() {
    super.draw()
  }
}
