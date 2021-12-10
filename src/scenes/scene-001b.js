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
    const planeMesh = createPlaneMesh({
      position: new THREE.Vector3(0, 0, 0),
      i: 0,
      totalPlaneCount: 1,
      rotationAngle: 0,
      // colorA: "#000000",
      // colorB: "#000000",
      colorC: "#ff4d00",
      shouldUseColorC: true,
      tileFrequency: 2,
      spikeAmplitude: 0.07,
    });
    const uniforms = planeMesh.material.uniforms;
    const uSpikeAmplitude = uniforms.uSpikeAmplitude;

    // planeMesh2.rotateY(Math.PI * getMousePos().x, Math.PI * getMousePos().y);
    const environmentMesh = createEnvironmentMesh({
      backgroundColor: "#000000",
    });

    this.meshes.push(planeMesh, environmentMesh);

    this.meshes.forEach((mesh) => {
      this.scene.add(mesh);
    });

    // camera start position
    this.camera.position.set(0, -0.6, 0.4);

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
