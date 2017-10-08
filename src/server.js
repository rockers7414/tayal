const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');

const api = require('./v1/api');
const artist = require('./v1/artist');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/v1', api);
app.use('/api/v1/artists', artist);

const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);
server.listen(port, () => console.log(`API running on localhost:${port}`));
