const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = 3030;
const HOST = '0.0.0.0';

app.use(cors());
app.use(cookieParser());
app.use(routes);

server.listen(PORT, HOST, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});