const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const routes = require('./src/routes/routes');

const PORT = 3030;
const HOST = '0.0.0.0';

app.use(express.static(__dirname + '/assets'));
app.use(routes);

// Array para armazenar as ofertas dos leilões
const bids = [];

// Configuração do socket.io
io.on('connection', (socket) => {
  console.log('Novo cliente conectado');

  // Evento para o cliente enviar uma oferta
  socket.on('bid', (bid) => {
    console.log('Nova oferta recebida:', bid);
    bids.push(bid);

    // Emitir a nova oferta para todos os clientes conectados
    io.emit('newBid', bid);
  });

  // Evento para obter as ofertas atuais
  socket.on('getBids', () => {
    socket.emit('currentBids', bids);
  });

  // Evento quando o cliente é desconectado
  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});