// https://threejsfundamentals.org/threejs/lessons/threejs-cameras.html
import * as THREE from 'three';

import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { ZONE_POS, ZONE_RADIUS } from './constants';
import { getRandomArbitrary, getRandomInt } from '../services/utils';

import cloudsFragment from '../shaders/clouds.frag.js';
import vertexShader from '../shaders/vertex.glsl.js';
import fogFragment from '../shaders/fog.frag.js';

import { generateLsystemTree } from '../lsystem/wrapper';
import AnimatedFlower from './create/AnimatedFlower.js';
import { generateShaderTree, generateTree, generateTreeInPark } from './create/trees.js';
import { generateMushroom } from './create/mushrooms.js';

export function instantiateParkObj(scene) {

  generateTreeInPark(scene, 30)
  renderGrassShader2(scene, {x: 0, z: 0})

  const arr = []

  // const shaderTree = generateShaderTree(10, -2, 0)

  // mushrooms
  /*
  const m = generateMushroom()

  for(let i = 0; i < 10; i++){
      const mClone = m.clone()
      mClone.translateX(Math.random() * 2000)
      mClone.translateZ(Math.random() * 2000)
      arr.push(mClone)
  }
  */

  // Clouds
  /*
  const torusKnotGeom = new THREE.TorusKnotGeometry( 10, 6, 100, 20 );
  torusKnotGeom.scale(2, 2, 2)

   const torusKnotMat = new THREE.MeshPhongMaterial( {color: 0x00d4ff });

   const torusMesh = new THREE.InstancedMesh(torusKnotGeom, torusKnotMat, 30)
   
   for(let i = 0; i < 50; i++)
   {
       const position = new THREE.Vector3(getRandomInt(-800, 800), getRandomInt(500, 2000), getRandomInt(-800, 800))

       const quaternion = new THREE.Quaternion()
       quaternion.setFromEuler(new THREE.Euler((Math.random() - 0.5) * Math.PI * 2, (Math.random() - 0.5) * Math.PI * 2, 0))

       const matrix = new THREE.Matrix4()
       matrix.makeRotationFromQuaternion(quaternion)
       matrix.setPosition(position)

       torusMesh.setMatrixAt(i, matrix)
   }
   */
  //  arr.push(torusMesh)

  {
    // lsystem trees
    var cloudMat = new THREE.ShaderMaterial({
      uniforms: {
          u_time: { value: 1.0 },
          u_resolution: { value: new THREE.Vector2() }
        },
        vertexShader: vertexShader,  
        fragmentShader: cloudsFragment
    })
    cloudMat.name = "shader"
    var neonMat = new THREE.ShaderMaterial({
        uniforms: {
            u_time: { value: 1.0 },
            u_alpha: { value : 0.8 },
            u_brightness: { value: 0.85 }, 
            u_tone: {value: new THREE.Vector3(55.0/255.0, 240.0/255.0, 254.0/255.0)},
            u_resolution: { value: new THREE.Vector2() }
          },
          vertexShader: vertexShader,  
          fragmentShader: fogFragment
    })
    neonMat.name = "shader"
    var plainMat = new THREE.MeshPhongMaterial({color: 0xC0B9DD })

    const Ltree1 = generateLsystemTree(plainMat, "ffBAf>A", "^fB++fB<<fvB", "f<f>B>f--AvA", 4, 0.08, 2.0);
    Ltree1.position.set(-1600, 0, -1100)
    Ltree1.scale.set(15, 15, 15)

    const Ltree3 = generateLsystemTree(plainMat, "f--f++A++B----A", "^^fv++<f-->Bf<^^f<B", "f-->Af++++fA<A", 5, 0.07, 2.0);
    Ltree3.position.set(1000, 0, -1200)
    Ltree3.scale.set(18, 18, 18)

    const Ltree4 = Ltree3.clone()
    Ltree4.position.set(-1500, 0, 1000)

    // const lsystemTree2 = generateLsystemTree("ffBAf>A", "^ffAvvfB+fv--B", "f<A>B<f--A+B", 4, 0.1, 1.8);
    const CenterTree = generateLsystemTree(neonMat, "ffBAf>AB", "^ffA<<fB+fvB", "f<B>ff>++A", 6, 0.08, 2.5);
    CenterTree.position.set(0, 0, 0);
    CenterTree.scale.set(80, 80, 80);

    arr.push(CenterTree, Ltree3, Ltree4) // Ltree1,
  }
  
  const flower3 = new AnimatedFlower({
    numerator: 4, 
    denominator: 7,
    size: 5
  })
  flower3.position.set(1883, 150, 220)

  const f2 = new AnimatedFlower({
    numerator: 4, 
    denominator: 7,
    size: 3
  })
  f2.position.set(1910, 150, -510)

  // arr.push(flower3, f2)

  // add all to scene
  for(let i = 0; i < arr.length; i++ ){
      scene.add(arr[i])
  }
}


