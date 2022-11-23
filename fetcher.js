const request = require('request');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const args = process.argv.slice(2);
const url = args[0];
const localFile = args[1];

const requestFile = (location, destination, callback) => {
  request(url, (error, response, body) => {
    console.log(`Attempting to download content from ${url}...`);
    callback(body, localFile, false);
  });
};

const createFile = (content, destination, overwrite = false) => {
  fs.readFile(destination, 'utf8', (err, data) => {
    if (err || overwrite) {
      fs.writeFile(localFile, content, err => {
        if (err) {
          console.error(err);
        }
        return console.log(`Downloaded and saved ${content.length} bytes to ${destination}`);
      });
      return;
    }
    rl.question(`Target destination (${destination}) already exists, overwrite? (y/n) `, (answer) => {
      if (answer === 'y') {
        createFile(content, destination, true);
      } else {
        console.log(`Request aborted.`);
        rl.close();
      }
    });
  });
  return;
};

requestFile(url, localFile, createFile);