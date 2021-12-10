import * as THREE from "three";
import gsap, { Power1 } from "gsap";
import { setAudioCurrentTime } from "../utilities/audio-analyser";

import createSphereMesh from "../meshes/sphere-mesh";
import createSegmentedSphere from "../meshes/segmented-sphere-mesh";
import createEnvironmentMesh from "../meshes/environment-mesh";
import { setAverageFactor } from "../utilities/audio-analyser";
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
    setAverageFactor(0.93);
    setAudioCurrentTime(88.25);

    const sphereSegments = createSegmentedSphere({
      segmentCount: 100,
      displacementDistance: 0.5,
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

    this.camera.position.set(-0.01, 1.0, -0.01);

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

    gsap.to(this.controls, {
      autoRotate: true,
      autoRotateSpeed: 50,
      delay: 19.75,
      duration: 0.0,
    });

    gsap.to(this.controls, {
      autoRotateSpeed: 2,
      delay: 19.76,
      duration: 12.0,
      ease: Power1.easeOut,
    });

    const noiseFactorUniform = sphereSegments[0].material.uniforms.uNoiseFactor;
    gsap.to(noiseFactorUniform, {
      value: 0.8,
      delay: 19.75,
      duration: 0.0,
    });
    gsap.to(noiseFactorUniform, {
      value: 0.375,
      delay: 19.77,
      duration: 12.0,
      ease: Power1.easeIn,
    });

    const displacementUniform =
      sphereSegments[0].material.uniforms.uDisplacementDistance;
    gsap.to(displacementUniform, {
      value: 0.8,
      delay: 19.75,
      duration: 0.0,
    });
    gsap.to(displacementUniform, {
      value: 0.5,
      delay: 19.77,
      duration: 12.0,
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
