import * as THREE from 'three';
import { ZONE_POS, ZONE_RADIUS } from "./constants"
import { getRandomArbitrary } from '../services/utils';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js'

const ZONE3_X_MIN = ZONE_POS.THREE.x - 300;
const ZONE3_X_MAX = ZONE_POS.THREE.x + 300;
const ZONE3_Z_MIN = ZONE_POS.THREE.z - 300;
const ZONE3_Z_MAX = ZONE_POS.THREE.z + 300;

export function instantiateZone3 (scene) {
    
  const posArr1 = [
    new THREE.Vector3(400, 0, 100),
    new THREE.Vector3(200, 0, -300),
    new THREE.Vector3(-300, 0, 100)
  ]

  const posArr2 = [
    new THREE.Vector3(250, 0, -50),
    new THREE.Vector3(-300, 0, -200),
    new THREE.Vector3(400, 0, -200)
  ]

  renderBuildings(scene, -1, posArr1)
  renderBuildings(scene, 2, posArr2)

  let ringPosArr = []
  for(let i = 30; i < 360; i+= 30) {
    const r = ZONE_RADIUS.THREE-(Math.random()*1000);
    const theta = THREE.MathUtils.degToRad(i)
    const tx = r * Math.cos(theta)
    const ty = r * Math.sin(theta)
    const ry =  THREE.MathUtils.degToRad(90-i)
    ringPosArr.push(new THREE.Vector3(tx, 0, ty))
  }
  console.log("render buildings ? ", ringPosArr)
  renderBuildings(scene, 3, ringPosArr)

  makeSteps(scene, {x: ZONE_POS.THREE.x - 1000, z: ZONE_POS.THREE.z })
  makeSteps(scene, {x: ZONE_POS.THREE.x - 800, z: ZONE_POS.THREE.z - 500 })
  makeSteps(scene, {x: ZONE_POS.THREE.x + 500, z: ZONE_POS.THREE.z + 500 })

  window.DYNAMIC_LOADED = true;
}

export function renderBuildings (scene, randNum, posArr) {
    
    const geometries = []

    const size = 60;
    const height = 300;
    const g1 = new THREE.BoxGeometry(size, height, size)

    // left z
    const leftZ = new THREE.BoxGeometry(size, size, size)
    leftZ.translate(0, height/2, size)
    for(let i = 6; i > 0; i--) {
        const cloneBox = leftZ.clone()
        cloneBox.scale(i/6, i/6, i/6)

        cloneBox.translate(0, size*(6-i), size*(6-i)-15*(6-i))
        geometries.push(cloneBox)
    }

    const rightZ = new THREE.BoxGeometry(size, size, size)
    rightZ.translate(0, 0, -size)
    for(let i = 0; i < 5; i++) {
        const cloneBox = rightZ.clone()
        cloneBox.translate(0, size*i, -size*i)
        //geometries.push(cloneBox)
    }
    for(let i = 6; i > 0; i--) {
        const cloneBox = rightZ.clone()
        cloneBox.scale(i/6, i/6, i/6)
        
        cloneBox.translate(0, size*(6-i), -size*(6-i)+15*(6-i))
        geometries.push(cloneBox)

    }

    geometries.push(g1, leftZ, rightZ)

    const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(geometries)
    mergedGeometry.randomNoise = getRandomArbitrary(100, 500)

    const material = new THREE.MeshPhongMaterial({ color: 0xffe5d9 })

    const mesh = new THREE.InstancedMesh(mergedGeometry, material, 10)

    for(let i = 0; i < posArr.length; i++)
    {
        const position = posArr[i] 
        //new THREE.Vector3(getRandomInt(-300, 300), 100, getRandomInt(-300, 300))

        const quaternion = new THREE.Quaternion()
        quaternion.setFromEuler(new THREE.Euler((Math.random() - 0.5) * Math.PI * 2, (Math.random() - 0.5) * Math.PI * 2, 0))

        const matrix = new THREE.Matrix4()
        // matrix.makeRotationFromQuaternion(quaternion)
        matrix.setPosition(position)

        mesh.setMatrixAt(i, matrix)
        // mesh.zone = 3;
        mesh.name = 'apt'
        mesh.desc= '수직 상승의 기회, 잡고 싶니?'
        mesh.needsUpdate = true;

        // enable tick
        mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
        mesh.randomNoise = randNum
    }

    mesh.translateX(ZONE_POS.THREE.x)
    mesh.translateZ(ZONE_POS.THREE.z)

    mesh.zone = 3
    window.RAYOBJ.push(mesh)
    scene.add(mesh)

}

export function makeSteps(scene, pos) {

    console.log("makeSteps? ", pos)
    const size = 60
    const height = 20
    const g1 = new THREE.BoxGeometry(size, height, size)
    const gmat = new THREE.MeshPhongMaterial({ color: 0x222222 })
    const boxTest = new THREE.Mesh(g1, gmat)
    boxTest.name = "점프해서 열심히 올라가 봐. 어려울걸?"
    boxTest.translateX(pos.x)
    boxTest.translateZ(pos.z)
    boxTest.zone = 3
    window.RAYOBJ.push(boxTest)        
    scene.add(boxTest)

    for(let i = 1; i < 25; i++){
        const box2 = boxTest.clone();
        box2.position.x += size * i;
        box2.position.y += height * i;
        box2.zone = 3
        window.RAYOBJ.push(box2)
        scene.add(box2)
    }


}