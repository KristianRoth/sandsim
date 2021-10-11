type GameState = {
  elements: number[][][];
  tempature: number[][];
  gassesSum: number[][];
  liquidsSum: number[][];
  dustsSum: number[][];
  gasses: number[][][];
  liquids: number[][][];
  dusts: number[][][];
}

const initialize = () => {
  let elements = makeArray(0, gw, gh, elementCount) as number[][][]
  let tempatures = makeArray(20, gw, gh) as number[][]
  let gassesSum = makeArray(0, gw, gh) as number[][]
  let liquidsSum = makeArray(0, gw, gh) as number[][]
  let dustsSum = makeArray(0, gw, gh) as number[][]
  let gasses = makeArray(0, gw, gh) as number[][][]
  let liquids = makeArray(0, gw, gh) as number[][][]
  let dusts = makeArray(0, gw, gh) as number[][][]

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
    tempature: tempatures,
    gassesSum: gassesSum,
    liquidsSum: liquidsSum,
    dustsSum: dustsSum,
    gasses: gasses,
    liquids: liquids,
    dusts: dusts
  }
  return gs
}

const update = () => {
  for (let i = 0; i < gw; i++) {
    for (let j = gh - 1; j >= 0; j--) {
      doCell(i, j)
    }
  }
  gs.elements = makeArray(0, gw, gh, elementCount) as number[][][]
  for (let i = 0; i < gw; i++) {
    for (let j = gh - 1; j >= 0; j--) {
      //balanceGasses()
      //balanceLiquids()
      balanceDusts(i, j)
    }
  }
}

const divideCellAmounts = (cellLeft: number, toAdd: number): Pair<number, number> => ({first: min(cellLeft, toAdd), second: toAdd - min(cellLeft, toAdd)})

const balanceDusts = (i: number, j: number) => {
  if (j + 1 < gh) {
    let cellSum = 0
    sortedDustDensity.forEach((elementId) => {
      cellSum += gs.elements[i][j + 1][elementId]
      let elementAmount = gs.dusts[i][j][elementId] + gs.dusts[i][j + 1][elementId]
      let {first, second} = divideCellAmounts(255 - cellSum, elementAmount)
      gs.elements[i][j+1][elementId] += first
      gs.elements[i][j][elementId] += second
      cellSum += elementAmount
      //console.log(j+1, "elementAmount", elementAmount, "up:", first, "down:",  second, "startSum", gs.elements[i][j + 1][elementId])
      gs.dusts[i][j][elementId] = 0
      gs.dusts[i][j+1][elementId] = 0
    })

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
  const insertWithDensity = (src: number[], elementId: number) => {
    let indx = src.findIndex((e, idx) => elementProps[idx].density < elementProps[elementId].density) 
    return src.splice(0, indx, elementId)
  }
  let tempature = gs.tempature[i][j]
  let elements = gs.elements[i][j]
  let gasses = makeArray(0, elementCount) as number[]
  let gassesSum = 0
  let liquids = makeArray(0, elementCount) as number[]
  let liquidsSum = 0
  let dusts = makeArray(0, elementCount) as number[]
  let dustsSum = 0
  elements.forEach((element, idx) => {
    if (tempature > elementProps[idx].boilingPoint) {
      gasses[idx] = element 
      gassesSum += element
    } else if (tempature > elementProps[idx].freezingPoint) {
      liquids[idx] = element
      liquidsSum += element
    } else {
      dusts[idx] = element
      dustsSum += element
    }
  })
  gs.gasses[i][j] = gasses
  gs.gassesSum[i][j] = gassesSum
  gs.liquids[i][j] = liquids
  gs.liquidsSum[i][j] = liquidsSum
  gs.dusts[i][j] = dusts
  gs.dustsSum[i][j] = dustsSum
}
