import './index.css'
import './animate.scss'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { NodePass } from 'three/examples/jsm/nodes/postprocessing/NodePass.js';
import * as Nodes from 'three/examples/jsm/nodes/Nodes.js';
import Stats from 'three/examples/jsm/libs/stats.module';
import { WEBGL } from 'three/examples/jsm/WebGL.js';

import { updateStepNum, retrieveEnergy, showDescription, showHowto, warnLowEnergy } from './services/utils';
import { MONUMENTS_MODELS } from './loaders/glbLoader.js';
import { loadAssets, loadZoneOneModels, loadZoneTwoModels, loadZoneParkModels, onLoadAnimation, loadZoneThreeModels } from './loaders/loadAssets'

import { ZONE_NAMES, ZONE_POS, ZONE_RADIUS, ZONE_RESET_POS } from './render/constants';
import { instantiateZone3 } from './render/zone3';
import { renderShutter } from './render/zone1';
import { instantiateParkObj } from './render/park';
import { renderGrounds, renderMountain } from './render/global';

// Global Variables
let stats, composer, nodepass, screen, blurScreen;  // render pass
const frame = new Nodes.NodeFrame();
let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
let popupOpen = true;
let myHeight = 50;

// Loading manager for 3d models and animation
window.MIXERS = [];
const loadManager = new THREE.LoadingManager();
loadManager.onLoad = init;
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/')
// dracoLoader.setDecoderPath('three/examples/js/libs/draco');

const gltfLoader = new GLTFLoader(loadManager);
gltfLoader.setDRACOLoader(dracoLoader)

const fontLoader = new FontLoader(loadManager)
const textureLoader = new THREE.TextureLoader(loadManager);
loadAssets(gltfLoader, fontLoader, textureLoader)

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0xbababa);
scene.fog = new THREE.FogExp2( 0xcdcdcd, 0.0008 );
window.SCENE = scene;

// Sizes
const sizes = {
  WIDTH : window.innerWidth,
  HEIGHT : window.innerHeight
}

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('canvas.webgl'),
  antialias: true
})
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setClearColor(new THREE.Color(0x000, 1.0));
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(sizes.WIDTH, sizes.HEIGHT);

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Node Pass
let nodepost = new Nodes.NodePostProcessing( renderer );

// Camera
const params = {
  fov: 60,
  aspect: window.innerWidth/window.innerHeight, 
  zNear: 1,
  zFar: 20000
}
function makeCamera() {
  const { fov, aspect, zNear, zFar} = params;  // the canvas default
  return new THREE.PerspectiveCamera(fov, aspect, zNear, zFar);
}
let camera = makeCamera();
// Start Position
camera.position.x = 6750;
camera.position.y = 100;
camera.position.z = 0;  
camera.lookAt(new THREE.Vector3(750, 0, -750));

// Orbit Controls
const controls = new OrbitControls( camera, renderer.domElement);
controls.enableZoom = true;
controls.enableDamping = true;
controls.update();

// EventListener for Debug
// window.addEventListener('click', function () {

//  console.log("check position:", pointerControls.getObject().position) 
//  // console.log("check rotation:", pointerControls.getObject().rotation)
// })

// Raycaster
const rayOrigin = new THREE.Vector3()
const rayDirection = new THREE.Vector3( -1, 0, 0 )
const rayZ = new THREE.Vector3( 0, 0, 1 )
rayDirection.normalize()
let raycaster = new THREE.Raycaster(rayOrigin, rayDirection, 0, 100); // rayOrigin, rayDirection, 0, 10
let raycaster2 = new THREE.Raycaster(rayOrigin, rayZ, 0, 100); // rayOrigin, rayDirection, 0, 10

// Zones
window.STEP_LIMIT = 3500
window.ZONE = ""
window.DYNAMIC_LOADED = false;
window.ZONE_CHANGED = false;
window.ACC_STEPS = window.STEP_LIMIT;
window.RAYOBJ = []
window.HOWTOPAGE = 1;
window.PREV_STEPS = window.STEP_LIMIT;
window.STALE = 0;
// Clock: autoStart, elapsedTime, oldTime, running, startTime
var clock = new THREE.Clock();
const pointerControls = new PointerLockControls(camera, document.body);

// init()

function togglePopup () {
  var popup = document.querySelector(".popup");
  if(popupOpen) {
    popup.classList.add("show");
    showHowto(0)
  } else {
    popup.classList.remove("show")
  }
}

