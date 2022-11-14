import { ROOT_NODE, GraphNode } from "./GraphNode"
import { Spring } from "./Spring"
import { Particle } from "./Particle"
import { FixedThing } from "./FixedThing"

export class System {
  things = new Set<TThing>()

  constructor() {}

  calculateInitialPosOfNode(
    node: GraphNode,
    prevEdge: GraphNode | null = null
  ) {
    if (node.value.constructor !== FixedThing) {
      const prevPos =
        prevEdge && prevEdge.value.constructor !== FixedThing
          ? createVector(0, prevEdge.value.endPos.y)
          : createVector(0, 0)
      node.value.position = p5.Vector.add(node.value.position, prevPos)
    }
  }

  calculateInitialPos(node = ROOT_NODE, prevEdge: GraphNode | null = null) {
    this.calculateInitialPosOfNode(node, prevEdge)

    for (const edge of node.edges) {
      this.calculateInitialPos(edge, node)
    }
  }

  addThing(thing: TThing) {
    this.things.add(thing)
  }

  removeThing(thingId: string) {
    this.things.forEach((t, tt, set) => {
      if (t.constructor === FixedThing && t.id === thingId) {
        set.delete(t)
      }
    })
  }

  computeForces() {
    // console.log(`---------------------- [computeForces]`)

    // ROOT_NODE.transverse((node, prevNode) => {
    //   if (node.value.constructor === FixedThing) {
    //     return
    //   }
    //   if ("internalForce" in node.value) {
    //     console.log(`[computeForces] ${node.value.name}`, {
    //       internalForce: node.value.internalForce,
    //       node,
    //     })
    //     for (let link of node.value.links) {
    //       // 7890-
    //     }
    //     // node.value.force = null
    //   }
    // }, ROOT_NODE)

    // TODO: how can i do things whitout relying in the graph back "next/prev"

    // const appliedForces = new Map<TThing, Set<TThing>>()

    for (const thing of this.things) {
      // When thing is a Spring
      if ("internalForce" in thing) {
        // init appliedForces
        // TODO: we may be re-setting for thing duplicated
        // for (const link of thing.links) {
        //   if ("force" in link.thing) {
        //     appliedForces.set(link.thing, new Set())
        //   }
        // }
        // for (const link of thing.backLinks) {
        //   if ("force" in link.thing) {
        //     appliedForces.set(link.thing, new Set())
        //   }
        // }

        // thing = Spring
        const force = thing.internalForce

        if (thing.backLinks.length && thing.links.length) {
          // TODO: consider last case without end spring
          // TODO: consider case when attached to fixed thing
          // if(thing.backLinks.find(l => l.thing.constructor ===FixedThing)) {
          // }
          // Divider spring force by two, it's applied equially to both sides
          force.mult(0.5)
        }

        // for (const force of forces) {
        if (force.mag() <= 0) {
          // skip acc this force if it's cero
          continue
        }

        // console.log(
        //   `[computeForces] Spring [${thing.name}] internalforce ${force}`
        // )

        for (const prevLink of thing.links) {
          if ("force" in prevLink.thing) {
            // console.log(
            //   `[computeForces] ++ Particle [${prevLink.thing.name}] [prev] ${force} `
            // )

            prevLink.thing.force.add(p5.Vector.mult(force, -1))
            // appliedForces.get(prevLink.thing).add(thing)
          }
        }

        // todo: refactor this logic duplicated fors just because link/backlink
        for (const nextLink of thing.backLinks) {
          if ("force" in nextLink.thing) {
            // console.log(
            //   `[computeForces] ++ Particle [${nextLink.thing.name}] [next] ${force}`
            // )

            nextLink.thing.force.add(force)
            // appliedForces.get(nextLink.thing).add(thing)
          }
        }
      }
    }

    // TODO! update spring when applying forces displacements

    // console.log(`[computeForces] ------- Final forces:`)

    // Get final forces
    for (const thing of this.things) {
      if ("force" in thing) {
        // Particle
        // console.log(
        //   `[computeForces] Particle [${thing.name}] force ${thing.force}`
        // )
      }
    }
  }

  applyForces() {
    // console.log("[System] [applyForces]")

    // Particles
    for (const thing of this.things) {
      if ("force" in thing) {
        thing.applyForce()
      }
    }

    // Springs
    for (const thing of this.things) {
      if ("displacement" in thing) {
        const backLinksFrameDy = thing.backLinks.reduce((acc, link) => {
          if ("diffFromPrevFrame" in link.thing) {
            return acc.add(link.thing.diffFromPrevFrame)
          }
          return acc
        }, createVector(0, 0))

        const backLinksFrameVelDy = thing.backLinks.reduce((acc, link) => {
          if ("diffVelFromPrevFrame" in link.thing) {
            return acc.add(link.thing.diffVelFromPrevFrame)
          }
          return acc
        }, createVector(0, 0))

        const linksFrameDy = thing.links.reduce((acc, link) => {
          if ("diffFromPrevFrame" in link.thing) {
            return acc.add(link.thing.diffFromPrevFrame)
          }
          return acc
        }, createVector(0, 0))

        const linksFrameVelDy = thing.links.reduce((acc, link) => {
          if ("diffVelFromPrevFrame" in link.thing) {
            return acc.add(link.thing.diffVelFromPrevFrame)
          }
          return acc
        }, createVector(0, 0))

        const totalFrameDy = backLinksFrameDy.copy().mult(-1).add(linksFrameDy)
        const totalVelFrameDy = backLinksFrameVelDy
          .copy()
          .mult(-1)
          .add(linksFrameVelDy)

        // console.log("totalVelFrameDy", totalVelFrameDy)

        // console.log(
        //   `[System] #adjust displacements ${thing.name} ajust dis. disY:${thing.displacement.y} blFdy:${backLinksFrameDy.y}  nlFdy:${linksFrameDy.y} | tfdy:${totalFrameDy.y}`
        // )

        thing.velocity.add(totalVelFrameDy)
        thing.displacement.add(totalFrameDy)

        // if (!!thing.backLinks.length) {
        // thing.position.sub(totalFrameDy.copy().mult(-0.5))
        // }
        // thing.length.add(totalFrameDy.copy().mult(-0.5))

        // todo adjust displacement
        // todo adjust positions (or automatically)
        // re-render position accordingly

        // thing.displacement.sub(backLinksFrameDy)
      }
    }
  }

