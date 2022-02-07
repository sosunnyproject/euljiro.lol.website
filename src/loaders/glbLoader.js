import { getRandomInt } from "../services/utils"
import { ZONE_POS } from "../render/constants"

const robotHead = {
  url: 'models/zone1/head.glb',
  posX: ZONE_POS.ONE.x, posY: 100, posZ: ZONE_POS.ONE.z + 50,
  rx: 0, ry: 0, rz: 0,
  scale: 3,
  type: "monument",
  name: "robotFace",
  desc: "세운 상가 뒷편에 버려졌던 내가 이렇게 다시 태어났어"
}

const coffeeSpa = {
  url: 'models/zone2/anim/Zone2monument.glb',
  posX: ZONE_POS.TWO.x, posY: -900, posZ: ZONE_POS.TWO.z,
  rx: 0, ry: -Math.PI/3.0, rz: 0,
  scale: 400,
  type: "monument",
  name: "coffeeSpa",
  desc: "을지로에 있는 모든 커피를 마셨더니 온몸이 들썩들썩"
}

const excavator = {
  url: 'models/zone3/Zone3monu.glb',
  posX: ZONE_POS.THREE.x, posY: -800, posZ: ZONE_POS.THREE.z,
  rx: 0, ry: Math.PI/3.0, rz: 0,
  scale: 350,
  type: "monument",
  name: "excavator",
  desc: "언제나 항상 공사중. 올라올테면 올라와 보시지.",
}

export const MONUMENTS_MODELS = [
  robotHead, coffeeSpa, excavator
]

const tigerlily = {
  url: 'models/park/tigerLily.glb',
  posX: 500, posY: -350, posZ: -1000, 
  rx: 0, ry: Math.PI/6.0, rz: 0,
  scale: 150,
  zone: 4,
  name: "을지로에 남아있던 마지막 꽃, 나는 Tiger Lily"
}

const squirrel = {
  url: 'models/park/SquirrelAnim.glb',
  posX: 800, posY: -340, posZ: 1200, 
  rx: 0, ry: -Math.PI/6.0, rz: 0,
  scale: 150,
  zone: 4,
  name: "나는야 공원을 지키는 우람한 다람쥐"
}

const parkCat = {
  url: 'models/park/CatAnim.glb',
  posX: -600, posY: -370, posZ: 1700, 
  rx: 0, ry: Math.PI/6.0, rz: 0,
  scale: 150,
  zone: 4,
  name: "잔디를 꾸욱~꾹~"
}

const pinkBench = {
  url: 'models/park/pinkBench.glb',
  posX: 1600, posY: 0, posZ: 500, 
  rx: 0, ry: Math.PI/4.0, rz: 0,
  scale: 1,
  zone: 4,
  name: "잔디밭에 잠시 앉아 쉬어가"
}
const blueBench = {
  url: 'models/park/blueBench.glb',
  posX: -700, posY: 0, posZ: -150, 
  rx: 0, ry: Math.PI/4.0, rz: 0,
  scale: 1,
  zone: 4,
  name: "잔디와 함께 바람도 쐬고 쉬었다 가"
}

export const ZONE_PARK_MODELS = [ 
  tigerlily, squirrel, parkCat, pinkBench, blueBench
 ]
 

const robotBird = {
  url: 'models/zone1/smallbird.glb',
  posX: 2500, posY: 0, posZ: 355,
  // posX: getRandomInt(ZONE1_X_MIN, ZONE1_X_MAX), posY: 200, posZ: getRandomInt(ZONE1_Z_MIN, ZONE1_Z_MAX),
  rx: 0, ry: -Math.PI/4.0, rz: 0,
  zone: 1,
  name: "robotBird",
  desc: "내 날개 어때? 요즘은 진짜 새 같은 피부도 만든다니까?"
}

