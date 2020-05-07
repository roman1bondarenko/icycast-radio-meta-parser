const RadioParser = require('../src/radio-parser');

const urls = [
  'http://online.radioroks.ua/RadioROKS',
  'http://online.radioroks.ua/RadioROKS_HardnHeavy',
  'http://uk2.internet-radio.com/proxy/danceradiouk?mp=/stream',
];

urls.forEach((url, index) => {
  new RadioParser(url)
    .on('meta', (songName) => {
      console.log(index, songName);
    })
    .startListen();
});
