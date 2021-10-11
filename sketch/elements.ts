
type ElementProps = {
  name: string;
  density: Density;
  boilingPoint: number;
  freezingPoint: number;
  color: number[];
  flamable: boolean;
}

type Density = {
  gas: number;
  liquid: number;
  dust: number
}


const getColor = (r: number, g: number, b: number) => {
  return [r/255, g/255, b/255, 255]
}

const elementProps: ElementProps[] = [
  {
    name: 'Sand',
    density: {
      gas: 70,
      liquid: 2650,
      dust: 1442,
    },
    boilingPoint: 2230,
    freezingPoint: 1550,
    color: getColor(194, 178, 128),
    flamable: false,
  },
  {
    name: 'Water',
    density: {
      gas: 0.58966,
      liquid: 997,
      dust: 917,
    },
    boilingPoint: 100,
    freezingPoint: 0,
    color: getColor(21, 61, 237),
    flamable: false,
  },
  {
    name: 'Wood',
    density: {
      gas: 0.6,
      liquid: 400,
      dust: 497
    },
    boilingPoint: 2000,
    freezingPoint: 2000,
    color: getColor(79, 53, 14),
    flamable: false,
  },
  {
    name: 'Wood',
    density: {
      gas: 0.6,
      liquid: 400,
      dust: 497
    },
    boilingPoint: 2000,
    freezingPoint: 2000,
    color: getColor(79, 53, 14),
    flamable: false,
  },
  {
    name: 'Wood',
    density: {
      gas: 0.6,
      liquid: 400,
      dust: 497
    },
    boilingPoint: 2000,
    freezingPoint: 2000,
    color: getColor(79, 53, 14),
    flamable: false,
  },
  {
    name: 'Wood',
    density: {
      gas: 0.6,
      liquid: 400,
      dust: 497
    },
    boilingPoint: 2000,
    freezingPoint: 2000,
    color: getColor(79, 53, 14),
    flamable: false,
  },
  {
    name: 'Wood',
    density: {
      gas: 0.6,
      liquid: 400,
      dust: 497
    },
    boilingPoint: 2000,
    freezingPoint: 2000,
    color: getColor(79, 53, 14),
    flamable: false,
  },
  {
    name: 'Wood',
    density: {
      gas: 0.6,
      liquid: 400,
      dust: 497
    },
    boilingPoint: 2000,
    freezingPoint: 2000,
    color: getColor(79, 53, 14),
    flamable: false,
  },
]

var sortedGassesDensity: number[]
var sortedLiquidDensity: number[]
var sortedDustDensity: number[]

const initializeElementProps = () => {
  sortedGassesDensity = make1NArray(elementCount).sort( (a, b) => elementProps[a].density.gas    - elementProps[b].density.gas    )
  sortedLiquidDensity = make1NArray(elementCount).sort( (a, b) => elementProps[a].density.liquid - elementProps[b].density.liquid )
  sortedDustDensity   = make1NArray(elementCount).sort( (a, b) => elementProps[a].density.dust   - elementProps[b].density.dust   )
}


const elementColors = elementProps.reduce((acc, current) => acc.concat(current.color), [])