function resetPosition() {
  camera.position.x = 300;
  camera.position.y = 10;
  camera.position.z = 100;

  if((window.ACC_STEPS/window.STEP_LIMIT * 100) <= 10) {
    showDescription("체력이 얼마 남지 않았습니다. 에너지를 채우기 위해 공원으로 곧 이동합니다.")
    window.ACC_STEPS = window.STEP_LIMIT
  }
}

function checkCameraLoadAssets(currentPos)  {

  // Zone 1
  const centerX1 = ZONE_POS.ONE.x
  const centerZ1 = ZONE_POS.ONE.z
  const radius1 = ZONE_RADIUS.ONE

  const dx1 = Math.abs(currentPos.x - centerX1)
  const dz1 = Math.abs(currentPos.z - centerZ1)

  let inZone1 = dx1*dx1 + dz1*dz1 <= radius1*radius1

  // rectangle zone 500(z) x 3000(x), x: 4500
  if(4500-1500 <= currentPos.x && 4500+1500 >= currentPos.x) {
    if(currentPos.z <= 250 && currentPos.z >= -250 ) {
        inZone1 = true;
    }
  }

  // zone 1
  // let inZone1 = window.GROUNDS[0]?.boundingSphere?.containsPoint(currentPos)
  if(inZone1) {
    isZoneChanged("ONE")
    return;
  }

  // ZONE 2
  const centerX2 = ZONE_POS.TWO.x
  const centerZ2 = ZONE_POS.TWO.z
  const radius2 = ZONE_RADIUS.TWO

  const dx2 = Math.abs(currentPos.x - centerX2)
  const dz2 = Math.abs(currentPos.z - centerZ2)

  let inZone2 = dx2*dx2 + dz2*dz2 <= radius2*radius2
  if(inZone2) {
    isZoneChanged("TWO")
    return;
  }

  // ZONE 3
  const centerX3 = ZONE_POS.THREE.x
  const centerZ3 = ZONE_POS.THREE.z
  const radius3 = ZONE_RADIUS.THREE

  const dx3 = Math.abs(currentPos.x - centerX3)
  const dz3 = Math.abs(currentPos.z - centerZ3)

  let inZone3 = dx3*dx3 + dz3*dz3 <= radius3*radius3
  if(inZone3) {
    isZoneChanged("THREE")
    loadZones(window.ZONE)
    return;
  }

  // PARK
  const centerX4 = ZONE_POS.GARDEN.x
  const centerZ4 = ZONE_POS.GARDEN.z
  const radius4 = ZONE_RADIUS.GARDEN

  const dx4 = Math.abs(currentPos.x - centerX4)
  const dz4 = Math.abs(currentPos.z - centerZ4)
  let inZonePark = dx4*dx4 + dz4*dz4 <= radius4*radius4

  if(inZonePark) {
    isZoneChanged("PARK")
  } 

  unloadZonesModels(inZone3)
}

// zone is changed
function isZoneChanged(zone) {
  if(window.ZONE !== zone) {
   window.ZONE_CHANGED = true; 
   window.ZONE = zone;
   notifyZones(zone)
  } else {
    console.log("same zone", zone)
  }
}

function notifyZones(zone) {
  console.log("loadZones called, ZONE_CHANGED? ", zone, window.ZONE_CHANGED)
  
  const lang =  window.localStorage.getItem('language')
  let notice1, notice2, notice3, notice4;
  if(lang == 'en') {
    notice1 = "Zone 1: TECH-JIRO"
    notice2 = "Zone 2: HIP-JIRO"
    notice3 = "Zone 3: BUILDING-JIRO"
    notice4 = "ZONE PARK: Recharge Your Energy"
  } else {
    notice1 = "1구역 테크JIRO입니다."
    notice2 = "2구역 힙JIRO입니다."
    notice3 = "3구역 빌딩JIRO입니다."
    notice4 = "에너지를 충전할 수 있는 공원입니다."
  }

  switch(zone) {
    case "ONE":
      showDescription(notice1)
      window.ZONE_CHANGED = true
      break;
    case "TWO":
      showDescription(notice2)
      window.ZONE_CHANGED = true
      break;
    case "THREE":
      showDescription(notice3)
      window.ZONE_CHANGED = true
      break;
    case "PARK":
      showDescription(notice4)
      window.ZONE_CHANGED = true
      break;   
  }

}

