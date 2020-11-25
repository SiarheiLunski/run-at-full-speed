import * as Phraser from 'phaser';
import { SCENES, MAX_ENEMY_SPEED, MIN_ENEMY_SPEED } from '../constants';
import { Player } from '../objects/Player';
import { Enemy } from '../objects/Enemy';

export class GameScene extends Phraser.Scene {
  private player: Player;
  private ground: Phaser.GameObjects.Sprite;
  private enemies: Phaser.GameObjects.Group;
  public spawnInterval: number;

  constructor() {
    super({ key: SCENES.GAME });
  }

  init(): void {
    Player.initAnimations(this);
    Enemy.initAnimations(this);
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

    this.enemies = this.add.group({ runChildUpdate: true });

    this.spawnInterval = window.setInterval(() => {
      this.enemies.add(new Enemy({
        scene: this,
        x: 800, 
        y: 310, 
        key: 'enemy',
        speed: -(Math.random() * (MAX_ENEMY_SPEED - MIN_ENEMY_SPEED) + MIN_ENEMY_SPEED)
      }));
    }, 1500);

    this.physics.add.collider(this.ground, this.player);
    this.physics.add.collider(this.ground, this.enemies);
  }

  update(): void {
    this.player?.update();
  }
}