  clearForces() {
    // console.log`---------------------- [clearForces]`

    // ROOT_NODE.transverse((node, _prevNode) => {
    //   if (node.value.constructor === FixedThing) {
    //     return
    //   }

    //   if (node.value.constructor === Spring) {
    //     console.log(`[clearForces] ${node.value.name}`, {
    //       force: node.value.internalForce,
    //       node,
    //     })
    //     // node.value.internalForce = null
    //   } else {
    //     console.log(`[clearForces] ${node.value.name} no force, skipping`, {
    //       // force: node.value.force,
    //       node,
    //     })
    //   }
    // }, ROOT_NODE)

    for (const thing of this.things) {
      if ("force" in thing) {
        thing.force = createVector(0, 0)
      }
    }
  }

  addInitialThings() {
    // Spring 1
    const s1 = new Spring({
      name: "s1",
      length: 100,
      stiffness: 1 / 100000,
      damping: 0.7,
    })
    this.addThing(s1)

    s1.addLink(new FixedThing({ name: "w1" })) // s1 starts attached fixed at the top-wall

    // Particle 1
    const p1 = new Particle({
      name: "p1",
      mass: 1,
    })
    this.addThing(p1)

    s1.addLink(p1) // s1 ends attached to p1

    // Spring 2
    const s2 = new Spring({
      name: "s2",
      length: 50,
      // stiffness: 1,
      displacement: createVector(0, -25), //[createVector(0, 25), createVector(0, 0)],
    })
    this.addThing(s2)

    p1.addLink(s2) // s1 ends attached to p1

    // Particle 2
    const p2 = new Particle({
      name: "p2",
      mass: 1,
    })
    this.addThing(p2)

    s2.addLink(p2) // s2 ends attached to p2

    // console.log("[root node]", ROOT_NODE)

    // Spring 3
    const s3 = new Spring({
      name: "s3",
      length: 150,
      // damping: 1.1,
      displacement: createVector(0, 50),
      // stiffness: 1.1,
    })
    this.addThing(s3)

    p2.addLink(s3) // p3 ends attached to s3

    // Particle 3
    const p3 = new Particle({
      name: "p3",
      mass: 3,
    })
    this.addThing(p3)

    s3.addLink(p3) // s3 ends attached to p2
  }

  drawThings() {
    for (const thing of this.things) {
      if ("renderPos" in thing) {
        thing.renderPos = [
          thing.links.length > 0
            ? thing.links[0].thing?.position?.copy()
            : undefined,
          thing.backLinks.length > 0
            ? thing.backLinks[0].thing?.position?.copy()
            : thing.links
                .find((l) => l.thing.constructor !== FixedThing)
                .thing?.position?.copy(), // pink the first non-wall thing
        ]
      }
      if ("draw" in thing) {
        thing.draw()
      }
    }
  }

  notifyLayoutDone() {
    for (const thing of this.things) {
      if ("layoutDone" in thing) {
        thing.layoutDone()
      }
    }
  }

  points: GPoint[] = []

  drawGraph() {
    // Create a new plot and set its position on the screen

    // const seed = 100 * random()

    const t = Array.from(this.things).find((t) => t.constructor === Particle)

    if (!(t && "diffFromPrevFrame" in t)) {
      return
    }

    if (frameCount > 10) {
      if (t.diffFromPrevFrame.mag() <= 0.000009) {
        this.points.push(null)
      }
    }

    if (this.points[this.points.length - 1] !== null) {
      this.points.push(new GPoint(frameCount - 1, t.position.y))
    }

    const plot = new GPlot(window)
    plot.setPos(0, 400)
    plot.setOuterDim(width, 300)

    // Add the points
    plot.setPoints(this.points.filter((p) => p !== null))

    // Set the plot title and the axis labels
    plot.setTitleText("Damped mass-spring system")
    plot.getXAxis().setAxisLabelText("x axis")
    plot.getYAxis().setAxisLabelText("y axis")

    // Draw it!
    plot.defaultDraw()
  }

  setup() {
    this.addInitialThings()
    this.calculateInitialPos()
    this.notifyLayoutDone()
  }

  draw() {
    // console.clear()

    // console.log(``)
    // console.log(``)
    // console.log(
    //   `System [draw] ---- ${Math.round(millis())}ms Frame ${frameCount}`
    // )

    this.clearForces()

    this.computeForces()

    this.drawGraph()

    this.drawThings()

    // if (mouseIsPressed) {
    this.applyForces()
    // }

    // TODO: Graph all springs positions, vel, acc/forces
    // Graph in time
    // TODO add drag
    // TODO make dragging to reatch at drag release (find closest spring)
    // TODO add x axis and allow dragging to x axis too

    // if (frameCount >= 2) {
    //   throw "oeo" // TODO! remove
    // }
  }
}