function loadZones(zone) {

  if(window.DYNAMIC_LOADED) return;
  console.log("loadZones called, DYNAMIC_LOADED? ", zone, window.DYNAMIC_LOADED)

  if(zone = "THREE") {
    instantiateZone3(scene) 
  }
}

function init() {

  if(!WEBGL.isWebGLAvailable()) {
    const warning = WEBGL.getWebGLErrorMessage() + "WebGL을 지원하지 않는 컴퓨터일 수 있습니다. 아니라면, 새로고침을 시도해주세요.";
    document.getElementById( 'container' ).appendChild( warning );
  } else {
    console.log("init")
    initStats();
    main()
    tick()
  }

  window.addEventListener( 'resize', onWindowResize );

}

function main() {
  renderer.autoClear = true;

  // Light
  const dirLight2 = new THREE.DirectionalLight( 0xB97A20 );  //0x002288
  dirLight2.position.set( -3000, 2000, -800 );
  dirLight2.intensity = 2.0
  const target2 = new THREE.Object3D()
  target2.position.set(ZONE_POS.ONE.x, ZONE_POS.ONE.y, ZONE_POS.ONE.z)
  dirLight2.target = target2
  dirLight2.name = "light"
  scene.add( dirLight2 );
  scene.add(target2)
  scene.add(dirLight2.target)
  // const helper2 = new THREE.DirectionalLightHelper( dirLight2, 50 );
  // scene.add( helper2 );

  const dirLight3 = new THREE.DirectionalLight( 0xB97A20 );
  dirLight3.position.set( 2000, 2000, 1000 );
  dirLight3.name = "light"
  scene.add( dirLight3 );
  // const helper3 = new THREE.DirectionalLightHelper( dirLight3, 50 );
  // scene.add( helper3 );

  const ambientLight = new THREE.AmbientLight( 0x777777 );
  ambientLight.intensity = 0.5;
  ambientLight.name = "light"
  scene.add( ambientLight );

  loadDefaultEnvironment()
  // initPostprocessing()  // use nodes, pass
  updateBlurMaterial() // use nodes
}

function initPostprocessing() {
  // Blur Pass
  // postprocessing
  composer = new EffectComposer( renderer );
  composer.addPass( new RenderPass( scene, camera ) );
  nodepass = new NodePass();
  composer.addPass( nodepass );
  updateBlurMaterial()
}

function updateBlurMaterial() {
  // Blur Nodes
  let size = renderer.getDrawingBufferSize( new THREE.Vector2() );

  blurScreen = new Nodes.BlurNode( new Nodes.ScreenNode() );
  blurScreen.size = new THREE.Vector2( size.width, size.height );

  nodepost.output = blurScreen;
  blurScreen.radius.x = 0;
  blurScreen.radius.y = 0;
  console.log("init -------------- ", blurScreen)
  // const bufferSize = renderer.getDrawingBufferSize( new THREE.Vector2() );
  // console.log("updateBlurMaterial buffersize? ", bufferSize)
  // const blurScreen = new Nodes.BlurNode( new Nodes.ScreenNode() );
  // blurScreen.size = new THREE.Vector2( bufferSize.width, bufferSize.height );
  // nodepass.input = blurScreen;
  // blurScreen.radius.x = -10;
  // blurScreen.radius.y = -10;
  nodepost.needsUpdate = true;
}

function gradientBlurScreen(delta) {
  if(delta < 0) {  // to CLEAR
    while(blurScreen.radius.x >= 0) {
      blurScreen.radius.x += delta
      blurScreen.radius.y += delta
    }
    return;
  }
  if(delta > 0) {  // to BLUR
    while(blurScreen.radius.x <= 5) {
      blurScreen.radius.x += delta
      blurScreen.radius.y += delta 
    }
  }
  // console.log("blur nodes", blurScreen, blurScreen.radius.x)
}

function loadDefaultEnvironment() {
  
  renderGrounds(scene)
  renderShutter(scene, 50);
  renderShutter(scene, -50);

  renderMountain(scene)

  instantiateParkObj(scene)
  
  // monument gltf
  for (let i = 0; i < MONUMENTS_MODELS.length; i++) {
    const monuments = MONUMENTS_MODELS[i]
    try {
      onLoadAnimation(monuments.gltf, monuments, scene)
    } catch (err) {
      console.log(err)
    }
  }

  // load all models in the beginning
  loadZoneParkModels(scene) 
  loadZoneThreeModels(scene)
  loadZoneTwoModels(scene)
  loadZoneOneModels(scene)
}


