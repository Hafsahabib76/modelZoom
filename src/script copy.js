/////////////////////////////////////////////////////////////////////////
///// IMPORT
import './s.css'
import * as THREE from 'three'
// import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

// let mapPointers = [];

/////////////////////////////////////////////////////////////////////////
//// DRACO LOADER TO LOAD DRACO COMPRESSED MODELS FROM BLENDER
// const dracoLoader = new DRACOLoader()
// dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/')
// dracoLoader.setDecoderConfig({ type: 'js' })
// // loader.setDRACOLoader(dracoLoader)
const loader = new GLTFLoader()

/////////////////////////////////////////////////////////////////////////
///// DIV CONTAINER CREATION TO HOLD THREEJS EXPERIENCE
const container = document.createElement('div')
document.body.appendChild(container)

/////////////////////////////////////////////////////////////////////////
///// SCENE CREATION
const scene = new THREE.Scene()
scene.background = new THREE.Color('#c8f0f9')

/////////////////////////////////////////////////////////////////////////
///// RENDERER CONFIG
const renderer = new THREE.WebGLRenderer({ antialias: true}) // turn on antialias
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) //set pixel ratio
renderer.setSize(window.innerWidth, window.innerHeight) // make it full screen
renderer.outputEncoding = THREE.sRGBEncoding // set color encoding
container.appendChild(renderer.domElement) // add the renderer to html div

/////////////////////////////////////////////////////////////////////////
///// CAMERAS CONFIG
const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 1000)
camera.position.set(0,0,1)
scene.add(camera)

/////////////////////////////////////////////////////////////////////////
///// MAKE EXPERIENCE FULL SCREEN
window.addEventListener('resize', () => {
    const width = window.innerWidth
    const height = window.innerHeight
    camera.aspect = width / height
    camera.updateProjectionMatrix()

    renderer.setSize(width, height)
    renderer.setPixelRatio(2)
})

/////////////////////////////////////////////////////////////////////////
///// CREATE ORBIT CONTROLS
const controls = new OrbitControls(camera, renderer.domElement)

/////////////////////////////////////////////////////////////////////////
///// SCENE LIGHTS
const ambient = new THREE.AmbientLight(0xa0a0fc, 0.82)
scene.add(ambient)

const sunLight = new THREE.DirectionalLight(0xe8c37b, 1.96)
sunLight.position.set(-69,44,14)
scene.add(sunLight)

/////////////////////////////////////////////////////////////////////////
///// LOADING GLB/GLTF MODEL FROM BLENDER
loader.load('models/gltf/GWE_new.glb', function (gltf) {

    scene.add(gltf.scene)
})

// /////////////////////////////////////////////////////////////////////////
// //// INTRO CAMERA ANIMATION USING TWEEN
// function introAnimation() {
//     controls.enabled = false //disable orbit controls to animate the camera
    
//     new TWEEN.Tween(camera.position.set(26,4,-35 )).to({ // from camera position
//         x: 16, //desired x position to go
//         y: 50, //desired y position to go
//         z: -0.1 //desired z position to go
//     }, 6500) // time take to animate
//     .delay(1000).easing(TWEEN.Easing.Quartic.InOut).start() // define delay, easing
//     .onComplete(function () { //on finish animation
//         controls.enabled = true //enable orbit controls
//         setOrbitControlsLimits() //enable controls limits
//         TWEEN.remove(this) // remove the animation from memory
//     })
// }

// introAnimation() // call intro animation on start

/////////////////////////////////////////////////////////////////////////
//// DEFINE ORBIT CONTROLS LIMITS
function setOrbitControlsLimits(){
    controls.enableDamping = true
    controls.dampingFactor = 0.04
    controls.minDistance = 1.6
    controls.maxDistance = 60
    controls.enableRotate = true
    controls.enableZoom = false
    controls.maxPolarAngle = Math.PI /2.5
}

setOrbitControlsLimits();

/////////////////////////////////////////////////////////////////////////
//// RENDER LOOP FUNCTION
function rendeLoop() {

    // TWEEN.update() // update animations

    controls.update() // update orbit controls

    renderer.render(scene, camera) // render the scene using the camera

    requestAnimationFrame(rendeLoop) //loop the render function
    
}

rendeLoop() //start rendering

//points 
const point0DOM = document.querySelector('.point-0');
point0DOM.style.transform = 'translateX(320px) translateY(-20px)';
const point1DOM = document.querySelector('.point-1');
point1DOM.style.transform = 'translateX(0) translateY(-20px)';
const point2DOM = document.querySelector('.point-2');
point2DOM.style.transform = ' translateX(-320px) translateY(-20px)';

point0DOM.addEventListener('click', () => {
    // Hide the GLB model with zoom in fade out animation
    const canvasDOM = document.getElementsByTagName('canvas');
    const glbModel = canvasDOM[0];
    glbModel.classList.add('fade-out');
    
    // Display the another model with fade in transition
    glbModel.classList.add('fade-in');
    glbModel.style.pointerEvents = 'auto'; // Enable interaction with the another model
  });