export function renderInstanceTrees(num, range, translate, scale, matColor, scene) {
    const geometries = []
    const instanceNum = num
  
    const trunkGeom = new THREE.CylinderGeometry(10, 20, scale || 10, 12)
    const grassGeom = new THREE.SphereGeometry(scale || 20, 10, 12)
    trunkGeom.translate(0, scale/2, 0)
    grassGeom.translate(0, scale * 1.5, 0)
    // trunkGeom.scale(scale, scale, scale)
    // grassGeom.scale(scale, scale, scale)
  
    // const newBufferGeom = trunkGeom.merge(grassGeom)
    geometries.push(trunkGeom, grassGeom)
    const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(geometries)
  
    const material = new THREE.MeshPhongMaterial({ color: matColor, side: THREE.DoubleSide })
  
    const mesh = new THREE.InstancedMesh(mergedGeometry, material, instanceNum)
  
    const r = ZONE_RADIUS.GARDEN

    for(let i = 0; i < instanceNum; i++)
    {
        const t = 2*Math.PI*Math.random()
        const u = getRandomArbitrary(0, r) + getRandomArbitrary(0, r)
        let radius;
        if(u > r) {
          radius = r*2 - u
        } else {
          radius = u 
        }
        
        const position = new THREE.Vector3(radius * Math.cos(t), 0, 0, radius * Math.sin(t))
        const matrix = new THREE.Matrix4()

        // const position = new THREE.Vector3(
        //   getRandomInt(range.x * -1, range.x),
        //   0, 
        //   getRandomInt(range.z * -1, range.z),
        // )
  
        // const quaternion = new THREE.Quaternion()
        // quaternion.setFromEuler(new THREE.Euler((Math.random() - 0.5) * Math.PI * 2, (Math.random() - 0.5) * Math.PI * 2, 0))
  
        // matrix.makeRotationFromQuaternion(quaternion)
        matrix.setPosition(position)
  
        mesh.setMatrixAt(i, matrix)
  
        // enable tick
        mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    }
    
    mesh.translateX(translate.x)
    mesh.translateY(translate.y)
    mesh.translateZ(translate.z)
  
    scene.add(mesh)
  }

  
// https://jsfiddle.net/felixmariotto/hvrg721n/

