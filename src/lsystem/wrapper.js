import * as THREE from 'three';
// import { ruleOne, ruleTwo, branchInsert } from "./app.js";
import { toRadians, toDegrees } from './utils';
import { getRandomArbitrary, getRandomInt } from '../services/utils';
import cloudsFragment from '../shaders/clouds.frag.js';
import vertexShader from '../shaders/vertex.glsl.js';
import fogFragment from '../shaders/fog.frag.js';

const mixers = [];
const clock = new THREE.Clock();

var initialBranchRadius = 0.4;
var leafsPositions = [[]];
var leafColor = 0x22dd11;
var barkTexture = 1;

var season = 4;
var barkTexture = 3;


export function generateLsystemTree(material, axiom, rule1, rule2, iter, radiusRed, branchRad, branchRadiusThreshold) {
    // Geometria composta dell'albero
    // setting
    var axiom = axiom // "ffBAf>A";
    var rule1 = rule1 // "^fB++fB<<fvB";
    var rule2  = rule2 // "f<f>B>f--AvA";
    var iterations = iter; // 5

    var angle = 30;
    var lengthReductionFactor = 0.005;
    var branchRadius = branchRad;
    var radiusReductionFactor = radiusRed // 0.05;
    var branchLength = 6;

    let j = 0;
    let rightX = 0;
    let rightY = 0;
    let rightZ = 0;

    let preXAngle = 0;
    let preYAngle = 0;
    let preZAngle = 0;

    // result
    var totalGeometry = new THREE.BoxGeometry(4, 4, 4);
    let petalGeom = new THREE.SphereBufferGeometry(1.4, 20, 20, Math.PI / 3.0, Math.PI / 3.0);

    var totalMesh = new THREE.Mesh(totalGeometry, material)
    let topPoint = new THREE.Vector3(0, -1.0, 0);

    // Funzione che sbriga l'assioma
    for (let i = 0; i < axiom.length; i++) {

        if (axiom.charAt(i) === "+") {
            rightX += 1;
            continue;
        }

        if (axiom.charAt(i) === "-") {
            rightX -= 1;
            continue;
        }

        if (axiom.charAt(i) === "^") {
            rightY += 1;
            continue;
        }

        if (axiom.charAt(i) === "v") {
            rightY -= 1;
            continue;
        }

        if (axiom.charAt(i) === ">") {
            rightZ += 1;
            continue;
        }

        if (axiom.charAt(i) === "<") {
            rightZ -= 1;
            continue;
        }

        if (axiom.charAt(i) === "f") {
            topPoint = branchInsert(
                branchLength * (1 - j * lengthReductionFactor),
                branchRadius * (1 - j * radiusReductionFactor), 
                topPoint, 
                angle * rightX + preXAngle,
                angle * rightY + preYAngle, 
                angle * rightZ + preZAngle);
            j += 1;

            preXAngle += angle * rightX;
            preYAngle += angle * rightY;
            preZAngle += angle * rightZ;
            rightX = 0;
            rightY = 0;
            rightZ = 0;
        }

        if (axiom.charAt(i) === "A") {
            ruleOne( topPoint, iterations, preXAngle, preYAngle, preZAngle, rightX, rightY, rightZ, j);
            continue;
        }

        if (axiom.charAt(i) === "B") {
            ruleTwo( topPoint, iterations, preXAngle, preYAngle, preZAngle, rightX, rightY, rightZ, j);
        }

    }

    function branchInsert(branchLength, branchRadius, topTargetPoint, theta, rho, phi) {
        const grassColors = ["rgb(227, 101, 91)", "rgb(220, 214, 247)", "rgb(217, 237, 146)", "rgb(181,228,140)", "rgb(153,217,140)", "rgb(118,200,147)", "rgb(82,182,154)", "rgb(52,160,164)"]
        const grassInd = getRandomInt(0, grassColors.length)

        if (branchLength < 0 || branchRadius < -0.25)
            return topTargetPoint;
      
        // var branch = new THREE.CylinderGeometry(branchRadius * (1 - radiusReductionFactor), branchRadius, branchLength, 9);
        // var branch = new THREE.BoxGeometry(branchRadius, branchRadius, branchRadius)
        var branchCylinder = new THREE.CylinderGeometry(branchRadius * (1 - radiusReductionFactor), branchRadius - 0.1, branchLength, 9);
        var grassCube = new THREE.BoxGeometry(branchRadius+1.5, branchRadius+1.5, branchRadius+1.5)
        // var grassSphere = new THREE.SphereBufferGeometry(branchRadius+1.5, 24, 24)
        let petalClone = petalGeom.clone()

        var greenMat = new THREE.MeshPhongMaterial({color: 0x31E981})
        var pinkMat = new THREE.MeshPhongMaterial({color: 0xC0B9DD})
        var randomMat = new THREE.MeshPhongMaterial({ color: grassColors[grassInd] })
        // Calcolo il top e il bottom point del cilindro e guardo dove sono dopo la rotazione
        var newTopPoint = new THREE.Vector3(0.0, branchLength / 3, 0);
        var bottomPoint = new THREE.Vector3(0.0, - branchLength / 2, 0);
      
        var branchMesh;
        if(branchRadius < 0.24) {
            branchMesh = new THREE.Mesh(petalClone, randomMat);

        } else {
            branchMesh = new THREE.Mesh(branchCylinder, material);
            if(material.name === "shader") branchMesh.name = "shader"
        }
 
      
        // branchMesh.autoUpdate = false;
      
        // Eseguo la rotazione
        branchMesh.rotateX(toRadians(theta));
        branchMesh.rotateY(toRadians(rho));
        branchMesh.rotateZ(toRadians(phi));
      
        branchMesh.updateMatrix();
    
        // Calcolo i nuovi punti ruotati
        newTopPoint.applyEuler(branchMesh.rotation);
        bottomPoint.applyEuler(branchMesh.rotation);
      
        // Eseguo una traslazione per allineare il bottom al top target in entrata, salvo il nuovo topPoint
        newTopPoint.x = newTopPoint.x + topTargetPoint.x - bottomPoint.x;
        newTopPoint.y = newTopPoint.y + topTargetPoint.y - bottomPoint.y;
        newTopPoint.z = newTopPoint.z + topTargetPoint.z - bottomPoint.z;
      
        branchMesh.position.set(topTargetPoint.x - bottomPoint.x, topTargetPoint.y - bottomPoint.y, topTargetPoint.z - bottomPoint.z);
        branchMesh.updateMatrix();
      
        // branchMesh.castShadow = true;
        // branchMesh.receiveShadow = true;
      
        totalMesh.add(branchMesh);
    
        return newTopPoint;
      
    }
    
    function ruleOne( topPoint, iterations, preXAngle, preYAngle, preZAngle, rightX, rightY, rightZ, j) {
    
        if (iterations === 0)
            return;
    
        for (let i = 0; i < rule1.length; i++) {
    
            if (rule1.charAt(i) === "+") {
                rightX += 1;
                continue;
            }
    
            if (rule1.charAt(i) === "-") {
                rightX -= 1;
                continue;
            }
    
            if (rule1.charAt(i) === "^") {
                rightY += 1;
                continue;
            }
    
            if (rule1.charAt(i) === "v") {
                rightY -= 1;
                continue;
            }
    
            if (rule1.charAt(i) === ">") {
                rightZ += 1;
                continue;
            }
    
            if (rule1.charAt(i) === "<") {
                rightZ -= 1;
                continue;
            }
    
            if (rule1.charAt(i) === "f") {
                topPoint = branchInsert( 
                    branchLength * (1 - j * lengthReductionFactor),
                    branchRadius * (1 - j * radiusReductionFactor),
                    topPoint, 
                    angle * rightX + preXAngle,
                    angle * rightY + preYAngle, 
                    angle * rightZ + preZAngle);
                j += 1;
    
                preXAngle += angle * rightX;
                preYAngle += angle * rightY;
                preZAngle += angle * rightZ;
                rightX = 0;
                rightY = 0;
                rightZ = 0;
            }
    
            if (rule1.charAt(i) === "A") {
                ruleOne( topPoint, iterations - 1, preXAngle, preYAngle, preZAngle, rightX, rightY,
                    rightZ, j);
                continue;
            }
    
            if (rule1.charAt(i) === "B") {
                ruleTwo( topPoint, iterations - 1, preXAngle, preYAngle, preZAngle, rightX, rightY,
                    rightZ, j);
                continue;
            }
    
        }
    
    }

    function ruleTwo(topPoint, iterations, preXAngle, preYAngle, preZAngle, rightX, rightY, rightZ, j) {

        if (iterations === 0)
            return;
    
        for (let i = 0; i < rule2.length; i++) {
    
            if (rule2.charAt(i) === "+") {
                rightX += 1;
                continue;
            }
    
            if (rule2.charAt(i) === "-") {
                rightX -= 1;
                continue;
            }
    
            if (rule2.charAt(i) === "^") {
                rightY += 1;
                continue;
            }
    
            if (rule2.charAt(i) === "v") {
                rightY -= 1;
                continue;
            }
    
            if (rule2.charAt(i) === ">") {
                rightZ += 1;
                continue;
            }
    
            if (rule2.charAt(i) === "<") {
                rightZ -= 1;
                continue;
            }
    
            if (rule2.charAt(i) === "f") {
                topPoint = branchInsert( 
                    branchLength * (1 - j * lengthReductionFactor),
                    branchRadius * (1 - j * radiusReductionFactor), 
                    topPoint, 
                    angle * rightX + preXAngle,
                    angle * rightY + preYAngle, 
                    angle * rightZ + preZAngle);
                j += 1;
    
                preXAngle += angle * rightX;
                preYAngle += angle * rightY;
                preZAngle += angle * rightZ;
                rightX = 0;
                rightY = 0;
                rightZ = 0;
            }
    
            if (rule2.charAt(i) === "A") {
                ruleOne(topPoint, iterations - 1, preXAngle, preYAngle, preZAngle, rightX, rightY,
                    rightZ, j);
                continue;
            }
    
            if (rule2.charAt(i) === "B") {
                ruleTwo(topPoint, iterations - 1, preXAngle, preYAngle, preZAngle, rightX, rightY,
                    rightZ, j);
                continue;
            }
    
        }
    }

    // totalMesh.receiveShadow = true;
    // totalMesh.castShadow = true;

    return totalMesh;
}
