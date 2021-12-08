import * as THREE from "three";

import getGui from "../utilities/debug-gui";
import getCommonUniforms from "../utilities/common-uniforms";
import {
  getAnalyserUniformData,
  setAverageFactor,
} from "../utilities/audio-analyser";

import vertexShader from "../shaders/hemisphere/vertex.glsl";
import fragmentShader from "../shaders/hemisphere/fragment.glsl";

export default function createHemisphereMesh({ isLeft } = { isLeft: true }) {
  const hemisphereGui = getGui().addFolder(`Hemisphere Mesh`);
  const analyserUniformData = getAnalyserUniformData();

  let phiStart = 0;
  let thetaStart = 0;
  //   if (!isLeft) {
  //     phiStart = Math.PI / 2.0;
  //     thetaStart = Math.PI / 2.0;
  //   }

  const hemisphereGeometry = new THREE.SphereGeometry(
    1,
    32,
    32,
    phiStart,
    2 * Math.PI,
    thetaStart,
    Math.PI / 2
  );

  //   const hemisphereMaterial = new THREE.MeshBasicMaterial({
  //     color: 0xffff00,
  //     side: THREE.DoubleSide,
  //   });
  const hemisphereMaterial = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      ...getCommonUniforms(),
      ...analyserUniformData,

      uMaxAudioThreshold: { value: 0.3 },
      isLeft: { value: isLeft },
    },
    side: THREE.DoubleSide,
  });

  const hemisphere = new THREE.Mesh(hemisphereGeometry, hemisphereMaterial);
  hemisphere.rotation.z = Math.PI / 2;
  hemisphere.position.z = -2;

  hemisphereGui
    .add(hemisphereMaterial.uniforms.uMaxAudioThreshold, "value")
    .min(0)
    .max(1.0)
    .step(0.001)
    .name("uMaxAudioThreshold");
  hemisphereGui.add(hemisphereMaterial.uniforms.isLeft, "value").name("isLeft");

  return hemisphere;
  //   const material = new THREE.ShaderMaterial({
  //     vertexShader,
  //     fragmentShader,
  //     uniforms: {
  //       ...getCommonUniforms(),
  //       ...analyserUniformData,

  //       uTileFrequency: { value: 4.0 },
  //       uSpikeAmplitude: { value: 0.1 },
  //     },
  //   });
}

export function createHemispherePair() {
  const rightHemisphere = createHemisphereMesh({ isLeft: false });
  const leftHemisphere = createHemisphereMesh({ isLeft: true });

  return [rightHemisphere, leftHemisphere];
}
