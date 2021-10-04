let texcoordShader: p5.Shader;
const gridSize = 10;
const w = 1000
const h = 1000
const gw = w/gridSize
const gh = h/gridSize
const elementCount = 8
const heightMultiplier = Math.ceil(elementCount/3)

const loaded = () => true

let elementTexture: p5.Image

const showTexture = false

let gs: GameState

const preload = () => {

  texcoordShader = loadShader('sketch/shaders/uniform.vert', 'sketch/shaders/uniform.frag');
}

const setup = () => {
  gs = initialize()
  initializeUi()
  elementTexture = createImage(gw, gh * heightMultiplier)
  makeTexture(gs, elementTexture)
  elementTexture.loadPixels()
  console.log(elementTexture.pixels)
  console.log("STARTING SETUP GridSize:", gw, gh, "Texture multiplier:", heightMultiplier, "Texture size:", elementTexture.width, elementTexture.height)
  
  createCanvas(w, h, WEBGL); 
  noStroke()
  console.log(gs)
}

function draw() {
  gs = update(gs)
  mouse()
  makeTexture(gs, elementTexture)

  if (showTexture) {
    background(frameCount%2 === 0 ? 255 : 0 )
    image(elementTexture, 0, 0, 100, 200)
    return
  }
  
  shader(texcoordShader);
  texcoordShader.setUniform('size', [gw, gh*heightMultiplier])
  texcoordShader.setUniform('heightMultiplier', heightMultiplier)
  texcoordShader.setUniform('elementColors', gs.elementColors)
  texcoordShader.setUniform('elementTex', elementTexture)
  texcoordShader.setUniform('showTest', ioState.debugTexture)
  
  if(frameCount%100 === 0) {
    console.log(frameRate())
  }
  
  rect(0,0,w,h);
}

const makeTexture = (gs: GameState, tex: p5.Image) => {
  tex.loadPixels()
  for (let i = 0; i < gh; i++) {
    for (let j = 0; j < gw; j++) {
      let idx = (i*gw + j)*4
      let m = (gw*gh*4)
      // console.log("tex length:", tex.pixels.length)
      // console.log("idx, m:", idx, m)
      // console.log("i, j:", i, j)
      // console.log("gh, gw:", gh, gw)
      // console.log(gs)
      tex.pixels[idx] = gs.elements[j][i][0]
      tex.pixels[idx + 1] = gs.elements[j][i][1]
      tex.pixels[idx + 2] = gs.elements[j][i][2]
      tex.pixels[idx + 3] = 255 
      tex.pixels[idx + m] = gs.elements[j][i][3]
      tex.pixels[idx + m + 1] = gs.elements[j][i][4]
      tex.pixels[idx + m + 2] = gs.elements[j][i][5]
      tex.pixels[idx + m + 3] = 255
      tex.pixels[idx + 2*m] = gs.elements[j][i][6]
      tex.pixels[idx + 2*m + 1] = gs.elements[j][i][7]
      tex.pixels[idx + 2*m + 2] = 255
      tex.pixels[idx + 2*m + 3] = 255
    }
  }
  tex.updatePixels()
}
