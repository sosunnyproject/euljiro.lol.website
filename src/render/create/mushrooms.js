import * as THREE from 'three';
import vertexShader from '../../shaders/vertex.glsl.js'
import fragmentShader from '../../shaders/fragment.glsl.js'

export function generateMushroom() {
	const mushroom = new THREE.Object3D()
 const points = [];
 for ( let i = 0; i < 10; i ++ ) {
   points.push( new THREE.Vector2( Math.sin( i * 0.2 ) * 10 + 2, ( i - 5 ) * 2 ) );
 }
 const geometry = new THREE.LatheGeometry( points, 15, 0, 2 * Math.PI );
 // const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
 const shader = new THREE.ShaderMaterial( {
  uniforms: {
    u_time: { value: 1.0 },
    u_resolution: { value: new THREE.Vector2() }
  },
  vertexShader: vertexShader,  
  fragmentShader: fragmentShader
} );  

 const lathe = new THREE.Mesh( geometry, shader );

 lathe.position.y = 80;
 lathe.position.x = 120;
 lathe.rotation.z = 60
 lathe.name = "shader lathe"

 mushroom.add(lathe)

 const curve = new THREE.Curve();
 const path = new CustomSinCurve(10);
 const tubeGeometry = new THREE.TubeGeometry( path, 64, 1, 20, false );
 const tubeMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff } );
 const tubeMesh = new THREE.Mesh( tubeGeometry, tubeMaterial );
 // tubeMesh.castShadow = true;
 
 tubeMesh.position.x = lathe.position.x + 40
 tubeMesh.position.y = lathe.position.y - 80
 tubeMesh.rotation.z = 90;

 mushroom.add( tubeMesh );

 return mushroom
}

class CustomSinCurve extends THREE.Curve {

	constructor( scale = 1 ) {

		super();

		this.scale = scale;

	}

	getPoint( t, optionalTarget = new THREE.Vector3() ) {

		const tx = t * 10 - 1.5;
		const ty = Math.sin( 2 * Math.PI * t );
		const tz = 0;

		return optionalTarget.set( tx, ty, tz ).multiplyScalar( this.scale );

	}

}
