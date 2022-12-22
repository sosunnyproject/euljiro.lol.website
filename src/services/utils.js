import * as THREE from 'three';
import { koSlide1, koSlide3, koSlide4 } from './instructionKO';
import { enSlide1, enSlide3, enSlide4 } from './instructionEN';

export function getRandomArbitrary(min, max) {
 return Math.random() * (max - min) + min;
}

export function getRandomInt(min, max) {
 min = Math.ceil(min);
 max = Math.floor(max);
 return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

export function updateStepNum() {

  if(window.ZONE === "PARK") {
    if(window.ACC_STEPS <= window.STEP_LIMIT) {
      window.ACC_STEPS++;
    }
  } else {
    if(window.ACC_STEPS >= 0) {
      window.ACC_STEPS--;
    }
  }

  let per = Math.floor((window.ACC_STEPS / window.STEP_LIMIT) * 100 )
  updateStepProgress(per)

}

// https://stackoverflow.com/questions/56421795/how-to-change-the-color-of-progressvalue-webkit-progress-value-property

export function updateStepProgress(stepPercent) {
  // Step Counter Bar
  var progress = document.querySelector("progress");
  // console.log(progress)

  progress.setAttribute('value', stepPercent)
  // console.log("stepPercent: ", stepPercent)

  var n = 2 * parseInt(progress.getAttribute("value"));

  n += stepPercent
  // console.log("rgb: ", n)
  
  progress.style.setProperty("--c", "rgb(" + (255-n) + "," + n + "," + n + ")");
}

let currLoaded = 0;

export function updateLoadingProgress(max) {
  // Load Progress Bar
  let leftBar = document.querySelector('.left .bar');
  let rightBar = document.querySelector('.right .bar');
  let notice = document.querySelector('#loadNotice');
  let lang =  window.localStorage.getItem('language');
  const startButton = document.querySelector(".startButton");

  currLoaded += 1
  let value = Math.floor((currLoaded / max) * 100)
  console.log("update loading: ", currLoaded)

  if(value < 100) {
    notice.innerHTML=' 로딩중... Loading... ';
  } else if (value >= 100) {
    notice.innerHTML = `로딩이 완료되었습니다. Ready to Start. `
    startButton.id = "able";
    startButton.innerText = "START"
  }
  if (value <= 50) {
    var degree = 18*value/5;
    rightBar.style.transform = "rotate("+degree+"deg)";
    leftBar.style.transform = "rotate(0deg)";
  } else {
    var degree = 18*(value-50)/5;
    rightBar.style.transform = "rotate(180deg)";
    leftBar.style.transform = "rotate("+degree+"deg)";
  }
}

const deltaValue = 0.005

export function retrieveEnergy(scene) {
  if(!scene && !scene?.traverse) return;

  scene.traverse(obj => {
    if(!obj.name) return;
    if(obj.name.includes("light")) {
      if(obj.intensity <= 1.0) {
        obj.intensity += deltaValue
      }
    }
    if(obj.name.includes("sky")){
      const currRgb = obj.material.uniforms.topColor.value
      //console.log(obj.material.uniforms.topColor.value)
      if(currRgb.r <= 0.6) {
        const newR = currRgb.r + deltaValue;
        const newG = currRgb.g + deltaValue;
        const newB = currRgb.b + deltaValue;
        const newRgb = new THREE.Color(newR, newG, newB)
        obj.material.uniforms.topColor.value = newRgb;
        //console.log(obj.material.uniforms.topColor.value)  
      }
    }
  })
}

export function warnLowEnergy(scene) {
  // dim the lights

  showDescription("체력이 얼마 남지 않았습니다. 공원으로 이동해서 에너지를 채워주세요!")

  if(!scene && !scene?.traverse) return;

  scene.traverse(obj => {
    if(!obj.name) return
    
    if(obj.name.includes("light")) {
      // console.log(obj)
      if(obj.intensity >= 0) {
        obj.intensity -= deltaValue
      }
    }
    if(obj.name.includes("sky")){
      const currRgb = obj.material.uniforms.topColor.value
      //console.log(obj.material.uniforms.topColor.value)
      if(currRgb.r >= -2.0) {
        const newR = currRgb.r - deltaValue;
        const newG = currRgb.g - deltaValue;
        const newB = currRgb.b - deltaValue;
        const newRgb = new THREE.Color(newR, newG, newB)
        obj.material.uniforms.topColor.value = newRgb;
        //console.log(obj.material.uniforms.topColor.value)  
      }
    }
  })
}

export function showDescription ( objName ) {
  var popup = document.querySelector(".descPopup");
  if(!window.DESC_POP) popup.classList.add("show");
  window.DESC_POP = true;

  const descPopup = document.querySelector("#descContent")
  descPopup.innerText = objName
  // console.log(descPopup, objName)

  setTimeout(() => {
    popup.classList.remove("show")
    window.DESC_POP = false;
  }, 6000)
}

export async function showHowto(num) {

  console.log(num, window.HOWTOPAGE)

  const maxPage = 4;
  const gamepadPage = document.querySelector("#howtoGamepad") // page 2
  const contentPage = document.querySelector("#howtoPage") // page 1, 3, 4
  const lang =  window.localStorage.getItem('language')
  
  window.HOWTOPAGE += num;
  if(window.HOWTOPAGE > maxPage) {  // not higher than max
    window.HOWTOPAGE = 1;
  } else if (window.HOWTOPAGE <= 0) {
    window.HOWTOPAGE = 4
  }
  console.log(num, window.HOWTOPAGE)

  console.log("page num: ", window.HOWTOPAGE)
  
  if(window.HOWTOPAGE === 2) {
    console.log('page2')

    gamepadPage.style.display = 'block';
    contentPage.style.display = 'none';
  } else {
    gamepadPage.style.display = 'none';
    contentPage.style.display = 'block';
  }

  // language setting
  let slide1, slide3, slide4;
  if(lang === 'en') {
    slide1 = enSlide1
    slide3 = enSlide3
    slide4 = enSlide4
  } else {
    slide1 = koSlide1;
    slide3 = koSlide3;
    slide4 = koSlide4;
  }

  switch(window.HOWTOPAGE) {
    case 1:
      console.log('page1')
      contentPage.innerHTML = slide1;
      break;
    case 2:
      break;
    case 3: 
      contentPage.innerHTML = slide3;
      break;
    case 4: 
      contentPage.innerHTML = slide4;
      break;
  }
  // await sleep(5000);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function demo() {
  console.log('Taking a break...');
  await sleep(2000);
  console.log('Two seconds later, showing sleep in a loop...');

  // Sleep in loop
  for (let i = 0; i < 5; i++) {
    if (i === 3)
      await sleep(2000);
    console.log(i);
  }
}

export function initHtml() {
  const startIntroButton = document.querySelector(".startButton");
  startIntroButton.addEventListener("click", startIntroButtonClicked);

  const langKo = document.querySelector("#korean");
  const langEn = document.querySelector("#english");

  langKo.addEventListener("click", setLang("ko"));
  langEn.addEventListener("click", setLang("en"));

  setExpPage();
  const nextButton = document.querySelector("#next-button");
  const prevButton = document.querySelector("#prev-button");
  const startButton = document.querySelector("#start-button");
  nextButton.addEventListener("click", nextIntroPage);
  prevButton.addEventListener("click", prevIntroPage);
  startButton.addEventListener("click", startGamePage);
}

export function nextIntroPage() {
  if(window.EXP_PAGE >= 3) return;
  window.EXP_PAGE += 1;
  setExpPage();
}

export function prevIntroPage() {
  if(window.EXP_PAGE <= 0) return;
  window.EXP_PAGE -= 1;
  setExpPage();
}
export function startGamePage() {
  window.GAMESCENE = true;
}

export function startIntroButtonClicked() {
  console.log("onclick start the intro");
  // form checked values
  const form = document.querySelector('form');

  const blockerHtml = document.querySelector('#blocker');
  blockerHtml.style.visibility = 'visible';

  const expHtml = document.querySelector('.exp-text');
  const selectPageHtml =  document.querySelector('#introBackground');
  expHtml.setAttribute("style", "display: show;");
  selectPageHtml.setAttribute("style", "display: none;");
}	

export function setExpPage() {
  const expHtml = document.querySelector('.exp-text');
  let introTexts = '';
  
  if(window.LANG === "en") {
    switch(window.EXP_PAGE) {
      case 0: 
      introTexts = `<div> In 2073, Euljiro district in Seoul gets struck by natural disaster. <br />
          It splits the district into 3 zones. And the park has evolved in the middle of them. <br />
        </div>`
        break;

      case 1: 
      introTexts =  `<div> First, TECH🤖JIRO  is concentrated with Euljiro's electronic shops,  <br /> 
        robots market, the intersection of humans and robots. <br/>
        Second, HIP🕶️JIRO  is filled with coffee liquids,  <br /> 
        disappeared local artists' graffiti works, and legacies of hipsters. <br />
        Third, BUILDING🏗️JIRO is full of buildings and cranes at construction sites <br />`
        break;
      
      case 2: 
      introTexts = `<div>People can freely walk around TECH🤖JIRO, HIP🕶️JIRO, BUILDING🏗️JIRO, <br />
        but have to recharge the energy at the park.</div>`
        break;
      
      case 3:
        introTexts = `
        <span style="color:#f9e661">How to Experience with your PC</span><br />
          - Move: WASD or ⬅️⬆️⬇️➡️ keys <br />
          - Direction: Mouse <br />
          - <span style="color:#ff0000">Press ESC</span> to read instructions and get your mouse cursor back. <br />
          -  <span style="color:#f9e661">Warning</span>: As this website contains many 3d models, it requires rendering power. <br />
        </div>
        `
    }
  
  }
  expHtml.innerHTML = introTexts;  

}

export function setLang(lang) {
  window.LANG = lang
  window.localStorage.setItem('language', lang)
  console.log("set language "+ lang);
      
      /*
  if(lang === 'en') {
    expHtml.innerHTML = 
      `<div> In future, Euljiro district in Seoul got struck by natural disaster. <br />
        It split the district into 3 zones. And the park evolved in the middle of them. <br />
        First, TECH🤖JIRO  is concentrated with Euljiro's electronic shops,  <br /> 
        robots market, the intersection of humans and robots. <br/>
        Second, HIP🕶️JIRO  is filled with coffee liquids,  <br /> 
        disappeared local artists' graffiti works, and legacies of hipsters. <br />
        Third, BUILDING🏗️JIRO is full of buildings and cranes at construction sites <br /> 
        People can freely walk around TECH🤖JIRO, HIP🕶️JIRO, BUILDING🏗️JIRO, <br />
        but have to recharge the energy at the park.
      </div>`

      anim6.innerText = 'Press Key i or Gamepad A button'
      anim7.innerText = 'to read instructions during the experience.'
      anim8.innerText = 'Click this screen or Press Gamepad B button to START.'

      howToPage.innerHTML = `
          <span style="color:#f9e661">How to Experience with your PC</span><br />
          - Move: WASD or ⬅️⬆️⬇️➡️ keys <br />
          - Direction: Mouse <br />
          - Jump: Space bar <br />
          - <span style="color:red">Instruction Window: Press i to turn on/off.</span> <br />
          - Turn PLAY mode off: Press ESC to find your mouse cursor back. <br />
          - Warning: This website contains many 3d models, so it requires graphic card with certain performance. <br />
          - If your graphic card spec is similar or above Nvidia GTX 1060, it'd be safe.
          `
  } else {
      anim1.innerText = '자연을 잃어버린 미래의 을지로는 천재지변으로 인해'
      anim2.innerText = '3개 구역으로 쪼개졌고, 그 중심에 공원이 생겼다.'
      anim3.innerText = '보행자는 오직 공원을 통해 이동하고, 에너지를 충전한다.'
      anim4.innerText = '테크🤖JIRO, 힙🕶️JIRO, 빌딩🏗️JIRO를 유람할 수 있다.'
      anim6.innerText = '작동 방법과 설명을 보려면'
      anim7.innerText = '키보드 i 혹은 컨트롤러 A 버튼을 누른다.'
      anim8.innerText = '시작하려면 마우스로 화면을 클릭하거나 게임패드 B버튼을 누른다.'

      howToPage.innerHTML = `
          <span style="color:#f9e661">개인 컴퓨터</span>로 감상하는 방법<br />
          - 방향: 키보드 WASD, ⬅️⬆️⬇️➡️  <br />
          - 시야 조정: 마우스 <br />
          - <span style="color:red">설명 창: i 키를 누르면 설명 창을 끄고 킬 수 있다.</span><br />
          - 마우스: ESC를 누르면 플레이 모드에서 벗어날 수 있다.<br />
          - 단, 컴퓨터 사양이 낮으면 화면이 흔들리거나 로딩이 오래 걸릴 수 있다.<br />
          - 컴퓨터 사양은 nvidia 그래픽 카드 기준, GTX 1060이상을 권장한다.<br />
      `
  } 
      */	

}