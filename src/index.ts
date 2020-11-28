import * as Phaser from 'phaser';
import { LoadScene } from './scenes/LoadScene';
import { MenuScene } from './scenes/MenuScene';
import { HUDScene } from './scenes/HUDScene';
import { GameScene } from './scenes/GameScene';

const gameConfig: Phaser.Types.Core.GameConfig = {
  title: 'Run at Full Speed',
  width: 640,
  height: 360,
  backgroundColor: 0xffffff,
  scene: [LoadScene, MenuScene, HUDScene, GameScene],
  type: Phaser.AUTO,
  input: {
    keyboard: true
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 700 },
      debug: true
    }
  },
  render: { pixelArt: true, antialias: false }
};

export const game = new Phaser.Game(gameConfig);
