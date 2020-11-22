import * as Phraser from 'phaser';
import { SCENES } from '../constants';
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
        speed: -(Math.random() * (100 - 50) + 50)
      }));
    }, 2000);

    this.physics.add.collider(this.ground, this.player);
    this.physics.add.collider(this.ground, this.enemies);
    // this.physics.add.collider(this.player, this.enemies, (player: any, enemy) => {
    // });

    this.physics.add.overlap(
      this.player,
      this.enemies,
      this.handlePlayerEnemyOverlap as any,
      undefined,
      this
    );
  }

  update(): void {
    this.player?.update();
  }
  
  private handlePlayerEnemyOverlap(player: Player, enemy: Enemy): void {
    if (player.body.touching.down && enemy.body.touching.up) {
      player.bounceUpAfterHitEnemyOnHead();
      enemy.gotHitOnHead();
    } else if (player.isVulnerable) {
      player.gotHit({
        onDie: () => {
          setTimeout(() => {
            this.scene.restart();
            window.clearInterval(this.spawnInterval);
          }, 1500);
        }
      });
    }
    // player got hit from the side or on the head
    // if (_player.isVulnerable) {
    // _player.gotHit();
    // }
  }
}
