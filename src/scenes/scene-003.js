import * as THREE from "three";
import gsap, { Power1 } from "gsap";
import { setAudioCurrentTime } from "../utilities/audio-analyser";

import createSphereMesh from "../meshes/sphere-mesh";
import createEnvironmentMesh from "../meshes/environment-mesh";
import { getMousePos } from "../utilities/common-uniforms";
import createRecorder from "../utilities/recorder";

export default class Scene003 {
  constructor({ scene, camera, renderer, audio }) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;

    this.meshes = [];
  }

  startScene() {
    // setAudioCurrentTime(23.045);

    const args = { displacementScale: 4.0 };

    const sphereMeshG = createSphereMesh(args);
    sphereMeshG.position.z = -80;

    const sphereMeshF = createSphereMesh(args);
    sphereMeshF.position.z = -48;

    const sphereMeshE = createSphereMesh(args);
    sphereMeshE.position.z = -24;

    const sphereMeshD = createSphereMesh(args);
    sphereMeshD.position.z = -12;

    const sphereMeshA = createSphereMesh(args);
    sphereMeshA.position.z = -6;

    const sphereMeshB = createSphereMesh(args);
    const sphereMeshC = createSphereMesh(args);
    sphereMeshC.position.z = 3;

    const environmentMesh = createEnvironmentMesh();

    this.meshes.push(
      sphereMeshA,
      sphereMeshB,
      sphereMeshC,
      sphereMeshD,
      sphereMeshE,
      sphereMeshF,
      sphereMeshG,
      environmentMesh
    );

    this.meshes.forEach((mesh) => {
      this.scene.add(mesh);
    });

    // ENVIRONMENT
    const environmentUniforms = environmentMesh.material.uniforms;
    environmentUniforms.tileScale.value = 0.75;
    environmentUniforms.uSpeed.value = 0.5;
    environmentUniforms.uShapeThreshold.value = 0.05;

    const environmentIntensity = environmentUniforms.uIntensity;
    // environmentIntensity.value = 0;

    this.camera.position.set(0, 0, 5);

    gsap.to(this.camera.position, {
      x: 3.0,
      y: 0.0,
      z: 2.8,
      duration: 2.5,
      // delay: 1.0,
      ease: Power1.easeIn,
    });
  }

  cleanUpScene() {
    this.meshes.forEach((mesh) => {
      this.scene.remove(mesh);
    });
    gsap.killTweensOf(this.camera.position);
  }

  update() {
    this.camera.lookAt(0, 0, 0);
  }
}
