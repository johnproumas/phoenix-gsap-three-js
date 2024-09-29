import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { SkeletonUtils } from "three/examples/jsm/Addons.js";

import phoenixModel from "/scene.gltf?url";

gsap.registerPlugin(ScrollTrigger);

const hdrTextureURL = new URL("/overcast_soil_puresky_2k.hdr", import.meta.url);

// Create a renderer and attach it to our document
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

renderer.setClearColor(0xa3a3a3);

// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 5, 15);

// Create a light
const light = new THREE.AmbientLight(0xdddddd, 1);
scene.add(light);

// Load an HDR texture
const rgbeLoader = new RGBELoader();
rgbeLoader.load(hdrTextureURL, function (texture) {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = texture;
  scene.environment = texture;
});

// Load a 3D model
let phoenix;
let mixer;
let mixer2;
let mixer3;
const loader = new GLTFLoader();
loader.load(
  phoenixModel,
  function (gltf) {
    const model = gltf.scene;
    phoenix = model;
    phoenix.scale.set(0.01, 0.01, 0.01);

    const phoenix2 = SkeletonUtils.clone(phoenix);
    const phoenix3 = SkeletonUtils.clone(phoenix);

    scene.add(phoenix);
    scene.add(phoenix2);
    scene.add(phoenix3);

    phoenix.position.set(-1, 2, 2);
    phoenix2.position.set(8, 3, -8);
    phoenix3.position.set(-10, 1, -5);

    // Create an AnimationMixer, and get the list of AnimationClip instances
    mixer = new THREE.AnimationMixer(phoenix);
    mixer2 = new THREE.AnimationMixer(phoenix2);
    mixer3 = new THREE.AnimationMixer(phoenix3);

    const clips = gltf.animations;

    // Play the animations
    if (clips && clips.length) {
      clips.forEach((clip) => {
        const action = mixer.clipAction(clip);
        const action2 = mixer2.clipAction(clip);
        const action3 = mixer3.clipAction(clip);

        action.play();
        action2.play();
        action3.play();
      });
    }
  },
  undefined,
  function (error) {
    console.error("An error happened", error);
  }
);

// GSAP Animation for the camera
const tl = gsap.timeline();
const duration = 3;
const ease = "none";

tl.to(camera.position, {
  z: 25,
  duration,
  ease,
  onUpdate: () => {
    camera.lookAt(0, 0, 0);
  },
})
  .to(camera.position, {
    y: 15,
    duration,
    ease,
    onUpdate: () => {
      camera.lookAt(0, 0, 0);
    },
  })
  .to(camera.position, {
    x: -50,
    y: 15,
    z: 10,
    duration,
    ease,
    onUpdate: () => {
      camera.lookAt(0, 0, 0);
    },
  })
  .to(camera.position, {
    x: -10,
    y: 20,
    z: -20,
    duration,
    ease,
    onUpdate: () => {
      camera.lookAt(0, 0, 0);
    },
  })
  .to(camera.position, {
    x: 45,
    y: -5,
    z: 12,
    duration,
    ease,
    onUpdate: () => {
      camera.lookAt(0, 0, 0);
    },
  })
  .to(camera.position, {
    x: 10,
    y: 5,
    z: 15,
    duration,
    ease,
    onUpdate: () => {
      camera.lookAt(0, 0, 0);
    },
  })
  .to(
    camera.position,
    {
      x: -1050,
      y: 6.38,
      z: 5.53,
      duration: 10,
      ease,
      onUpdate: () => {
        camera.lookAt(0, 0, 0);
      },
    },
    ">-1"
  );

// Create an animation loop
const clock = new THREE.Clock();
function animate(time) {
  // Update the animation mixer on each frame
  const delta = clock.getDelta();
  // control.update(delta);
  if (mixer && mixer2 && mixer3) {
    mixer.update(delta * 0.7);
    mixer2.update(delta * 0.6);
    mixer3.update(delta * 0.8);
  }
  // Render the scene from the perspective of the camera
  renderer.render(scene, camera);
}

// Run the animation loop every frame
renderer.setAnimationLoop(animate);

// Make the renderer responsive
function onWindowResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}
window.addEventListener("resize", onWindowResize, false);