// OUTSIDE zones
function unloadZonesModels(isInsideZone3) {
  // if( inZone1 + inZone2 + inZone3 == 0) {
  if( isInsideZone3 == 0) {
    window.DYNAMIC_LOADED = false;

    // unload all gltf
    if(!scene && !scene?.traverse) return;
    try {
      scene.traverse(obj => {
        if(obj?.zone === 3) {
          console.log("unload zone3 primitive models")
          if(obj.parent === scene) scene.remove(obj)
        }
        /**
        if (typeof obj?.zone === 'number') {

          if(obj?.zone < 4) {
            console.log("unload zone123 models")
            if(obj.parent === scene) scene.remove(obj) 
            //TypeError: Cannot read properties of undefined (reading 'traverse') at Scene.traverse 
          }
        }
         */
      })
    } catch (err) {
      console.log(err)
    }
  }
}
/**
function unloadParkModels() {
  if(!inZonePark) {
    // window.DYNAMIC_LOADED = false;
    console.log("unload park models")

    if(!scene && !scene?.traverse) return;
    try {
      scene.traverse(obj => {
        if (typeof obj?.zone === 'number') {
          if(obj.zone === 4) {
            scene.remove(obj)
          }
        }
      })
    } catch (err) {
      console.log(err)
    }
  }
}
 */

function loadSounds() {
    
  // audio test
  try {

  const listener = new THREE.AudioListener();
  camera.add(listener)

  const sound1 = new THREE.PositionalAudio( listener );
  sound1.setVolume(3.0)
  sound1.setLoop(true)

  const zone1Song = document.getElementById( 'zone1' );
  sound1.setMediaElementSource( zone1Song );
  sound1.setRefDistance( 60 );
  sound1.setMaxDistance( ZONE_RADIUS.ONE )
  zone1Song.play();
  
  const centerSphere = new THREE.SphereGeometry(100, 10, 10)
  const material = new THREE.MeshPhongMaterial( { color: 0xff2200, opacity: 0.0, transparent: true } );
  const mesh = new THREE.Mesh( centerSphere, material );
  mesh.position.set(ZONE_POS.ONE.x + 600, ZONE_POS.ONE.y + 200, ZONE_POS.ONE.z)
  scene.add( mesh );
  mesh.add(sound1)

  // park
  const sound4 = new THREE.PositionalAudio( listener );
  sound4.setVolume(4.0)
  sound4.setLoop(true)
  const parkSong = document.getElementById( 'zonepark' );
  sound4.setMediaElementSource( parkSong );
  sound4.setRefDistance( 80 );
  sound4.setMaxDistance( ZONE_RADIUS.GARDEN )
  parkSong.play();
  
  const parkMesh = new THREE.Mesh( centerSphere.clone(), material );
  parkMesh.position.set(ZONE_POS.GARDEN.x , ZONE_POS.GARDEN.y + 400, ZONE_POS.GARDEN.z)
  scene.add( parkMesh );
  parkMesh.add(sound4)

  // zone2 
  const sound2 = new THREE.PositionalAudio( listener );
  sound2.setVolume(3.0)
  sound2.setLoop(true)
  const zone2Song = document.getElementById( 'zone2' );
  sound2.setMediaElementSource( zone2Song );
  sound2.setRefDistance( 30 );
  sound2.setMaxDistance( 200 )
  zone2Song.play();
  const zone2Mesh = new THREE.Mesh( centerSphere.clone(), material );
  zone2Mesh.position.set(ZONE_POS.TWO.x , ZONE_POS.TWO.y + 200, ZONE_POS.TWO.z)
  scene.add( zone2Mesh );
  zone2Mesh.add(sound2)

  // zone3
  const sound3 = new THREE.PositionalAudio( listener );
  sound3.setVolume(2.5)
  sound3.setLoop(true)
  const zone3Song = document.getElementById( 'zone3' );
  sound3.setMediaElementSource( zone3Song );
  sound3.setRefDistance( 30 );
  sound3.setMaxDistance( 200 )
  zone3Song.play();
  const zone3Mesh = new THREE.Mesh( centerSphere.clone(), material );
  zone3Mesh.position.set(ZONE_POS.THREE.x , ZONE_POS.THREE.y + 300, ZONE_POS.THREE.z)
  scene.add( zone3Mesh );
  console.log("add zone3 sound")
  zone3Mesh.add(sound3)
  } catch (err) {
    console.log("sounds: ", err)
  }
}

