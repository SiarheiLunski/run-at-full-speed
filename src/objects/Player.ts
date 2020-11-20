import * as Phraser from 'phaser';
import { PLAYER_ANIMATIONS } from '../constants';

export class Player extends Phaser.Physics.Arcade.Sprite {
  private currentScene: Phraser.Scene
  private keys: Map<string, Phaser.Input.Keyboard.Key>  
  private isJumping: boolean;
  private isDying: boolean;
  private velocity: number;

  public body: Phraser.Physics.Arcade.Body;

  constructor(params: any) {
    super(params.scene, params.x, params.y, params.key, params.frame);

    this.currentScene = params.scene;
    this.initSprite();
    this.currentScene.add.existing(this);
  }

  private initSprite() {
    this.velocity = 200;
    this.setOrigin(0.5, 0.5);
    this.setFlipX(false);

    this.currentScene.anims.create({
      key: PLAYER_ANIMATIONS.RUN,
      frameRate: 8,
      repeat: -1,
      frames: this.currentScene.anims.generateFrameNumbers('player', {
        start: 6,
        end: 11
      })
    });

    this.currentScene.anims.create({
      key: PLAYER_ANIMATIONS.IDLE,
      frames: this.currentScene.anims.generateFrameNumbers('player', {
        frames: [0]
      })
    });

    this.currentScene.anims.create({
      key: PLAYER_ANIMATIONS.JUMP,
      frameRate: 8,
      repeat: -1,
      frames: this.currentScene.anims.generateFrameNumbers('player', {
        start: 12,
        end: 17
      })
    });

    this.currentScene.anims.create({
      key: PLAYER_ANIMATIONS.LAND,
      frameRate: 8,
      repeat: -1,
      frames: this.currentScene.anims.generateFrameNumbers('player', {
        start: 18,
        end: 23
      })
    });

    this.keys = new Map([
      ['LEFT', this.addKey('LEFT')],
      ['RIGHT', this.addKey('RIGHT')],
      ['DOWN', this.addKey('DOWN')],
      ['JUMP', this.addKey('UP')]
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
  }

  private handleInput() {
    if (
      this.body.onFloor() ||
      this.body.touching.down ||
      this.body.blocked.down
    ) {
      this.isJumping = false;
    }

    if (this.keys.get('RIGHT')?.isDown) {
      this.body.velocity.x = this.velocity;
      this.setFlipX(false);
    } else if (this.keys.get('LEFT')?.isDown) {
      this.body.velocity.x = -this.velocity;
      this.setFlipX(true);
    } else {
      this.body.setVelocityX(0);
      this.body.setAccelerationX(0);
    }

    if (this.keys.get('JUMP')?.isDown && !this.isJumping) {
      this.body.setVelocityY(-400);
      this.isJumping = true;
    }
  }

  private handleAnimations() {
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

  private bounceUpAfterHitEnemyOnHead(): void {
    this.currentScene.add.tween({
      targets: this,
      props: { y: this.y - 50 },
      duration: 450,
      ease: 'Power1',
      yoyo: true
    });
  }

  protected gotHit(): void {
    this.isDying = true;

    // sets acceleration, velocity and speed to zero
    // stop all animations
    this.body.stop();
    this.anims.stop();

    // make last dead jump and turn off collision check
    this.body.setVelocityY(-180);

    // this.body.checkCollision.none did not work for me
    this.body.checkCollision.up = false;
    this.body.checkCollision.down = false;
    this.body.checkCollision.left = false;
    this.body.checkCollision.right = false;
  }
}
