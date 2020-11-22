import * as Phraser from 'phaser';
import { PLAYER_ANIMATIONS, INPUTS, EVENTS } from '../constants';
import { PlayerObjectParams } from '../types';

export class Player extends Phaser.Physics.Arcade.Sprite {
  private currentScene: Phraser.Scene
  private keys: Map<string, Phaser.Input.Keyboard.Key>  
  private isJumping: boolean;
  private isDying: boolean;
  private velocity: number;
  public isVulnerable: boolean;
  private vulnerableCounter: number;
  private hitCounter: number;
  public body: Phraser.Physics.Arcade.Body;

  static initAnimations(scene: Phaser.Scene): void {
    scene.anims.create({
      key: PLAYER_ANIMATIONS.RUN,
      frameRate: 8,
      repeat: -1,
      frames: scene.anims.generateFrameNumbers('player', {
        start: 6,
        end: 11
      })
    });

    scene.anims.create({
      key: PLAYER_ANIMATIONS.IDLE,
      frames: scene.anims.generateFrameNumbers('player', {
        frames: [0]
      })
    });

    scene.anims.create({
      key: PLAYER_ANIMATIONS.JUMP,
      frameRate: 8,
      repeat: -1,
      frames: scene.anims.generateFrameNumbers('player', {
        start: 12,
        end: 17
      })
    });

    scene.anims.create({
      key: PLAYER_ANIMATIONS.LAND,
      frameRate: 8,
      repeat: -1,
      frames: scene.anims.generateFrameNumbers('player', {
        start: 18,
        end: 23
      })
    });

    scene.anims.create({
      key: PLAYER_ANIMATIONS.DYING,
      frameRate: 8,
      repeat: -1,
      frames: scene.anims.generateFrameNumbers('player', {
        start: 24,
        end: 29
      })
    });
  }

  constructor(params: PlayerObjectParams) {
    super(params.scene, params.x, params.y, params.key, params.frame);

    this.currentScene = params.scene;
    this.vulnerableCounter = 100;
    this.hitCounter = 2;
    this.initSprite();
    this.currentScene.add.existing(this);
  }

  private initSprite() {
    this.velocity = 200;
    this.setOrigin(0.5, 0.5);
    this.setFlipX(false);

    this.keys = new Map([
      [INPUTS.LEFT, this.addKey(INPUTS.LEFT)],
      [INPUTS.RIGHT, this.addKey(INPUTS.RIGHT)],
      [INPUTS.DOWN, this.addKey(INPUTS.DOWN)],
      [INPUTS.JUMP, this.addKey(INPUTS.JUMP)]
    ]);

    this.currentScene.physics.world.enable(this);
    this.body.maxVelocity.x = this.velocity;
    this.body.maxVelocity.y = 400;
  }

  private addKey(key: string): Phaser.Input.Keyboard.Key {
    return this.currentScene.input.keyboard.addKey(key);
  }

  update(): void {
    this.handleInput();
    this.handleAnimations();
    this.checkAndUpdateVulnerability(); 
  }

  private checkAndUpdateVulnerability() {
    if (!this.isVulnerable) {
      if (this.vulnerableCounter > 0) {
        this.vulnerableCounter -= 1;
      } else {
        this.vulnerableCounter = 100;
        this.isVulnerable = true;
      }
    }
  }

  private handleInput() {
    if (
      this.body.onFloor() ||
      this.body.touching.down ||
      this.body.blocked.down
    ) {
      this.isJumping = false;
    }

    if (this.keys.get(INPUTS.RIGHT)?.isDown) {
      this.body.velocity.x = this.velocity;
      this.setFlipX(false);
    } else if (this.keys.get(INPUTS.LEFT)?.isDown) {
      this.body.velocity.x = -this.velocity;
      this.setFlipX(true);
    } else {
      this.body.setVelocityX(0);
      this.body.setAccelerationX(0);
    }

    if (this.keys.get(INPUTS.JUMP)?.isDown && !this.isJumping) {
      this.body.setVelocityY(-400);
      this.isJumping = true;
    }
  }

  private handleAnimations() {
    if (this.isDying) {
      this.anims.play(PLAYER_ANIMATIONS.DYING, true);
      return;
    }

    if (this.body.velocity.y !== 0) {
      if (this.body.velocity.y > 0) {
        this.anims.play(PLAYER_ANIMATIONS.LAND, true);
      } else {
        this.anims.play(PLAYER_ANIMATIONS.JUMP, true);
      }
    } else if (this.body.velocity.x !== 0) {
      if (this.body.velocity.x > 0) {
        this.anims.play(PLAYER_ANIMATIONS.RUN, true);
      } else {
        this.anims.play(PLAYER_ANIMATIONS.RUN, true);
      }
    } else {
      this.setFrame(0);
    }
  }

  public bounceUpAfterHitEnemyOnHead(): void {
    this.currentScene.add.tween({
      targets: this,
      props: { y: this.y - 50 },
      duration: 450,
      ease: 'Power1',
      yoyo: true
    });
  }

  public gotHit({ onDie }: any): void {
    this.isVulnerable = false;

    if (this.hitCounter === 0) {
      // const livesLeft = this.currentScene.registry.get(REGISTRY_KEYS.LIVES);
      // console.log(livesLeft);
      this.isDying = true;
      this.currentScene.events.emit(EVENTS.DECREASE_LIVES);
      this.hitCounter = 2;
      this.scene.sound.play('lose');

      this.body.setVelocityY(-180);
      this.body.checkCollision.up = false;
      this.body.checkCollision.down = false;
      this.body.checkCollision.left = false;
      this.body.checkCollision.right = false;

      onDie();
    } else {
      this.hitCounter -= 1;
      this.scene.sound.play('hit');
    }
    // sets acceleration, velocity and speed to zero
    // stop all animations
    // this.body.stop();
    // this.anims.stop();
  }
}