const robotCrane = {
  url: 'models/zone1/bot_truck_small.glb',
  posX: 2800, posY: 0, posZ: -850,
  // posX: getRandomInt(ZONE1_X_MIN, ZONE1_X_MAX), posY: 50, posZ: getRandomInt(ZONE1_Z_MIN, ZONE1_Z_MAX),
  rx: 0, ry: -Math.PI/4.0, rz: 0,
  scale: 20,
  zone: 1,
  name: "robotCrane",
  desc: "나는 그저 로봇과 인간이 평화롭게 공존하길 바랄 뿐이야"
}

const robotChip = {
  url: 'models/zone1/bot_arduino_small.glb',
  posX: 3500, posY: 0, posZ: 755,
  // posX: getRandomInt(ZONE1_X_MIN, ZONE1_X_MAX), posY: 50, posZ: getRandomInt(ZONE1_Z_MIN, ZONE1_Z_MAX),
  rx: 0, ry: -Math.PI/4, rz: 0,
  scale: 20,
  zone: 1,
  name: "robotChip",
  desc: "이 칩이 없으면 로봇도 죽은 몸일 뿐이야."
}

const robotTiger = {
  url: 'models/zone1/tiger.glb',
  posX: 4300, posY: 0, posZ: 605,
  // posX: getRandomInt(ZONE1_X_MIN, ZONE1_X_MAX), posY: 50, posZ: getRandomInt(ZONE1_Z_MIN, ZONE1_Z_MAX),
  rx: 0, ry: -Math.PI/6.0, rz: 0,
  zone: 1,
  name: "robotTiger",
  desc: "길거리 생활이 지겨워서 이식 좀 해봤지. 더이상 날 무시하진 않아서 좋긴 하네."
}

const bird1 = {
  url:  'models/zone1/bird1-bothead.glb',
  posX: 2700, posY: 10, posZ: 1175,
  // posX: getRandomInt(ZONE1_X_MIN, ZONE1_X_MAX), posY: 10, posZ: getRandomInt(ZONE1_Z_MIN, ZONE1_Z_MAX),
  rx: 0, ry: Math.PI/3, rz: 0,
  zone: 1,
  name: "bird1",
  desc: "로봇에게는 인간이, 인간에게는 로봇이 필요할 수 밖에!"
 }


const bird2 = {
  url:  'models/zone1/bird2.glb',
  posX: 3500, posY: 10, posZ: -1280,
  // posX: getRandomInt(ZONE1_X_MIN, ZONE1_X_MAX), posY: 10, posZ: getRandomInt(ZONE1_Z_MIN, ZONE1_Z_MAX),
  rx: 0, ry: 0, rz: 0,
  zone: 1,
  name: "bird2",
  desc: "고철 솟대도 이렇게 멋진 로봇이 될 수 있다고!"
}

const bird3 = {
  url: 'models/zone1/bird3.glb',
  posX: 3400, posY: 10, posZ: -1355,
  // posX: getRandomInt(ZONE1_X_MIN, ZONE1_X_MAX), posY: 10, posZ: getRandomInt(ZONE1_Z_MIN, ZONE1_Z_MAX),
  rx: 0, ry: 0, rz: 0,
  zone: 1,
  name: "bird3",
  desc: "부품 교체는 좋지만 불법 수술은 절대 안 돼."
}

const neonsign = {
  url: 'models/zone1/neonsign.glb',
  posX: 3800, posY: 10, posZ: 1200,
  // posX: getRandomInt(ZONE1_X_MIN, ZONE1_X_MAX), posY: 10, posZ: getRandomInt(ZONE1_Z_MIN, ZONE1_Z_MAX),
  rx: 0, ry: -Math.PI/4.0, rz: 0,
  zone: 1,
  name: "neonsign",
  desc: "규율만 잘 지키면 언제든지 환영이야"
}

const humanworker = {
  url: 'models/zone1/humanworker.glb',
  posX: 1900, posY: 10, posZ: 900,
  // posX: getRandomInt(ZONE1_X_MIN, ZONE1_X_MAX), posY: 10, posZ: getRandomInt(ZONE1_Z_MIN, ZONE1_Z_MAX),
  rx: 0, ry: Math.PI/3, rz: 0,
  zone: 1,
  name: "humanworker",
  desc: "로봇 팔이 나보다 정교하니까, 나는 이런 반복 작업이 더 편해"
}

