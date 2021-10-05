type GameState = {
  elements: number[][][];
  elementColors: number[]
}

const elementColors1 = [
  1, 0, 0, 1,
  0, 1, 0, 1,
  0, 0, 1, 1,
  1, 0, 1, 1,
  1, 1, 0, 1,
  1, 1, 1, 1,
  1, 0.5, 0, 1,
  1, 0, 0.5, 1,
]
const elementColors = () =>  {return [
  random(1), random(1), random(1), 1,
  random(1), random(1), random(1), 1,
  random(1), random(1), random(1), 1,
  random(1), random(1), random(1), 1,
  random(1), random(1), random(1), 1,
  random(1), random(1), random(1), 1,
  random(1), random(1), random(1), 1,
  random(1), random(1), random(1), 1,
]}



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
      eArray[2] = (j == 0) ? 255 : 0
      eArray[5] = 0
      eArray[7] = 0
      col.push(eArray)
    }
    elements.push(col)
  }
  gs = { 
    elements: elements,
    elementColors: elementColors1
  }
  return gs
}


const update = (gs: GameState) => {
  for (let i = 0; i < gw; i++) {
    for (let j = gh - 1; j >= 0; j--) {
      for (let x = -1; x <= 1; x += 2) {
        if (j + x < gh && j + x >= 0) {
          let balanced = balance(gs.elements[i][j+x], gs.elements[i][j], (x === 1) ? 0.7 : 0.5)
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

