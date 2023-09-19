import * as THREE from 'three';
import TWEEN from './libs/tween.esm.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';



document.addEventListener("DOMContentLoaded", function(event) { 
    startAnimations();
});

//audio
const audio = new Audio('audio/action_scene.wav');
audio.loop = true;
audio.volume = 0.4;


function startAnimations(){

audio.load();
audio.play();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 
    75, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    1000 
);
camera.position.set(0,6,11);

const renderer = new THREE.WebGLRenderer({alpha: true ,antialias: true});
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMap.enabled = true;
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true;

//lights

const light = new THREE.DirectionalLight(0xFFFFFF, 0.5);
scene.add(light);
light.position.set(0, 6, 2);
light.castShadow = true;

const light2 = new THREE.AmbientLight(0xFFFFFF, 0.7);
scene.add(light2)

const intensity =2;
const posx = 0;
const posy = 10;
const posz = 5;
const spotLight = new THREE.SpotLight(0xffffff, intensity);
spotLight.position.set(posx, posy, posz);
scene.add(spotLight);


spotLight.castShadow = true; 
spotLight.angle = 0.4;

//GUI
const panel = new GUI();
let currentState = 'idle';
var tween, tween1;
const options = {
    idle: function () {
      currentState = 'idle';
      if(tween)tween.stop();
      if(tween1)tween1.stop();
      idle(model);
    },
    jump: function () {
      currentState = 'jump';
      tween1 =jump(model); 
      if(tween)tween.stop();
      tween1.start();

    },
    run: function () {
      currentState = 'run';
      tween = running(model); 
      if(tween1)tween1.stop();
      tween.start();
     

    },
};

const animFolder = panel.addFolder('Animations');
const idleButton = animFolder.add(options, 'idle');
const jumpButton = animFolder.add(options, 'jump');
const runButton = animFolder.add(options, 'run');
animFolder.open();

const lightFolder = panel.addFolder('Spotlight');
lightFolder.add(spotLight.position, 'x', -20 , 20);
lightFolder.add(spotLight.position, 'y', -20, 20);
lightFolder.add(spotLight.position, 'z', -20, 20);
lightFolder.add(spotLight,'intensity', 0, 4);
lightFolder.open();



// add ground mesh for reference
const groundGeometry = new THREE.BoxGeometry(10, 0.2, 10);
const groundMaterial = new THREE.MeshStandardMaterial({color:'#1c455c' });
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
groundMesh.position.y = -0.2;
groundMesh.receiveShadow = true;
scene.add(groundMesh);

//model
const loader = new GLTFLoader();
var model;

loader.load('models/character/redBot.gltf', function(gltf){
    model = gltf.scene;
    model.traverse((object) => {
        if (object.isMesh) {
            object.castShadow = true;
            object.receiveShadow = true;
        }
    });
    const scaleval = 2;
    model.scale.set(scaleval, scaleval, scaleval);
    model.position.y = -0.1;

    const skeleton = new THREE.SkeletonHelper(model);
    skeleton.visible = true;
    //scene.add(skeleton);
    
    const bodyParts = [
        'mixamorigHead', 'mixamorigNeck', 'mixamorigSpine', 'mixamorigHips',
        'mixamorigSpine1', 'mixamorigSpine2', 'mixamorigLeftShoulder', 
        'mixamorigLeftArm', 'mixamorigLeftForeArm', 'mixamorigLeftHand', 
        'mixamorigRightShoulder', 'mixamorigRightArm', 'mixamorigRightForeArm', 
        'mixamorigRightHand', 'mixamorigLeftUpLeg', 'mixamorigLeftLeg', 
        'mixamorigLeftFoot', 'mixamorigRightUpLeg', 'mixamorigRightLeg', 'mixamorigRightFoot'
    ];

    bodyParts.forEach((partName) => {
        const part = model.getObjectByName(partName);
        if (part) {
            switch (partName) {
                case 'mixamorigLeftArm':
                    part.rotation.z = Math.PI * -0.40;

                    break;
                case 'mixamorigRightArm':
                    part.rotation.z = Math.PI * 0.40;

                    break;
                
            }

            
        }
    });
    scene.add(model);
    
}, undefined, (error) => {
    console.error(error);
});

