import { SCENES, EVENTS, REGISTRY_KEYS, TEXT_ELEMENTS_KEYS } from '../constants';

export class HUDScene extends Phaser.Scene {
  private textElements: Map<string, Phaser.GameObjects.BitmapText>;

  constructor() {
    super({ key: SCENES.HUD });
  }

  create(): void {
    this.textElements = new Map([
      [TEXT_ELEMENTS_KEYS.LIVES, this.addText(20, 8, `${this.registry.get(REGISTRY_KEYS.LIVES)}`, 'red')],
      [TEXT_ELEMENTS_KEYS.SCORE, this.addText(20, 32, this.getScoreFormatted(), 'white')],
    ]);

    this.scene.get(SCENES.GAME).events
      .on(EVENTS.SCORE_CHANGED, this.updateScore, this)
      .on(EVENTS.DECREASE_LIVES, this.descreaseLives, this);
  }

  private updateScore(): void {
    this.textElements.get(TEXT_ELEMENTS_KEYS.SCORE)?.setText(this.getScoreFormatted());
  }

  private descreaseLives(): void {
    const livesLeft = this.registry.get(TEXT_ELEMENTS_KEYS.LIVES) - 1;
    if (livesLeft === 0) {
      this.scene.get(SCENES.GAME).events
        .removeListener(EVENTS.SCORE_CHANGED, this.updateScore, this)
        .removeListener(EVENTS.DECREASE_LIVES, this.descreaseLives, this);
      this.scene.stop(SCENES.GAME);
      this.scene.start(SCENES.MENU, { score: this.registry.get(REGISTRY_KEYS.SCORE) });
    } else {
      this.registry.set(REGISTRY_KEYS.LIVES, livesLeft);
      this.textElements.get(TEXT_ELEMENTS_KEYS.LIVES)?.setText(`${livesLeft}`);
      window.setTimeout(() => {
        this.scene.get(SCENES.GAME).scene.restart();
      }, 1500);
    }
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
