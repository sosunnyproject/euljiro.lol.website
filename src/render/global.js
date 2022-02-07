import * as THREE from 'three';
import { ZONE_POS, ZONE_RADIUS, ZONE_CENTER, ZONE_RESET_POS } from './constants.js';
import skyVertex from '../shaders/skyVertex.glsl.js';
import skyFrag from '../shaders/skyFrag.glsl.js';
import CircleGround from './create/CircleGround'
import vertexShader from '../shaders/vertex.glsl.js';
import fogFragment from '../shaders/fog.frag.js';
import coffeeRiverFragment from '../shaders/coffee.frag.js';
import turbulenceFragment from '../shaders/turbulence.frag.js';
import metallicFrag from '../shaders/metallic.frag.js';
import newCoffeeFragment from '../shaders/fog_coffee.frag.js';
  
export function renderSkyDome(scene) {
    
    const hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
    hemiLight.color.setHSL( 0.6, 1.0, 0.6 );
    hemiLight.groundColor.setHSL( 0.095, 1, 0.35 );
    hemiLight.position.set( 0, 50, 0 );

    const uniforms = {
      "topColor": { value: new THREE.Color( 0xcccccc ) },
      "bottomColor": { value: new THREE.Color( 0xffffff ) },
      "offset": { value: 33 },
      "exponent": { value: 0.6 }
    }
    const skyGeo = new THREE.SphereGeometry( 10000, 12, 12 );
    const skyMat = new THREE.ShaderMaterial( {
      uniforms: uniforms,
      vertexShader: skyVertex,
      fragmentShader: skyFrag,
      side: THREE.BackSide
    } );
    // uniforms[ "topColor" ].value.copy( hemiLight.color );
    const sky = new THREE.Mesh( skyGeo, skyMat );
    sky.name = "sky"
    // sky.rotateY(Math.PI);
    scene.add( sky );
}

export function renderGrounds(scene) {
    
  // ZONE 1 GROUND
  const metallicShader = new THREE.ShaderMaterial({
    uniforms: {
      u_time: { value: 1.0 },
      u_resolution: { value: new THREE.Vector2(0.0, 0.0) },
      u_alpha: { value: 0.9 }
    },
    vertexShader: vertexShader,
    fragmentShader: metallicFrag,
    side: THREE.BackSide,
    transparent: true
  })
  const ground1 = new CircleGround(ZONE_POS["ONE"], ZONE_RADIUS.ONE, metallicShader, "shader ground")

  scene.add(ground1);

  {
    const geom = new THREE.PlaneGeometry(500, 3000)
    const planeGround1 = new THREE.Mesh(geom, metallicShader)
    planeGround1.name = "shader ground"
    planeGround1.rotateY(Math.PI/2)
    planeGround1.rotateX(Math.PI/2)
    planeGround1.position.set(4500, 0, 0)
    scene.add(planeGround1) 
  }

  // ZONE 2 GROUND
  const coffeeShader = new THREE.ShaderMaterial( {
    uniforms: {
      u_time: { value: 1.0 },
      u_resolution: { value: new THREE.Vector2() }
    },
      vertexShader: vertexShader,
      fragmentShader: newCoffeeFragment,
      side: THREE.BackSide
  } );

  const ground2 = new CircleGround(ZONE_POS["TWO"], ZONE_RADIUS.TWO, coffeeShader, "shader ground");
  scene.add(ground2)

  // ZONE 3 GROUND
  const skyuniforms = {
    "topColor": { value: new THREE.Color( 0x0077ff ) },
    "bottomColor": { value: new THREE.Color( 0xffffff ) },
    "offset": { value: 33 },
    "exponent": { value: 0.6 }
  }
  // const skyGeo = new THREE.SphereGeometry( 1000, 32, 32 );
  const skyMat = new THREE.ShaderMaterial( {
    uniforms: skyuniforms,
    vertexShader: skyVertex,
    fragmentShader: skyFrag,
    side: THREE.BackSide
  } );
  // const ground3Mat = new THREE.MeshPhongMaterial({ color: 0x77777, side: THREE.DoubleSide });
  const ground3 = new CircleGround(ZONE_POS["THREE"], ZONE_RADIUS.THREE, skyMat, "ground");;
  scene.add(ground3)

  // BOTTOM ground
  const ground5Mat = new THREE.MeshPhongMaterial({ color: 0xcccccc, side: THREE.DoubleSide });
  const ground5 = new CircleGround(ZONE_POS["BLANK"], ZONE_RADIUS.BLANK, ground5Mat, "BLANK");;
  scene.add(ground5)

  // ZONE PARK GROUND
  const parkShader = new THREE.ShaderMaterial( {
    uniforms: {
      u_time: { value: 1.0 },
      u_resolution: { value: new THREE.Vector2() }
    },
    vertexShader: vertexShader,  
    fragmentShader: turbulenceFragment, 
    side: THREE.BackSide
  } ); 

  // grass colors: 0x679436
  const ground4Mat = new THREE.MeshPhongMaterial({ color: 0x006400, side: THREE.DoubleSide });
  const ground4 = new CircleGround(ZONE_POS["GARDEN"], ZONE_RADIUS.GARDEN, ground4Mat, "garden")
  scene.add(ground4)

  window.GROUNDS = [ground1.geom, ground2.geom, ground3.geom, ground4.geom];
}