function checkPointerControls() {
  const time = performance.now();
  const currentPosition = pointerControls?.getObject().position

  if ( pointerControls.isLocked === true ) {

    // jump on raycaster objects
    raycaster.ray.origin.copy(currentPosition);
    raycaster.ray.origin.x += 10;

    raycaster2.ray.origin.copy(currentPosition);
    raycaster2.ray.origin.z += 10;

    const interX = raycaster.intersectObjects( window.RAYOBJ , false )
    const interZ = raycaster2.intersectObjects(window.RAYOBJ, false)
    const intersections = interX.concat(interZ)
    const onObject = intersections.length > 0;
    if(onObject) {
      // console.log(intersections[0].object?.name)
      if(window.localStorage.getItem('language') === 'en') {
        showDescription(  intersections[0].object?.descEN ||  intersections[0].object?.name )
      } else {
        showDescription(  intersections[0].object?.descKO ||  intersections[0].object?.name )

      }
    }

    // control speed of movement
    const delta = ( time - prevTime ) / 250;  // larger dividend, slower

    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;

    velocity.y -= 9.8 * 100.0 * delta;

    direction.z = Number( moveForward ) - Number( moveBackward );
    direction.x = Number( moveRight ) - Number( moveLeft );
    direction.normalize(); // this ensures consistent movements in all directions

    if ( moveForward || moveBackward ) velocity.z -= direction.z * 400.0 * delta;
    if ( moveLeft || moveRight ) velocity.x -= direction.x * 400.0 * delta;

    if ( onObject === true ) {
      // console.log("JUMP YES")
      velocity.y = Math.max( 0, velocity.y);
      canJump = true;

    }

    pointerControls.moveRight( - velocity.x * delta );
    pointerControls.moveForward( - velocity.z * delta );

    pointerControls.getObject().position.y += ( velocity.y * delta ); // new behavior

    if ( pointerControls.getObject().position.y < myHeight ) {

      velocity.y = 0;
      pointerControls.getObject().position.y = myHeight;

      canJump = true;

    }
  }

  prevTime = time;
}

// part of animation loop
function render() {

  const canvas = renderer.domElement;
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();     

  const delta = clock.getDelta();

  if(window.MIXERS.length > 0) {
    window.MIXERS.forEach(mixer => {
      mixer.update(delta)
    })
  }  

  const elapse = clock.getElapsedTime()

    frame.update(elapse)
    nodepost.render( scene, camera, frame );  

    // CHECK if it's playing
    let frameCount = nodepost.renderer.info.render.frame;
    if(frameCount%100 == 0) {
      if(window.PREV_STEPS === window.ACC_STEPS) { // stale
        window.STALE += 1
        // console.log("stale", window.STALE)
      } else {
        window.STALE = 0;  // walking
        // let hasReset = window.localStorage.getItem('autoReset')
        // if(hasReset === 'true') {
        //   window.localStorage.setItem('autoReset', 'false')
        // }
      }

      window.PREV_STEPS = window.ACC_STEPS

      if(window.STALE >= 180) { // check if stale for 3~4 minutes
        // let hasReset = window.localStorage.getItem('autoReset')
        // console.log("stale over 4 minute, did it reset before?", hasReset)
        // if(hasReset === 'false') {  // reset if not reset previously
          location.reload()
          // window.localStorage.setItem('autoReset', 'true')

        // }
      }
    }

  stats.update()
}

// Key Controls
const onKeyDown = function ( event ) {
  updateStepNum()
  if(window.ACC_STEPS <= 0) resetPosition()

  switch ( event.code ) {

    case 'ArrowUp':
    case 'KeyW':
      moveForward = true;
      break;

    case 'ArrowLeft':
    case 'KeyA':
      if(popupOpen) {
        showHowto(-1)
      } else {
        moveLeft = true;
      }
      break;

    case 'ArrowDown':
    case 'KeyS':
      moveBackward = true;
      break;

    case 'ArrowRight':
    case 'KeyD':
      if(popupOpen) {
        showHowto(1)
      } else {
        moveRight = true;
      }
      break;

    case 'Space':
      if ( canJump === true ) velocity.y += 650;
      canJump = false;
      break;
    
    case 'KeyI':
      popupOpen = !popupOpen;
      console.log(popupOpen)
      togglePopup()
      break;
  }
};

