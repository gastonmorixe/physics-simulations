import { FixedThing } from "./FixedThing"

export class GraphNode {
  value: TThing
  edges: Set<GraphNode>
  backEdges: Set<GraphNode>

  constructor(value: TThing) {
    this.backEdges = new Set()
    this.edges = new Set()
    this.value = value
  }

  transverse(
    cb: (node: GraphNode, prevNode?: GraphNode | null) => void,
    node: GraphNode = this,
    prevNode: GraphNode | undefined = null
  ) {
    cb(node, prevNode)

    for (const edge of node.edges) {
      this.transverse(cb, edge, node)
    }
  }

  transverseBackwards(
    cb: (node: GraphNode, prevNode?: GraphNode | null) => void,
    node: GraphNode = this,
    prevNode: GraphNode | undefined = null
  ) {
    cb(node, prevNode)

    for (const edge of node.backEdges) {
      this.transverseBackwards(cb, edge, node)
    }
  }

  findNode(value: TThing): GraphNode {
    // console.log("[findNode]", { value })
    for (const node of this.edges) {
      if (value === node.value) {
        return node
      }
      return node.findNode(value)
    }
  }

  addNode(thingFrom: TThing, linkTo: TLink) {
    if (linkTo.thing.constructor === FixedThing) {
      this.value = linkTo.thing

      let nodeTo
      if (!(nodeTo = this.findNode(thingFrom))) {
        nodeTo = new GraphNode(thingFrom)
      }

      // console.log("[addNode] [nodeFrom]", {
      //   nodeTo,
      //   thiss: this,
      //   thingFrom,
      //   linkTo,
      // })

      this.edges.add(nodeTo)

      return
    }

    let nodeTo
    if (!(nodeTo = this.findNode(linkTo.thing))) {
      nodeTo = new GraphNode(linkTo.thing)
    }

    let nodeFrom
    if (!(nodeFrom = this.findNode(thingFrom))) {
      nodeFrom = new GraphNode(thingFrom)
    }

    // console.log("[addNode] [nodeFrom]", { nodeTo, nodeFrom, thingFrom, linkTo })

    nodeTo.backEdges.add(nodeFrom)
    nodeFrom.edges.add(nodeTo)
  }
}

export const ROOT_NODE = new GraphNode(null)
