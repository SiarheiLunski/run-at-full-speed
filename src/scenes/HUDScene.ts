import { SCENES, EVENTS, REGISTRY_KEYS, TEXT_ELEMENTS_KEYS } from '../constants';

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

    this.scene.get(SCENES.GAME).events
      .on(EVENTS.UPDATE_SCORE, this.updateScore, this)
      .on(EVENTS.DECREASE_LIVES, this.decreaseLives, this);
  }

  private updateScore(dyingScoreValue: number): void {
    const currentScore = this.registry.get(REGISTRY_KEYS.SCORE);
    this.registry.set(REGISTRY_KEYS.SCORE, currentScore + dyingScoreValue);
    this.textElements.get(TEXT_ELEMENTS_KEYS.SCORE)?.setText(this.getScoreFormatted());
  }

  private decreaseLives(): void {
    const livesLeft = this.registry.get(TEXT_ELEMENTS_KEYS.LIVES) - 1;
    if (livesLeft === 0) {
      this.scene.get(SCENES.GAME).events
        .removeListener(EVENTS.UPDATE_SCORE, this.updateScore, this)
        .removeListener(EVENTS.DECREASE_LIVES, this.decreaseLives, this);
      window.setTimeout(() => {
        this.scene.stop(SCENES.GAME);
        this.scene.start(SCENES.MENU, { score: this.registry.get(REGISTRY_KEYS.SCORE) });
      }, 1500);
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
