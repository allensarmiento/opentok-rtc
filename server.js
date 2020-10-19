const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

app.use(express.static(path.resolve(__dirname, 'dist')));

app.get('/', function(req, res) {
  const pathToHtmlFile = path.resolve(__dirname, 'dist/landing.html');
  const contentFromFile = fs.readFileSync(pathToHtmlFile, 'utf-8');
  res.send(contentFromFile);
});

app.listen(3000, function() {
  console.log(`App listening on port ${3000}`);
});

