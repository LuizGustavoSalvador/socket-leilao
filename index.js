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

io.on('connection', (socket) => {
  let countdown = 5;
  let timer;

  console.log('Novo cliente conectado');

  socket.on('startAuction', (id) => {
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
