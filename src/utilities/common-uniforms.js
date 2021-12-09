import * as THREE from "three";

const clock = new THREE.Clock();

const commonUniforms = {
  uTime: { type: "f", value: 1.0 },
  uResolution: { type: "v2", value: new THREE.Vector2() },
  uMouse: { type: "v2", value: new THREE.Vector2() },
};

function onMouseMove(event) {
  commonUniforms.uMouse.value.x = 2 * (event.clientX / window.innerWidth);
  commonUniforms.uMouse.value.y = 2 * (1 - event.clientY / window.innerHeight);

  // console.log(
  //   "mouse:",
  //   commonUniforms.uMouse.value.x,
  //   commonUniforms.uMouse.value.y
  // );
}

function onWindowResize(event) {
  //   commonUniforms.uResolution.value.x = renderer.domElement.width;
  //   commonUniforms.uResolution.value.y = renderer.domElement.height;
}

export function initCommonUniforms() {
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("windowresize", onWindowResize);
}

export function setResolutionUniform({ width, height }) {
  commonUniforms.uResolution.value = new THREE.Vector2(width, height);
}

export function getMousePos() {
  return { x: commonUniforms.uMouse.value.x, y: commonUniforms.uMouse.value.y };
}

export default function getCommonUniforms() {
  return commonUniforms;
}

export function updateCommonUniforms() {
  const elapsedTime = clock.getElapsedTime();

  // Update material
  commonUniforms.uTime.value = elapsedTime;
}
