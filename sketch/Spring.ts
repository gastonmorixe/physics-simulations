import { Thing } from "./Thing"

export class Spring extends Thing {
  stiffness: number
  damping: number
  length: p5.Vector
  displacement: p5.Vector //[p5.Vector, p5.Vector]
  initialPosition: p5.Vector
  initialLength: p5.Vector
  velocity: p5.Vector

  constructor(config: {
    stiffness?: number
    damping?: number
    length?: number
    position?: p5.Vector
    velocity?: p5.Vector
    // [x: displacement from prev, y: displacement from next]
    // TODO: this should be calculated based on position of particle
    displacement?: p5.Vector //[p5.Vector, p5.Vector]
    name: string
  }) {
    super(config)

    this.stiffness = config.stiffness || 1 / 10
    this.damping = config.damping || 1 / 4 // default: undamped
    this.length = createVector(0, config.length || 20)

    this.velocity = config.velocity || createVector(0, 0)
    this.displacement = config.displacement || createVector(0, 0)
    this.position = config.position || createVector(width / 2, 0)

    this.initialPosition = this.position.copy()
    // this.position.sub(this.displacement[0])
  }

  addBacklink(thing: TThing): void {
    super.addBacklink(thing)

    // if (this.displacement[0].mag() > 0) {
    //   console.log(`[Spring] [addBacklink] ${this.name} thing: ` + thing.name)
    //   thing.updatePrevLink((t) => {
    //     t.position.sub(this.displacement[0])
    //   })
    // }
  }

  addLink(thing: TThing): void {
    super.addLink(thing)

    // if (this.displacement[1].mag() > 0) {
    //   console.log(`[Spring] [addLink] ${this.name} thing: ` + thing.name)
    //   thing.updateNextLinks((t) => {
    //     t.position.add(this.displacement[1])
    //   })
    // }
  }

  get endPos() {
    return this.position.copy().add(this.length)
    // .add(this.displacement.copy().mult(1))
    // .sub(this.displacement[0])
    // .add(this.displacement[1])
  }

  get internalForce() {
    // F = ma = mx'' = mvdt
    // F = -k x => F = - (k) (displacement from equilibrium)

    // const originDy = this.displacement[0].y
    // const originForce = originDy * this.stiffness // * m

    // const endDy = this.displacement[0].y
    // const endForce = endDy * this.stiffness // * m

    const dy = this.displacement.y
    let forceY = dy * this.stiffness // * m

    // apply damping
    const veldy = this.velocity.y
    forceY += veldy * this.damping

    // TODO: consider particle mass later
    // TODO: X axis
    return createVector(0, forceY)
  }

  setup() {
    super.setup()
  }

  layoutDone() {
    this.initialPosition = this.position.copy()
    this.initialLength = this.length.copy()
  }

  get computedPosition() {
    if (!this.backLinks.length && !!this.links.length) {
      return this.position
    }
    return this.position //.copy() //.add(this.displacement.copy())
  }

  random = 0 //random(50) - random(50)

  renderPos: undefined | [p5.Vector, p5.Vector]
  //  = [createVector(0, 0), createVector(0, 0)]

  get finalPos() {
    const fp = this.computedPosition

    const x0 = fp.x + this.random
    const y0 = this.renderPos[0] ? this.renderPos[0].y : fp.y
    const x1 = this.endPos.x + this.random
    const y1 = this.renderPos[1] ? this.renderPos[1].y : this.endPos.y

    return [x0, y0, x1, y1]
  }
  draw() {
    // console.log(` [Spring] #draw [${this.name}] dis y:${this.displacement.y}`)

    // print(this.position)
    // print(this.endPos)
    // throw("stop")

    const [x0, y0, x1, y1] = this.finalPos

    strokeWeight(4) // stroke weight
    stroke(30) // stroke color
    fill(255) // fill color
    line(x0, y0, x1, Math.max(y1, 20))
    noStroke()
    circle(x0, y0, 5)
    circle(x0, y1, 5)

    super.draw(x0, y0, x1, y1)
  }
}
