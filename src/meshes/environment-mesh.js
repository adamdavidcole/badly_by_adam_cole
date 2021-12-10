import * as THREE from "three";

import getGui from "../utilities/debug-gui";
import getCommonUniforms from "../utilities/common-uniforms";
import {
  getAnalyserUniformData,
  setAverageFactor,
} from "../utilities/audio-analyser";

import vertexShader from "../shaders/environment/vertex.glsl";
import fragmentShader from "../shaders/environment/fragment.glsl";

export default function createEnvironmentMesh({
  backgroundColor = "#8f7619",
  foregroundColor = "#d11515",
  intensity = 0.5,
} = {}) {
  const debugObject = {
    backgroundColor,
    foregroundColor,
  };
  const environmentGui = getGui().addFolder("Environment");
  const analyserUniformData = getAnalyserUniformData();

  //   const geometry = new THREE.PlaneGeometry(10, 10, 100, 100);
  //   const geometry = new THREE.BoxGeometry(90, 90, 90, 100, 100, 100);

  const geometry = new THREE.SphereGeometry(80, 100, 100);

  //   const material = new THREE.MeshBasicMaterial({
  //     color: 0xffff00,
  //     side: THREE.BackSide,
  //   });

  const environmentMaterial = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      ...getCommonUniforms(),
      ...analyserUniformData,

      tileScale: { value: 5.0 },
      uTranslationX: { value: 0.0 },
      uTranslationY: { value: 0.0 },
      uSpeed: { value: 1.0 },
      uShapeThreshold: { value: 0.06 },
      uIntensity: { value: intensity },

      uBackgroundColor: { value: new THREE.Color(debugObject.backgroundColor) },
      uForegroundColor: { value: new THREE.Color(debugObject.foregroundColor) },
    },
    side: THREE.BackSide,
  });

  environmentGui
    .add(environmentMaterial.uniforms.tileScale, "value")
    .min(0)
    .max(10)
    .step(0.001)
    .name("Tile scale");
  environmentGui
    .add(environmentMaterial.uniforms.uTranslationX, "value")
    .min(-5)
    .max(5)
    .step(0.001)
    .name("TranslationX");
  environmentGui
    .add(environmentMaterial.uniforms.uTranslationY, "value")
    .min(-5)
    .max(5)
    .step(0.001)
    .name("TranslationY");
  environmentGui
    .add(environmentMaterial.uniforms.uSpeed, "value")
    .min(0)
    .max(10)
    .step(0.001)
    .name("Speed");
  environmentGui
    .add(environmentMaterial.uniforms.uShapeThreshold, "value")
    .min(0)
    .max(1)
    .step(0.001)
    .name("Shape Threshold");
  environmentGui
    .add(environmentMaterial.uniforms.uIntensity, "value")
    .min(0)
    .max(3)
    .step(0.001)
    .name("Intensity");

  environmentGui
    .addColor(debugObject, "backgroundColor")
    .name("backgroundColor")
    .onChange(() => {
      environmentMaterial.uniforms.uBackgroundColor.value.set(
        new THREE.Color(debugObject.backgroundColor)
      );
    });
  environmentGui
    .addColor(debugObject, "foregroundColor")
    .name("foregroundColor")
    .onChange(() => {
      environmentMaterial.uniforms.uForegroundColor.value.set(
        new THREE.Color(debugObject.foregroundColor)
      );
    });

  const plane = new THREE.Mesh(geometry, environmentMaterial);

  return plane;
}
