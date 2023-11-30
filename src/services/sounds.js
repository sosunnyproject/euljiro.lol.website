import { ZONE_NAMES, ZONE_POS, ZONE_RADIUS, ZONE_RESET_POS } from '../render/constants.js';
import * as THREE from 'three'

export function loadSounds(scene, camera) {
    
  // audio test
  try {

  const listener = new THREE.AudioListener();
  camera.add(listener)

  const sound1 = new THREE.PositionalAudio( listener );
  sound1.setVolume(3.0)
  sound1.setLoop(true)

  const zone1Song = document.getElementById( 'zone1' );
  sound1.setMediaElementSource( zone1Song );
  console.log(sound1);
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
