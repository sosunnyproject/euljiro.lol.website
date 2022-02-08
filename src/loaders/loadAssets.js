import * as THREE from 'three';
// import { DISTRICT_ONE_GLB, DISTRICT_TWO_GLB, DISTRICT_THREE_GLB, MONUMENTS_GLB, DISTRICT_PARK_GLB } from './models/glbLoader.js';
import { ZONE_ONE_MODELS, MONUMENTS_MODELS, ZONE_TWO_MODELS, ZONE_PARK_MODELS, ZONE_THREE_MODELS } from './glbLoader.js';
import { showDescription, updateLoadingProgress } from '../services/utils';
import { ZONE_POS } from '../render/constants';

const box = new THREE.BoxGeometry(5, 40, 5, 10, 10)
const cylinderRay = new THREE.CylinderGeometry(2, 2, 60, 8)
const mat = new THREE.MeshBasicMaterial({ color: 0xff00ff, opacity: 0.0, transparent: true })
 //  opacity: 0.0, transparent: true

export async function loadAssets(gltfLoader, fontLoader, textureLoader) {

 const loadNum = MONUMENTS_MODELS.length + ZONE_ONE_MODELS.length + ZONE_TWO_MODELS.length + ZONE_THREE_MODELS.length + ZONE_PARK_MODELS.length

 MONUMENTS_MODELS.forEach(model => {
  gltfLoader.load(model.url,
   (gltf) => {
    model.gltf = gltf;
    console.log("loaded monument")
    updateLoadingProgress(loadNum);
  })
 })

 ZONE_ONE_MODELS.forEach(model => {
  try {
    gltfLoader.load(model.url, 
      (gltf) => {
      model.gltf = gltf;
      console.log("loaded 1")
      updateLoadingProgress(loadNum);
    }) 
  } catch (e) {
    console.log(e)
  }
})

 ZONE_TWO_MODELS.forEach(model => {
   gltfLoader.load(model.url, 
     (gltf) => {
     model.gltf = gltf;
     console.log("loaded 2")
     updateLoadingProgress(loadNum);
    })
 })

 ZONE_THREE_MODELS.forEach(model => {
  gltfLoader.load(model.url, 
    (gltf) => {
    model.gltf = gltf;
    console.log("loaded 3")
    updateLoadingProgress(loadNum);
  })
})


ZONE_PARK_MODELS.forEach(model => {
  gltfLoader.load(model.url, 
    (gltf) => {
    model.gltf = gltf;
    updateLoadingProgress(loadNum);
  })
})

}

export async function loadZoneParkModels(scene) {
  console.log("loadZoneParkModels")
  
  for (let i = 0; i < ZONE_PARK_MODELS.length; i++) {
    const model = ZONE_PARK_MODELS[i]
    try {
      await onLoadAnimation(model.gltf, model, scene)
    } catch (err) {
      console.log(err)
    }
  }

  // window.DYNAMIC_LOADED = true;  
}


export async function loadZoneOneModels(scene) {
  console.log("loadZoneOneGLB")
  for (let i = 0; i < ZONE_ONE_MODELS.length; i++) {
    const model = ZONE_ONE_MODELS[i]
    try {
      await onLoadAnimation(model.gltf, model, scene)
    } catch (err) {
      console.log(err)
    }
  }

  // window.DYNAMIC_LOADED = true;  
}

export async function loadZoneTwoModels(scene) {
  console.log("loadZoneTwoGLB")

  for (let i = 0; i < ZONE_TWO_MODELS.length; i++) {
    const model = ZONE_TWO_MODELS[i]
    try {
      await onLoadAnimation(model.gltf, model, scene)
    } catch (err) {
      console.log(err)
    }
  }

  // window.DYNAMIC_LOADED = true;  
}

export async function loadZoneThreeModels(scene) {
  console.log("loadZoneThreeGLB")

  for (let i = 0; i < ZONE_THREE_MODELS.length; i++) {
    const model = ZONE_THREE_MODELS[i]
    try {
      await onLoadAnimation(model.gltf, model, scene)
    } catch (err) {
      console.log(err)
    }
  }

  // window.DYNAMIC_LOADED = true;  
}

export function onLoadAnimation(model, data, scene) {
  // console.log("load animated models: ", data)
  const { posX, posY, posZ, rx, ry, rz } = data

  if(model){
    model.scene.position.set(posX, posY, posZ);
    model.scene.rotation.set(rx, ry, rz);
    model.scene.rotation.y += Math.PI/2.0; // face front  
  }

  if(data.scale) {
    const inputScale = data.scale
    if(data.zone < 4) {
      model.scene.scale.set(inputScale, inputScale, inputScale/1.5)
    } else {
      model.scene.scale.set(inputScale, inputScale, inputScale)
    }
  } 

  if(data.name) {
    model.scene.name = data.name
  }

  // add dummy 
  const dummy = new THREE.Mesh(cylinderRay, mat)
  dummy.position.set(posX, 20, posZ)
  dummy.scale.set(70, 40, 70) 

  // scene.add(dummy)
  dummy.name = data.name;
  dummy.descEN = data.en
  dummy.descKO = data.ko
  // console.log("dummy for bounding box", dummy)
  // const boxhelper = new THREE.BoxHelper( dummy, 0xff0000 );
  // boxhelper.setFromObject(dummy)
  // boxhelper.name = data.name;

  scene.add(dummy)
  window.RAYOBJ.push(dummy)

  if(model.animations.length) {
    let mixer = new THREE.AnimationMixer(model.scene);
    window.MIXERS.push(mixer)

    var action = mixer.clipAction(model.animations[0])
    action.play();   
  }

  if(data.zone) {
    model.scene.zone = data.zone
  }

  // model.scene.children[0].geometry.computeBoundingBox();
  // console.log("gltf", model.scene) // object3d
  // console.log("gltf bounding box: ", model.scene, model.scene.children[0].geometry.boundingBox) // mesh

  scene.add(model.scene)

}