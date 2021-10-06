type IOState = {
  mouse: MouseState,
  lastMouse: MouseState,
  brush: BrushState,
  debugTexture: boolean,
  gameParams: GameParams,
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

type GameParams = {
  gravity: number,
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
  gameParams: {
    gravity: 70
  }
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
        // gs.elements[i][j] = [0, 0, 0, 0, 0, 0, 0, 0]
        gs.elements[i][j][elementId] = elementAmount
      }
    }
  }
}

const initializeUi = () => {
  ioState.brush.brushSize = min(gw, gh)/10

  let controlsDiv = document.getElementById('controls')

  // BRUSH SIZE
  let brushSizeSlider = getSliderElement(
    'Brush size', 1, min(gw, gh)/2, 1, ioState.brush.brushSize, 
    (value) => {ioState.brush.brushSize = value}
  )
  controlsDiv.append(brushSizeSlider)

  // CURRENT ELEMENT
  let currentElmenetSelector = getSelectElement(
    "Brush type", false, 
    elementProps.map((e, i) => ({ first: i, second: e.name })),
    (value) => { ioState.brush.currentElement = int(value) }
  )
  controlsDiv.append(currentElmenetSelector)

  // ELEMENT AMOUNT
  let elementAmountSlider = getSliderElement(
    'Element amount', 0, 255, 1, ioState.brush.elementAmount, 
    (value) => {ioState.brush.elementAmount = value}
  )
  controlsDiv.append(elementAmountSlider)

  // BRUSH TYPE
  let brushTypeSelector = getSelectElement(
    "Brush type", true, 
    Object.keys(BrushType).map((e) => ({ first: e, second: e })),
    (value) => { ioState.brush.brushType = BrushType[ value as keyof typeof BrushType ] }
  )
  controlsDiv.append(brushTypeSelector)

  // DEBUG TEXTURE
  let debugTextureCheckbox = document.createElement('input')
  debugTextureCheckbox.type = 'checkbox'
  debugTextureCheckbox.onchange = () => {
    ioState.debugTexture = debugTextureCheckbox.checked
  }
  controlsDiv.append(getLabelElement('Enable texture debug:'))
  controlsDiv.append(debugTextureCheckbox)

  // GRAVITY AMOUNT
  let gravityAmountSlider = getSliderElement(
    'Gravity amount', 0, 100, 1, ioState.gameParams.gravity, 
    (value) => {ioState.gameParams.gravity = value}
  )
  controlsDiv.append(gravityAmountSlider)

  // LINK TO GH
  let desc = document.createElement('p')
  desc.innerHTML = `Source code can be found <a target="_blank" href="https://github.com/KristianRoth/sandsim" >here</a>`
  controlsDiv.append(desc)
}

let getLabelElement = (text: string) => {
  let label = document.createElement('label')
  label.innerHTML = text
  return label
}

let getSliderElement = (title: string, min: number, max: number, step: number, defaultValue: number, updateState?: (value: number) => void) => {
  let sliderContainer = document.createElement('div')
  let slider = document.createElement('input')
  let legend = getLabelElement(title + ': ' + defaultValue)
  slider.type = 'range'
  slider.min = str(min)
  slider.max = str(max)
  slider.step = str(step ?? '1')
  slider.defaultValue = str(defaultValue)
  slider.oninput = () => {
    updateState(int(slider.value))
    legend.innerHTML = title + ': ' + int(slider.value)
  }
  sliderContainer.append(legend)
  sliderContainer.append(slider)
  return sliderContainer
}

let getSelectElement = (title: string, reverse: boolean, options: Pair<string | number, string>[], updateState?: (value: string) => void) => {
  let selectContainer = document.createElement('div')
  let selector = document.createElement('select')
  options = (reverse) ? options.reverse() : options
  selector.innerHTML = options.reduce((acc, e, i) => acc + `<option value="${str(e.first)}">${e.second}</option>`, "")
  selector.onchange = () => {
    updateState(selector.options[selector.selectedIndex].value)
  }
  selectContainer.append(getLabelElement(title + ': '))
  selectContainer.append(selector)
  return selectContainer
}