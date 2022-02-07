import * as THREE from 'three';

export default class CircleGround extends THREE.Mesh {
 constructor(origin, radius, material, name) {
  const geom = new THREE.CircleGeometry(radius || 600, radius || 600);
 
  super(geom, material)

  this.geom = geom;
  this.center = origin;
  this.material = material
  this.name = name

  this.computeGeometry();

 }

 computeGeometry() {
  this.geom.rotateX(Math.PI/2)
  this.geom.translate(this.center.x, this.center.y-5, this.center.z)

  this.geom.computeVertexNormals();
  this.geom.computeBoundingSphere();
 }
}