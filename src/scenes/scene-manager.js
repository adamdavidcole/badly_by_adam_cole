import Scene000 from "./scene-000";
import Scene001 from "./scene-001";
import Scene002 from "./scene-002";

const SCENE_CLASSES = [Scene000, Scene001, Scene002];

export default class SceneManager {
  constructor({ scene, camera, renderer }) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;

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
      });

      this.scenes.push(sceneClass);
    });
  }

  setUpScenes() {
    this.activeScene = this.scenes[1];
    this.activeScene.startScene();
  }

  update() {
    this.activeScene.update();
  }
}
