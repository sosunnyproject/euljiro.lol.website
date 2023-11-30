import * as THREE from 'three';
import { ZONE_POS } from './constants.js';
import ShutterPattern from '../../static/assets/png/shutter2.jpg'
import shutter1 from '../../static/assets/png/png2jpg/shutterart1.jpg'
import shutter2 from '../../static/assets/png/png2jpg/shutterart2.jpg'
import shutter3 from '../../static/assets/png/png2jpg/shutterart3.jpg'
import shutter4 from '../../static/assets/png/png2jpg/shutterart4.jpg'
import shutter5 from '../../static/assets/png/png2jpg/shutterart5.jpg'

export function renderShutter (scene, posZ) {
    
    // render shutter arts
    
    renderTextureShutter(scene, {x: 6051, y: 50, z: 48}, shutter1)
    renderTextureShutter(scene,  {x: 6253, y: 50, z: 48}, shutter2)
    renderTextureShutter(scene,  {x: 6556, y: 50, z: 48}, shutter3)
    renderTextureShutter(scene,  {x: 6455, y: 50, z: -48}, shutter4)
    renderTextureShutter(scene,  {x: 6152, y: 50, z: -48}, shutter5)

    new THREE.TextureLoader().load(
        ShutterPattern,
        function (texture) {
            const material = new THREE.MeshPhongMaterial({
                map: texture,
                side: THREE.DoubleSide,
                shininess: 100.0,
                flatShading: true
            })

            texture.matrixAutoUpdate = false;

            var aspect = 1;  // plane is 1 : 1 ratio
            var imageAspect = texture.image.width / texture.image.height;

            if ( aspect < imageAspect ) {

                texture.matrix.setUvTransform( 0, 0, aspect / imageAspect, 1, 0, 0.5, 0.5 );

            } else {

                texture.matrix.setUvTransform( 0, 0, 1, imageAspect / aspect, 0, 0.5, 0.5 );

            }

            renderShutterPlane(scene, posZ, material)
        },
        undefined,
        function(err) {
            console.error('cannot load texture shutter')
        }

    )

}

function renderShutterPlane(scene, posZ, material) {
    const size = 100;
    const height = 300;
    const shutter = new THREE.PlaneGeometry(size, size, size)

    // const material = new THREE.MeshPhongMaterial({ color: 0xffe5d9, side: THREE.DoubleSide })

    // blockade at the very end (7160, 50, -50)
    const firstMesh = new THREE.Mesh(shutter, material)
    firstMesh.position.set(7061, 50, 0)
    firstMesh.rotateY(Math.PI/2)
    scene.add(firstMesh)

    const mesh = new THREE.InstancedMesh(shutter, material, 50)
    for(let i = 1; i < 12; i++)
    {
        const position = new THREE.Vector3(
            ZONE_POS.ONE.x + 2550 + i*size + (1*i), 50, posZ       
        )
 
        const matrix = new THREE.Matrix4()
        matrix.setPosition(position)

        mesh.setMatrixAt(i, matrix)

    }

    scene.add(mesh)
}

function renderTextureShutter(scene, position, imageFile) {
    new THREE.TextureLoader().load(
        imageFile,
        function (texture) {
            const material = new THREE.MeshPhongMaterial({
                map: texture,
                side: THREE.DoubleSide,
                shininess: 100.0,
                flatShading: true
            })

            texture.matrixAutoUpdate = false;

            var aspect = 1;  // plane is 1 : 1 ratio
            var imageAspect = texture.image.width / texture.image.height;

            if ( aspect < imageAspect ) {

                texture.matrix.setUvTransform( 0, 0, aspect / imageAspect, 1, 0, 0.5, 0.5 );

            } else {

                texture.matrix.setUvTransform( 0, 0, 1, imageAspect / aspect, 0, 0.5, 0.5 );
            }

            renderEachShutter(scene, position, material)
        },
        undefined,
        function(err) {
            console.error('cannot load texture shutter')
        }

    )
}

function renderEachShutter(scene, pos, material) {
    const size = 100;
    const height = 300;
    const shutter = new THREE.PlaneGeometry(size, size, size);

    const mesh = new THREE.Mesh(shutter, material)
    mesh.position.set(pos.x, pos.y, pos.z)
    mesh.rotateY(Math.PI)

    scene.add(mesh)
}
