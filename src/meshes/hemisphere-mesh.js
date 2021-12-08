import * as THREE from "three";

import getGui from "../utilities/debug-gui";
import getCommonUniforms from "../utilities/common-uniforms";
import {
  getAnalyserUniformData,
  setAverageFactor,
} from "../utilities/audio-analyser";

import vertexShader from "../shaders/hemisphere/vertex.glsl";
import fragmentShader from "../shaders/hemisphere/fragment.glsl";
import { GUI } from "lil-gui";

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

export function createSegmentedSphere({ segmentCount } = { segmentCount: 2 }) {
  const segmentedSphereGui = getGui().addFolder(`Segmented Sphere Mesh`);
  const analyserUniformData = getAnalyserUniformData();
  const sphereSegments = [];

  const segmentSize = (2 * Math.PI) / segmentCount;
  console.log("segmentSize", segmentSize);

  const debugObject = {
    depthColor: "#000000",
    surfaceColor: "#a60808",
  };
  const sharedUniforms = {
    uDisplacementDistance: { value: 3.0 },
    uMaxAudioThreshold: { value: 0.3 },

    uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
    uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
    uColorOffset: { value: 0.5 },
    uColorMultiplier: { value: 10.0 },

    uNoiseFactor: { value: 0.8 },
    uNoiseSpeed: { value: 1.0 },
    uNoiseScale: { value: 1.0 },
    uNoiseDisplacementFactor: { value: 0.25 },
  };

  for (let i = 0; i < segmentCount; i++) {
    const hemisphereGeometry = new THREE.SphereGeometry(
      1,
      32,
      32,
      0,
      segmentSize,
      0,
      Math.PI
    );

    // const hemisphereMaterial = new THREE.MeshBasicMaterial({
    //   color: 0xffff00,
    //   side: THREE.DoubleSide,
    // });
    const hemisphereMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        ...getCommonUniforms(),
        ...analyserUniformData,

        uMaxAudioThreshold: { value: 0.3 },

        uRotationAngle: { value: i * segmentSize },
        uSegmentCount: { value: segmentCount },

        ...sharedUniforms,
      },
      side: THREE.DoubleSide,
    });

    const hemisphere = new THREE.Mesh(hemisphereGeometry, hemisphereMaterial);
    // hemisphere.rotation.z = Math.PI / 2;
    // hemisphere.position.z = -2;

    sphereSegments.push(hemisphere);
  }

  segmentedSphereGui
    .add(sharedUniforms.uDisplacementDistance, "value")
    .min(0.0)
    .max(20.0)
    .step(0.01)
    .name("Displacement distance");
  segmentedSphereGui
    .add(sharedUniforms.uMaxAudioThreshold, "value")
    .min(0)
    .max(1.0)
    .step(0.001)
    .name("Max Audio Threshold");

  segmentedSphereGui
    .add(sharedUniforms.uNoiseFactor, "value")
    .min(0)
    .max(1.0)
    .step(0.001)
    .name("Noise factor");
  segmentedSphereGui
    .add(sharedUniforms.uNoiseSpeed, "value")
    .min(0)
    .max(4.0)
    .step(0.001)
    .name("Noise speed");
  segmentedSphereGui
    .add(sharedUniforms.uNoiseScale, "value")
    .min(0)
    .max(10.0)
    .step(0.001)
    .name("Noise scale");
  segmentedSphereGui
    .add(sharedUniforms.uNoiseDisplacementFactor, "value")
    .min(0)
    .max(1.0)
    .step(0.001)
    .name("Noise displacement factor");

  segmentedSphereGui
    .addColor(debugObject, "depthColor")
    .name("depthColor")
    .onChange(() => {
      sharedUniforms.uDepthColor.value.set(
        new THREE.Color(debugObject.depthColor)
      );
    });
  segmentedSphereGui
    .addColor(debugObject, "surfaceColor")
    .name("surfaceColor")
    .onChange(() => {
      sharedUniforms.uSurfaceColor.value.set(
        new THREE.Color(debugObject.surfaceColor)
      );
    });
  segmentedSphereGui
    .add(sharedUniforms.uColorOffset, "value")
    .min(0)
    .max(1)
    .step(0.001)
    .name("uColorOffset");
  segmentedSphereGui
    .add(sharedUniforms.uColorMultiplier, "value")
    .min(0)
    .max(10)
    .step(0.001)
    .name("uColorMultiplier");

  return sphereSegments;
}
