import * as Phraser from 'phaser';
import { SCENES, REGISTRY_KEYS } from '../constants';
import { MenuSceneParams } from '../types';

export class MenuScene extends Phraser.Scene {
  constructor() {
    super({ key: SCENES.MENU });
  }
  
  create(data: MenuSceneParams): void {
    this.initGlobalDataManager();
    this.sound.stopAll();
    this.add.image(0, 0, 'menu_background').setOrigin(0, 0);
    if (data?.hasOwnProperty('score')) {
      this.sound.play('defeat');
      const scoreTitle = this.add.bitmapText(20, 50, 'white', 'Your score', 24);
      const scoreText = this.add.bitmapText(0, 90, 'red', `${data.score}`, 36).setCenterAlign();
      scoreTitle.x = this.game.renderer.width / 2 - scoreTitle.width / 2;
      scoreText.x = this.game.renderer.width / 2 - scoreText.width / 2;
    }

    const startButton = this.add.bitmapText(0, 0, 'white', 'Start', 24);
    startButton.x = this.game.renderer.width / 2 - startButton.width / 2;
    startButton.y = this.game.renderer.height / 2;
    startButton.setInteractive();
    startButton.on('pointerup', () => {
      this.sound.stopByKey('defeat');
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
