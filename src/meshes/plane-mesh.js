import * as THREE from "three";

import getCommonUniforms from "../utilities/common-uniforms";
import getGui from "../utilities/debug-gui";
import {
  getAnalyserUniformData,
  setAverageFactor,
} from "../utilities/audio-analyser";

import vertexShader from "../shaders/basic-plane/vertex.glsl";
import fragmentShader from "../shaders/basic-plane/fragment.glsl";

export default function createPlaneMesh({
  position,
  i,
  totalPlaneCount,
  rotationAngle,
  tileFrequency = 4,
  colorA,
  colorB,
  colorC,
  shouldUseColorC,
  spikeAmplitude = 0.1,
} = {}) {
  const debugObject = {
    colorA: colorA || "#8f7619",
    colorB: colorB || "#d11515",
    colorC: colorC || "#0000ff",
  };

  console.log("shouldUseColorC", shouldUseColorC);

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

      uTileFrequency: { value: tileFrequency },
      uSpikeAmplitude: { value: spikeAmplitude },
      uRotationAngle: { value: rotationAngle },

      colorA: { value: new THREE.Color(debugObject.colorA) },
      colorB: { value: new THREE.Color(debugObject.colorB) },
      colorC: { value: new THREE.Color(debugObject.colorC) },
      uShouldUseColorC: { value: shouldUseColorC },

      side: THREE.DoubleSide,
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
  planeGui
    .addColor(debugObject, "colorA")
    .name("colorA")
    .onChange(() => {
      material.uniforms.colorA.value.set(new THREE.Color(debugObject.colorA));
    });
  planeGui
    .addColor(debugObject, "colorB")
    .name("colorB")
    .onChange(() => {
      material.uniforms.colorB.value.set(new THREE.Color(debugObject.colorB));
    });
  planeGui
    .addColor(debugObject, "colorC")
    .name("colorC")
    .onChange(() => {
      material.uniforms.colorC.value.set(new THREE.Color(debugObject.colorC));
    });

  const plane = new THREE.Mesh(geometry, material);
  plane.position.set(position.x, position.y, position.z);
  const scale = Math.pow(totalPlaneCount - i, 2);
  plane.scale.set(scale, scale, scale);
  return plane;

  // scene.add( plane );
}
