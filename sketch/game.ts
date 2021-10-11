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
var rand: number[]

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
  rand = Array.from(Array(gw).keys()).sort((a, b) => random() - random())
  return gs
}

const update = () => {
  for (let i = 0; i < gw; i++) {
    for (let j = gh - 1; j >= 0; j--) {
      doCell(i, j)
      gs.elements[i][j] = [0, 0, 0, 0, 0, 0, 0, 0]
    }
  }
  
  for (let j = gh - 1; j >= 0; j--) {
    for (let i = 0; i < gw; i++) {
      //balanceGasses()
      //balanceLiquids()
      balanceDusts(rand[i], j)
    }
  }
}
const divideCellAmounts = (cellLeft: number[], toAdd: number): number[] => {
  let down = Math.min(cellLeft[0], toAdd)
  let leftToAdd = toAdd - down
  let left = Math.min(cellLeft[1], leftToAdd/2)
  let right = Math.min(cellLeft[2], leftToAdd/2)
  let stay = leftToAdd - left - right
  return [down, left, right, stay]
}



const balanceDusts = (i: number, j: number) => {
  let hasLeft = !(i === 0)
  let hasRight = !(i === (gw - 1))
  if (j + 1 < gh) {
    let cellAmounts = [0, (hasLeft) ? 0 : 255 , (hasRight) ? 0 : 255]
    sortedDustDensity.forEach((elementId) => {
      cellAmounts[0] += gs.elements[i][j + 1][elementId]
      cellAmounts[1] += (hasLeft)  ? gs.elements[i - 1][j + 1][elementId] : 0
      cellAmounts[2] += (hasRight) ? gs.elements[i + 1][j + 1][elementId] : 0
      let elementAmount = gs.dusts[i][j][elementId]
      let [down, left, right, stay] = divideCellAmounts(cellAmounts.map((e) => 255-e), elementAmount)
      if (j === 3 && elementId === 0) {
        //console.log(i, j, "elementAmount", elementAmount, "sum:", stay + down + left + right, "down:", down, "left:", left, "right:", right, "stay:", stay, "cellamouts", cellAmounts)
      }
      gs.elements[i][j+1][elementId] += down
      if (hasLeft) {
        gs.elements[i - 1][j+1][elementId] += left
      }
      if (hasRight) {
        gs.elements[i + 1][j+1][elementId] += right
      }
      gs.elements[i][j][elementId] += stay
      cellAmounts[0] += down
      cellAmounts[1] += left
      cellAmounts[2] += right
      gs.dusts[i][j][elementId] = 0
    })

  } else if(j == gh - 1 ) {
    arrayCopy(gs.dusts[i][j], gs.elements[i][j])
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
