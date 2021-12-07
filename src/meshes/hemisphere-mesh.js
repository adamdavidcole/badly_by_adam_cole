import * as THREE from "three";

import getGui from "../utilities/debug-gui";
import getCommonUniforms from "../utilities/common-uniforms";

export default function createHemisphereMesh() {
  const hemisphereGui = getGui().addFolder(`Hemisphere Mesh`);

  const hemisphereGeometry = new THREE.SphereGeometry(
    1,
    32,
    32,
    0,
    2 * Math.PI,
    0,
    Math.PI / 2
  );

  const hemisphereMaterial = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    side: THREE.DoubleSide,
  });

  const hemisphere = new THREE.Mesh(hemisphereGeometry, hemisphereMaterial);
  hemisphere.rotation.z = Math.PI / 2;
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
