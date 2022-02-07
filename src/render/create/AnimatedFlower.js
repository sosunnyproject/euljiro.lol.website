// https://jsfiddle.net/f2Lommf5/12523/
import * as THREE from 'three';

export default class AnimatedFlower extends THREE.Object3D {

 constructor(params) {
   super()
   
    const { numerator, denominator, angleGap, size } = params;
    this.n = numerator || 4;
    this.d = denominator || 7;
    this.angle = angleGap || 0.5; 
    this.k = this.n/this.d;
    this.amplitude = 30;
    this.rotationY = Math.PI/2.0;
    this.scaleNum = size;
    this.name = "flower"

    this.renderPetal()

   if(this.scaleNum > 1) {
     this.scale.set(this.scaleNum, this.scaleNum, this.scaleNum);
   }
   this.rotateY(this.rotationY);
 }

  // Flower Leaf
  renderPetal() {
    const radius = 6;
    let petalMat = new THREE.MeshPhongMaterial({color: 0xeaeaea, side: THREE.DoubleSide});
    let petalGeom = new THREE.SphereBufferGeometry(radius, 20, 20, Math.PI / 3.0, Math.PI / 3.0);
    petalGeom.translate(0, -radius, 0);
    petalGeom.rotateX(-Math.PI);
    var mesh = new THREE.Mesh(petalGeom, petalMat);

    for(let i = 0; i < Math.PI * 2.0 * this.d; i += this.angle) {
      let radial = this.amplitude * Math.cos(this.k * i)
      let x = radial * Math.cos(i)
      let y = radial * Math.sin(i)
      var m = mesh.clone()
      // const lathe = new THREE.LatheGeometry( points );
      // var cubeGeom = new THREE.BoxGeometry(2, 2, 2);
      // var cubeMat = new THREE.MeshPhongMaterial({ color: 0x7209b7 })
      m.rotateZ(i * Math.PI/4.0)
      m.position.set(x, y, 0)
      this.add(m)
    }
  }

  tick(time) {
    // let time = performance.now();
    this.clear()
    let petalN = Math.abs(Math.cos(time/3000)*4) + 1
    let petalD = Math.abs(Math.sin(time/3000)*9) + 1
    this.n = petalN
    this.d = petalD

    this.renderPetal()
  }

}