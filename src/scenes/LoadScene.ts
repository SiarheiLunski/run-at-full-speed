import * as Phraser from 'phaser';
import { SCENES } from '../constants';
import images from '../../public/assets/images/*.png';
import audio from '../../public/assets/audio/*.mp3';

console.log(audio);
console.log(images);
export class LoadScene extends Phraser.Scene {
  constructor() {
    super({
      key: SCENES.LOAD
    });
  }

  preload(): void {
    this.load.image('background', images.background);
    this.load.image('ground', images.ground);
    this.load.image('start_button', images.start);
    this.load.image('player', images.player);
    this.load.image('enemy', images.enemy);
    this.load.audio('bg_music', audio.peremen);

    const loadingBar = this.add.graphics({
      y: -3,
      fillStyle: {
        color: 0xFF0000
      }
    });

    this.load.on('progress', (percent: number) => {
      loadingBar.fillRect(0, this.game.renderer.height / 2, this.game.renderer.width * percent, 3);
    });

    this.load.on('complete', () => {
      this.scene.start(SCENES.MENU);
    });
  }
}
