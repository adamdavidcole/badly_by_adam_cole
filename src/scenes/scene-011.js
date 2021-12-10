import * as THREE from "three";
import gsap, { Power1 } from "gsap";

import createPlaneMesh from "../meshes/plane-mesh";
import createEnvironmentMesh from "../meshes/environment-mesh";
import { getMousePos } from "../utilities/common-uniforms";
import { setAverageFactor } from "../utilities/audio-analyser";
import { setAudioCurrentTime } from "../utilities/audio-analyser";

export default class Scene002 {
  constructor({ scene, camera, renderer, audio }) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;

    this.meshes = [];
  }

  startScene() {
    // setAudioCurrentTime(29.16);

    const planeMeshes = [];
    const gridSize = 10;
    for (let i = -gridSize; i <= gridSize; i++) {
      for (let j = -gridSize; j <= gridSize; j++) {
        const planeMesh = createPlaneMesh({
          position: new THREE.Vector3(i, j, 0),
          i: 0,
          totalPlaneCount: 1,
          rotationAngle: 0,
          //   colorA: "#000000",
          //   colorB: "#000000",
          //   colorC: "#ffffff",
          shouldUseColorC: false,
          tileFrequency: 2,
          spikeAmplitude: 0.07,
        });

        const uniforms = planeMesh.material.uniforms;
        const uSpikeAmplitude = uniforms.uSpikeAmplitude;
        uSpikeAmplitude.value =
          0.01 + (gridSize - Math.abs(i) - Math.abs(j)) / 10.0;

        // gsap.to(uSpikeAmplitude, {
        //   value: 0.01 + (gridSize - Math.abs(i) - Math.abs(j)) / 10.0,
        //   duration: 0,
        //   // delay: 2.475 + 7,
        // });

        gsap.to(uSpikeAmplitude, {
          value: 0.5 + (gridSize - Math.abs(i) - Math.abs(j)) / 10.0,
          ease: Power1.easeIn,
          duration: 20,
          delay: 0.025,
        });

        planeMeshes.push(planeMesh);
      }
    }

    // planeMesh2.rotateY(Math.PI * getMousePos().x, Math.PI * getMousePos().y);
    const environmentMesh = createEnvironmentMesh();

    this.meshes.push(...planeMeshes, environmentMesh);

    this.meshes.forEach((mesh) => {
      this.scene.add(mesh);
    });

    // camera start position
    this.camera.position.set(0, 0, 2.0);
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
