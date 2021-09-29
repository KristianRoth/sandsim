type GameState = {
  elements: number[][][];
  elementColors: number[]
}

const elementColors = [
  1, 0, 0, 1,
  0, 1, 0, 1,
  0, 0, 1, 1,
  1, 0, 1, 1,
  1, 1, 0, 1,
]

const initialize = () => {
  let elements = []
  for (let i = 0; i < gw; i++) {
    let col = []
    for (let j = 0; j < gh; j++) {
      let eArray = []
      for (let e = 0; e < elementCount; e++) {
        eArray.push(0)
      }
      eArray[0] = (i === j || i === gw - j) ? 255 : 0
      eArray[1] = ( abs(int(gw/2) - i) < 3) ? 255 : 0 
      eArray[4] = 0
      eArray[5] = 0
      eArray[7] = 0
      col.push(eArray)
    }
    elements.push(col)
  }
  gs = { 
    elements: elements,
    elementColors: elementColors
  }
  return gs
}


const update = (gs: GameState) => {
  for (let i = 0; i < gw; i++) {
    for (let j = 0; j < gh; j++) {
      for (let e = 0; e < elementCount; e++) {
      }
    }
  }
  return gs
}