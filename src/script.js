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
import createSegmentedSphere from "./meshes/segmented-sphere-mesh";
import createEnvironmentMesh from "./meshes/environment-mesh";
import {
  initCommonUniforms,
  updateCommonUniforms,
  setResolutionUniform,
} from "./utilities/common-uniforms";

import Scene001 from "./scenes/scene-001";

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
  disableOrbitControls: true,
  showAxesHelper: true,
};

const scenes = [];

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

gui.add(debugValues, "isAnalyzerMeshVisible").name("Show analyzer data");
gui.add(debugValues, "showAxesHelper").name("Show axes helper");

let basicSphereMesh;
let hemisphereMesh;
let sphereSegments = [];
function initSoundConnectedGeometry() {
  // basicSphereMesh = createSphereMesh();
  // scene.add(basicSphereMesh);
  // const totalPlaneCount = 1;
  // for (let i = 0; i < totalPlaneCount; i++) {
  //   let planeMesh = createPlaneMesh({
  //     position: new THREE.Vector3(0, 0, i - totalPlaneCount / 2),
  //     i,
  //     totalPlaneCount,
  //   });
  //   scene.add(planeMesh);
  // }
  /** sphere Segments */
  // sphereSegments = createSegmentedSphere();
  // // sphereSegments
  // scene.add(...sphereSegments);
  /** enviornment mesh */
  // const environmentMesh = createEnvironmentMesh();
  // scene.add(environmentMesh);

  const scene001 = new Scene001({ scene, camera, renderer });
  scene001.setUpScene();
  scenes.push(scene001);
}

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// let planeMesh = createPlaneMesh({
//   position: new THREE.Vector3(0, 0, 0),
//   i: 0,
//   totalPlaneCount: 1,
// });
// scene.add(planeMesh);

/**
 * Sizes
 */

let sizes;
function setSizes() {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  console.log(windowWidth, windowHeight);

  const scale = windowWidth / windowHeight;

  if (windowWidth > windowHeight) {
    sizes = {
      width: windowHeight * (16 / 9),
      height: windowHeight,
    };
  } else {
    sizes = {
      width: windowWidth,
      height: windowWidth * (9 / 16),
    };
  }
}
setSizes();

window.addEventListener("resize", () => {
  console.log("resize?");
  // Update sizes
  setSizes();

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  setResolutionUniform({ width: sizes.width, height: sizes.height });
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.001,
  100
);
camera.position.set(0, 2, 4);
scene.add(camera);

// Controls

let controls;
if (!debugValues.disableOrbitControls) {
  controls = new OrbitControls(camera, canvas);
  controls.listenToKeyEvents(window);
  controls.enableDamping = true;
}

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
setResolutionUniform({ width: sizes.width, height: sizes.height });

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

  scenes.forEach((scene) => {
    scene.update();
  });

  // console.log(hemisphereMesh.material.uniforms.tAudioData.value.image.data);

  setAnalyserMeshVisibility(debugValues.isAnalyzerMeshVisible);
  axesHelper.visible = debugValues.showAxesHelper;

  // Update controls
  if (!debugValues.disableOrbitControls) {
    controls.update();
  }

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
