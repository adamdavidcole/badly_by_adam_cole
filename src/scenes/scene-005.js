import * as THREE from "three";
import gsap, { Power1 } from "gsap";

import createSegmentedSphere from "../meshes/segmented-sphere-mesh";
import createEnvironmentMesh from "../meshes/environment-mesh";
import { getMousePos } from "../utilities/common-uniforms";
import { setAudioCurrentTime } from "../utilities/audio-analyser";

export default class Scene005 {
  constructor({ scene, camera, renderer, audio }) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;

    this.meshes = [];
  }

  startScene() {
    setAudioCurrentTime(29);
    const segmentedSpheres = createSegmentedSphere({
      segmentCount: 2,
      displacementDistance: 5,
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
    this.camera.position.set(0.01, 3, 0);

    gsap.to(this.camera.position, {
      x: 2.0,
      z: -2.0,
      y: 2.0,
      duration: 0.125,
      delay: 1.0,
    });

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
