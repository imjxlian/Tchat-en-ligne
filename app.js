
const { Socket } = require('socket.io');

const express = require('express');

const app = express();
const http = require('http').createServer(app);
const path = require('path');
const { expr } = require('jquery');
const port = 3000;

/**
 * @type {Socket}
 */
const io = require('socket.io')(http);

app.use('/css', express.static(__dirname + '/ressources/css'));
app.use('/bootstrap/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/bootstrap/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use('/jquery', express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

http.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});