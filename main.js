import * as THREE from 'three';
import TWEEN from './libs/tween.esm.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';




const gameOverScreen = document.getElementById('game-over');
const restartButton = document.getElementById('restart-button');
const menuButton = document.getElementById('menu-button');

const audio = new Audio('audio/evasion.wav');
audio.loop = true;
audio.volume = 0.4;


document.addEventListener("DOMContentLoaded", function(event) { 
    startGame();
});


function startGame(){
    audio.load();
    audio.play();
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 
        75, 
        window.innerWidth / window.innerHeight, 
        0.1, 
        1000 
    );
    camera.position.z = 6;
    
    const renderer = new THREE.WebGLRenderer({alpha: true ,antialias: true});
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;
    document.body.appendChild( renderer.domElement );
    
    //backgound
    const textureLoader = new THREE.TextureLoader();
    scene.background = textureLoader.load('texture/futuristic_tunnel.jpg');
    
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
        const scaleval = 1.2    ;
        model.scale.set(scaleval, scaleval, scaleval);
    
    
        const bodyParts = [
            'mixamorigHead', 'mixamorigNeck', 'mixamorigSpine', 
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
    
    
    class Box extends THREE.Mesh {
        constructor({ 
            width, 
            height, 
            depth, 
            color = '#00ff00',
            position = {
                x: 0,
                y: 0,
                z: 0  
            }, 
            velocity ={
            x: 0,
            y: 0,
            z: 0
            }, 
            
            zAcceleration = false
        }) {
            super(
                new THREE.BoxGeometry(width,  height, depth),
                new THREE.MeshStandardMaterial({ color: color })
                )
            this.width  = width;
            this.height = height;
            this.depth  = depth;
    
            this.position.set(position.x, position.y, position.z );
    
            this.dx = this.position.x + this.width /2;
            this.sx = this.position.x - this.width /2;
    
            this.ground = this.position.y - this.height /2;
            this.top = this.position.y + this.height /2;
    
            this.front = this.position.z + this.depth /2;
            this.back = this.position.z - this.depth /2;
    
            this.velocity = velocity;
    
            this.zAcceleration = zAcceleration;
            
        };
    
        update_sides(){
            this.dx = this.position.x + this.width /2;
            this.sx = this.position.x - this.width /2;
    
            this.ground = this.position.y - this.height /2;
            this.top = this.position.y + this.height /2;
    
            this.front = this.position.z + this.depth /2;
            this.back = this.position.z - this.depth /2;
        }
    
        update(base){
            this.update_sides();
    
            if(this.zAcceleration) this.velocity.z += 0.0003;
    
            this.position.x +=  this.velocity.x;
            this.position.z +=  this.velocity.z;
    
            this.gravity(base);
        };
    
        gravity(base){
            this.velocity.y += - 0.002;
            if(crash({box1: this,box2: base}) ){
                this.velocity.y = -this.velocity.y * 0.5;
            } else {
                this.position.y += this.velocity.y;
            }
        }
    };
    
    
    function crash({ box1, box2 }) {
        return (
            box1.dx >= box2.sx &&
            box1.sx <= box2.dx &&
            box1.ground + box1.velocity.y <= box2.top &&
            box1.top >= box2.ground &&
            box1.front >= box2.back &&
            box1.back <= box2.front
        );
    }
    
    
    class Cube extends Box{
        constructor(){
            super({
                width: 0.6,
                height: 1.2,
                depth: 1.2,
                velocity: {x: 0, y: -0.01, z: 0}
            });
            this.material = new THREE.MeshStandardMaterial({
                transparent:true,
                wireframe: true,  
                opacity: 0
            })
        }
    }
    
    const textureLoader2 = new THREE.TextureLoader();
    const enemyTexture = textureLoader2.load('texture/red_aura.jpg'); 
    const enemyMaterial = new THREE.MeshStandardMaterial({
        map: enemyTexture
    });
    
    
    class Enemy extends Box{
    
        constructor({ position }){
            super({
                width: 1,
                height: 1,
                depth: 1, 
                position: {
                    x: position.x,
                    y: position.y,
                    z: position.z
                },
                velocity: { x: 0, y: 0, z: 0.005 },
                color: '#000000',
                zAcceleration: true
            });
            this.castShadow = true;
            this.material = enemyMaterial;
            
        }
    
        update(base) {
            super.update(base); 
        }
    }
    
    
    const base = new Box({width: 9, height: 0.5, depth: 60, color: '#1c455c', position: {x: 0, y: -2, z: 0} }); 
    scene.add(base);
    base.position.z = -25;
    base.receiveShadow = true;
    
    
    const cube = new Cube();
    scene.add(cube);
    
    //lights
    
    const light = new THREE.AmbientLight(0xB1E1FF , 1.5); 
    scene.add(light);
    
    const dirlight = new THREE.DirectionalLight(0xFFFFFF, 1);
    scene.add(dirlight);
    dirlight.position.set(0, 6, 2);
    dirlight.castShadow = true;
    
    
    const keys = {
        a: { pressed: false },
        d: { pressed: false },
    };
    
    const keyMap = {
        KeyA: 'a',
        KeyD: 'd',
        KeySpace: 'Space'
    };
    
    window.addEventListener('keydown', (event) => {
        const key = keyMap[event.code];
        if (key) {
            keys[key].pressed = true;
        }
    
        if (event.code === 'Space') {
            cube.velocity.y = 0.09;
            jump(model); 
        }
    });
    
    window.addEventListener('keyup', (event) => {
        const key = keyMap[event.code];
        if (key) {
            keys[key].pressed = false;
        }
    });
    
    
    function jump(model){
        
        const la = model.getObjectByName('mixamorigLeftArm');
        const ra = model.getObjectByName('mixamorigRightArm');
        const ll = model.getObjectByName('mixamorigLeftLeg');
        const rl = model.getObjectByName('mixamorigRightLeg');
        const lul = model.getObjectByName('mixamorigLeftUpLeg');
        const rul = model.getObjectByName('mixamorigRightUpLeg');
        const s = model.getObjectByName('mixamorigSpine');
        const s2 = model.getObjectByName('mixamorigSpine2');
        
        const tween3 = new TWEEN.Tween({
            _la: 0,
            _ra: 0,
            _ll: 0,
            _rl: 0,
            _lul: 0,
            _rul: 0,
            _s: 0,
            _s2: 0,
            
        })
        .to({
            _la: Math.PI * -0.10,
            _ra: Math.PI * - 0.10,
            _ll: Math.PI * 0.80,
            _rl: Math.PI * 0.80,
            _lul: Math.PI * -0.6,
            _rul: Math.PI * -0.6,
            _s: Math.PI * 0.20,
            _s2: Math.PI * -0.05,
        },50)
        .onUpdate((coords) =>{
            la.rotation.x = coords._la;
            ra.rotation.x = coords._ra;
            ll.rotation.x = coords._ll;
            rl.rotation.x = coords._rl;
            lul.rotation.x = coords._lul;
            rul.rotation.x = coords._rul;
            s.rotation.x = coords._s;
            s2.rotation.x = coords._s2;
        })
        .easing(TWEEN.Easing.Exponential.Out); 
        
        const tween4 = new TWEEN.Tween({
            _la: Math.PI * -0.10,
            _ra: Math.PI * - 0.10,
            _ll: Math.PI * 0.80,
            _rl: Math.PI * 0.80,
            _lul: Math.PI * -0.6,
            _rul: Math.PI * -0.6,
            _s: Math.PI * 0.20,
            _s2: Math.PI * -0.05,
        })
        .to({
            _la: 0,
            _ra: 0,
            _ll: 0,
            _rl: 0,
            _lul: 0,
            _rul: 0,
            _s: 0,
            _s2: 0,
        },400)
        .onUpdate((coords) =>{
            la.rotation.x = coords._la;
            ra.rotation.x = coords._ra;
            ll.rotation.x = coords._ll;
            rl.rotation.x = coords._rl;
            lul.rotation.x = coords._lul;
            rul.rotation.x = coords._rul;
            s.rotation.x = coords._s;
            s2.rotation.x = coords._s2;
        })
        .easing(TWEEN.Easing.Exponential.In)
        .delay(100);
    
        tween3.chain(tween4);
        tween3.start();
    
    
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
        model.rotation.y = Math.PI;
        
    
        const tween = new TWEEN.Tween({
            _la: Math.PI * -0.3,
            _ra: Math.PI * 0.3,
            _lfa: Math.PI * 0.1,
            _rfa: Math.PI * -0.1,
            _ll: Math.PI * 0,
            _rl: Math.PI * 0.40,
            _lul: Math.PI * 0.2,
            _rul: Math.PI * -0.30,
            _ls: Math.PI * -0.20, 
            _rs: Math.PI * -0.20,
            _s2y: Math.PI * 0.05,
            _h: Math.PI * 0.05,
            _lf: Math.PI * 0.20,
            _rf: Math.PI * -0.20
        })
        .to({
            _la: Math.PI * 0.3,
            _ra: Math.PI * -0.3,
            _lfa: Math.PI * -0.1,
            _rfa: Math.PI * 0.1,
            _ll: Math.PI * 0.40,
            _rl: Math.PI * 0 ,
            _lul: Math.PI * -0.30,
            _rul: Math.PI * 0.2, 
            _ls: Math.PI * 0.20,
            _rs: Math.PI * 0.20,
            _s2y: Math.PI * -0.05,
            _h: Math.PI * - 0.05,
            _lf: Math.PI * -0.20,
            _rf: Math.PI * 0.20
        }, 400)
        .onUpdate((coords) => {
            la.rotation.x = coords._la;
            ra.rotation.x = coords._ra;
            lfa.rotation.x = coords._lfa;
            rfa.rotation.x = coords._rfa;
            ll.rotation.x = coords._ll;
            rl.rotation.x = coords._rl;
            lul.rotation.x = coords._lul;
            rul.rotation.x = coords._rul;
            ls.rotation.y = coords._ls;
            rs.rotation.y = coords._rs;
            s2.rotation.y = coords._s2y;
            h.rotation.y = coords._h;
            lf.rotation.x = coords._lf;
            rf.rotation.x = coords._rf;
        })
        .easing(TWEEN.Easing.Linear.None)
        .repeat(Infinity)
        .yoyo(true);
    
        tween.start();
    
    }
    
    
    
    const enemies = [];
    
    let frames = 0;
    let spawnRate = 200;
    
    function animate() {
        model.position.x = cube.position.x;
        model.position.y = cube.position.y - 0.7;
        model.position.z = cube.position.z;
    
        TWEEN.update();
        const animationId = requestAnimationFrame( animate );
        renderer.render( scene, camera );
        cube.update(base);
    
        enemies.forEach(enemy => {
            enemy.update(base);
            if(crash({box1: cube, box2: enemy})){
                cancelAnimationFrame(animationId);
                gameOverScreen.style.display = 'block';
                audio.pause();
                audio.load();
            }      
            
        });
    
        if(frames % spawnRate === 0){
            if(spawnRate >50) spawnRate -=7;
            const enemy = new Enemy({
                position: {x: (Math.random() - 0.5)* 8, y: 0, z: -30}
            })
            scene.add(enemy);
    
            enemies.push(enemy);
        }
    
        frames++;
        
    
        //movimenti
        cube.velocity.x = 0;
        cube.velocity.z = 0;
        if(keys.a.pressed)
        {
            cube.velocity.x = -0.05;
            model.position.x -= 0.05;
        }
        else if(keys.d.pressed)
        {
            cube.velocity.x = 0.05;
            model.position.x += 0.05;
        }
        
    }
    
    
    
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
     }
     async function WaitModel()
     {
        while(model == undefined)
        {
            console.log("sleeping");
            await sleep(1000);
        } 
        
        running(model);
        animate();
     }
    
     WaitModel();
    
    
};
