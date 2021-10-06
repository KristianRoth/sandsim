precision highp float;

#define elementCount 8
// this is the same variable we declared in the vertex shader
// we need to declare it here too!
varying vec2 vTexCoord;

uniform vec2 size;
uniform float heightMultiplier;
uniform sampler2D elementTex;
uniform vec4 elementColors[elementCount];
uniform bool showTest;

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

float emap(float value) {
  return map(value, 0.0, 255.0, 0.0, 1.0);
}

vec2 sample(vec2 coord, float multi) {
  vec2 transCoord = vec2(coord.x, (coord.y / heightMultiplier) + (multi / heightMultiplier));
  return ( floor(transCoord*size) + 0.5) / size;
}

vec2 tsample(vec2 coord, float heightMultiplier) {
  vec2 transCoord = vec2(coord.x, coord.y);
  return ( floor(transCoord*size) + 0.5) / size;
}

vec4 myBlend(vec4 source, vec4 dest) {
    float a = (1.0 - source.a)*dest.a + source.a;
    vec3 d = ((1.0 - source.a)*dest.a * dest.rgb + source.a*source.rgb) / a;
    return vec4(d, a);
}

void main() {

  vec2 coord = vec2(vTexCoord.x, 1.0 - vTexCoord.y);

  vec4 elementAmount1 = texture2D(elementTex, sample(coord, 0.0));
  vec4 elementAmount2 = texture2D(elementTex, sample(coord, 1.0));
  vec4 elementAmount3 = texture2D(elementTex, sample(coord, 2.0));

  float totalElementAmount = dot(elementAmount1.rgb, vec3(1.0)) + dot(elementAmount2.rgb, vec3(1.0)) + dot(elementAmount3.rg, vec2(1.0));

  // vec4 finalColor = vec4(0, 0, 0, 1.0);
  // finalColor = myBlend( elementColors[0] * elementAmount1.r, finalColor);
  // finalColor = myBlend( elementColors[1] * elementAmount1.g, finalColor);
  // finalColor = myBlend( elementColors[2] * elementAmount1.b, finalColor);
  // finalColor = myBlend( elementColors[3] * elementAmount2.r, finalColor);
  // finalColor = myBlend( elementColors[4] * elementAmount2.g, finalColor);
  // finalColor = myBlend( elementColors[5] * elementAmount2.b, finalColor);
  // finalColor = myBlend( elementColors[6] * elementAmount3.r, finalColor);
  // finalColor = myBlend( elementColors[7] * elementAmount3.g, finalColor);

  vec3 finalColor = vec3(0);
  finalColor += elementColors[0].rgb * (elementAmount1.r / totalElementAmount);
  finalColor += elementColors[1].rgb * (elementAmount1.g / totalElementAmount);
  finalColor += elementColors[2].rgb * (elementAmount1.b / totalElementAmount);
  finalColor += elementColors[3].rgb * (elementAmount2.r / totalElementAmount);
  finalColor += elementColors[4].rgb * (elementAmount2.g / totalElementAmount);
  finalColor += elementColors[5].rgb * (elementAmount2.b / totalElementAmount);
  finalColor += elementColors[6].rgb * (elementAmount3.r / totalElementAmount);
  finalColor += elementColors[7].rgb * (elementAmount3.g / totalElementAmount);

  vec4 finalColorWithAlpha = vec4(finalColor, min(totalElementAmount, 1.0));
  vec4 black = vec4(0.0, 0.0, 0.0, 1.0);
  vec4 final = myBlend(finalColorWithAlpha, black);

  if (showTest) {
    gl_FragColor = texture2D(elementTex, tsample(coord, 0.0));
  } else {
    gl_FragColor = final;
  }
}