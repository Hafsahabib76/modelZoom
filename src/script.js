import './s.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const loader = new GLTFLoader()

// DIV CONTAINER CREATION TO HOLD THREEJS EXPERIENCE
const container = document.createElement('div')
document.body.appendChild(container)

// SCENE CREATION
const scene = new THREE.Scene()
scene.background = new THREE.Color('#c8f0f9')

// RENDERER CONFIG
const renderer = new THREE.WebGLRenderer({ antialias: true }) // turn on antialias
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) // set pixel ratio
renderer.setSize(window.innerWidth, window.innerHeight) // make it full screen
renderer.outputEncoding = THREE.sRGBEncoding // set color encoding
container.appendChild(renderer.domElement) // add the renderer to html div

// CAMERAS CONFIG
const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 1000)
camera.position.set(0, 0, 1)
scene.add(camera)

// MAKE EXPERIENCE FULL SCREEN
window.addEventListener('resize', () => {
  const width = window.innerWidth
  const height = window.innerHeight
  camera.aspect = width / height
  camera.updateProjectionMatrix()

  renderer.setSize(width, height)
  renderer.setPixelRatio(2)
})

// CREATE ORBIT CONTROLS
const controls = new OrbitControls(camera, renderer.domElement)

// SCENE LIGHTS
const ambient = new THREE.AmbientLight(0xa0a0fc, 0.82)
scene.add(ambient)

const sunLight = new THREE.DirectionalLight(0xe8c37b, 1.96)
sunLight.position.set(-69, 44, 14)
scene.add(sunLight)

let model1, model2 // variables to hold the loaded models

// LOADING GLB/GLTF MODELS
loader.load('models/gltf/GWE_new.glb', function (gltf) {
  model1 = gltf.scene
  scene.add(model1)
})

loader.load('models/gltf/fac.glb', function (gltf) {
  model2 = gltf.scene
  scene.add(model2)
  model2.visible = false
})

// DEFINE ORBIT CONTROLS LIMITS
function setOrbitControlsLimits() {
  controls.enableDamping = true
  controls.dampingFactor = 0.04
  controls.minDistance = 1.6
  controls.maxDistance = 60
  controls.enableRotate = true
  controls.enableZoom = false
  controls.maxPolarAngle = Math.PI / 2.5
}

setOrbitControlsLimits()

// RENDER LOOP FUNCTION
function renderLoop() {
  controls.update() // update orbit controls
  renderer.render(scene, camera) // render the scene using the camera
  requestAnimationFrame(renderLoop) // loop the render function
}

renderLoop() // start rendering

// SWITCH BUTTON
const switchButton = document.createElement('button')
switchButton.id = 'switch-button'
switchButton.textContent = 'Switch'
switchButton.addEventListener('click', switchModels)
container.after(switchButton)

// BACK BUTTON
const backButton = document.createElement('button')
backButton.id = 'back-button'
backButton.textContent = 'Back'
backButton.style.display = 'none'
backButton.addEventListener('click', switchModels)
container.after(backButton)

// Pinch-to-zoom variables
let initialDistance = 0
let initialZoom = 0

// Add event listeners for touch events
container.addEventListener('touchstart', handleTouchStart, false)
container.addEventListener('touchmove', handleTouchMove, false)

// Function to handle touchstart event
function handleTouchStart(event) {
  if (event.touches.length === 2) {
    const touch1 = event.touches[0]
    const touch2 = event.touches[1]
    const dx = touch1.clientX - touch2.clientX
    const dy = touch1.clientY - touch2.clientY
    initialDistance = Math.sqrt(dx * dx + dy * dy)
    initialZoom = camera.position.z
  }
}

// Function to handle touchmove event
function handleTouchMove(event) {
  console.log(event);

  if (event.touches.length === 2) {
    const touch1 = event.touches[0]
    const touch2 = event.touches[1]
    const dx = touch1.clientX - touch2.clientX
    const dy = touch1.clientY - touch2.clientY
    const distance = Math.sqrt(dx * dx + dy * dy)
    const delta = distance - initialDistance
    const zoomSpeed = 0.01

    camera.position.z = Math.max(initialZoom - delta * zoomSpeed, 0.2)
  }
}

// Function to switch between models
function switchModels() {
  if (model1 && model2) {
    const targetPosition = model1.visible ? model2.position : model1.position

    // Animate camera zoom
    const startZoom = camera.position.z
    const endZoom = model1.visible ? 1 : 2 // Adjust the zoom level as needed
    const zoomDuration = 1000 // Adjust the duration of the zoom animation

    const zoomStartTime = Date.now()
    function animateZoom() {
      const elapsed = Date.now() - zoomStartTime
      const t = Math.min(elapsed / zoomDuration, 1)
      const zoom = startZoom + (endZoom - startZoom) * t
      camera.position.z = zoom

      if (t < 1) {
        requestAnimationFrame(animateZoom)
      } else {
        // Animation completed, switch models and update controls
        model1.visible = !model1.visible
        model2.visible = !model2.visible
        switchButton.style.display = model1.visible ? 'inline' : 'none'
        backButton.style.display = model1.visible ? 'none' : 'inline'
        controls.target.copy(targetPosition)
        controls.update()
      }
    }

    animateZoom()
  }
}
