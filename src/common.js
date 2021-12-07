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
}

function onWindowResize(event) {
  //   commonUniforms.uResolution.value.x = renderer.domElement.width;
  //   commonUniforms.uResolution.value.y = renderer.domElement.height;
}

export function initCommonUniforms() {
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("windowresize", onWindowResize);
}

export function getCommonUniforms() {
  return commonUniforms;
}

export function updateCommonUniforms() {
  const elapsedTime = clock.getElapsedTime();

  // Update material
  commonUniforms.uTime.value = elapsedTime;
}
