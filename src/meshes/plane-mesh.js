import * as THREE from "three";

import getCommonUniforms from "../utilities/common-uniforms";
import getGui from "../utilities/debug-gui";
import {
  getAnalyserUniformData,
  setAverageFactor,
} from "../utilities/audio-analyser";

import vertexShader from "../shaders/basic-plane/vertex.glsl";
import fragmentShader from "../shaders/basic-plane/fragment.glsl";

export default function createPlaneMesh({ position, i, totalPlaneCount }) {
  const planeGui = getGui().addFolder(`Plane Mesh ${i}`);
  const analyserUniformData = getAnalyserUniformData();
  setAverageFactor(0.5);

  const geometry = new THREE.PlaneGeometry(1, 1, 100, 100);
  geometry.position = position;
  // const material = new THREE.MeshBasicMaterial({
  //   color: 0xffff00,
  //   side: THREE.DoubleSide,
  // });
  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      ...getCommonUniforms(),
      ...analyserUniformData,

      uTileFrequency: { value: 4.0 },
      uSpikeAmplitude: { value: 0.1 },
    },
  });

  planeGui
    .add(material.uniforms.uTileFrequency, "value")
    .min(0.0)
    .max(20.0)
    .step(1.0)
    .name("tileFrequency");

  planeGui
    .add(material.uniforms.uSpikeAmplitude, "value")
    .min(0.0)
    .max(5.0)
    .step(0.001)
    .name("uSpikeAmplitude");

  const plane = new THREE.Mesh(geometry, material);
  plane.position.set(position.x, position.y, position.z);
  const scale = Math.pow(totalPlaneCount - i, 2);
  plane.scale.set(scale, scale, scale);
  return plane;

  // scene.add( plane );
}
