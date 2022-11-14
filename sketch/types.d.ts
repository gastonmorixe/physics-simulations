declare type Thing = import("./Thing").Thing
declare type Spring = import("./Spring").Spring
declare type Particle = import("./Particle").Particle
declare type FixedThing = import("./FixedThing").FixedThing

declare class GPoint {
  constructor(index: number, value: number)
}

declare class GPlot {
  constructor(context: any)
  setPos: any
  setOuterDim: any
  setPoints: any
  setTitleText: any
  getXAxis: any
  getYAxis: any
  defaultDraw: any
}

type TLink = { thing: TThing }

type TThing = Thing | Spring | Particle | FixedThing // | Positions.Fixed
