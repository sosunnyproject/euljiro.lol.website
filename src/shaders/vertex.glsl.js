const vertexShader = `
// switch on high precision floats
#ifdef GL_ES
precision highp float;
#endif

varying vec2 vUv;
                
// void main(){
    
//     vUv = uv;
//     gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
// }

void main()
{
    vUv = uv;
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;
}
`
export default vertexShader;