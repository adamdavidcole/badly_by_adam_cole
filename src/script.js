import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import testVertexShader from "./shaders/test/vertex.glsl";
import testFragmentShader from "./shaders/test/fragment.glsl";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

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
const geometry = new THREE.PlaneGeometry(1, 1, 32, 32);

const count = geometry.attributes.position.count;
const randoms = new Float32Array(count);

for (let i = 0; i < count; i++) {
  randoms[i] = Math.random();
}

geometry.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1));

// Material
const material = new THREE.ShaderMaterial({
  vertexShader: testVertexShader,
  fragmentShader: testFragmentShader,
  uniforms: {
    uFrequency: { value: new THREE.Vector2(10, 5) },
    uTime: { value: 0 },
    uColor: { value: new THREE.Color("orange") },
    uTexture: { value: flagTexture },
  },
});

gui
  .add(material.uniforms.uFrequency.value, "x")
  .min(0)
  .max(20)
  .step(0.01)
  .name("frequencyX");
gui
  .add(material.uniforms.uFrequency.value, "y")
  .min(0)
  .max(20)
  .step(0.01)
  .name("frequencyY");

// Mesh
const mesh = new THREE.Mesh(geometry, material);
mesh.scale.y = 2 / 3;
scene.add(mesh);

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
  0.1,
  100
);
camera.position.set(0.25, -0.25, 1);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

let analyser, uniforms;
const FFT_SIZE = 512 * 2;
const bandCount = 8;
const frequencyBands = new Uint8Array(bandCount);

/*
 * Audio
 */
function initSound() {
  const listener = new THREE.AudioListener();
  const audio = new THREE.Audio(listener);
  const file = "./sounds/ROSALIA-MALAMENTE.mp3";
  const mediaElement = new Audio(file);
  mediaElement.play();

  audio.setMediaElementSource(mediaElement);

  const fftSize = FFT_SIZE;
  analyser = new THREE.AudioAnalyser(audio, fftSize);
  const format = renderer.capabilities.isWebGL2
    ? THREE.RedFormat
    : THREE.LuminanceFormat;

  uniforms = {
    tAudioData: {
      value: new THREE.DataTexture(frequencyBands, bandCount, 1, format),
    },
  };

  const analyserGeometry = new THREE.PlaneGeometry(1, 1);
  const analyserMaterial = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: document.getElementById("vertexShader").textContent,
    fragmentShader: document.getElementById("fragmentShader").textContent,
  });
  const analyserMesh = new THREE.Mesh(analyserGeometry, analyserMaterial);
  scene.add(analyserMesh);

  const overlay = document.getElementById("overlay");
  overlay.remove();

  tick();
}

function updateFrequencyBandData() {
  const averageFactor = 0.25;
  const frequencyData = analyser.getFrequencyData();
  const nextFrequencyBands = [];

  let count = 0;
  for (let i = 0; i < bandCount; i++) {
    let sum = 0;
    let sampleCount = Math.pow(2, i + 1);

    if (i == bandCount - 1) {
      const remainder = FFT_SIZE / 2 - (count + sampleCount);
      sampleCount += remainder;
    }

    for (let j = 0; j < sampleCount; j++) {
      sum += frequencyData[count];
      count++;
    }

    const average = sum / sampleCount;
    nextFrequencyBands[i] = Math.round(average);

    frequencyBands[i] =
      (frequencyBands[i] * averageFactor +
        (1 - averageFactor) * nextFrequencyBands[i]) /
      2.0;
  }
}

const startButton = document.getElementById("startButton");
startButton.addEventListener("click", initSound);

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update material
  material.uniforms.uTime.value = elapsedTime;

  const frequencyData = analyser.getFrequencyData();
  updateFrequencyBandData();

  uniforms.tAudioData.value.needsUpdate = true;
  //   uniforms.frequencyBands.value = frequencyBands;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};
