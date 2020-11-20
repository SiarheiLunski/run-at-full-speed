import { SCENES, REGISTRY_KEYS } from '../constants';

export class HUDScene extends Phaser.Scene {
  private textElements: Map<string, Phaser.GameObjects.BitmapText>;

  constructor() {
    super({ key: SCENES.HUD });
  }

  create(): void {
    this.textElements = new Map([
      ['SCORE', this.addText(40, 8, `${this.registry.get(REGISTRY_KEYS.SCORE)}`)],
    ]);

    const level = this.scene.get(SCENES.GAME);
    level.events.on('scoreChanged', this.updateScore, this);
  }

  private updateScore(): void {
    this.textElements.get('SCORE')
      ?.setText(`${this.registry.get(REGISTRY_KEYS.SCORE)}`)
      .setX(40 - 8 * (this.registry.get(REGISTRY_KEYS.SCORE).toString().length - 1));
  }

  private addText(
    x: number,
    y: number,
    value: string
  ): Phaser.GameObjects.BitmapText {
    return this.add.bitmapText(x, y, 'main', value, 24);
  }
}
