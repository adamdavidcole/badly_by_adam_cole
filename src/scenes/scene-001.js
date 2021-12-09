import * as THREE from "three";
import gsap, { Power1 } from "gsap";

import createPlaneMesh from "../meshes/plane-mesh";
import createEnvironmentMesh from "../meshes/environment-mesh";
import { getMousePos } from "../utilities/common-uniforms";
import createRecorder from "../utilities/recorder";

export default class Scene002 {
  constructor({ scene, camera, renderer, audio }) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;

    this.meshes = [];
  }

  startScene() {
    const sphereMesh = createPlaneMesh({
      position: new THREE.Vector3(0, 0, 0),
      i: 0,
      totalPlaneCount: 1,
    });
    const environmentMesh = createEnvironmentMesh();

    this.meshes.push(sphereMesh, environmentMesh);

    this.meshes.forEach((mesh) => {
      this.scene.add(mesh);
    });

    // camera start position
    this.camera.position.set(0, 0, 0.3);

    // camera second position
    gsap.to(this.camera.position, {
      x: 0.0,
      y: 0.0,
      z: 0.75,
      duration: 5,
      ease: Power1.easeIn,
    });

    gsap.to(this.camera.position, {
      x: 0.0,
      y: -0.75,
      z: 0.3,
      duration: 2,
      delay: 5,
      //   ease: Power1.easeInOut,
    });
    // gsap.to(this.camera.position, {
    //   x: 0.0,
    //   y: -0.05,
    //   z: 0.75,
    //   duration: 2,
    //   delay: 7,
    //   ease: Power1.easeOut,
    // });

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
    this.camera.lookAt(0, 0, 0);
  }
}
