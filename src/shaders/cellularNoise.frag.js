// Author: @patriciogv
// Title: CellularNoise

const cnFragment = `
#ifdef GL_ES
precision mediump float;
#endif

#define TWO_PI 6.28318530718

uniform vec2 u_resolution;
uniform float u_time;
varying vec2 vUv;

vec2 random2( vec2 p ) {
    return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}

void main() {
    vec2 st = vUv;
    // st.x *= u_resolution.x/u_resolution.y;
    vec3 color = vec3(.0);

    // Scale
  st *= 300.;

  // Tile the space
  vec2 i_st = floor(st);
  vec2 f_st = fract(st);

  float m_dist = 1.0;  // minimum distance

  for (int y= -1; y <= 1; y++) {
    for (int x= -1; x <= 1; x++) {
      // Neighbor place in the grid
      vec2 neighbor = vec2(float(x),float(y));

      // Random position from current + neighbor place in the grid
      vec2 point = random2(i_st + neighbor);

      // Animate the point
      point = 0.364*sin(u_time + 100.451*point);

      // Vector between the pixel and the point
      vec2 diff = neighbor + point - f_st;

      // Distance to the point
      float dist = length(diff);

       // Keep the closer distance
       m_dist = min(m_dist, dist);
      }
  }

  // Draw the min distance (distance field)
  color += m_dist;
  color.g = mod(u_time + 10.0, 200.0);
  // color.b = mod(u_time*0.1, 50.0);

  // Draw cell center
  // color += 1.-step(.02, m_dist);

  // Show isolines
  // color -= step(.7,abs(sin(27.0*m_dist)))*.5;

  gl_FragColor = vec4(color,1.0);
}
`
export default cnFragment;