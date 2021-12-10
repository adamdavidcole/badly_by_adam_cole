import * as THREE from "three";
import gsap, { Power1 } from "gsap";
import { setAudioCurrentTime } from "../utilities/audio-analyser";

import createSphereMesh from "../meshes/sphere-mesh";
import createEnvironmentMesh from "../meshes/environment-mesh";
import { setAverageFactor } from "../utilities/audio-analyser";
import { getMousePos } from "../utilities/common-uniforms";
import createRecorder from "../utilities/recorder";

export default class Scene009 {
  constructor({ scene, camera, renderer }) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;

    this.meshes = [];
  }

  startScene() {
    setAverageFactor(0.925);
    // setAudioCurrentTime(10.75);

    const args = { displacementScale: 1.5 };

    const sphereMeshA = createSphereMesh({
      ...args,
      startRotation: Math.PI * (1 / 8),
      lightPosition: new THREE.Vector3(0, 10.0, 10.0),
    });
    sphereMeshA.position.x = -2;

    const sphereMeshB = createSphereMesh({
      ...args,
      startRotation: Math.PI * (3 / 8),
      lightPosition: new THREE.Vector3(-20, 20.0, -5.0),
    });
    sphereMeshB.position.x = 2;

    const environmentMesh = createEnvironmentMesh();

    this.meshes.push(sphereMeshA, sphereMeshB, environmentMesh);

    this.meshes.forEach((mesh) => {
      this.scene.add(mesh);
    });

    this.camera.position.set(0, 0, 2);
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
