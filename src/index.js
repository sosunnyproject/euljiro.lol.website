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

import { initHtml, updateStepNum, retrieveEnergy, showDescription, showHowto, warnLowEnergy } from './services/utils';
import { MONUMENTS_MODELS } from './loaders/glbLoader.js';
import { loadAssets, loadZoneOneModels, loadZoneTwoModels, loadZoneParkModels, onLoadAnimation, loadZoneThreeModels } from './loaders/loadAssets'

import { ZONE_NAMES, ZONE_POS, ZONE_RADIUS, ZONE_RESET_POS } from './render/constants';
import { instantiateZone3 } from './render/zone3';
import { renderShutter } from './render/zone1';
import { instantiateParkObj } from './render/park';
import { renderGrounds, renderMountain } from './render/global';
import { xboxAxesPressed, xboxKeyPressed } from './services/keyboardInputs';
import { loadSounds } from './services/sounds';

// Global Variables
let stats, composer, nodepass, screen, blurScreen;  // render pass
const frame = new Nodes.NodeFrame();
let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
let myHeight = 50;
export let popupOpen = false;
window.GAMESCENE = false;
window.EXP_PAGE = 0;

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
// const geometry = new THREE.BoxGeometry(1, 1, 1)
// const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
// const mesh = new THREE.Mesh(geometry, material)
// scene.add(mesh)

// Node Pass
let nodepost = new Nodes.NodePostProcessing( renderer );

