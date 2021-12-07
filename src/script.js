import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import getGui from "./utilities/debug-gui";

import {
  initSound,
  setAnalyserMeshVisibility,
  updateCustomFrequencyBandData,
  getAnalyserUniformData,
} from "./utilities/audio-analyser";
import createSphereMesh from "./meshes/sphere-mesh";
import createPlaneMesh from "./meshes/plane-mesh";
import createHemisphereMesh from "./meshes/hemisphere-mesh";
import {
  initCommonUniforms,
  updateCommonUniforms,
} from "./utilities/common-uniforms";

import testVertexShader from "./shaders/test/vertex.glsl";
import testFragmentShader from "./shaders/test/fragment.glsl";

/**
 * Base
 */
// Debug
const gui = getGui();
const debugValues = {
  isAnalyzerMeshVisible: false,
  disableAudio: false,
};

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const flagTexture = textureLoader.load("/textures/flag-french.jpg");

/**
 * Test mesh
 */
// Geometry
initCommonUniforms();

// const geometry = new THREE.PlaneGeometry(1, 1, 100, 100);

// const count = geometry.attributes.position.count;
// const randoms = new Float32Array(count);

// for (let i = 0; i < count; i++) {
//   randoms[i] = Math.random();
// }

// geometry.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1));

// // Material
// const material = new THREE.ShaderMaterial({
//   vertexShader: testVertexShader,
//   fragmentShader: testFragmentShader,
//   uniforms: {
//     ...commonUniforms,
//     uFrequency: { value: new THREE.Vector2(10, 5) },
//     uColor: { value: new THREE.Color("orange") },
//     uTexture: { value: flagTexture },
//   },
// });

// gui
//   .add(material.uniforms.uFrequency.value, "x")
//   .min(0)
//   .max(20)
//   .step(0.01)
//   .name("frequencyX");
// gui
//   .add(material.uniforms.uFrequency.value, "y")
//   .min(0)
//   .max(20)
//   .step(0.01)
//   .name("frequencyY");
// gui.add(debugValues, "isAnalyzerMeshVisible").name("Show analyzer data");

// // Mesh
// const mesh = new THREE.Mesh(geometry, material);
// mesh.scale.y = 2 / 3;
// scene.add(mesh);

let basicSphereMesh;
function initSoundConnectedGeometry() {
  basicSphereMesh = createSphereMesh();
  scene.add(basicSphereMesh);

  // const totalPlaneCount = 1;
  // for (let i = 0; i < totalPlaneCount; i++) {
  //   let planeMesh = createPlaneMesh({
  //     position: new THREE.Vector3(0, 0, i - totalPlaneCount / 2),
  //     i,
  //     totalPlaneCount,
  //   });
  //   scene.add(planeMesh);
  // }
}

// let planeMesh = createPlaneMesh({
//   position: new THREE.Vector3(0, 0, 0),
//   i: 0,
//   totalPlaneCount: 1,
// });
// scene.add(planeMesh);

// const hemisphereMesh = createHemisphereMesh();
// scene.add(hemisphereMesh);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.01,
  100
);
camera.position.set(0, 0, 1);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.listenToKeyEvents(window);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update material
  // material.uniforms.uTime.value = elapsedTime;
  updateCommonUniforms();
  updateCustomFrequencyBandData();

  // console.log(basicSphereMesh.material.uniforms);

  setAnalyserMeshVisibility(debugValues.isAnalyzerMeshVisible);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

if (debugValues.disableAudio) {
  const overlay = document.getElementById("overlay");
  overlay.remove();

  initSoundConnectedGeometry();

  tick();
} else {
  const startButton = document.getElementById("startButton");
  startButton.addEventListener("click", onStartButtonClick);

  function onStartButtonClick() {
    initSound({ scene, renderer });

    initSoundConnectedGeometry();

    const overlay = document.getElementById("overlay");
    overlay.remove();

    tick();
  }
}
