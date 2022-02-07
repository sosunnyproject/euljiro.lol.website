import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils'
import { getRandomArbitrary, getRandomInt } from '../../services/utils';
import vertexShader from '../../shaders/vertex.glsl.js'
import waterSampleFragment from '../../shaders/water.frag.js'
import cloudsFragment from '../../shaders/clouds.frag.js';
import { ZONE_RADIUS } from '../constants.js';

const trunkGeometry = new THREE.CylinderGeometry(1, 2, 6, 12)

const grassGeometry1 = new THREE.DodecahedronGeometry(getRandomArbitrary(4.0, 10.0), getRandomInt(0, 3))
const grassGeometry2 = new THREE.DodecahedronGeometry(getRandomArbitrary(4.0, 10.0), getRandomInt(0, 3))
const grassGeometry3 = new THREE.DodecahedronGeometry(getRandomArbitrary(4.0, 10.0), getRandomInt(0, 3))
const randGeom = [grassGeometry1, grassGeometry2, grassGeometry3]

export function generateTreeInPark (scene, nums ) {
  const r = ZONE_RADIUS.GARDEN

  for(let i = 0; i < nums; i++) {
    const t = 2*Math.PI*Math.random()
    const u = getRandomArbitrary(0, r) + getRandomArbitrary(0, r)
    let radius;
    if(u > r) {
      radius = r*2 - u
    } else {
      radius = u 
    }
    let lowpolyTree = generateTree()
    lowpolyTree.position.set( radius * Math.cos(t), 0, radius * Math.sin(t) )
    // console.log(lowpolyTree, nums, i)
    scene.add(lowpolyTree)  
  }

}
export function generateTree(position) {

  let x = 0, y = 0, z = 0

  if(position) {
    x = position.x;
    y = position.y;
    z = position.z;
  }
  // const { x, y, z } = position;
 const tree = new THREE.Object3D();
 
 let rand = getRandomInt(0, randGeom.length)
 const grassGeom = randGeom[rand]

 const grassColors = ["rgb(227, 101, 91)", "rgb(220, 214, 247)", "rgb(217, 237, 146)", "rgb(181,228,140)", "rgb(153,217,140)", "rgb(118,200,147)", "rgb(82,182,154)", "rgb(52,160,164)"]
 const grassInd = getRandomInt(0, grassColors.length)
 
 const grassMaterial = new THREE.MeshPhongMaterial( { color: grassColors[grassInd] } );
 
 const grassMesh = new THREE.Mesh( grassGeom, grassMaterial );
 grassMesh.position.x = x
 grassMesh.position.y = y + 20 * 10
 grassMesh.position.z = z
 grassMesh.scale.set(20, 20, 20)
 grassMesh.name = "trees"
 tree.add(grassMesh)

 const trunkColors = [ "rgb(232, 174, 183)", "rgb(115, 72, 48)", "rgb(94, 116, 127)", "rgb(197, 152, 73)", "rgb(156, 179, 128)" ]
 const colorIndex = getRandomInt(0, trunkColors.length)
 const trunkMaterial = new THREE.MeshPhongMaterial({ color: trunkColors[colorIndex] })
 const trunkMesh = new THREE.Mesh( trunkGeometry, trunkMaterial );
 trunkMesh.position.x = x
 trunkMesh.position.y = y + 20 + 20
 trunkMesh.position.z = z
 trunkMesh.scale.set(20, 20, 20)
 trunkMesh.name = "trees";
 tree.add(trunkMesh);

 return tree
}

//dodecahedron - shader tree
const data = {
  radius: 20,
  detail: 1
}

export function generateShaderTree(xpos, ypos, zpos, gui) {
  const position = {x: xpos, y: ypos + 30, z: zpos}
  if(gui){
    // const folder = gui.addFolder('ShaderTree-Dodecahedron');
    // folder.add(data, 'radius', 1, 40).onChange(() => drawShaderMesh(position));
    // folder.add(data, 'detail', 0, 5).step(1).onChange(() => drawShaderMesh(position))
    // folder.add(data, 'x', 1, 40).onChange(() => draw(position));
    // folder.add(data, 'y', 0, 5).step(1).onChange(() => draw(position))  
  }
 
  const output = drawShaderMesh(position)
  return output;
}

function drawShaderMesh(position) { 
 
  const grassColors = ["rgb(227, 101, 91)", "rgb(220, 214, 247)", "rgb(217, 237, 146)", "rgb(181,228,140)", "rgb(153,217,140)", "rgb(118,200,147)", "rgb(82,182,154)", "rgb(52,160,164)"]
  const grassInd = getRandomInt(0, grassColors.length)
  const grassGeometry = new THREE.CylinderGeometry(data.radius, data.radius, 100, 32)
  const grassMaterial = new THREE.MeshPhongMaterial( { color: grassColors[grassInd] } );
  const grassShader = new THREE.ShaderMaterial( {
    uniforms: {
      u_time: { value: 1.0 },
      u_resolution: { value: new THREE.Vector2() }
    },
    vertexShader: vertexShader,  
    fragmentShader: cloudsFragment
  } );  
  const grassMesh = new THREE.Mesh( grassGeometry, grassShader );
  // const grassMesh = updateGeometry(grass, grassGeometry, position)
 
  //  const trunkColors = [ "rgb(232, 174, 183)", "rgb(115, 72, 48)", "rgb(94, 116, 127)", "rgb(197, 152, 73)", "rgb(156, 179, 128)" ]
  //  const colorIndex = getRandomInt(0, trunkColors.length)
  //  const trunkGeometry = new THREE.CylinderGeometry(2, 4, 18, 12)
  //  const trunkMaterial = new THREE.MeshBasicMaterial({ color: trunkColors[colorIndex] })
  //  const trunkMesh = new THREE.Mesh( trunkGeometry, trunkMaterial );
  //  trunkMesh.position.x = xpos
  //  trunkMesh.position.y = ypos - 5
  //  trunkMesh.position.z = zpos
  //  tree.add(trunkMesh);

  return grassMesh;
 }

function updateGeometry( mesh, newGeometry, pos ) {
  const { x, y, z} = pos

  if(shaderTree !== undefined) {
    shaderTree.geometry.dispose()
    shaderTree.geometry = newGeometry
    shaderTree.position.x = x
    shaderTree.position.y = y
    shaderTree.position.z = z
  } else {
    mesh.position.x = x
    mesh.position.y = y
    mesh.position.z = z
  }

  // these do not update nicely together if shared
  return mesh
}