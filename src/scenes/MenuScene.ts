import * as Phraser from 'phaser';
import { SCENES, REGISTRY_KEYS } from '../constants';

export class MenuScene extends Phraser.Scene {
  constructor() {
    super({ key: SCENES.MENU });
  }
  
  create(): void {
    this.initGlobalDataManager();
    this.sound.stopAll();
    this.add.image(0, 0, 'menu_background').setOrigin(0, 0);

    const logo = this.add.image(20, 50, 'logo').setOrigin(0, 0);
    logo.x = this.game.renderer.width / 2 - logo.width / 2;

    const startButton = this.add.bitmapText(0, 0, 'white', 'Start', 24);
    startButton.x = this.game.renderer.width / 2 - startButton.width / 2;
    startButton.y = this.game.renderer.height / 2;
    startButton.setInteractive();
    startButton.on('pointerup', () => {
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
