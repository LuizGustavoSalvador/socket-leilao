window.onload = function () {
  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  const socket = io();

  // Enviar uma oferta quando o formulário for enviado
  document.querySelector("#offer-form").addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('vehicleId').value;
    const amount = document.getElementById('bidAmount').value;
    const offer = {
      "id": id,
      "amount": amount,
    }
    socket.emit('offer', offer);
  });

  // Atualizar a lista de ofertas quando uma nova oferta for recebida
  socket.on('newBid', (bid) => {
    const bidList = document.getElementById('offers');
    const p = document.createElement('p');
    p.textContent = "Nova oferta de: " + formatter.format(bid);
    bidList.appendChild(p);
  });

  // Obter as ofertas atuais quando a página for carregada
  socket.emit('getOffers', document.getElementById('vehicleId').value);
  socket.on('currentBids', (offers) => {
    const offerList = document.getElementById('offers');
    offers.forEach((offer) => {
      const p = document.createElement('p');
      p.setAttribute('id', "offer"+offer.id);
      p.textContent = "Nova oferta de: " + formatter.format(offer.offer);
      offerList.appendChild(p);
    });
  });

  // Iniciar o leilão
  socket.emit('startAuction', document.getElementById('vehicleId').value);
  });
};
