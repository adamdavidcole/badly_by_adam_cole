import * as THREE from "three";
import gsap, { Power1, Power2 } from "gsap";

import createSphereMesh from "../meshes/sphere-mesh";
import createSegmentedSphere from "../meshes/segmented-sphere-mesh";
import createEnvironmentMesh from "../meshes/environment-mesh";
import { setAverageFactor } from "../utilities/audio-analyser";
import { setAudioCurrentTime } from "../utilities/audio-analyser";
import { getMousePos } from "../utilities/common-uniforms";
import createRecorder from "../utilities/recorder";

export default class Scene010 {
  constructor({ scene, camera, renderer, controls }) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.controls = controls;

    this.meshes = [];
  }

  startScene() {
    setAverageFactor(0.8);
    // setAudioCurrentTime(88.25);

    const sphereSegments = createSegmentedSphere({
      segmentCount: 150,
      displacementDistance: 1.05,
      noiseFactor: 0.5,
    });

    const environmentMesh = createEnvironmentMesh({
      backgroundColor: "#000000",
      intensity: 0.25,
    });

    this.meshes.push(...sphereSegments, environmentMesh);

    this.meshes.forEach((mesh) => {
      this.scene.add(mesh);
    });

    this.camera.position.set(-0.01, 3.0, -0.01);

    gsap.to(this.camera.position, {
      y: 3.0,
      duration: 5.0,
      ease: Power1.easeInOut,
    });

    gsap.to(this.camera.position, {
      y: 3.0,
      x: -3.0,
      z: -3.0,
      duration: 1.0,
      delay: 5.0,
      ease: Power1.easeInOut,
    });

    gsap.to(this.camera.position, {
      y: 1.5,
      x: -1.5,
      z: -1.5,
      delay: 6.0,
      duration: 5.0,
      ease: Power1.easeInOut,
    });

    const delaySpinTime = 19.55;
    gsap.to(this.controls, {
      autoRotate: true,
      autoRotateSpeed: 30,
      delay: delaySpinTime,
      duration: 0.0,
    });

    gsap.to(this.controls, {
      autoRotateSpeed: 2,
      delay: delaySpinTime,
      duration: 12.0,
      ease: Power1.easeOut,
    });

    const noiseFactorUniform = sphereSegments[0].material.uniforms.uNoiseFactor;
    gsap.to(noiseFactorUniform, {
      value: 0.5,
      delay: 19.75,
      duration: 0.0,
    });
    gsap.to(noiseFactorUniform, {
      value: 0.375,
      delay: delaySpinTime + 0.02,
      duration: 12.0,
      ease: Power1.easeIn,
    });

    const displacementUniform =
      sphereSegments[0].material.uniforms.uDisplacementDistance;
    gsap.to(displacementUniform, {
      value: 1.0,
      duration: 5.0,
      ease: Power1.easeInOut,
    });
    gsap.to(displacementUniform, {
      value: 2.0,
      delay: delaySpinTime,
      duration: 0.125,
      ease: Power1.easeIn,
    });
    gsap.to(displacementUniform, {
      value: 0.5,
      delay: delaySpinTime + 0.4,
      duration: 12.0,
      ease: Power2.easeOut,
    });
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