function renderGrassShader2(scene, position) {
  
    ////////////
    // MATERIAL
    ////////////
    
    const vertexShader = `
    varying vec2 vUv;
    uniform float u_time;
    
    void main() {
    
      vUv = uv;
      
      // VERTEX POSITION
      
      vec4 mvPosition = vec4( position, 1.0 );
      #ifdef USE_INSTANCING
        mvPosition = instanceMatrix * mvPosition;
      #endif
      
      // DISPLACEMENT
      
      // here the displacement is made stronger on the blades tips.
      float dispPower = 1.0 - cos( uv.y * 3.1416 / 2.0 );
      
      float displacement = sin( mvPosition.z + u_time * 1.2 ) * ( 0.8 * dispPower );
      mvPosition.z += displacement;
      
      //
      
      vec4 modelViewPosition = modelViewMatrix * mvPosition;
      gl_Position = projectionMatrix * modelViewPosition;
    
    }
    `;
    
    const fragmentShader = `
    varying vec2 vUv;
    
    void main() {
      vec3 baseColor = vec3( 0.41, 1.0, 0.5 );
      float clarity = ( vUv.y * 0.8 ) + 0.5;
      gl_FragColor = vec4( baseColor * clarity, 1 );
    }
    `;
    
    const uniforms = {
    u_time: {
      value: 0
    }
    }
    
    const leavesMaterial = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms,
    side: THREE.DoubleSide
    });
    
    /////////
    // MESH
    /////////
    
    const instanceNumber = 100000;
    const dummy = new THREE.Object3D();
    
    const geometry = new THREE.PlaneGeometry( 3, 6, 1, 4 );
    geometry.translate( 0, 1, 0 ); // move grass blade geometry lowest point at 0.
    
    const instancedMesh = new THREE.InstancedMesh( geometry, leavesMaterial, instanceNumber );
    instancedMesh.name = "shader grass"
    scene.add( instancedMesh );
    
    // Position and scale the grass blade instances randomly.
    const r = ZONE_RADIUS.GARDEN
    const rMaxSqr = getRandomArbitrary(0, r*r)
    
    for ( let i=0 ; i<instanceNumber ; i++ ) {
    
      // https://stackoverflow.com/questions/5837572/generate-a-random-point-within-a-circle-uniformly
      const t = 2*Math.PI*Math.random()
      const u = getRandomArbitrary(0, r) + getRandomArbitrary(0, r)
      let radius;
      if(u > r) {
        radius = r*2 - u
      } else {
        radius = u 
      }
      
      dummy.position.set(radius * Math.cos(t), 0, radius * Math.sin(t))
    // dummy.position.set(
    //   ( Math.random() - 0.5 ) * 3000,
    //   0,
    //   ( Math.random() - 0.5 ) * 3000
    // );
    
    dummy.scale.setScalar( 0.5 + Math.random() * 0.5 );
    
    dummy.rotation.y = Math.random() * Math.PI;
    
    dummy.updateMatrix();
    instancedMesh.setMatrixAt( i, dummy.matrix );
    
    } 
    
    instancedMesh.translateX(position.x)
    instancedMesh.translateZ(position.z)
    
    }

// old test
    
export function renderGrass(scene) {
    const geometries = []
    const geometry = new THREE.PlaneGeometry( 1, 10, 1, 4 );
    geometry.translate(0, 0.3, 0)
    geometry.rotateY(Math.PI/2)
    const g1 = geometry.clone();
    g1.translate(0, 0, 1.2)
    const g2 = geometry.clone();
    g2.translate(0, 0, -1.2)
    geometries.push(geometry, g1, g2)

    const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(geometries)
    const instanceNumber = 500;
    const dummy = new THREE.Object3D();
    
    // geometry.translate(0, 0.5, 0 ); // move grass blade geometry lowest point at 0.
    const leavesMat = new THREE.MeshPhongMaterial({ color: 0x00ff00, side: THREE.DoubleSide })

    const mesh = new THREE.InstancedMesh( mergedGeometry, leavesMat, instanceNumber );
    
    for(let i = 0; i < instanceNumber; i++)
    {
        const position = new THREE.Vector3(getRandomInt(-600, 600), 0, getRandomInt(-300, 300))

        const matrix = new THREE.Matrix4()
        // matrix.makeRotationFromQuaternion(quaternion)
        matrix.setPosition(position)

        mesh.setMatrixAt(i, matrix)

        // enable tick
        mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    }
    mesh.translateX(ZONE_POS.ONE.x + 2000);

    scene.add( mesh );

}
