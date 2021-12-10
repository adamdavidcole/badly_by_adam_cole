import * as THREE from "three";
import gsap, { Power1 } from "gsap";
import { setAudioCurrentTime } from "../utilities/audio-analyser";

import createSphereMesh from "../meshes/sphere-mesh";
import createEnvironmentMesh from "../meshes/environment-mesh";
import { getMousePos } from "../utilities/common-uniforms";
import createRecorder from "../utilities/recorder";

export default class Scene004 {
  constructor({ scene, camera, renderer, audio }) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;

    this.meshes = [];
  }

  startScene() {
    setAudioCurrentTime(23.045);
    const radiusFactor = 5;
    const sphereSegments = 10;
    const heightSegments = 10;
    const angleIncrement = (2 * Math.PI) / sphereSegments;
    const heightIncrements = 1 / heightSegments;

    for (let i = 0; i < 2 * Math.PI; i++) {
      for (let j = -heightSegments; j < heightSegments; j++) {
        let y = j * heightIncrements; //  y goes from 1 to -1
        const radius = radiusFactor * Math.sqrt(1 - y * y); //  radius at y
        y = y * radiusFactor;
        console.log("y", y, "r", radius);
        const angle = angleIncrement * i;
        const x = radius * Math.cos(angle);
        const z = radius * Math.sin(angle);

        console.log(x, y, z);

        const sphereMesh = createSphereMesh();
        sphereMesh.position.set(x, y, z);
        sphereMesh.scale.set(0.25, 0.25, 0.25);
        this.meshes.push(sphereMesh);
      }
    }

    const environmentMesh = createEnvironmentMesh();

    this.meshes.push(environmentMesh);

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
  }

  cleanUpScene() {
    this.scene.remove(sphereMesh);
  }

  update() {
    this.camera.lookAt(0, 0, 0);
  }
}
