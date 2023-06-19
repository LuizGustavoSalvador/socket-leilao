const socket = io();

    // Enviar uma oferta quando o formulário for enviado
    document.getElementById('bidForm').addEventListener('submit', (event) => {
      event.preventDefault();
      const bidAmount = document.getElementById('bidAmount').value;
      socket.emit('bid', bidAmount);
    });

    // Atualizar a lista de ofertas quando uma nova oferta for recebida
    socket.on('newBid', (bid) => {
      const bidList = document.getElementById('bids');
      const li = document.createElement('li');
      li.textContent = bid;
      bidList.appendChild(li);
    });

    // Obter as ofertas atuais quando a página for carregada
    socket.emit('getBids');
    socket.on('currentBids', (bids) => {
      const bidList = document.getElementById('bids');
      bids.forEach((bid) => {
        const li = document.createElement('li');
        li.textContent = bid;
        bidList.appendChild(li);
      });
    });