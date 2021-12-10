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
import createRecorder from "./utilities/recorder";
import SceneManager from "./scenes/scene-manager";

import testVertexShader from "./shaders/test/vertex.glsl";
import testFragmentShader from "./shaders/test/fragment.glsl";

/**
 * Base
 */
// Debug
const debugValues = {
  isAnalyzerMeshVisible: false,
  disableAudio: false,
  disableOrbitControls: false,
  showAxesHelper: true,
  shouldRecord: true,
  showGui: true,
  shouldPlayAll: true,
};
const gui = getGui();
if (!debugValues.showGui || debugValues.shouldRecord) {
  gui.destroy();
}

// const recorder = createRecorder({
//   name: `scene-001 ${new Date().toDateString()} ${new Date().toTimeString()}`,
//   duration: 150,
// });

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
  //     rotationAngle: 0,

  //     colorA: "#000000",
  //     colorB: "#000000",
  //     colorC: "#ffffff",
  //     shouldUseColorC: true,
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

  // const scene001 = new Scene002({
  //   scene,
  //   camera,
  //   renderer,
  //   shouldRecord: debugValues.shouldRecord,
  // });
  // scene001.setUpScene();
  // scenes.push(scene001);

  if (!debugValues.shouldPlayAll) {
    sceneManager.setUpScenes(10);
  } else {
    sceneManager.initAudio();
  }
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

  // if (debugValues.shouldRecord) {
  //   sizes = {
  //     width: 1728,
  //     height: 972,
  //   };
  // }
}
setSizes();

window.addEventListener("resize", () => {
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
  70,
  sizes.width / sizes.height,
  0.001,
  1000 // 100
);
camera.position.set(0, 0, 3);
scene.add(camera);

// Controls

let controls;
if (!debugValues.disableOrbitControls) {
  controls = new OrbitControls(camera, canvas);
  controls.listenToKeyEvents(window);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.enableRotate = false;
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

const sceneManager = new SceneManager({
  camera,
  renderer,
  scene,
  controls,
  shouldPlayAll: debugValues.shouldPlayAll,
});

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
  sceneManager.update();

  // console.log(hemisphereMesh.material.uniforms.tAudioData.value.image.data);

  setAnalyserMeshVisibility(debugValues.isAnalyzerMeshVisible);
  axesHelper.visible = debugValues.showAxesHelper && !debugValues.shouldRecord;

  // Update controls
  if (!debugValues.disableOrbitControls) {
    controls.update();
  }

  // Render
  renderer.render(scene, camera);
  if (debugValues.shouldRecord) {
    // recorder.capture(renderer.domElement);
  }

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

if (debugValues.disableAudio) {
  const overlay = document.getElementById("overlay");
  overlay.remove();

  initSoundConnectedGeometry();

  tick();
} else {
  const fullscreenButton = document.getElementById("startFullscreen");
  fullscreenButton.addEventListener("click", () => {
    document.documentElement.requestFullscreen();
  });

  if (debugValues.shouldPlayAll) {
    fullscreenButton.remove();
  }

  const startButton = document.getElementById("startButton");
  startButton.addEventListener("click", onStartButtonClick);

  function onStartButtonClick() {
    if (debugValues.shouldPlayAll) {
      document.documentElement.requestFullscreen();
    }

    initSound({ scene, renderer });

    initSoundConnectedGeometry();

    const overlay = document.getElementById("overlay");
    overlay.remove();

    if (debugValues.shouldRecord) {
      canvas.style.cursor = "none";
    }

    tick();
  }
}
