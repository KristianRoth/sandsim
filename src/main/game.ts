import { ioState } from "./io"
import { elementCount, gh, gs, gw } from "./sketch"
import { makeArray, map2 } from "./util"

export type GameState = {
  elements: number[][][];
  tempature: number[][];
}

export const initialize = () => {
  let elements = makeArray(0, gw, gh, elementCount) as number[][][]
  let tempatures = makeArray(20, gw, gh) as number[][]
  for (let i = 0; i < gw; i++) {
    for (let j = 0; j < gh; j++) {
      elements[i][j][0] = (i === j || i === gw - j) ? 255 : 0
      elements[i][j][1] = 0 //( abs(int(gw/2) - i) < 3) ? 255 : 0 
      elements[i][j][2] = 0 //(j == 0) ? 255 : 0
      elements[i][j][5] = 0
      elements[i][j][7] = 0
    }
  }
  return { 
    elements: elements,
    tempature: tempatures
  }
}

export const update = (gs: GameState) => {
  for (let i = 0; i < gw; i++) {
    for (let j = gh - 1; j >= 0; j--) {
      for (let x = -1; x <= 1; x += 2) {
        if (j + x < gh && j + x >= 0) {
          let balanced = balance(gs.elements[i][j+x], gs.elements[i][j], (x === 1) ? ioState.gameParams.gravity/200+0.5 : 0.5)
          gs.elements[i][j+x]= balanced.first
          gs.elements[i][j] = balanced.second
        }
        if (i + x < gw && i + x >= 0) {
          let balanced = balance(gs.elements[i+x][j], gs.elements[i][j])
          gs.elements[i+x][j]= balanced.first
          gs.elements[i][j] = balanced.second
        }
      }
    }
  }
  return gs
}

const balance = (src: number[], dest: number[], balance: number = 0.5 ) => {
  return map2(src, dest, (element1: number, element2: number) => {
    let sum = element1 + element2
    let av = sum*balance
    return { first: av, second: sum - av }
  })
}

