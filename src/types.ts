type GameObjectParams = {
  scene: Phaser.Scene,
  x: number,
  y: number,
  key: string,
  frame?: number,
}

export type PlayerObjectParams = GameObjectParams;

export type EnemyObjectParams = { speed: number } & GameObjectParams;
