import * as Phraser from 'phaser';
import { SCENES } from '../constants';
import { Player } from '../objects/Player';

export class GameScene extends Phraser.Scene {
  private player: Player;
  private ground: Phaser.GameObjects.Sprite;
  public spawnInterval: number;

  constructor() {
    super({ key: SCENES.GAME });
  }

  init(): void {
    Player.initAnimations(this);
  }

  create(): void {
    this.add.image(0, 0, 'background').setOrigin(0, 0);
    this.ground = this.add.sprite(320, 351, 'ground');
    this.ground.scaleX = 2;

    this.physics.add.existing(this.ground, true);

    this.player = new Player({
      scene: this,
      x: 100,
      y: 300,
      key: 'player'
    });

    this.physics.add.collider(this.ground, this.player);
  }

  update(): void {
    this.player?.update();
  }
}
