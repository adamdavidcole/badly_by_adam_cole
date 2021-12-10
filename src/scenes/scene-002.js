import * as THREE from "three";
import gsap, { Power1 } from "gsap";

import createPlaneMesh from "../meshes/plane-mesh";
import createEnvironmentMesh from "../meshes/environment-mesh";
import { getMousePos } from "../utilities/common-uniforms";
import createRecorder from "../utilities/recorder";
import { setAudioCurrentTime } from "../utilities/audio-analyser";

export default class Scene002 {
  constructor({ scene, camera, renderer, audio }) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;

    this.meshes = [];
  }

  startScene() {
    //setAudioCurrentTime(17.65);
    // const planeMeshA = createPlaneMesh({
    //   position: new THREE.Vector3(-1, 0, 0),
    //   i: 0,
    //   totalPlaneCount: 1,
    //   rotationAngle: 0,
    //   colorA: "#000000",
    //   colorB: "#000000",
    //   colorC: "#ffffff",
    //   shouldUseColorC: true,
    //   tileFrequency: 2,
    //   spikeAmplitude: 0.1,
    // });
    // const planeMeshB = createPlaneMesh({
    //   position: new THREE.Vector3(0, 0, 0),
    //   i: 0,
    //   totalPlaneCount: 1,
    //   rotationAngle: 0,
    //   colorA: "#000000",
    //   colorB: "#000000",
    //   colorC: "#ffffff",
    //   shouldUseColorC: true,
    //   tileFrequency: 2,
    //   spikeAmplitude: 0.1,
    // });
    // const planeMeshC = createPlaneMesh({
    //   position: new THREE.Vector3(1, 0, 0),
    //   i: 0,
    //   totalPlaneCount: 1,
    //   rotationAngle: 0,
    //   colorA: "#000000",
    //   colorB: "#000000",
    //   colorC: "#ffffff",
    //   shouldUseColorC: true,
    //   tileFrequency: 2,
    //   spikeAmplitude: 0.1,
    // });

    // const uniforms = planeMesh.material.uniforms;
    // const uSpikeAmplitude = uniforms.uSpikeAmplitude;

    const gridSizeX = 1;
    const gridSizeY = 0;
    for (let i = -gridSizeX; i <= gridSizeX; i++) {
      for (let j = -gridSizeY; j <= gridSizeY; j++) {
        const planeMesh = createPlaneMesh({
          position: new THREE.Vector3(i, j, 0),
          i: 0,
          totalPlaneCount: 1,
          rotationAngle: 0,
          colorA: "#000000",
          colorB: "#000000",
          colorC: "#ffffff",
          shouldUseColorC: true,
          tileFrequency: 2,
          spikeAmplitude: 0.1,
        });
        this.meshes.push(planeMesh);
      }
    }

    // planeMesh2.rotateY(Math.PI * getMousePos().x, Math.PI * getMousePos().y);
    const environmentMesh = createEnvironmentMesh();

    // this.meshes.push(planeMeshA, planeMeshB, planeMeshC);

    this.meshes.forEach((mesh) => {
      this.scene.add(mesh);
    });

    // camera start position
    this.camera.position.set(0, 0, 1.4);

    this.meshes.forEach((mesh) => {
      const uniforms = mesh.material.uniforms;
      const uRotationAngle = uniforms.uRotationAngle;

      const rotation = Math.PI / 2 - 0.01;
      if (mesh.position.x < 0) {
        gsap.to(uRotationAngle, {
          value: -rotation,
          duration: 0.125,
          ease: Power1.easeOut,
          delay: 2,
        });
      } else if (mesh.position.x > 0) {
        gsap.to(uRotationAngle, {
          value: rotation,
          duration: 0.125,
          ease: Power1.easeOut,
          delay: 2,
        });
      }
    });

    // ENVIRONMENT
    // const environmentUniforms = environmentMesh.material.uniforms;
    // environmentUniforms.tileScale.value = 0.75;
    // environmentUniforms.uSpeed.value = 0.5;
    // environmentUniforms.uShapeThreshold.value = 0.05;

    // const environmentIntensity = environmentUniforms.uIntensity;
    // environmentIntensity.value = 1;
    // gsap.to(environmentIntensity, {
    //   value: 0.5,
    //   duration: 10.75,
    //   ease: Power1.easeIn,
    // });
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
