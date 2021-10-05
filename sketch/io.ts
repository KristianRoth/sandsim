

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
  elementAmount: number,
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
    elementAmount: 255,
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
          .forEach((point) => setEllipse(point.x, point.y, ioState.brush.brushSize, ioState.brush.currentElement, ioState.brush.elementAmount))
      }
      if (ioState.brush.brushType === BrushType.SQUARE) {
        plotLine(ioState.mouse.x, ioState.mouse.y, ioState.lastMouse.x, ioState.lastMouse.y)
          .forEach((point) => setSquare(point.x, point.y, ioState.brush.brushSize, ioState.brush.currentElement, ioState.brush.elementAmount))
      }
    }
  }
}
  
const setEllipse = (x: number, y: number, radius: number, elementId: number, elementAmount: number) => {
  setArea(x, y, radius, elementId, elementAmount, (x, y, x2, y2, radius) => (x2-x)**2+(y2-y)**2 <= (radius/2)**2)
}

const setSquare = (x: number, y: number, radius: number, elementId: number, elementAmount: number) => {
  setArea(x, y, radius, elementId, elementAmount, (x, y, x2, y2, radius) => abs(x2-x) <= radius/2 && abs(y2-y) <= radius/2 )
}

const setArea = (x: number, y: number, radius: number, elementId: number, elementAmount: number, fn: (x: number, y: number, x2: number, y2: number, radius: number) => boolean) => {
  for (let i = 0; i < gh; i++) {
    for (let j = 0; j < gw; j++) {
      if (fn(i, j, x, y, radius)) {
        gs.elements[i][j][elementId] = elementAmount
      }
    }
  }
}

const initializeUi = () => {

  ioState.brush.brushSize = min(gw, gh)/10

  let controlsDiv = document.getElementById('controls')

  // BRUSH SIZE
  let brushSizeSlider = document.createElement('input')
  let brushSizeLegend = getLabelElement('Brush size: ' + ioState.brush.brushSize)
  brushSizeSlider.type = 'range'
  brushSizeSlider.defaultValue = min(gw, gh)/10 + ''
  brushSizeSlider.min = '1'
  brushSizeSlider.max = min(gw, gh)/2 + ''
  brushSizeSlider.onchange = () => {
    ioState.brush.brushSize = int(brushSizeSlider.value)
    brushSizeLegend.innerHTML = 'Brush size: ' + int(brushSizeSlider.value)
  }
  controlsDiv.append(brushSizeLegend)
  controlsDiv.append(brushSizeSlider)

  // CURRENT ELEMENT
  let currentElmenetSelector = document.createElement('select')
  currentElmenetSelector.innerHTML = gs.elements[0][0].reduce((acc, e, i) => acc + `<option value="${i}">${i}</option>`, "")
  currentElmenetSelector.onchange = () => { 
    ioState.brush.currentElement = int(currentElmenetSelector.value)
  }
  controlsDiv.append(getLabelElement('Current element:'))
  controlsDiv.append(currentElmenetSelector)

  // ELEMENT AMOUNT
  let elementAmountSlider = document.createElement('input')
  let elementAmountLegend = getLabelElement('Element amount: ' + ioState.brush.elementAmount)
  elementAmountSlider.type = 'range'
  elementAmountSlider.defaultValue = '255'
  elementAmountSlider.min = '0'
  elementAmountSlider.max = '255'
  elementAmountSlider.step = '1'
  elementAmountSlider.onchange = () => {
    ioState.brush.elementAmount = int(elementAmountSlider.value)
    elementAmountLegend.innerHTML = 'Element amount: ' + int(elementAmountSlider.value)
  }
  controlsDiv.append(elementAmountLegend)
  controlsDiv.append(elementAmountSlider)

  // BRUSH TYPE
  let brushTypeSelector = document.createElement('select')
  brushTypeSelector.innerHTML = Object.keys(BrushType).reduce((acc, e, i) => `<option value="${e}">${e}</option>` + acc, "")
  brushTypeSelector.onchange = () => {
    ioState.brush.brushType = BrushType[ brushTypeSelector.options[brushTypeSelector.selectedIndex].value as keyof typeof BrushType ]
  }
  controlsDiv.append(getLabelElement('Brush type:'))
  controlsDiv.append(brushTypeSelector)

  // DEBUG TEXTURE
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