const onKeyUp = function ( event ) {

  switch ( event.code ) {

    case 'ArrowUp':
    case 'KeyW':
      moveForward = false;
      break;

    case 'ArrowLeft':
    case 'KeyA':
      moveLeft = false;
      break;

    case 'ArrowDown':
    case 'KeyS':
      moveBackward = false;
      break;

    case 'ArrowRight':
    case 'KeyD':
      moveRight = false;
      break;
  }
};
document.addEventListener( 'keydown', onKeyDown );
document.addEventListener( 'keyup', onKeyUp );

// GamePad Interaction
window.gamepadConnected = false;
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;

window.addEventListener("gamepadconnected", function(e) {
  console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
    e.gamepad.index, e.gamepad.id,
    e.gamepad.buttons.length, e.gamepad.axes.length);
    window.gamepadConnected = true; 
});
window.addEventListener("gamepaddisconnected", function(e) {
  console.log("Gamepad DISconnected")
  window.gamepadConnected = false;
})

// gamepad before init
function xboxKeyPressed (gamepad) {
  if(!gamepad) {
    console.log("ERROR: XBOX CONNECTION LOST")
    return
  }

  if(window.ACC_STEPS <= 0) resetPosition()


  let currentPos = pointerControls.getObject().position
  checkCameraLoadAssets(currentPos);
  // let per = Math.floor((window.ACC_STEPS / stepLimit) * 100 )
  // updateStepProgress(per)

  const buttons = gamepad.buttons;

  if(buttons[1].touched) {  // B button
    console.log("b btn clicked")
    console.log(buttons[1].touched)
    console.log(pointerControls)
    if(!pointerControls?.isLocked) {
      console.log(pointerControls)
      console.log(pointerControls.isLocked)

      // start howto popup in the beginning
      const howtoPopup = document.querySelector(".popup");
      howtoPopup.classList.add("show");
      try {
        pointerControls?.lock();
      } catch (err) {
        console.log(err)
      }
    }
  }

  if(buttons[12].touched) {  // up
    moveForward = true;
    updateStepNum()
  } 
  if(!buttons[12].touched) {
    moveForward = false;
  }
  if(buttons[15].touched) {
    moveRight = true;
    updateStepNum()
  }
  if(!buttons[15].touched){
    moveRight = false;
  }
  if(buttons[13].touched) {
    moveBackward = true;
    updateStepNum()
  }
  if(!buttons[13].touched){
    moveBackward = false;
  }
  if(buttons[14].touched) {
    moveLeft = true;
    updateStepNum()
  }
  if(!buttons[14].touched){
    moveLeft = false;
  }
  if(buttons[3].pressed) {
    if ( canJump === true ) velocity.y += 650;
    canJump = false;
    return;
  }
  if(buttons[0].pressed) {  // open popup
    if(!popupOpen && buttons[0].value) {
      popupOpen = true;
      togglePopup()
    }
    // control for howto popup slide
    if(popupOpen){
      console.log("popup? ", popupOpen)
      // const btnVal = buttons[0].pressed;
      showHowto(0)
      // setTimeout(showHowto(), 2000)
    }
    return;
  }
  if(buttons[2].pressed) { // close popup
    popupOpen = false;
    console.log(popupOpen)
    togglePopup()
    window.HOWTOPAGE = 1;
    return;
  }
  if(buttons[8].pressed) {
    console.log("reset")
    location.reload()
    return;
  }
}

let prevAxisX = 0;
let prevAxisY = 0;
let staleX = 0;
let staleY = 0;

