import { SCENES, REGISTRY_KEYS, TEXT_ELEMENTS_KEYS } from '../constants';

export class HUDScene extends Phaser.Scene {
  private textElements: Map<string, Phaser.GameObjects.BitmapText>;

  constructor() {
    super({ key: SCENES.HUD });
  }

  create(): void {
    this.add.image(30, 20, 'heart');
    this.textElements = new Map([
      [TEXT_ELEMENTS_KEYS.LIVES, this.addText(50, 10, `${this.registry.get(REGISTRY_KEYS.LIVES)}`, 'red')],
      [TEXT_ELEMENTS_KEYS.SCORE, this.addText(20, 40, this.getScoreFormatted(), 'white')],
    ]);
  }

  private addText(
    x: number,
    y: number,
    value: string,
    font: string
  ): Phaser.GameObjects.BitmapText {
    return this.add.bitmapText(x, y, font, value, 24);
  }

  private getScoreFormatted(): string {
    return `${this.registry.get(REGISTRY_KEYS.SCORE)}`.padStart(5, '0');
  }
}
