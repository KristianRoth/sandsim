

type IOState = {
  mouse: MouseState,
  lastMouse: MouseState,
  brush: BrushState,
  debugTexture: boolean,
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
  mouse: {
    x: 0,
    y: 0,
  },
  lastMouse: {
    x: 0,
    y: 0
  },
  brush: {
    currentElement: 0,
    brushSize: 10,
    brushType: BrushType.CIRCLE,
  },
  debugTexture: false,
}

const doIO = () => {
  ioState.lastMouse = ioState.mouse
  let [ x, y ] = [mouseX, mouseY].map((a) => drag(floor(a/gridSize), 0, gw - 1))
  ioState.mouse = {x: x, y: y}

  if ( 0 <= mouseX && mouseX <= width && 0 <= mouseY && mouseY <= height) {
    if (mouseIsPressed) {
      
      if (ioState.brush.brushType === BrushType.CIRCLE) { 
        plotLine(ioState.mouse.x, ioState.mouse.y, ioState.lastMouse.x, ioState.lastMouse.y)
          .forEach((point) => setEllipse(point.x, point.y, ioState.brush.brushSize, ioState.brush.currentElement))
      }
      if (ioState.brush.brushType === BrushType.SQUARE) {
        plotLine(ioState.mouse.x, ioState.mouse.y, ioState.lastMouse.x, ioState.lastMouse.y)
          .forEach((point) => setSquare(point.x, point.y, ioState.brush.brushSize, ioState.brush.currentElement))
      }
    }
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

  let brushSizeSlider = document.createElement('input')
  let brushSizeLegend = getLabelElement('Brush size: ' + ioState.brush.brushSize)
  brushSizeSlider.type = 'range'
  brushSizeSlider.defaultValue = min(gw, gh)/10 + ''
  brushSizeSlider.min = '1'
  brushSizeSlider.max = min(gw, gh)/2 + ''
  brushSizeSlider.onchange = () => {
    ioState.brush.brushSize = int(brushSizeSlider.value)
    brushSizeLegend.innerHTML = "Brush size: " + int(brushSizeSlider.value)
  }
  controlsDiv.append(brushSizeLegend)
  controlsDiv.append(brushSizeSlider)

  let currentElmenetSelector = document.createElement('select')
  currentElmenetSelector.innerHTML = gs.elements[0][0].reduce((acc, e, i) => acc + `<option value="${i}">${i}</option>`, "")
  currentElmenetSelector.onchange = () => { 
    ioState.brush.currentElement = int(currentElmenetSelector.value)
  }
  controlsDiv.append(getLabelElement('Current element:'))
  controlsDiv.append(currentElmenetSelector)

  let brushTypeSelector = document.createElement('select')
  brushTypeSelector.innerHTML = Object.keys(BrushType).reduce((acc, e, i) => `<option value="${e}">${e}</option>` + acc, "")
  brushTypeSelector.onchange = () => {
    ioState.brush.brushType = BrushType[ brushTypeSelector.options[brushTypeSelector.selectedIndex].value as keyof typeof BrushType ]
  }
  controlsDiv.append(getLabelElement('Brush type:'))
  controlsDiv.append(brushTypeSelector)

  let debugTextureCheckbox = document.createElement('input')
  debugTextureCheckbox.type = 'checkbox'
  debugTextureCheckbox.onchange = () => {
    ioState.debugTexture = debugTextureCheckbox.checked
  }
  controlsDiv.append(getLabelElement('Enable texture debug:'))
  controlsDiv.append(debugTextureCheckbox)
}

let getLabelElement = (text: string) => {
  let label = document.createElement('label')
  label.innerHTML = text
  return label
}