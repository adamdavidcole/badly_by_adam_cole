import * as THREE from "three";
import gsap, { Power1 } from "gsap";

import createSegmentedSphere from "../meshes/segmented-sphere-mesh";
import createEnvironmentMesh from "../meshes/environment-mesh";
import { getMousePos } from "../utilities/common-uniforms";
import { setAudioCurrentTime } from "../utilities/audio-analyser";
import { setAverageFactor } from "../utilities/audio-analyser";

export default class Scene006 {
  constructor({ scene, camera, renderer, audio }) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;

    this.meshes = [];
  }

  startScene() {
    setAudioCurrentTime(29);
    setAverageFactor(0.75);
    const segmentedSpheres = createSegmentedSphere({
      segmentCount: 2,
      displacementDistance: 3.5,
      noiseScale: 0.6,
      noiseFactor: 0.375,
      audioThreshold: 0.2,
    });
    console.log("segmentedSphere", segmentedSpheres);
    // const uniforms = segmentedSphere.material.uniforms;

    const environmentMesh = createEnvironmentMesh({
      backgroundColor: "#2e0000",
      forgroundColor: "#db0000",
      intensity: 0.15,
    });

    this.meshes.push(...segmentedSpheres, environmentMesh);

    this.meshes.forEach((mesh) => {
      this.scene.add(mesh);
    });

    // camera start position
    this.camera.position.set(0.01, 2, 0);

    this.camera.lookAt(0, 0, 0);

    // this.camera.rotateX;
  }

  cleanUpScene() {
    this.scene.remove(sphereMesh);
  }

  update() {
    //
    // this.camera.rotation.set(getMousePos().y, getMousePos().x, getMousePos().x);
    this.camera.lookAt(0, 0, 0);
  }
}
