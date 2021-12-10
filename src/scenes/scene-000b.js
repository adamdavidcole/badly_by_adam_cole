import * as THREE from "three";
import gsap, { Power1 } from "gsap";

import createSphereMesh from "../meshes/sphere-mesh";
import createEnvironmentMesh from "../meshes/environment-mesh";
import { getMousePos } from "../utilities/common-uniforms";
import createRecorder from "../utilities/recorder";

export default class Scene001 {
  constructor({ scene, camera, renderer, audio }) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;

    this.meshes = [];
  }

  startScene() {
    const sphereMesh = createSphereMesh();
    const environmentMesh = createEnvironmentMesh({
      backgroundColor: "#0e0a01",
    });

    this.meshes.push(sphereMesh, environmentMesh);

    this.meshes.forEach((mesh) => {
      this.scene.add(mesh);
    });

    // SPHERE
    const sphereUniforms = sphereMesh.material.uniforms;
    const uDisplacementScale = sphereUniforms.uDisplacementScale;
    const uLightIntensity = sphereUniforms.uLightIntensity;
    const shouldRotate = sphereUniforms.uShouldRotate;
    const rotateTimeStart = sphereUniforms.uRotationTimeStart;

    uDisplacementScale.value = 6.0;
    uLightIntensity.value = 1.0;

    // camera start position
    this.camera.position.set(0, 0, 3);

    // ENVIRONMENT
    const environmentUniforms = environmentMesh.material.uniforms;
    environmentUniforms.tileScale.value = 0.75;
    environmentUniforms.uSpeed.value = 0.5;
    environmentUniforms.uShapeThreshold.value = 0.05;

    const environmentIntensity = environmentUniforms.uIntensity;
    environmentIntensity.value = 0.25;
  }

  cleanUpScene() {
    this.meshes.forEach((mesh) => {
      this.scene.remove(mesh);
    });
  }

  update() {
    this.camera.lookAt(0, 0, 0);
  }
}
