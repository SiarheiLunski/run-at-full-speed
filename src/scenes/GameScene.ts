import * as Phraser from 'phaser';
import { SCENES } from '../constants';

export class GameScene extends Phraser.Scene {
  private ground: Phaser.GameObjects.Sprite;

  constructor() {
    super({ key: SCENES.GAME });
  }

  init(): void { }

  create(): void {
    this.add.image(0, 0, 'background').setOrigin(0, 0);
    this.ground = this.add.sprite(320, 351, 'ground');
    this.ground.scaleX = 2;

    this.physics.add.existing(this.ground, true);
  }

  update(): void { }
}
