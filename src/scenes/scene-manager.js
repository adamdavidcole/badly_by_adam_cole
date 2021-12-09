import { getAudioElement } from "../utilities/audio-analyser";
import Scene000 from "./scene-000";
import Scene001 from "./scene-001";

const SCENE_CLASSES = [Scene000, Scene001];

export default class SceneManager {
  constructor({ scene, camera, renderer }) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;

    this.scenes = [];
    this.initScenes();
  }

  initScenes() {
    SCENE_CLASSES.forEach((SceneClass) => {
      const sceneClass = new SceneClass({
        scene: this.scene,
        camera: this.camera,
        renderer: this.renderer,
      });

      this.scenes.push(sceneClass);
    });
  }

  setUpScenes() {
    getAudioElement().currentTime = 30;
    this.scenes[1].startScene();
  }

  update() {
    this.scenes.forEach((scene) => {
      scene.update();
    });
  }
}
