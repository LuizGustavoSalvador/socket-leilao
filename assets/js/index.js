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

  // Iniciar o leilão e o temporizador
  socket.emit('startAuction', document.getElementById('vehicleId').value);
  socket.on('timer', (seconds) => {
    document.getElementById('timer').textContent = `Tempo restante: ${seconds}s`;

    if (seconds < 1) {
      document.querySelector("#offer-form #bidAmount").setAttribute('disabled', true);
      document.querySelector("#offer-form button").setAttribute('disabled', true);
    }
  });
  
  socket.on('auctionEnd', (winner) => {
    document.querySelector("#offers").classList.add('end');
    document.querySelector("#offers #offer" + winner.id).classList.add('winner');
  });

  document.getElementById('restartButton').addEventListener('click', function() {
    restartAuction();
  });
  
  function restartAuction() {
    fetch('/restart', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "vehicle": document.getElementById('vehicleId').value
      }),
    })
    .then(response => response)
    .then(data => {
      console.log(data.message);
      location.reload();
    })
    .catch(error => {
      console.error('Erro ao reiniciar o leilão:', error);
    });
  }
};