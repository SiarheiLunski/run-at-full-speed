import * as Phraser from 'phaser';
import { EVENTS, ENEMY_ANIMATIONS } from '../constants';
import { EnemyObjectParams } from '../types';

export class Enemy extends Phraser.GameObjects.Sprite {
  private currentScene: Phraser.Scene
  private speed: number;
  public isDying: boolean;
  private dyingScoreValue: number;
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

    this.dyingScoreValue = 10;
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

  protected showAndAddScore(): void {
    this.scene.sound.play('score');
    this.currentScene.events.emit(EVENTS.UPDATE_SCORE, this.dyingScoreValue);
  }

  public gotHitOnHead(): void {
    this.isDying = true;
    this.showAndAddScore();
    this.body.setVelocityY(-180);
    this.body.checkCollision.up = false;
    this.body.checkCollision.down = false;
    this.body.checkCollision.left = false;
    this.body.checkCollision.right = false;
    setTimeout(() => {
      this.destroy();
    }, 1000);
  }
}
