let texcoordShader: p5.Shader;
const gridSize = 20
const w = 1000
const h = 1000
const gw = w/gridSize
const gh = h/gridSize
const elementCount = 8
const heightMultiplier = Math.ceil(elementCount/3)
let elementTexture: p5.Image

//used to verify if this script is loaded for github pages
const loaded = () => true

let gs: GameState

const preload = () => {
  texcoordShader = loadShader('sketch/shaders/uniform.vert', 'sketch/shaders/uniform.frag');
}

const setup = () => {
  gs = initialize()
  console.log(gs)
  initializeUi()
  initializeElementProps()
  elementTexture = createImage(gw, gh * heightMultiplier)
  makeTexture(elementTexture)
  console.log("STARTING SETUP GridSize:", gw, gh, "Texture multiplier:", heightMultiplier, "Texture size:", elementTexture.width, elementTexture.height)
  console.log("Starting gamestate:", gs)
  createCanvas(w, h, WEBGL);
  noStroke()
  //frameRate(1)
  //noLoop()
}

function draw() {
  update()
  // console.log(gs.elements)
  doIO()
  makeTexture(elementTexture)
  
  shader(texcoordShader);
  texcoordShader.setUniform('size', [gw, gh*heightMultiplier])
  texcoordShader.setUniform('heightMultiplier', heightMultiplier)
  texcoordShader.setUniform('elementColors', elementColors)
  texcoordShader.setUniform('elementTex', elementTexture)
  texcoordShader.setUniform('showTest', ioState.debugTexture)
  
  if(frameCount%100 === 0) {
    console.log("Framerate:", ceil(frameRate()))
  }
  
  rect(0,0,w,h);
}

const makeTexture = (tex: p5.Image) => {
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