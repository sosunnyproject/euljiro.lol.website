// inspiration: https://en.wikipedia.org/wiki/Rose_(mathematics)
// helpful resrc: https://jsfiddle.net/sosunny/fjr8s9t3/2/
import * as THREE from 'three';

export function FlowerPetals(numerator, denominator, angleGap) {

  const flower = new THREE.Object3D()
  const n = numerator;
  const d = denominator;
  const k = (n / d); // angular frequency, non-zero integer
  const angle = angleGap || 0.5;
  const amplitude = 30;

  // lathe
  // const points = [];
  // for ( let i = 0; i < 10; i ++ ) {
  //   points.push( new THREE.Vector2( Math.sin( i * 0.2 ) * 5 + 5, ( i - 5 ) * 2 ) );
  // }

  // spehereBuffer
  const radius = 6;
  let petalMat = new THREE.MeshPhongMaterial({color: 0xeaeaea, side: THREE.DoubleSide});
  let petalGeom = new THREE.SphereBufferGeometry(radius, 20, 20, Math.PI / 3.0, Math.PI / 3.0);
  petalGeom.translate(0, -radius, 0);
  petalGeom.rotateX(-Math.PI);

  for(let i = 0; i < Math.PI * 2.0 * d; i += angle) {
    let radial = amplitude * Math.cos(k * i)
    let x = radial * Math.cos(i)
    let y = radial * Math.sin(i)

    // const lathe = new THREE.LatheGeometry( points );
    // var cubeGeom = new THREE.BoxGeometry(2, 2, 2);
    // var cubeMat = new THREE.MeshPhongMaterial({ color: 0x7209b7 })
    var mesh = new THREE.Mesh(petalGeom, petalMat);
    mesh.rotateZ(i*Math.PI/4.0)
    mesh.position.set(x, y, 0)
    flower.add(mesh)
  }

  flower.scale.set(2, 2, 2)
  flower.rotation.y = Math.PI/2.0


  return flower
}
