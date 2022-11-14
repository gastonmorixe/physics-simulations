export function genId(kind: string) {
  return `${kind}:${random(999).toFixed(0)}`
}

export function createLink(thing: TThing): TLink {
  return {
    thing: thing,
    // place: place
  }
}