function xboxAxesPressed(gamepad) {
  const _euler = new THREE.Euler( 0, 0, 0, 'YXZ' );
  const minPolarAngle = 0; // radians
  const maxPolarAngle = Math.PI; // radians 
  const _PI_2 = Math.PI / 2;

  const movementX = gamepad.axes[2]
  const movementY = gamepad.axes[3]

  prevAxisY === movementY ? staleY++ : staleY = 0;
  prevAxisX === movementX ? staleX++ : staleX = 0; 

  if(staleX > 10 && staleY > 10){  // prevent constant camera rotation
    return
  } else {
    _euler.setFromQuaternion( camera.quaternion );
  
    _euler.y -= movementX * 0.02;
    _euler.x -= movementY * 0.02;
  
    _euler.x = Math.max( _PI_2 - maxPolarAngle, Math.min( _PI_2 - minPolarAngle, _euler.x ) );
  
    camera.quaternion.setFromEuler( _euler );
  }

  prevAxisX = movementX;
  prevAxisY = movementY;
}
/**
if (window.gamepadConnected) {
  const gamepad = navigator.getGamepads()[0];
  
  if(!gamepad) {
    console.log("ERROR: XBOX CONNECTION LOST") 
    return;

  } else {
    try {
      xboxKeyPressed(gamepad);
      xboxAxesPressed(gamepad);
    } catch (err) {
      console.log("XBOX ERROR: ", err)
    }  
  }
} 
 */
// Pointer Lock Controls & Instructions
const instructions = document.getElementById( 'instructions' );
const blocker = document.getElementById( 'blocker' );

pointerControls.addEventListener('change', function () {

  // camera position check
  let currentPos = pointerControls.getObject().position
  let currentRot = pointerControls.getObject().rotation  

  checkCameraLoadAssets(currentPos)
    
})

blocker.addEventListener( 'click', function () {
  pointerControls.lock();

  const howtoPopup = document.querySelector(".popup");
  howtoPopup.classList.add("show");

  const energyHtml = document.querySelector( '.energyContainer' );
  energyHtml.style.visibility = 'visible';
  // loadSounds()
  // tick();  // start animate after blocker is gone
} );

pointerControls.addEventListener( 'lock', function () {
  instructions.style.display = 'none';
  blocker.style.display = 'none';

  loadSounds() // this prevents going back between lock and unlock
} );

pointerControls.addEventListener( 'unlock', function () {

  blocker.style.display = 'block';
  instructions.style.display = '';

} );


function tick() {
  const time = performance.now();

  // check energy progress
  let energyPercent = ((window.ACC_STEPS/window.STEP_LIMIT)*100) 
  if( energyPercent < 30 ) {
    warnLowEnergy(scene)
    gradientBlurScreen(0.005)
  } else if ( energyPercent > 30 ) {
    retrieveEnergy(scene)
    gradientBlurScreen(-0.005)

  }

  
  // gamepad
  if (window.gamepadConnected) {
    const gamepad = navigator.getGamepads()[0];
    
    if(!gamepad) {
      console.log("ERROR: XBOX CONNECTION LOST") 
      return;

    } else {
      try {
        xboxKeyPressed(gamepad);
        xboxAxesPressed(gamepad);
      } catch (err) {
        console.log("XBOX ERROR: ", err)
      }  
    }
  } 

  // fill energy when standing in Park
  if (window.ZONE === "PARK") {
    updateStepNum() 
  }

  if(!scene && !scene?.traverse) return;
  scene.traverse(obj => {
    if(!obj.name) return;

    if(obj?.name?.includes("shader")) {
      // update shader material
      if (window.ZONE === "PARK") {
        if(obj.name.includes("grass")) {  // grass shader only in PARK
          obj.material.uniforms.u_time.value = time * 0.002; 
        }
      } else {
        obj.material.uniforms.u_time.value = time * 0.002; 
      }
    }
    if(obj.name === "robotFace") {
      obj.position.y += Math.sin(time*0.002)*2.0
    }
    if(obj.name === "trees") {  // animate tree's scale
      obj.scale.x = Math.cos(time*0.0003) * 12
      obj.scale.y = Math.cos(time*0.0003) * 12
      obj.scale.z = Math.cos(time*0.0003) * 12
    }
    if (typeof obj.tick === 'function') {   // tick AnimatedFlower
      obj.tick(time);
    }
    if (window.ZONE === "THREE") {
      if(obj.name.includes('apt')) { 
        const rand = obj.randomNoise;
        obj.position.y += Math.sin(time*0.0005)*rand
      }
    }
  })

  render();

  requestAnimationFrame( tick );

  checkPointerControls()
};


function initStats() {
  stats = new Stats();
  stats.setMode(0);
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  document.querySelector("#stats-output").append(stats.domElement);
  return stats;
}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );
  nodepost.setSize( window.innerWidth, window.innerHeight );

  // composer.setSize( window.innerWidth, window.innerHeight );

}