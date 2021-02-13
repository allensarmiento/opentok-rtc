const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const roomRoutes = require('./routes/room.routes');
const config = require('./config');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use('/room', roomRoutes);

app.get('/credentials', (req, res) => {
  const { apiKey, apiSecret } = config.video;

  if (!apiKey || !apiSecret) {
    return res.status(500).send();
  }

  return res.json({ apiKey, apiSecret });
});

const port = 5000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`)
});
