import * as THREE from "three";

import getGui from "../utilities/debug-gui";
import getCommonUniforms from "../utilities/common-uniforms";
import {
  getAnalyserUniformData,
  setAverageFactor,
} from "../utilities/audio-analyser";

import vertexShader from "../shaders/hemisphere/vertex.glsl";
import fragmentShader from "../shaders/hemisphere/fragment.glsl";

const SURFACE_COLOR = new THREE.Color("#a60808");

function getStartColor({ angle, useDifferentColors }) {
  if (!useDifferentColors) return SURFACE_COLOR;

  const startR = SURFACE_COLOR.r;
  const startG = SURFACE_COLOR.g;
  const b = SURFACE_COLOR.b;

  const r = startR + Math.sin(angle) / 5.0;
  const g = startG + Math.cos(angle) / 5.0;

  return new THREE.Color(r, g, b);
}

export default function createSegmentedSphere(
  { segmentCount } = { segmentCount: 2 }
) {
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
    uColorOffset: { value: 0.2 },
    uColorMultiplier: { value: 10.0 },

    uNoiseFactor: { value: 0.375 },
    uNoiseSpeed: { value: 1.0 },
    uNoiseScale: { value: 2.0 },
    uNoiseDisplacementFactor: { value: 1.0 },
  };

  for (let i = 0; i < segmentCount; i++) {
    const hemisphereGeometry = new THREE.SphereGeometry(
      1,
      64,
      64,
      0,
      segmentSize,
      0,
      Math.PI
    );

    // const hemisphereMaterial = new THREE.MeshBasicMaterial({
    //   color: 0xffff00,
    //   side: THREE.DoubleSide,
    // });
    const surfaceColor = getStartColor({
      angle: i * segmentSize,
      useDifferentColors: true,
    });
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
        uSurfaceColor: { value: surfaceColor },
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