const ozRobot = {
  url: 'models/zone1/ozrobot.glb',
  posX: 2400, posY: 10, posZ: -705,
  // posX: getRandomInt(ZONE1_X_MIN, ZONE1_X_MAX), posY: 10, posZ: getRandomInt(ZONE1_Z_MIN, ZONE1_Z_MAX),
  rx: 0, ry: -Math.PI/6.0, rz: 0,
  zone: 1,
  name: "ozRobot",
  desc: "나야말로 로봇들의 조상 아니겠어?"
}

const robotGuide = {
  url: 'models/zone1/guide.glb',
  posX: 3800, posY: 10, posZ: 95, 
  // posX: getRandomInt(ZONE1_X_MIN, ZONE1_X_MAX), posY: 40, posZ: getRandomInt(ZONE1_Z_MIN, ZONE1_Z_MAX),
  rx: 0, ry: Math.PI/4.0, rz: 0,
  zone: 1,
  name: "robotGuide",
  desc: "로봇 다리? 인간 팔? 말만 하세요!"
}

const neoneyes = {
  name: "cctv",
  url: 'models/zone1/neoneyes.glb',
  posX: 4400, posY: 10, posZ: -800, 
 //  posX: getRandomInt(ZONE1_X_MIN, ZONE1_X_MAX), posY: 10, posZ: getRandomInt(ZONE1_Z_MIN, ZONE1_Z_MAX),
  rx: 0, ry: Math.PI/6.0, rz: 0,
  zone: 1,
  desc: "어허, 모든 걸 다 지켜보고 있다니까?!"
}
const orangeCone = {
  url: 'models/zone1/orangeCone.glb',
  posX: 4900, posY: 0, posZ: -85, 
  // posX: getRandomInt(ZONE1_X_MIN, ZONE1_X_MAX), posY: 10, posZ: getRandomInt(ZONE1_Z_MIN, ZONE1_Z_MAX),
  rx: 0, ry: -Math.PI/3.5, rz: 0,
  zone: 1,
  name: "purpleCone",
  desc: "감시 드론 항시 작동중! 허튼 짓 금물!"
}
const blueCone = {
  url: 'models/zone1/blueCone.glb',
  posX: 2000, posY: 0, posZ: -105,
  // posX: getRandomInt(ZONE1_X_MIN, ZONE1_X_MAX), posY: 10, posZ: getRandomInt(ZONE1_Z_MIN, ZONE1_Z_MAX),
  rx: 0, ry: Math.PI/6.0, rz: 0,
  zone: 1,
  name: "blueCone",
  desc: "그런데 로봇이 인간을 먹어서 뭐하겠어? 사실은 인간 아닐까?"
}
const pinkCone = {
  url: 'models/zone1/pinkCone.glb',
  posX: 2900, posY: 10, posZ: -200,
 //  posX: getRandomInt(ZONE1_X_MIN, ZONE1_X_MAX), posY: 10, posZ: getRandomInt(ZONE1_Z_MIN, ZONE1_Z_MAX),
  rx: 0, ry: 0, rz: 0,
  zone: 1,
  name: "pinkCone",
  desc: "로봇과 인간 모두 3원칙을 잘 지켜야지 우리 동네 장사도 잘 유지된다고. 그게 그렇게 어려워?"
}
const rocket = {
  url: 'models/zone1/rocket.glb',
  posX: 5200, posY: 100, posZ: 115,
 //  posX: getRandomInt(ZONE1_X_MIN, ZONE1_X_MAX), posY: 10, posZ: getRandomInt(ZONE1_Z_MIN, ZONE1_Z_MAX),
  rx: 0, ry: 0, rz: 0,
  zone: 1,
  name: "rocket",
  desc: "난 여기에서 로켓을 만들어 우주로 떠날거야"
 }
export const ZONE_ONE_MODELS = [ rocket, pinkCone, orangeCone, blueCone, robotBird, robotTiger, robotChip, robotCrane, bird1, bird2, bird3, neoneyes, robotGuide, ozRobot, humanworker, neonsign ]

