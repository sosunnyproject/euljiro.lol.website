import { popupOpen, checkCameraLoadAssets, pointerControls, resetPosition, moveDir } from "../index"
import { updateStepNum } from "../services/utils"


// gamepad before init
export function xboxKeyPressed (gamepad) {
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

export function xboxAxesPressed(gamepad) {
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