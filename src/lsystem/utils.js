// https://github.com/FrancescoGradi/L-System-Trees/blob/981afdd92c1d8d6c386ea244c4ce637dc22eb487/js/utils.js#L5
export function toDegrees (angle) {
 return angle * (180 / Math.PI);
}

export function toRadians (angle) {
 return (angle * Math.PI) / 180;
}

export function rotateAboutPoint(obj, point, axis, theta, pointIsWorld){
 pointIsWorld = (pointIsWorld === undefined)? false : pointIsWorld;

 if(pointIsWorld){
     obj.parent.localToWorld(obj.position); // compensate for world coordinate
 }

 obj.position.sub(point); // remove the offset
 obj.position.applyAxisAngle(axis, theta); // rotate the POSITION
 obj.position.add(point); // re-add the offset

 if(pointIsWorld){
     obj.parent.worldToLocal(obj.position); // undo world coordinates compensation
 }

 obj.rotateOnAxis(axis, theta); // rotate the OBJECT
}


export function seasonChanger(actualSeason) {

 switch (actualSeason) {

     // inverno
     case "1":
         break;

     // primavera
     case "2":
         leafColor = 0xF99584;
         break;

     // estate
     case "3":
         leafColor = 0x16691c;
         break;

     // autunno
     case "4":
         leafColor = 0xe62604;
         break;
 }

}