const tape = {
  url: 'models/zone2/tape.glb',
  posX: -240, posY: 0, posZ: -3800,
  // posX: getRandomInt(ZONE2_X_MIN, ZONE2_X_MAX), posY: 10, posZ: getRandomInt(ZONE2_Z_MIN, ZONE2_Z_MAX),
  rx: 0, ry: 0, rz: 0,
  zone: 2,
  desc: "저 아이팟보다 내가 훨씬 오래됐다고! 요즘은 나 같은 애 보기 힘들 걸?"
}

const fork = {
  url: 'models/zone2/fork.glb',
  posX: 450, posY: 10, posZ: -3550,
  rx: 0, ry: 0, rz: 0,
  zone: 2,
  desc: "을지로 맛집? 나 정도는 되야 안다고 할 수 있지."
}

const weed = {
  url: 'models/zone2/weed.glb',
  posX: 250, posY: 0, posZ: -4000,
  rx: 0, ry: -Math.PI/2, rz: 0,
  scale: 1,
  zone: 2,
  desc: "모두 나를 보면 금방 잠들더라..."
}

const spaSign = {
  url: 'models/zone2/spa.glb',
  posX: 900, posY: 0, posZ: -3700,
  // posX: 50, posY: 10, posZ: -2500,
  // posX: getRandomInt(ZONE2_X_MIN, ZONE2_X_MAX), posY: 30, posZ: getRandomInt(ZONE2_Z_MIN, ZONE2_Z_MAX),
  rx: 0, ry: Math.PI/3.0, rz: 0,
  scale: 1,
  zone: 2,
  desc: "아주 오래 전에 이 간판이 무슨 의미였는지 아는 사람?"
}
const camera = {
  url: 'models/zone2/camera.glb',
  posX: -1400, posY: 0, posZ: -3800,
  rx: 0, ry: 0, rz: 0,
  scale: 1,
  zone: 2,
  desc: "내가 옛날에 찍은 을지로 사진들 보면 너무 힙해서 모두 기절할걸"
}

const ipod = {
  url: 'models/zone2/ipod.glb',
  posX: 1000, posY: 0, posZ: -2800,
  rx: 0, ry: Math.PI/4, rz: 0,
  scale: 1,
  zone: 2,
  desc: "hi... i love music ... thank you and you...?"
}

const oldPhone = {
  url: 'models/zone2/phone.glb',
  posX: 200, posY: 0, posZ: -3000,
  rx: 0, ry: Math.PI/6.0, rz: 0,
  scale: 1,
  zone: 2,
  desc: "질린다고 할 땐 언제고 이제는 특이해서 좋다나."
}

const cheese = {
  url: 'models/zone2/cheese.glb',
  posX: -800, posY: 0, posZ: -4200,
  rx: 0, ry: 0, rz: 0,
  zone: 2,
  desc: "나는 진짜 치즈일까 치즈케이크일까. 여기는 을지로일까 아닐까."
}

const knife = {
  url: 'models/zone2/knife.glb',
  posX: -800, posY: 200, posZ: -4200,
  rx: Math.PI, ry: -Math.PI/2.0, rz: 0,
  zone: 2,
  desc: "모든 맛집에 내가 없으면 안 되니까, 내가 여기서 짱이야"
}

const bear = {
  url: 'models/zone2/anim/BearAnim.glb',
  posX: 450, posY: -100, posZ: -3500,
  rx: 0, ry: Math.PI/5, rz: 0,
  scale:50,
  zone: 2,
  desc: "나만큼 유행 안타고 스테디셀러인 애가 없지. 실수로 눈을 잃어버렸더니 특이하다고 더 좋아하더라니까?"
}

const purpleSunglass = {
  url: 'models/zone2/anim/PurpleAnim.glb',
  posX: -1000, posY: -350, posZ: -3100,
  rx: 0, ry: 0, rz: 0,
  scale: 100,
  zone: 2,
  desc: "여기서 우리만큼 힙한 애들 봤어?"
}

