import { genId, createLink } from "./utils"
import { ROOT_NODE } from "./GraphNode"
import { FixedThing } from "./FixedThing"

export abstract class Thing {
  id: string
  name: string
  links: TLink[] // SET?
  backLinks: TLink[] // SET?
  time: number
  position: p5.Vector

  constructor(config: { name: string }) {
    this.id = genId(this.constructor.name.toString())
    this.name = config.name
    this.links = []
    this.backLinks = []
    this.time = millis()
  }

  layoutDone() {}

  addBacklink(thing: TThing) {
    const link = createLink(thing)
    this.backLinks.push(link)
  }

  addLink(thing: TThing) {
    // backLink
    const link = createLink(thing)
    this.links.push(link)
    ROOT_NODE.addNode(this, link)

    // filter fixed/static/wall thing
    if (link.thing.constructor !== FixedThing) {
      link.thing.addBacklink(this)
    }
  }

  get endPos(): p5.Vector {
    return
  }

  setup() {}

  // everySecond() { }

  //   everySecondCheck() {
  //     const wait = 1000
  //     if(millis() - this.time >= wait){
  //       console.log(wait, "ms passed")
  //       this.everySecond()
  //       //also update the stored time
  //       this.time = millis()
  //     }
  //   }

  updateNextLinks(cb: (thing: TThing) => void) {}

  updatePrevLink(cb: (thing: TThing) => void) {
    const rootNode = ROOT_NODE.findNode(this)
    rootNode.transverseBackwards((node, prevNode) => {
      console.log(
        `[Thing] ${node.value.name} [updatePrevLink] transverseBackwards`
      )
      cb(node.value)
    })
  }

  draw(x0?: number, y0?: number, x1?: number, y1?: number) {
    // this.everySecondCheck()
    // console.log(
    //   `   #draw [${this.constructor.name}] [${this.name}] pos x:${this.position.x} y:${this.position.y}`
    // )

    strokeWeight(0)
    stroke(0) // stoke color
    fill(0) // fill color
    const label = `${this.name} (${this.id})`
    text(
      label,
      this.position.x + 10,
      this.endPos
        ? p5.Vector.add(
            this.position,
            p5.Vector.sub(this.endPos, this.position).mult(0.5)
          ).y
        : 0
    )
  }
}
