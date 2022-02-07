// https://www.shadertoy.com/view/4t23zR
// metallic diffusion

const metallicFrag = `
#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265358979323846

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
varying vec2 vUv;

void main( ){
	float t = u_time * .7;
	vec2 r = vUv.xy; //u_resolution.xy;
	vec3 c=vec3(0.);
	float l=0.,z=t;
	for(int i=0;i<3;i++) {
		vec2 uv,p= vUv.xy;
		uv=p;	
  //	if we just use p, no uv, it's almost the same, but with dark centered horizontal/vertical lines
		
  p-=.5;
		p.x*=r.x/r.y;
		z+=.03;
		l=length(p);
		uv+=p/(l*(sin(z)+1.5)*max(.2, abs(sin(l*9.-z*2.))));
        float j = float(i);
        float k = .005*(mix(4.-j, j+1.,(sin(t/1.1e1)+1.)/2.));
		c[i]=(cos(t/2.1)+1.01)*k/length((mod(uv,1.)-.5));
	}
    gl_FragColor = vec4( 5. * c, 1. );
}

`

export default metallicFrag;