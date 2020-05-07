const Transform = require('stream').Transform;

class RadioStreamReader extends Transform {
  constructor(metaInt) {
    super();
    this.buffer = [];
    this.metaInt = metaInt;
    this.chunkSizeWithMetaData = metaInt * 2;
  }

  _write(chunk, encoding, next) {
    this.buffer.push(...chunk);
    if (this.buffer.length > this.chunkSizeWithMetaData) {
      const songTitle = parseMeta(this.buffer, this.metaInt);
      if (songTitle) {
        this.emit('meta', songTitle);
      }
    }
    next();
  }
}

const parseMeta = (buffer, metaInt) => {
  // remove bytes with audio
  buffer.splice(0, metaInt);

  // This byte will equal the metadata "length / 16"
  const firstByteWithLength = buffer.shift();
  // Multiply by 16 to get the actual metadata length.
  const metaLength = firstByteWithLength * 16;

  if (metaLength !== 0) {
    const metaBytes = buffer.splice(0, metaLength);
    return Buffer
      .from(metaBytes)
      .toString('utf8')
      .match(/'([^']+)'/)[1]
  }
  return null;
};

module.exports = RadioStreamReader;
