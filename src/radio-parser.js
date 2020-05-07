const http = require('http');
const EventEmitter = require('events').EventEmitter;
const RadioReader = require('./radio-stream-reader');

const OPTIONS = {
  headers: {
    'Icy-MetaData': '1',
  }
};

class RadioParser extends EventEmitter{
  constructor(url) {
    super();
    this.url = url;
  }

  startListen () {
    const req = http.request(this.url, OPTIONS, (res) => {
      const { statusCode } = res;
      if (statusCode !== 200) {
        console.log(`Error. Response status: ${statusCode}`);
        return;
      }
      const metaInt = Number.parseInt(res.headers['icy-metaint']);
      console.log('Headers:', res.headers);
      const radioReader = new RadioReader(metaInt);
      res
        .pipe(radioReader)
        .on('meta', (meta) => {
          this.emit('meta', meta);
        })
        .on('end', () => {
          this.emit('end');
        });
    });

    req.on('error', (e) => {
      console.error(`problem with request: ${e.message}`);
    });

    req.end();
  }
}

module.exports = RadioParser;
