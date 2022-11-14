import { Thing } from "./Thing"

export class Particle extends Thing {
  mass: number
  velocity: p5.Vector
  force: p5.Vector
  initialPosition: p5.Vector
  initialVelocity: p5.Vector
  prevPosition: p5.Vector
  prevVelocity: p5.Vector
  // displacement?: p5.Vector

  constructor(config: {
    mass?: number
    velocity?: p5.Vector
    position?: p5.Vector
    force?: p5.Vector
    // Displacement from rest
    // displacement?: p5.Vector
    name: string
  }) {
    super(config)

    this.mass = config.mass || 0
    this.velocity = config.velocity || createVector(0, 0)
    this.position = config.position || createVector(width / 2, 0)
    // this.displacement = config.displacement || createVector(0, 0)
    this.force = config.force || createVector(0, 0) // null means will have createVector(0, 0)
  }

  applyForce() {
    if (this.force.mag() <= 0) {
      // console.log(`[Particle] [applyForce] ${this.name} has no force. Skipping.`)
      return
    }

    // this.velocity = createVector(
    //   this.velocity.x,
    //   this.velocity.y + this.force.y
    // )

    this.velocity.add(this.force)
    this.position.add(this.velocity)

    // for (let link of this.links) {
    //   console.log(`[Particle] [applyForce] ${link.thing.name}`)
    //   const thing = link.thing
    // }
  }

  get diffDisplacement() {
    return p5.Vector.sub(this.position, this.initialPosition)
  }

  get size() {
    return this.mass * 10
  }

  get endPos() {
    return p5.Vector.add(this.position, createVector(0, this.size))
  }

  setup() {
    super.setup()
  }

  layoutDone() {
    this.initialPosition = this.position.copy()
    this.initialVelocity = this.velocity.copy()

    this.prevPosition = this.initialPosition.copy()
    this.prevVelocity = this.initialVelocity.copy()
  }

  get diffFromPrevFrame() {
    return this.position.copy().sub(this.prevPosition)
  }

  get diffVelFromPrevFrame() {
    return this.velocity.copy().sub(this.prevVelocity)
  }

  diffs() {
    // const diffFromInit = this.diffDisplacement
    // const diffFromPrevFrame = this.diffFromPrevFrame
    // console.log(
    //   `[Particle] [draw] [${this.name}] fdx:${diffFromPrevFrame.x} fdy:${diffFromPrevFrame.y} | idx:${diffFromInit.x} idy: ${diffFromInit.y} | x:${this.position.x} y:${this.position.y}`
    // )
  }

  draw() {
    super.draw()

    this.diffs()

    const x0 = this.position.x
    const y0 = this.position.y

    const d = this.mass * 10

    strokeWeight(0) // stroke weight
    fill("yellow") // stroke color
    circle(x0, y0, d)

    this.prevPosition = this.position.copy()
    this.prevVelocity = this.velocity.copy()
  }
}
