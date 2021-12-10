import Scene000 from "./scene-000";
import Scene001 from "./scene-001";
import Scene002 from "./scene-002";
import Scene003 from "./scene-003";
import Scene004 from "./scene-004";
import Scene005 from "./scene-005";
import Scene006 from "./scene-006-(05b)";
import Scene007 from "./scene-007-(05c)";
import Scene008 from "./scene-008-(05d)";
import Scene009 from "./scene-009";
import Scene010 from "./scene-010";

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
];

export default class SceneManager {
  constructor({ scene, camera, renderer, controls }) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.controls = controls;

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
      });

      this.scenes.push(sceneClass);
    });
  }

  setUpScenes() {
    this.activeScene = this.scenes[10];
    this.activeScene.startScene();
  }

  update() {
    if (this.activeScene) {
      this.activeScene.update();
    }
  }
}
