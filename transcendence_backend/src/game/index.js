const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const initSocket = require('./socket');


app.use(cors());
app.use(express.json());

const server = http.createServer(app);
initSocket(server);

server.listen(3001, '0.0.0.0', () => {
  console.log("Server listening on port 3001");
});