const greenSunglass = {
  url: 'models/zone2/green.glb',
  posX: -1100, posY: 0, posZ: -4000,
  rx: 0, ry: 0, rz: 0,
  zone: 2,
  desc: "내가 잘 어울리는 사람은 진정한 힙스터로 인정해줄게"
}

const orangeSunglass = {
  url: 'models/zone2/orange.glb',
  posX: -800, posY: 0, posZ: -2500,
  rx: 0, ry: 0, rz: 0,
  zone: 2,
  desc: "아무나 우리랑 어울릴 수 없지. 함부로 다가오지 못할걸."
}

const pabloShutter = {
  url: 'models/zone2/anim/Pablo.glb',
  posX: 1200, posY: -150, posZ: -3500,
  rx: 0, ry: -Math.PI/2.0, rz: 0,
  scale: 70,
  zone: 2,
  desc: "을지로는 가을이었다. by 파블로"
}

const lionShutter = {
  url: 'models/zone2/anim/LionAnim.glb',
  posX: -600, posY: -200, posZ: -4600,
  rx: 0, ry: -Math.PI/3, rz: 0,
  scale: 100,
  zone: 2,
  desc: "사자의 모습으로 냥냥 펀치를 하면 이뻐해주겠지?"
}
const catfishShutter = {
  url: 'models/zone2/anim/Catfish.glb',
  posX: 100, posY: -200, posZ: -4600,
  rx: 0, ry: -Math.PI/3, rz: 0,
  scale: 100,
  zone: 2,
  desc: "예전에는 겨울에 이렇게 생긴 걸 먹었다네...?"
}
const diamondShutter = {
  url: 'models/zone2/diamond.glb',
  posX: 700, posY: 0, posZ: -4400,
  rx: 0, ry: Math.PI/2, rz: 0,
  zone: 2,
  desc: "이 구역의 힙스터는 나야"
}

export const ZONE_TWO_MODELS = [ bear, fork, weed, tape, knife, cheese, camera, ipod, oldPhone, spaSign,
  greenSunglass, orangeSunglass, purpleSunglass, pabloShutter, lionShutter, diamondShutter, catfishShutter ]

// DISTRICT THREE
const ZONE3_X_MIN = ZONE_POS.THREE.x - 500;
const ZONE3_X_MAX = ZONE_POS.THREE.x + 500;
const ZONE3_Z_MIN = ZONE_POS.THREE.z - 500;
const ZONE3_Z_MAX = ZONE_POS.THREE.z + 500;

const bnb = {
  url: 'models/zone3/bnbBig.glb',
  posX: getRandomInt(ZONE3_X_MIN, ZONE3_X_MAX), posY: 370,  posZ: getRandomInt(ZONE3_Z_MIN, ZONE3_Z_MAX),
  rx: 0, ry: 0, rz: 0,
  // zone: 3,
  name: "coins",
  desc: "본 작품은 특정 상품이나 서비스의 판매나 투자권유 또는 조언을 위하여 제작된 것이 아닙니다."
}

const eth = {
  url: 'models/zone3/ethBig.glb',
  posX: getRandomInt(ZONE3_X_MIN, ZONE3_X_MAX), posY: 70,  posZ: getRandomInt(ZONE3_Z_MIN, ZONE3_Z_MAX),
  rx: 0, ry: 0, rz: 0,
  // zone: 3,
  name: "coins",
  desc: "본 작품은 특정 상품이나 서비스의 판매나 투자권유 또는 조언을 위하여 제작된 것이 아닙니다."
}

const btc = {
  url: 'models/zone3/btcBig.glb',
  posX: getRandomInt(ZONE3_X_MIN, ZONE3_X_MAX), posY: 170,  posZ: getRandomInt(ZONE3_Z_MIN, ZONE3_Z_MAX),
  rx: 0, ry: 0, rz: 0,
  // zone: 3,
  name: "coins",
  desc: "본 작품은 특정 상품이나 서비스의 판매나 투자권유 또는 조언을 위하여 제작된 것이 아닙니다."
}

export const ZONE_THREE_MODELS = [ bnb, eth, btc ]