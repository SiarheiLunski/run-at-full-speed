import * as Phraser from 'phaser';
import { PLAYER_ANIMATIONS } from '../constants';

export class Player extends Phaser.Physics.Arcade.Sprite {
  private currentScene: Phraser.Scene
  private keys: Map<string, Phaser.Input.Keyboard.Key>  
  private isJumping: boolean;
  private isDying: boolean;

  public body: Phraser.Physics.Arcade.Body;

  constructor(params: any) {
    super(params.scene, params.x, params.y, params.key, params.frame);

    this.currentScene = params.scene;
    this.initSprite();
    this.currentScene.add.existing(this);
  }

  private initSprite() {
    this.scale = 0.5;
    this.setOrigin(0.5, 0.5);
    this.setFlipX(false);

    this.currentScene.anims.create({
      key: PLAYER_ANIMATIONS.RUN,
      frameRate: 8,
      repeat: -1,
      frames: this.currentScene.anims.generateFrameNumbers('player', {
        frames: [6,7,8,9,10,11]
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
        frames: [12,13,14,15,16,17]
      })
    });

    this.currentScene.anims.create({
      key: PLAYER_ANIMATIONS.LAND,
      frameRate: 8,
      repeat: -1,
      frames: this.currentScene.anims.generateFrameNumbers('player', {
        frames: [18,19,20,21,22,23]
      })
    });

    this.keys = new Map([
      ['LEFT', this.addKey('LEFT')],
      ['RIGHT', this.addKey('RIGHT')],
      ['DOWN', this.addKey('DOWN')],
      ['JUMP', this.addKey('UP')]
    ]);

    this.currentScene.physics.world.enable(this);
    this.body.maxVelocity.x = 50;
    this.body.maxVelocity.y = 300;
  }

  private addKey(key: string): Phaser.Input.Keyboard.Key {
    return this.currentScene.input.keyboard.addKey(key);
  }

  update(time: number, delta: number): void {
    this.handleInput(delta);
  }

  private handleInput(delta: number) {
    if (
      this.body.onFloor() ||
      this.body.touching.down ||
      this.body.blocked.down
    ) {
      this.isJumping = false;
    }

    if (this.keys.get('RIGHT')?.isDown) {
      this.x += 128 * (delta / 1000);
      this.setFlipX(false);
      this.play(PLAYER_ANIMATIONS.RUN);
    } else if (this.keys.get('LEFT')?.isDown) {
      this.x -= 128 * (delta / 1000);
      this.setFlipX(true);
      this.play(PLAYER_ANIMATIONS.RUN);
    }

    if (this.keys.get('JUMP')?.isDown && !this.isJumping) {
      this.body.setVelocityY(-300);
      this.isJumping = true;
      this.play(PLAYER_ANIMATIONS.JUMP);
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
