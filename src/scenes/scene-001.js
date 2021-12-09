import * as THREE from "three";
import gsap, { Power1 } from "gsap";

import createSphereMesh from "../meshes/sphere-mesh";
import createEnvironmentMesh from "../meshes/environment-mesh";
import { getMousePos } from "../utilities/common-uniforms";

export default class Scene001 {
  constructor({ scene, camera, renderer, audio }) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;

    this.meshes = [];
  }

  setUpScene() {
    const sphereMesh = createSphereMesh();
    const environmentMesh = createEnvironmentMesh();

    this.meshes.push(sphereMesh, environmentMesh);

    this.meshes.forEach((mesh) => {
      this.scene.add(mesh);
    });

    // SPHERE
    const sphereUniforms = sphereMesh.material.uniforms;
    const uDisplacementScale = sphereUniforms.uDisplacementScale;
    const uLightIntensity = sphereUniforms.uLightIntensity;

    uDisplacementScale.value = 30.0;
    uLightIntensity.value = 0.0;

    // camera start position
    this.camera.position.set(1.2, 1.2, 0.01);

    // camera second position
    gsap.to(this.camera.position, {
      x: 0.0,
      y: 0.0,
      z: 2.0,
      duration: 10.75,
      ease: Power1.easeInOut,
    });

    gsap.to(uDisplacementScale, {
      value: 10.0,
      duration: 10.75,
      ease: Power1.easeIn,
    });

    gsap.to(uLightIntensity, {
      value: 1.0,
      duration: 10.75,
      ease: Power1.easeIn,
    });

    // ENVIRONMENT
    const environmentUniforms = environmentMesh.material.uniforms;
    environmentUniforms.tileScale.value = 0.75;
    environmentUniforms.uSpeed.value = 0.5;
    environmentUniforms.uShapeThreshold.value = 0.05;

    const environmentIntensity = environmentUniforms.uIntensity;
    environmentIntensity.value = 0;
    gsap.to(environmentIntensity, {
      value: 0.5,
      duration: 10.75,
      ease: Power1.easeIn,
    });
  }

  cleanUpScene() {
    this.scene.remove(sphereMesh);
  }

  update() {
    // this.camera.lookAt(0 + getMousePos().x, 0, 0);

    console.log("mouse", getMousePos());
  }
}