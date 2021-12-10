import { getAudioElement } from "../utilities/audio-analyser";
import gsap from "gsap";

import Scene000 from "./scene-000";
import Scene000b from "./scene-000b";
import Scene001 from "./scene-001";
import Scene001b from "./scene-001b";
import Scene002 from "./scene-002";
import Scene003 from "./scene-003";
import Scene004 from "./scene-004";
import Scene005 from "./scene-005";
import Scene006 from "./scene-006-(05b)";
import Scene007 from "./scene-007-(05c)";
import Scene008 from "./scene-008-(05d)";
import Scene009 from "./scene-009";
import Scene010 from "./scene-010";
import Scene011 from "./scene-011";
import Scene012 from "./scene-012";

const SCENE_CLASSES = [
  Scene000,
  Scene001,
  Scene002,
  Scene003,
  Scene004,
  Scene005,
  Scene006,
  Scene007,
  Scene008,
  Scene009,
  Scene010,
  Scene011,
  Scene012,

  // 13
  Scene000b,

  // 14
  Scene001b,
];

const sceneStartTimes = [0];

export default class SceneManager {
  constructor({ scene, camera, renderer, controls, shouldPlayAll }) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.controls = controls;
    this.shouldPlayAll = shouldPlayAll;

    this.scenes = [];
    this.activeScene;
    this.initScenes();
  }

  initScenes() {
    SCENE_CLASSES.forEach((SceneClass) => {
      const sceneClass = new SceneClass({
        scene: this.scene,
        camera: this.camera,
        renderer: this.renderer,
        controls: this.controls,
        shouldPlayAll: this.shouldPlayAll,
      });

      this.scenes.push(sceneClass);
    });
  }

  initAudio() {
    getAudioElement().currentTime = 0;
  }

  isAudioCue(cueTime) {
    const audioCueThreshold = 1 / 60;
    const currentTime = getAudioElement().currentTime;
    return currentTime >= cueTime && currentTime < cueTime + audioCueThreshold;
  }

  playAll() {
    // opening pan
    // white plane
    // red ball
    // color plane
    // camera pan multi-ball
    // color field zoomed in
    // color field zoomout out
    // final scene
  }

  setUpScenes(sceneNumber) {
    this.activeScene = this.scenes[sceneNumber];
    this.activeScene.startScene();
  }

  cleanUpScene() {
    if (this.activeScene) {
      this.activeScene.cleanUpScene();
    }
  }

  update() {
    // opening pan
    if (this.shouldPlayAll) {
      if (this.isAudioCue(0)) {
        this.setUpScenes(0);
      }

      // white plane
      if (this.isAudioCue(5.05)) {
        this.cleanUpScene();
        this.setUpScenes(1);
      }

      // red ball
      if (this.isAudioCue(10.56)) {
        this.cleanUpScene();
        this.setUpScenes(13);
      }

      // color plane
      if (this.isAudioCue(19.8)) {
        this.cleanUpScene();
        this.setUpScenes(14);
      }

      // camera pan multi-ball
      if (this.isAudioCue(25.34)) {
        this.cleanUpScene();
        this.setUpScenes(3);
      }

      // color field zoomed in
      if (this.isAudioCue(29)) {
        this.cleanUpScene();
        this.setUpScenes(11);
      }

      // final scene
      if (this.isAudioCue(49)) {
        this.cleanUpScene();
        this.setUpScenes(10);
      }
    }

    if (this.activeScene) {
      this.activeScene.update();
    }
  }
}
