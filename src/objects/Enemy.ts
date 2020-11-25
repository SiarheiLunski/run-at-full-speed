import * as Phraser from 'phaser';
import { ENEMY_ANIMATIONS } from '../constants';
import { EnemyObjectParams } from '../types';

export class Enemy extends Phraser.GameObjects.Sprite {
  private currentScene: Phraser.Scene
  private speed: number;
  public body: Phraser.Physics.Arcade.Body;

  static initAnimations(scene: Phaser.Scene): void {
    scene.anims.create({
      key: ENEMY_ANIMATIONS.RUN,
      frameRate: 8,
      repeat: -1,
      frames: scene.anims.generateFrameNumbers('enemy', {
        start: 0,
        end: 5
      })
    });
  }

  constructor(params: EnemyObjectParams) {
    super(params.scene, params.x, params.y, params.key, params.frame);

    this.speed = params.speed;
    this.currentScene = params.scene;
    this.initSprite();
    this.currentScene.add.existing(this);
  }

  private initSprite() {
    this.setFlipX(true);
    this.currentScene.physics.world.enable(this);
    this.play(ENEMY_ANIMATIONS.RUN);
  }

  update(): void {
    this.body.setVelocityX(this.speed);
  }
}
