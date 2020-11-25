import * as Phraser from 'phaser';

const gameConfig: Phaser.Types.Core.GameConfig = {
  title: 'Run at Full Speed',
  width: 640,
  height: 360,
  backgroundColor: 0xffffff,
  scene: [],
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

export const game = new Phraser.Game(gameConfig);
