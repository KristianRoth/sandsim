

type IOState = {
  lastMouse: MouseState,
  brush: BrushState,
}

type MouseState = {
  x: number,
  y: number
}

type BrushState = {
  currentElement: number,
  brushSize: number,
  brushType: BrushType,
}

enum BrushType {
  SQUARE = "SQUARE",
  CIRCLE = "CIRCLE"
}

let ioState: IOState = {
  lastMouse: {
    x: 0,
    y: 0
  },
  brush: {
    currentElement: 0,
    brushSize: 10,
    brushType: BrushType.CIRCLE
  }
}

const mouse = () => {
  if (mouseIsPressed) {
    let [ i, j ] = [mouseX, mouseY].map((a) => drag(floor(a/gridSize), 0, gw - 1))
    if (ioState.brush.brushType === BrushType.CIRCLE) { setEllipse(i, j, ioState.brush.brushSize, ioState.brush.currentElement )}
    if (ioState.brush.brushType === BrushType.SQUARE) { setSquare(i, j, ioState.brush.brushSize, ioState.brush.currentElement )}

  }
}
  
const setEllipse = (x: number, y: number, radius: number, elementId: number) => {
  setArea(x, y, radius, elementId, (x: number, y: number, x2: number, y2: number, radius: number) => (x2-x)**2+(y2-y)**2 <= (radius/2)**2)
}

const setSquare = (x: number, y: number, radius: number, elementId: number) => {
  setArea(x, y, radius, elementId, (x: number, y: number, x2: number, y2: number, radius: number) => abs(x2-x) <= radius/2 && abs(y2-y) <= radius/2 )
}

  
const setArea = (x: number, y: number, radius: number, elementId: number, fn: (x: number, y: number, x2: number, y2: number, radius: number) => boolean) => {
  for (let i = 0; i < gh; i++) {
    for (let j = 0; j < gw; j++) {
      if (fn(i, j, x, y, radius)) {
        gs.elements[i][j][elementId] = 255
      }
    }
  }
}

const initializeUi = () => {

  ioState.brush.brushSize = min(gw, gh)/10

  let controlsDiv = document.getElementById('controls')
  console.log(controlsDiv)

  let brushSizeSlider = document.createElement('input')
  brushSizeSlider.type = 'range'
  brushSizeSlider.defaultValue = min(gw, gh)/10 + ''
  brushSizeSlider.min = '1'
  brushSizeSlider.max = min(gw, gh)/2 + ''
  brushSizeSlider.onchange = () => {
    ioState.brush.brushSize = int(brushSizeSlider.value)
  }
  controlsDiv.append(brushSizeSlider)

  let currentElmenetSelector = document.createElement('select')
  currentElmenetSelector.innerHTML = gs.elements[0][0].reduce((acc, e, i) => acc + `<option value="${i}">${i}</option>`, "")
  currentElmenetSelector.onchange = () => { 
    ioState.brush.currentElement = int(currentElmenetSelector.value)
  }
  controlsDiv.append(currentElmenetSelector)

  let brushTypeSelector = document.createElement('select')
  brushTypeSelector.innerHTML = Object.keys(BrushType).reduce((acc, e, i) => `<option value="${e}">${e}</option>` + acc, "")
  brushTypeSelector.onchange = () => {
    ioState.brush.brushType = BrushType[ brushTypeSelector.options[brushTypeSelector.selectedIndex].value as keyof typeof BrushType ]
  }
  controlsDiv.append(brushTypeSelector)
}