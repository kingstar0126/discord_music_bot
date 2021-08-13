const fs = require('fs');
const path = require('path');
const { shuffle } = require('../common/settings');
const { shuffleArray } = require('../common/utils');
const MissingArgumentError = require('./errors/MissingArgumentError');
const LocalProvider = require('../classes/providers/LocalProvider');

class Queue {
  constructor(queueFilename, localMusicDirectory) {
    if (!queueFilename) {
      throw new MissingArgumentError('queueFilename is required!');
    }

    const queueFromFile = fs.readFileSync(queueFilename).toString().split('\n')
      .filter((url) => url.startsWith('https://') || url.startsWith('http://'));
    const localMusicQueue = fs.readdirSync(localMusicDirectory).reduce((queue, file) => {
      if (LocalProvider.isFileSupported(file)) {
        queue.push(`local:${path.join(localMusicDirectory, file)}`);
      }
      return queue;
    }, []);

    this.queue = [...queueFromFile, ...localMusicQueue];

    if (this.queue.length < 1) {
      throw new Error('Queue is empty! Please add music to the queue file or to the local music folder before starting the bot.');
    }

    if (shuffle) {
      shuffleArray(this.queue);
    }

    this.index = 0;
  }

  getNext() {
    if (this.index >= this.queue.length) {
      this.index = 0;
    }

    return this.queue[this.index++];
  }
}

module.exports = Queue;