// Camera
const params = {
  fov: 60,
  aspect: window.innerWidth/window.innerHeight, 
  zNear: 1,
  zFar: 10000
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

// Raycaster
const rayOrigin = new THREE.Vector3()
const rayDirection = new THREE.Vector3( -1, 0, 0 )
const rayZ = new THREE.Vector3( 0, 0, 1 )
rayDirection.normalize()
let raycaster = new THREE.Raycaster(rayOrigin, rayDirection, 0, 100); // rayOrigin, rayDirection, 0, 10
let raycaster2 = new THREE.Raycaster(rayOrigin, rayZ, 0, 100); // rayOrigin, rayDirection, 0, 10

// Zones
window.STEP_LIMIT = 3500
window.ZONE = null
window.DYNAMIC_LOADED = false;
window.ZONE_CHANGED = false;
window.ACC_STEPS = window.STEP_LIMIT;
window.RAYOBJ = []
window.HOWTOPAGE = 1;
window.PREV_STEPS = window.STEP_LIMIT;
window.STALE = 0;
// Clock: autoStart, elapsedTime, oldTime, running, startTime
var clock = new THREE.Clock();
export const pointerControls = new PointerLockControls(camera, document.body);

// init()

export function resetPosition() {
  camera.position.x = 300;
  camera.position.y = 10;
  camera.position.z = 100;

  if((window.ACC_STEPS/window.STEP_LIMIT * 100) <= 10) {
    showDescription("체력이 얼마 남지 않았습니다. 에너지를 채우기 위해 공원으로 곧 이동합니다.")
    window.ACC_STEPS = window.STEP_LIMIT
  }
}

export function checkCameraLoadAssets(currentPos)  {

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
    // console.log("same zone", zone)
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
    main();
    tick();
    initHtml();
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

let zone1BridgeBB;
let shutterBB_left, shutterBB_right, shutterBB_back;
{
  // x: 6051 ~ 7061, z: -50
  // x: 6051 ~ 7061, z: 50
  const shutterGeometry = new THREE.BoxGeometry( 1000, 100, 20 ); 
  const shutterMaterial = new THREE.MeshBasicMaterial( {color: 0x00ff00} ); 
  const _leftShutterBBMesh = new THREE.Mesh( shutterGeometry, shutterMaterial ); 
  _leftShutterBBMesh.position.set(6051 + 500, 50, 50)
  // scene.add( _leftShutterBBMesh );

  // Update mesh matrix world
  _leftShutterBBMesh.updateMatrixWorld();

  // Update shutter bounding box
  _leftShutterBBMesh.geometry.computeBoundingBox();
  shutterBB_left = new THREE.Box3();
  shutterBB_left.copy(_leftShutterBBMesh.geometry.boundingBox).applyMatrix4(_leftShutterBBMesh.matrixWorld);

  const _rightShutterBBMesh = new THREE.Mesh( shutterGeometry, shutterMaterial ); 
  _rightShutterBBMesh.position.set(6051 + 500, 50, -50)
  // scene.add( _rightShutterBBMesh );

  _rightShutterBBMesh.updateMatrixWorld();
  _rightShutterBBMesh.geometry.computeBoundingBox();
  shutterBB_right = new THREE.Box3();
  shutterBB_right.copy(_rightShutterBBMesh.geometry.boundingBox).applyMatrix4(_rightShutterBBMesh.matrixWorld);

  const shutterSmallGeometry = new THREE.BoxGeometry( 60, 100, 120 ); 
  const _backShuttleBBMesh = new THREE.Mesh( shutterSmallGeometry, shutterMaterial );
  _backShuttleBBMesh.position.set(7085, 50, 0)
  // scene.add( _backShuttleBBMesh );
  _backShuttleBBMesh.updateMatrixWorld();
  _backShuttleBBMesh.geometry.computeBoundingBox();
  shutterBB_back = new THREE.Box3();
  shutterBB_back.copy(_backShuttleBBMesh.geometry.boundingBox).applyMatrix4(_backShuttleBBMesh.matrixWorld);

  // zone1 entrance. rectangle zone 500(z) x 3000(x), x: 4500
  const bridgeGeometry = new THREE.BoxGeometry( 1000, 100, 500 );
  const _zone1BridgeBBMesh = new THREE.Mesh( bridgeGeometry, shutterMaterial );
  _zone1BridgeBBMesh.position.set(5500, 50, 0);
  // scene.add(_zone1BridgeBBMesh);

  _zone1BridgeBBMesh.updateMatrixWorld();
  _zone1BridgeBBMesh.geometry.computeBoundingBox();
  zone1BridgeBB = new THREE.Box3();
  zone1BridgeBB.copy(_zone1BridgeBBMesh.geometry.boundingBox).applyMatrix4(_zone1BridgeBBMesh.matrixWorld);
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

    direction.z = Number( moveDir.moveForward ) - Number( moveDir.moveBackward );
    direction.x = Number( moveDir.moveRight ) - Number( moveDir.moveLeft );
    direction.normalize(); // this ensures consistent movements in all directions

    if ( moveDir.moveForward || moveDir.moveBackward ) velocity.z -= direction.z * 400.0 * delta;
    if ( moveDir.moveLeft || moveDir.moveRight ) velocity.x -= direction.x * 400.0 * delta;

    if ( onObject === true ) {
      // console.log("JUMP YES")
      velocity.y = Math.max( 0, velocity.y);
      moveDir.canJump = true;

    }

    pointerControls.moveRight( - velocity.x * delta );
    pointerControls.moveForward( - velocity.z * delta );

    // if(window.ZONE){
    //   pointerControls.getObject().position.y += ( velocity.y * delta ); // new behavior
    // } else {
    //   pointerControls.getObject().position.y -= 5;
    // }
    pointerControls.getObject().position.y += ( velocity.y * delta ); // new behavior
    if ( pointerControls.getObject().position.y < myHeight ) {
      velocity.y = 0;
      pointerControls.getObject().position.y = myHeight;
      moveDir.canJump = true;
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

document.addEventListener( 'keydown', onKeyDown );
document.addEventListener( 'keyup', onKeyUp );

// GamePad Interaction
window.gamepadConnected = false;
export let moveDir = {
  moveForward: false,
  moveBackward: false,
  moveLeft: false,
  moveRight: false,
  canJump: false
}

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

// Pointer Lock Controls & Instructions
const instructions = document.getElementById( 'instructions' );
const blocker = document.getElementById( 'blocker' );
const startButton = document.querySelector("#start-button");

pointerControls.addEventListener('change', function () {

  // camera position check
  let currentPos = pointerControls.getObject().position
  let currentRot = pointerControls.getObject().rotation  

  checkCameraLoadAssets(currentPos)
    
})

startButton.addEventListener('click', function () {
  pointerControls.lock();

  // const howtoPopup = document.querySelector(".popup");
  // howtoPopup.classList.add("show");

  const energyHtml = document.querySelector( '.energyContainer' );
  energyHtml.style.visibility = 'visible';
  loadSounds(scene, camera)
  // tick();  // start animate after blocker is gone
})
blocker.addEventListener( 'click', function () {
  
} );

pointerControls.addEventListener( 'lock', function () {
  instructions.style.display = 'none';
  blocker.style.display = 'none';

  // this prevents going back between lock and unlock
} );

pointerControls.addEventListener( 'unlock', function () {

  blocker.style.display = 'block';
  instructions.style.display = '';

} );


function tick() {
  const time = performance.now();

  // check camera bounding box with shutterBB_LEFT
  let currentPos = pointerControls.getObject().position
  if(shutterBB_left){
    const dist = shutterBB_left.distanceToPoint(currentPos)
    if(dist < 20){
      console.log("close to shutter left")
      // velocity.x += velocity.x * 0.005;
      // pointerControls.moveRight(velocity.x);
      pointerControls.getObject().position.z -= 6;
    }
  }
  if(shutterBB_right){
    const dist = shutterBB_right.distanceToPoint(currentPos)
    if(dist < 20){
      // console.log("close to shutter right")
      pointerControls.getObject().position.z += 6;
    }
  }
  if(shutterBB_back){
    const dist = shutterBB_back.distanceToPoint(currentPos)
    if(dist < 20){
      console.log("close to shutter back")
      pointerControls.getObject().position.x -= 6;
    }
  }

  // if(zone1BridgeBB){
  //   if(zone1BridgeBB.containsPoint(currentPos)) {
  //     console.log("inside the bridge")
  //   } else {
  //     console.log("outside the bridge")
  //     // drop the fps pos y -= 10 or blackout.
  //   }
  // }

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


// Key Controls
function onKeyDown ( event ) {
  // camera position check
  checkCameraLoadAssets(pointerControls.getObject().position)
  
  updateStepNum()
  if(window.ACC_STEPS <= 0) resetPosition()

  switch ( event.code ) {
    case 'ArrowUp':
    case 'KeyW':
      moveDir.moveForward = true;
      break;

    case 'ArrowLeft':
    case 'KeyA':
      if(popupOpen) {
        // showHowto(-1)
      } else {
        moveDir.moveLeft = true;
      }
      break;

    case 'ArrowDown':
    case 'KeyS':
      moveDir.moveBackward = true;
      break;

    case 'ArrowRight':
    case 'KeyD':
      if(popupOpen) {
        // showHowto(1)
      } else {
        moveDir.moveRight = true;
      }
      break;

    case 'Space':
      if ( moveDir.canJump === true ) velocity.y += 650;
      moveDir.canJump = false;
      break;
    
    case 'KeyI':
      // popupOpen = !popupOpen;
      // console.log(popupOpen)
      // togglePopup()
      break;
  }
};

function onKeyUp( event ) {

  switch ( event.code ) {

    case 'ArrowUp':
    case 'KeyW':
      moveDir.moveForward = false;
      break;

    case 'ArrowLeft':
    case 'KeyA':
      moveDir.moveLeft = false;
      break;

    case 'ArrowDown':
    case 'KeyS':
      moveDir.moveBackward = false;
      break;

    case 'ArrowRight':
    case 'KeyD':
      moveDir.moveRight = false;
      break;
  }
};