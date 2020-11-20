import * as Phraser from 'phaser';
import { SCENES } from '../constants';

import images from '../../public/assets/images/*.png';
import audio from '../../public/assets/audio/*.mp3';
import spritesheets from '../../public/assets/spritesheets/*.png';

export class LoadScene extends Phraser.Scene {
  constructor() {
    super({
      key: SCENES.LOAD
    });
  }

  preload(): void {
    /* Load all images from /assets/images */
    Object.entries(images).forEach(([name, filePath]) => {
      this.load.image(name, filePath as string);
    });

    /* Load all audio from /assets/audio */
    Object.entries(audio).forEach(([name, filePath]) => {
      this.load.audio(name, filePath as string);
    });

    /* Load all spritesheets from /assets/spritesheets */
    this.load.spritesheet('player', spritesheets.player as string, {
      frameWidth: 60,
      frameHeight: 60
    });
    this.load.spritesheet('enemy', spritesheets.enemy as string, {
      frameWidth: 40,
      frameHeight: 70
    });

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