function idle(model){
    const la = model.getObjectByName('mixamorigLeftArm');
    const ra = model.getObjectByName('mixamorigRightArm');
    const lfa = model.getObjectByName('mixamorigLeftForeArm');
    const rfa = model.getObjectByName('mixamorigRightForeArm');
    const ll = model.getObjectByName('mixamorigLeftLeg');
    const rl = model.getObjectByName('mixamorigRightLeg');
    const lul = model.getObjectByName('mixamorigLeftUpLeg');
    const rul = model.getObjectByName('mixamorigRightUpLeg');
    const s = model.getObjectByName('mixamorigSpine');
    const s1 = model.getObjectByName('mixamorigSpine1');
    const s2 = model.getObjectByName('mixamorigSpine2');
    const ls = model.getObjectByName('mixamorigLeftShoulder');
    const rs = model.getObjectByName('mixamorigRightShoulder');
    const h = model.getObjectByName('mixamorigHips');
    const lf = model.getObjectByName('mixamorigLeftFoot');
    const rf = model.getObjectByName('mixamorigRightFoot');

    la.rotation.x = 0;
    la.rotation.z = Math.PI * -0.40;
    ra.rotation.x = 0;
    ra.rotation.z = Math.PI * 0.40;
    lfa.rotation.x = 0;
    lfa.rotation.y = 0;
    rfa.rotation.x = 0;
    rfa.rotation.y = 0;
    ll.rotation.x = 0;
    rl.rotation.x = 0;
    lul.rotation.x = 0;
    rul.rotation.x = 0;
    ls.rotation.y = 0;
    rs.rotation.y = 0;
    s.rotation.x = 0;
    s1.rotation.x = 0;
    s2.rotation.x = 0; 
    s2.rotation.y = 0;
    h.rotation.x = 0;
    h.rotation.y = 0;
    lf.rotation.x = 0;
    rf.rotation.x = 0;
    model.position.y = -0.1;

}
function running(model){
    const la = model.getObjectByName('mixamorigLeftArm');
    const ra = model.getObjectByName('mixamorigRightArm');
    const lfa = model.getObjectByName('mixamorigLeftForeArm');
    const rfa = model.getObjectByName('mixamorigRightForeArm');
    const ll = model.getObjectByName('mixamorigLeftLeg');
    const rl = model.getObjectByName('mixamorigRightLeg');
    const lul = model.getObjectByName('mixamorigLeftUpLeg');
    const rul = model.getObjectByName('mixamorigRightUpLeg');
    const s = model.getObjectByName('mixamorigSpine');
    const s1 = model.getObjectByName('mixamorigSpine1');
    const s2 = model.getObjectByName('mixamorigSpine2');
    const ls = model.getObjectByName('mixamorigLeftShoulder');
    const rs = model.getObjectByName('mixamorigRightShoulder');
    const h = model.getObjectByName('mixamorigHips');
    const lf = model.getObjectByName('mixamorigLeftFoot');
    const rf = model.getObjectByName('mixamorigRightFoot');

    lfa.rotation.y = Math.PI * -0.6;
    rfa.rotation.y = Math.PI * 0.6;
    s.rotation.x = Math.PI * 0.10;
    s1.rotation.x = Math.PI * -0.10;
    s2.rotation.x = 0;
    h.rotation.x = Math.PI * 0.07;
    model.position.y = -0.2;

    const tween = new TWEEN.Tween({
        rot_la: Math.PI * -0.3,
        rot_ra: Math.PI * 0.3,
        rot_lfa: Math.PI * 0.1,
        rot_rfa: Math.PI * -0.1,
        rot_ll: Math.PI * 0,
        rot_rl: Math.PI * 0.40,
        rot_lul: Math.PI * 0.2,
        rot_rul: Math.PI * -0.30,
        rot_ls: Math.PI * -0.20, 
        rot_rs: Math.PI * -0.20,
        rot_s2y: Math.PI * 0.05,
        rot_h: Math.PI * 0.05,
        rot_lf: Math.PI * 0.20,
        rot_rf: Math.PI * -0.20
    })
    .to({
        rot_la: Math.PI * 0.3,
        rot_ra: Math.PI * -0.3,
        rot_lfa: Math.PI * -0.1,
        rot_rfa: Math.PI * 0.1,
        rot_ll: Math.PI * 0.40,
        rot_rl: Math.PI * 0 ,
        rot_lul: Math.PI * -0.30,
        rot_rul: Math.PI * 0.2, 
        rot_ls: Math.PI * 0.20,
        rot_rs: Math.PI * 0.20,
        rot_s2y: Math.PI * -0.05,
        rot_h: Math.PI * - 0.05,
        rot_lf: Math.PI * -0.20,
        rot_rf: Math.PI * 0.20
    }, 400)
    .onUpdate((update) => {
        la.rotation.x = update.rot_la;
        ra.rotation.x = update.rot_ra;
        lfa.rotation.x = update.rot_lfa;
        rfa.rotation.x = update.rot_rfa;
        ll.rotation.x = update.rot_ll;
        rl.rotation.x = update.rot_rl;
        lul.rotation.x = update.rot_lul;
        rul.rotation.x = update.rot_rul;
        ls.rotation.y = update.rot_ls;
        rs.rotation.y = update.rot_rs;
        s2.rotation.y = update.rot_s2y;
        h.rotation.y = update.rot_h;
        lf.rotation.x = update.rot_lf;
        rf.rotation.x = update.rot_rf;
    })
    .easing(TWEEN.Easing.Linear.None)
    .repeat(Infinity)
    .yoyo(true);

    return tween;

}