export function renderMountain(scene) {
  // theta: 0, 30, 60, 90
  const r = ZONE_RADIUS.BLANK
  const triMesh = renderBackgroundTriangle() 

  for(let i = 30; i < 360; i+= 30) {
    const theta = THREE.MathUtils.degToRad(i)
    const tx = r * Math.cos(theta)
    const ty = r * Math.sin(theta)
    const ry =  THREE.MathUtils.degToRad(90-i)
    const triClone = triMesh.clone()
    triClone.rotateY(ry)
    triClone.position.set(tx, 0, ty)
    scene.add(triClone)
  }

}

export function renderBackgroundTriangle(scene, pos) {

  // test shape geom
const shape = new THREE.Shape();

const x = 0;
const y = 0;

shape.moveTo(x + 180, y +180)
shape.lineTo(x + 300, y +340)
shape.lineTo(x + 400, y +290)
shape.lineTo(x + 570, y +250)
shape.lineTo(x + 750, y +110)
shape.lineTo(x + 970, y +270)
shape.lineTo(x + 1050 , y +220)
shape.lineTo(x + 1140 , y +250)
shape.lineTo(x + 1280 , y +380)
shape.lineTo(x + 1460 , y +300)
shape.lineTo( x + 1500, y + 320 )
shape.lineTo( x + 1800, y + 150 )
shape.lineTo( x + 2220, y + 60 )
shape.lineTo( x + 2250, y + 260 )
shape.lineTo( x + 2370, y + 220 )
shape.lineTo( x + 2560, y + 340 )
shape.lineTo( x + 2760, y + 230 )
shape.lineTo( x + 2860, y + 280 )
shape.lineTo( x + 2960, y + 130 )
shape.lineTo( x + 3180, y + 100 )
shape.lineTo( x + 3380, y + 140 )
shape.lineTo( x + 3450, y + 240 )
shape.lineTo( x + 3620, y + 330 )
shape.lineTo( x + 3730, y + 220 )
shape.lineTo( x + 3870, y + 260 )
shape.lineTo( x + 3900, y + 180 )
shape.lineTo( x + 4440, y + 80 )
shape.lineTo( x + 4500, y + 10 )
shape.lineTo( x + 4600, y + 0 )
shape.lineTo( x + 0, y + 0 )

const TriangleGeometry = new THREE.ShapeGeometry(shape);
TriangleGeometry.applyMatrix( new THREE.Matrix4().makeTranslation( -2300, 0, 0 ) );

const mat = new THREE.MeshPhongMaterial({ color: 0x006400, side: THREE.DoubleSide });
const triMesh = new THREE.Mesh(TriangleGeometry, mat)
triMesh.scale.set(1, 1.25, 1)

return triMesh

}