import * as THREE from "three";

import getGui from "../utilities/debug-gui";
import getCommonUniforms from "../utilities/common-uniforms";
import { getAnalyserUniformData } from "../utilities/audio-analyser";

import vertexShader from "../shaders/basic-sphere/vertex.glsl";
import fragmentShader from "../shaders/basic-sphere/fragment.glsl";

import spikeVertexShader from "../shaders/sphere-spikes/vertex.glsl";
import spikeFragmentShader from "../shaders/sphere-spikes/fragment.glsl";

import perlinVertexShader from "../shaders/basic-sphere-perlin/vertex.glsl";
import perlinFragmentShader from "../shaders/basic-sphere-perlin/fragment.glsl";

function getShaders({ usePerlin, useSpikes } = {}) {
  if (usePerlin) {
    return {
      vertexShader: perlinVertexShader,
      fragmentShader: perlinFragmentShader,
    };
  }

  if (useSpikes) {
    return {
      vertexShader: spikeVertexShader,
      fragmentShader: spikeFragmentShader,
    };
  }

  return {
    vertexShader,
    fragmentShader,
  };
}

export default function createSphereMesh({ usePerlin } = {}) {
  const sphereGui = getGui().addFolder("Sphere Mesh");
  const debugObject = {
    depthColor: "#ffffff",
    surfaceColor: "#cc1414",
  };

  let geometry = new THREE.SphereGeometry(1, 100, 100); //

  const analyserUniformData = getAnalyserUniformData();

  let uniforms = {
    ...getCommonUniforms(),
    ...analyserUniformData,

    uDisplacementScale: { value: 10.0 },

    uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
    uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
    uColorOffset: { value: 0.08 },
    uColorMultiplier: { value: 10.0 },

    uLightIntensity: { value: 1.0 },
    uAmbientLightIntensity: { value: 0.15 },

    uShouldRotate: { value: false },
    uRotationTimeStart: { value: 0 },

    uTileSpacing: { value: 10.0 },
  };
  const basicMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  let material = new THREE.ShaderMaterial({
    uniforms,
    ...getShaders({}),
  });
  let mesh = new THREE.Mesh(geometry, material);
  mesh.rotateY(Math.PI / 4);

  sphereGui
    .add(uniforms.uDisplacementScale, "value")
    .min(0)
    .max(50)
    .step(0.001)
    .name("uDisplacementScale");
  sphereGui
    .addColor(debugObject, "depthColor")
    .name("depthColor")
    .onChange(() => {
      material.uniforms.uDepthColor.value.set(
        new THREE.Color(debugObject.depthColor)
      );
    });
  sphereGui
    .addColor(debugObject, "surfaceColor")
    .name("surfaceColor")
    .onChange(() => {
      material.uniforms.uSurfaceColor.value.set(
        new THREE.Color(debugObject.surfaceColor)
      );
    });
  sphereGui
    .add(material.uniforms.uColorOffset, "value")
    .min(0)
    .max(1)
    .step(0.001)
    .name("uColorOffset");
  sphereGui
    .add(material.uniforms.uColorMultiplier, "value")
    .min(0)
    .max(10)
    .step(0.001)
    .name("uColorMultiplier");
  sphereGui
    .add(material.uniforms.uLightIntensity, "value")
    .min(0)
    .max(10)
    .step(0.001)
    .name("uLightIntensity");
  sphereGui
    .add(material.uniforms.uAmbientLightIntensity, "value")
    .min(0)
    .max(1)
    .step(0.001)
    .name("uAmbientLightIntensity");

  sphereGui.close();

  return mesh;
}
