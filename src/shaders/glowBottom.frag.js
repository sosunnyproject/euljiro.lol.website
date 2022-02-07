// https://www.shadertoy.com/view/3s3GDn
// How to achieve and control a simple distance glow effect based on several Shadertoy examples
// For 3D see https://www.shadertoy.com/view/7stGWj
// Things to try:
//  * Make the radius and intensity pulse in time or to input
//	* Time varying colour
//  * Animate several points and add the glow values for each to create metaballs

const glowGroundFragment = `
#ifdef GL_ES
precision mediump float;
#endif

#define TAU 6.28318530718
#define MAX_ITER 5

varying vec2 vUv;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec3 u_color;

void main(){
    
    //***********    Basic setup    **********
    vec2 uv = vUv;
	   // Position of fragment relative to centre of screen
    vec2 pos = 0.5 - uv;
    // Adjust y by aspect for uniform transforms
    pos.y /= vUv.x/vUv.y;
    
    // Equation 1/x gives a hyperbola which is a nice shape to use for drawing glow as 
    // it is intense near 0 followed by a rapid fall off and an eventual slow fade
    float dist = 1.0/length(pos);
    
    // Dampen the glow to control the radius
    dist *= 1.0;
    
    // Raising the result to a power allows us to change the glow fade behaviour
    // See https://www.desmos.com/calculator/eecd6kmwy9 for an illustration
    // (Move the slider of m to see different fade rates)
    dist = pow(dist, 0.7);
    
    // Add colour
    float r = clamp(u_color.r*1.0, 0.0, 1.0);
    float g = clamp(u_color.g*1.0, 0.0, 1.0);
    float b = clamp(u_color.b*1.0, 0.0, 1.0);

    vec3 col = dist * vec3(r, g, b);
	
    // Tonemapping. See comment by P_Malin
    col = 1.0 - exp( -col );
    
    // Output to screen
    gl_FragColor = vec4(col, 1.0);
}
`

export default glowGroundFragment;