function jump(model){
    const la = model.getObjectByName('mixamorigLeftArm');
    const ra = model.getObjectByName('mixamorigRightArm');
    const lfa = model.getObjectByName('mixamorigLeftForeArm');
    const rfa = model.getObjectByName('mixamorigRightForeArm');
    const ll = model.getObjectByName('mixamorigLeftLeg');
    const rl = model.getObjectByName('mixamorigRightLeg');
    const lul = model.getObjectByName('mixamorigLeftUpLeg');
    const rul = model.getObjectByName('mixamorigRightUpLeg');
    const s = model.getObjectByName('mixamorigSpine');
    const s2 = model.getObjectByName('mixamorigSpine2');
    const ls = model.getObjectByName('mixamorigLeftShoulder');
    const rs = model.getObjectByName('mixamorigRightShoulder');
    const lf = model.getObjectByName('mixamorigLeftFoot');
    const rf = model.getObjectByName('mixamorigRightFoot');

    const tween1 = new TWEEN.Tween({
        rot_la: 0,
        rot_ra: 0,
        rot_lfa: 0,
        rot_rfa: 0,
        rot_ll: 0,
        rot_rl: 0,
        rot_lul: 0,
        rot_rul: 0,
        rot_s: 0, 
        rot_s2: 0,
        rot_ls: 0,
        rot_rs: 0,
        rot_lf: 0,
        rot_rf: 0,
        rot_m: 0
    })
    .to({
        rot_la: Math.PI * 0.20,
        rot_ra: Math.PI * 0.20,
        rot_lfa: Math.PI * -0.70,
        rot_rfa: Math.PI * 0.70,
        rot_ll: Math.PI * 0.30,
        rot_rl: Math.PI * 0.30,
        rot_lul: Math.PI * -0.20,
        rot_rul: Math.PI * -0.20,
        rot_s: Math.PI * 0.20,
        rot_s2: Math.PI * -0.10,
        rot_ls: Math.PI * -0.10,
        rot_rs: Math.PI * 0.10,
        rot_lf: Math.PI * -0.10,
        rot_rf: Math.PI * -0.10,
        rot_m: -0.35
    }, 200)
    .onUpdate((update) => {
        la.rotation.x = update.rot_la;
        ra.rotation.x = update.rot_ra;
        lfa.rotation.y = update.rot_lfa;
        rfa.rotation.y = update.rot_rfa;
        ll.rotation.x = update.rot_ll;
        rl.rotation.x = update.rot_rl;
        lul.rotation.x = update.rot_lul;
        rul.rotation.x = update.rot_rul;
        s.rotation.x = update.rot_s;
        s2.rotation.x = update.rot_s2;
        ls.rotation.y = update.rot_ls;
        rs.rotation.y = update.rot_rs;
        lf.rotation.x = update.rot_lf;
        rf.rotation.x = update.rot_rf;
        model.position.y = update.rot_m;
    })
    .easing(TWEEN.Easing.Linear.None);

    const tween2 = new TWEEN.Tween({
        rot_la: Math.PI * 0.20,
        rot_ra: Math.PI * 0.20,
        rot_ll: Math.PI * 0.30,
        rot_rl: Math.PI * 0.30,
        rot_lul: Math.PI * -0.20,
        rot_rul: Math.PI * -0.20,
        rot_s: Math.PI * 0.20,
        rot_s2: Math.PI * -0.10,
        rot_lf: Math.PI * -0.10,
        rot_rf: Math.PI * -0.10,
        rot_m: -0.35
    })
    .to({
        rot_la: 0,
        rot_ra: 0,
        rot_ll: 0,
        rot_rl: 0,
        rot_lul: 0,
        rot_rul: 0,
        rot_s: 0,
        rot_s2: 0,
        rot_lf: 0,
        rot_rf: 0,
        rot_m: 0
    }, 200)
    .onUpdate((update) => {
        la.rotation.x = update.rot_la;
        ra.rotation.x = update.rot_ra;
        ll.rotation.x = update.rot_ll;
        rl.rotation.x = update.rot_rl;
        lul.rotation.x = update.rot_lul;
        rul.rotation.x = update.rot_rul;
        s.rotation.x = update.rot_s;
        s2.rotation.x = update.rot_s2;
        lf.rotation.x = update.rot_lf;
        rf.rotation.x = update.rot_rf;
        model.position.y = update.rot_m;
    })
    .easing(TWEEN.Easing.Linear.None)
    .delay(100);

    const tween3 = new TWEEN.Tween({
        rot_la: 0,
        rot_ra: 0,
        rot_ll: 0,
        rot_rl: 0,
        rot_lul: 0,
        rot_rul: 0,
        rot_s: 0,
        rot_s2: 0,
        rot_m: 0
    })
    .to({
        rot_la: Math.PI * -0.10,
        rot_ra: Math.PI * - 0.10,
        rot_ll: Math.PI * 0.80,
        rot_rl: Math.PI * 0.80,
        rot_lul: Math.PI * -0.6,
        rot_rul: Math.PI * -0.6,
        rot_s: Math.PI * 0.20,
        rot_s2: Math.PI * -0.05,
        rot_m: 2
    },400)
    .onUpdate((update) =>{
        la.rotation.x = update.rot_la;
        ra.rotation.x = update.rot_ra;
        ll.rotation.x = update.rot_ll;
        rl.rotation.x = update.rot_rl;
        lul.rotation.x = update.rot_lul;
        rul.rotation.x = update.rot_rul;
        s.rotation.x = update.rot_s;
        s2.rotation.x = update.rot_s2;
        model.position.y = update.rot_m;
    })
    .easing(TWEEN.Easing.Exponential.Out); 
    
    const tween4 = new TWEEN.Tween({
        rot_la: Math.PI * -0.10,
        rot_ra: Math.PI * - 0.10,
        rot_ll: Math.PI * 0.80,
        rot_rl: Math.PI * 0.80,
        rot_lul: Math.PI * -0.6,
        rot_rul: Math.PI * -0.6,
        rot_s: Math.PI * 0.20,
        rot_s2: Math.PI * -0.05,
        rot_m: 2
    })
    .to({
        rot_la: 0,
        rot_ra: 0,
        rot_ll: 0,
        rot_rl: 0,
        rot_lul: 0,
        rot_rul: 0,
        rot_s: 0,
        rot_s2: 0,
        rot_m: 0
    },400)
    .onUpdate((update) =>{
        la.rotation.x = update.rot_la;
        ra.rotation.x = update.rot_ra;
        ll.rotation.x = update.rot_ll;
        rl.rotation.x = update.rot_rl;
        lul.rotation.x = update.rot_lul;
        rul.rotation.x = update.rot_rul;
        s.rotation.x = update.rot_s;
        s2.rotation.x = update.rot_s2;
        model.position.y = update.rot_m;
    })
    .easing(TWEEN.Easing.Exponential.In)
    .delay(100);
    
    const tween5 = new TWEEN.Tween({
        rot_la: 0,
        rot_ra: 0,
        rot_ll: 0,
        rot_rl: 0,
        rot_lul: 0,
        rot_rul: 0,
        rot_s: 0,
        rot_s2: 0,
        rot_lf: 0,
        rot_rf: 0,
        rot_m: 0
    })
    .to({
        rot_la: Math.PI * 0.20,
        rot_ra: Math.PI * 0.20,
        rot_ll: Math.PI * 0.30,
        rot_rl: Math.PI * 0.30,
        rot_lul: Math.PI * -0.20,
        rot_rul: Math.PI * -0.20,
        rot_s: Math.PI * 0.20,
        rot_s2: Math.PI * -0.10,
        rot_lf: Math.PI * -0.10,
        rot_rf: Math.PI * -0.10,
        rot_m: -0.35
    }, 400)
    .onUpdate((update) =>{
        la.rotation.x = update.rot_la;
        ra.rotation.x = update.rot_ra;
        ll.rotation.x = update.rot_ll;
        rl.rotation.x = update.rot_rl;
        lul.rotation.x = update.rot_lul;
        rul.rotation.x = update.rot_rul;
        s.rotation.x = update.rot_s;
        s2.rotation.x = update.rot_s2;
        lf.rotation.x = update.rot_lf;
        rf.rotation.x = update.rot_rf;
        model.position.y = update.rot_m;
    })
    .easing(TWEEN.Easing.Linear.None);
    
    const tween6 = new TWEEN.Tween({
        rot_la: Math.PI * 0.20,
        rot_ra: Math.PI * 0.20,
        rot_laz: 0, 
        rot_raz: 0, 
        rot_lfa: Math.PI * -0.70,
        rot_rfa: Math.PI * 0.70,
        rot_ll: Math.PI * 0.30,
        rot_rl: Math.PI * 0.30,
        rot_lul: Math.PI * -0.20,
        rot_rul: Math.PI * -0.20,
        rot_s: Math.PI * 0.20,
        rot_s2: Math.PI * -0.10,
        rot_ls: Math.PI * -0.10,
        rot_rs: Math.PI * 0.10,
        rot_lf: Math.PI * -0.10,
        rot_rf: Math.PI * -0.10,
        rot_m: -0.35
    })
    .to({
        rot_la: Math.PI * 0,
        rot_ra: Math.PI * 0,
        rot_laz: Math.PI * -0.40,
        rot_raz: Math.PI * 0.40,
        rot_lfa: Math.PI * -0.30,
        rot_rfa: Math.PI * 0.30,
        rot_ll: 0,
        rot_rl: 0,
        rot_lul: 0,
        rot_rul: 0,
        rot_s: 0,
        rot_s2: 0,
        rot_ls: 0,
        rot_rs: 0,
        rot_lf: 0,
        rot_rf: 0,
        rot_m: 0
    }, 300)
    .onUpdate((update) => {
        la.rotation.x = update.rot_la;
        ra.rotation.x = update.rot_ra;
        la.rotation.z =update.rot_laz;
        ra.rotation.z = update.rot_raz;
        lfa.rotation.y = update.rot_lfa;
        rfa.rotation.y = update.rot_rfa;
        ll.rotation.x = update.rot_ll;
        rl.rotation.x = update.rot_rl;
        lul.rotation.x = update.rot_lul;
        rul.rotation.x = update.rot_rul;
        s.rotation.x = update.rot_s;
        s2.rotation.x = update.rot_s2;
        ls.rotation.y = update.rot_ls;
        rs.rotation.y = update.rot_rs;
        lf.rotation.x = update.rot_lf;
        rf.rotation.x = update.rot_rf;
        model.position.y = update.rot_m;
    })
    .easing(TWEEN.Easing.Linear.None)

    tween1.chain(tween2);
    tween2.chain(tween3);
    tween3.chain(tween4);
    tween4.chain(tween5);
    tween5.chain(tween6);

    return tween1;

}


function animate() {
    TWEEN.update();
	const animationId = requestAnimationFrame( animate );
    renderer.render( scene, camera );
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
 }
 async function WaitModel()
 {
    while(model == undefined)
    {
        
        await sleep(1000);
    }  
    animate();
 }

 WaitModel();

};
