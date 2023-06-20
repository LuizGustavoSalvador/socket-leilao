const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const routes = require('./src/routes/routes');
const uuid = require("uuid");
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = 3030;
const HOST = '0.0.0.0';

app.use(express.static(__dirname + '/assets'));
app.use(routes);

let auctionTime = 5; // Tempo inicial do leilão em segundos
let timer; // Referência para o temporizador

// Configuração do socket.io
io.on('connection', (socket) => {
  console.log('Novo cliente conectado');

  // começa o leilão
  socket.on('startAuction', () => {
    if (!timer) {
      timer = setInterval(() => {
        auctionTime--;
        if (auctionTime < 0) {
          let winner = JSON.parse(fs.readFileSync('./src/data/offer.json', 'utf-8')).reduce((max, o) => {
            if (o.offer > max) {
              return o.id;
            } else {
              return max;
            }
          }, 0);
          clearInterval(timer);
          timer = null;
          io.emit('auctionEnd', winner);
        } else {
          io.emit('timer', auctionTime);
        }
      }, 1000);
    }
  });

  // Evento para o cliente enviar uma oferta
  socket.on('offer', (offer) => {
    const { id, amount } = offer;
    let offers = JSON.parse(fs.readFileSync('./src/data/offer.json', 'utf-8'));

    offers.push({
      "id": uuid.v1(),
      "id_vehicle": id,
      "offer": amount,
    });

    fs.writeFileSync("./src/data/offer.json", JSON.stringify(offers), { encoding: "utf-8" });

    // Emitir a nova oferta para todos os clientes conectados
    io.emit('newBid', amount);
  });

  // Evento para obter as ofertas atuais
  socket.on('getOffers', (id) => {
    let offers = JSON.parse(fs.readFileSync('./src/data/offer.json', 'utf-8')).filter((o) => o.id_vehicle === id);

    socket.emit('currentBids', offers);
  });

  // Evento quando o cliente é desconectado
  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});


server.listen(PORT, HOST, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});