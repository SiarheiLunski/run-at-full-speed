import * as Phraser from 'phaser';
import { SCENES, REGISTRY_KEYS } from '../constants';
import { MenuSceneParams } from '../types';

export class MenuScene extends Phraser.Scene {
  constructor() {
    super({ key: SCENES.MENU });
  }

  init(data: MenuSceneParams): void {
    this.sound.stopByKey('bg_music');
    if (data?.hasOwnProperty('score')) {
      this.sound.play('defeat');
    }
    this.initGlobalDataManager();
  }

  create(): void {
    this.add.image(0, 0, 'background').setOrigin(0, 0);

    const startButton = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2, 'start_button');
    startButton.setInteractive();
    startButton.on('pointerup', () => {
      this.sound.stopAll();
      this.sound.play('bg_music', { loop: true });
      this.scene.start(SCENES.HUD);
      this.scene.start(SCENES.GAME);
      this.scene.bringToTop(SCENES.HUD);
    });
  }

  private initGlobalDataManager(): void {
    this.registry.set(REGISTRY_KEYS.LIVES, 3);
    this.registry.set(REGISTRY_KEYS.SCORE, 0);
  }
}
