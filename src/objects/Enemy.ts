import * as Phraser from 'phaser';
import { REGISTRY_KEYS } from '../constants';
export class Enemy extends Phraser.GameObjects.Sprite {
  private currentScene: Phraser.Scene
  private speed: number;
  private isDying: boolean;
  private dyingScoreValue: number;
  public body: Phraser.Physics.Arcade.Body;

  constructor(params: any) {
    super(params.scene, params.x, params.y, params.key, params.frame);

    this.dyingScoreValue = 10;
    this.speed = params.speed;
    this.currentScene = params.scene;
    this.initSprite();
    this.currentScene.add.existing(this);
  }

  private initSprite() {
    this.currentScene.anims.create({
      key: 'enemy_run',
      frameRate: 8,
      repeat: -1,
      frames: this.currentScene.anims.generateFrameNumbers('enemy', {
        start: 0,
        end: 5
      })
    });

    this.setFlipX(true);
    this.currentScene.physics.world.enable(this);

    this.play('enemy_run');
  }

  update(): void {
    this.body.setVelocityX(this.speed);
  }

  protected showAndAddScore(): void {
    this.scene.sound.play('score');
    this.currentScene.registry.values[REGISTRY_KEYS.SCORE] += this.dyingScoreValue;
    this.currentScene.events.emit('scoreChanged');
  }

  protected gotHitOnHead(): void {
    this.isDying = true;
    // this.setFrame(2);
    this.showAndAddScore();
  }

  protected isDead(): void {
    this.destroy();
  }
}
