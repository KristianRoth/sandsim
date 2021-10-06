type GameState = {
  elements: number[][][];
  tempature: number[][];
}

const initialize = () => {
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
  gs = { 
    elements: elements,
    tempature: tempatures
  }
  return gs
}

const update = () => {
  for (let i = 0; i < gw; i++) {
    for (let j = gh - 1; j >= 0; j--) {
      doCell(i, j)
    }
  }
}

const balance = (src: number[], dest: number[], balance: number = 0.5 ) => {
  return map2(src, dest, (element1: number, element2: number) => {
    let sum = element1 + element2
    let av = sum*balance
    return { first: av, second: sum - av }
  })
}

const doCell = (i: number, j: number) => {
  let tempature = gs.tempature[i][j]
  let elements = gs.elements[i][j]
  let gasses = []
  let gassesSum = 0
  let liquids = []
  let liquidsSum = 0
  let dusts = []
  let dustsSum = 0
  elements.forEach((element, idx) => {
    if (tempature > elementProps[idx].boilingPoint) {
      gasses.push(idx)
      gassesSum += element
    } else if (tempature > elementProps[idx].freezingPoint) {
      liquids.push(idx)
      liquidsSum += element
    } else {
      dusts.push(idx)
      dustsSum += element
    }
  })
}
