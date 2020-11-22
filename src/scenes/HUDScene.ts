import { SCENES, EVENTS, REGISTRY_KEYS, TEXT_ELEMENTS_KEYS } from '../constants';

export class HUDScene extends Phaser.Scene {
  private textElements: Map<string, Phaser.GameObjects.BitmapText>;

  constructor() {
    super({ key: SCENES.HUD });
  }

  create(): void {
    this.textElements = new Map([
      [TEXT_ELEMENTS_KEYS.LIVES, this.addText(20, 8, `${this.registry.get(REGISTRY_KEYS.LIVES)}`)],
      [TEXT_ELEMENTS_KEYS.SCORE, this.addText(20, 32, this.getScoreFormatted())],
    ]);

    const level = this.scene.get(SCENES.GAME);
    level.events.on(EVENTS.SCORE_CHANGED, this.updateScore, this);
    level.events.on(EVENTS.DECREASE_LIVES, this.descreaseLives, this);
  }

  private updateScore(): void {
    this.textElements.get(TEXT_ELEMENTS_KEYS.SCORE)?.setText(this.getScoreFormatted());
  }

  private descreaseLives(): void {
    const lives = this.registry.get(TEXT_ELEMENTS_KEYS.LIVES) - 1;
    this.registry.set(REGISTRY_KEYS.LIVES, lives);

    this.textElements.get(TEXT_ELEMENTS_KEYS.LIVES)?.setText(`${lives}`);
  }

  private addText(
    x: number,
    y: number,
    value: string
  ): Phaser.GameObjects.BitmapText {
    return this.add.bitmapText(x, y, 'main', value, 24);
  }

  private getScoreFormatted(): string {
    return `${this.registry.get(REGISTRY_KEYS.SCORE)}`.padStart(5, '0');
  }
}
