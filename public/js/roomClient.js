const socket = io();

let selectedDifficulty;
let selectedGameMode;
const roomCodeDisplay = document.getElementById('roomCode');
const userList = document.getElementById('userList');
const chatInput = document.getElementById('chat-input');
const sendMessageButton = document.getElementById('send-message');
const chatMessages = document.getElementById('chat-messages');
const startQuizButton = document.getElementById('start-quiz-btn');
const difficultyButtons = document.querySelectorAll('.difficulty-btn');
let cards;

socket.on('connect', () => {
  // Envoyer l'ID de l'utilisateur au serveur lors de la connexion
  socket.emit('joinRoom', { roomId: roomCode, userId: userId });
});

socket.on('roomUsers', ({ roomId, users }) => {
  roomCodeDisplay.textContent = roomId;
  updateUserList(users);
});

socket.on('chatMessage', (data) => {
  const div = document.createElement('div');
  div.classList.add('chat-message');
  div.innerHTML = `<strong>${data.userName}:</strong> ${data.message}`;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

socket.on('userDisconnected', (data) => {
  const userElement = document.querySelector(`[data-user-id="${data.userId}"]`);
  if (userElement) {
    userElement.remove();
  }
});

function updateUserList(users) {
  userList.innerHTML = '';
  users.forEach(user => {
    const li = document.createElement('li');
    li.innerText = user.name;
    li.setAttribute('data-user-id', user.id);
    userList.appendChild(li);
  });
}

//Chatbox
function sendMessage() {
  const message = chatInput.value.trim();
  if (message) {
    // Envoyer l'ID de l'utilisateur avec le message
    socket.emit('chatMessage', { userId, message });
    chatInput.value = '';
    chatInput.focus();
  }
}

chatInput.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    sendMessage();
    chatInput.focus();
  }
});

sendMessageButton.addEventListener('click', sendMessage);

function startQuiz() {
  if (selectedDifficulty && selectedGameMode) {
    socket.emit('startQuiz', { roomCode, difficulty: selectedDifficulty, gameMode: selectedGameMode });
    document.getElementById('difficulty-selection').style.display = 'none';
    document.getElementById('game-mode-selection').style.display = 'none';
  } else {
    alert("Veuillez sélectionner un mode de jeu et une difficulté avant de commencer.");
  }
}

// Fonction pour gérer le clic sur une carte
function onCardClick(event) {
  cards.forEach(card => card.classList.remove('selected'));
  event.currentTarget.classList.add('selected');
  selectedGameMode = event.currentTarget.querySelector('.title').textContent.trim();
}

document.addEventListener('DOMContentLoaded', () => {

  difficultyButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      selectedDifficulty = event.target.dataset.difficulty;
      difficultyButtons.forEach(btn => btn.classList.remove('selected'));
      button.classList.add('selected');
    });
  });

  startQuizButton.addEventListener('click', startQuiz);

  // Attachez le gestionnaire de clic aux cartes de jeu
  cards = document.querySelectorAll('.card');
  cards.forEach(card => card.addEventListener('click', onCardClick));
});

socket.on('quizStarted', ({ gameMode , roomCode: roomCodeFromServer }) => {
  console.log(`Le jeu de ${gameMode} a commencé!`);
  const roomCode = new URLSearchParams(window.location.search).get('roomCode') || roomCodeFromServer;
  if (roomCode) {
    window.location.href = `/quiz/play?roomCode=${roomCode}`;
  } else {
    console.error('Room code is missing');
  }
});


socket.on('hostCheck', ({ isHost }) => {
  const difficultySelection = document.getElementById('difficulty-selection');
  const startQuizButton = document.getElementById('start-quiz-btn');

  // Affichez ou masquez les contrôles en fonction du statut d'hôte
  if (isHost) {
      if (difficultySelection) difficultySelection.style.display = 'flex';
      if (startQuizButton) startQuizButton.style.display = 'flex';
  } else {
      if (difficultySelection) difficultySelection.style.display = 'none';
      if (startQuizButton) startQuizButton.style.display = 'none';
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const startQuizButton = document.getElementById('start-quiz-btn');
  const roomId = new URLSearchParams(window.location.search).get('roomCode');

  if (startQuizButton) {
      startQuizButton.addEventListener('click', () => {
          const difficulty = selectedDifficulty;
          socket.emit('startQuiz', { roomCode: roomId, difficulty });
        });
  }
});
