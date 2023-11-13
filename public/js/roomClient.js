const socket = io();

socket.on('connect', () => {
  socket.emit('joinRoom', { roomId: roomCode, userId: userId });
});

socket.on('roomUsers', ({ roomId, users }) => {
  const roomCodeDisplay = document.getElementById('roomCode');
  const userList = document.getElementById('userList');

  roomCodeDisplay.textContent = roomId; // Affiche le code de la salle
  userList.innerHTML = ''; 
  users.forEach(user => {
    const li = document.createElement('li');
    li.innerText = user.name;
    li.setAttribute('data-user-id', user.id);
    userList.appendChild(li);
  });
});

socket.on('updateRoom', (data) => {
  const roomCodeDisplay = document.getElementById('roomCode');
  const participantList = document.getElementById('userList');

  roomCodeDisplay.textContent = data.roomCode;
  participantList.innerHTML = '';
  data.participants.forEach((participant) => {
      const li = document.createElement('li');
      li.textContent = participant;
      participantList.appendChild(li);
  });
});

const chatInput = document.getElementById('chat-input');
const sendMessageButton = document.getElementById('send-message');
const chatMessages = document.getElementById('chat-messages');

sendMessageButton.addEventListener('click', function() {
    console.log('message reçu')
    const message = chatInput.value.trim();
    if(message) {
        socket.emit('chatMessage', { userId, message });
        chatInput.value = '';
        chatInput.focus();
    }
});

socket.on('userDisconnected', (data) => {
  const userElement = document.querySelector(`[data-user-id="${data.userId}"]`);
  if (userElement) {
      userElement.remove(); 
  }
});

socket.on('chatMessage', (data) => {
    const div = document.createElement('div');
    div.classList.add('chat-message');
    div.innerHTML = `<strong>${data.userName}:</strong> ${data.message}`;
    chatMessages.appendChild(div);

    chatMessages.scrollTop = chatMessages.scrollHeight;
});