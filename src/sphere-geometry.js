import * as THREE from "three";

import getGui from "./debug-gui";
import { getCommonUniforms } from "./common";
import { getAnalyserUniformData } from "./audio-analyser";

import fragmentShader from "./shaders/basic-sphere/fragment.glsl";
import vertexShader from "./shaders/basic-sphere/vertex.glsl";

export function createBasicSphere() {
  let geometry = new THREE.SphereGeometry(1, 100, 100); //

  const analyserUniformData = getAnalyserUniformData();

  let uniforms = {
    ...getCommonUniforms(),
    ...analyserUniformData,
    uDisplacementScale: { value: 10.0 },
  };
  const basicMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  let material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
  });
  let mesh = new THREE.Mesh(geometry, material);

  getGui()
    .add(uniforms.uDisplacementScale, "value")
    .min(0)
    .max(50)
    .step(0.001)
    .name("uDisplacementScale");

  return mesh;
}
