const socket = io();

socket.on('connect', () => {
    console.log('entered')
});

socket.on('newQuestion', (data) => {
    displayQuestion(data);
    console.log(data)
});

function displayQuestion(data) {
    const questionElement = document.getElementById('question');
    const optionsContainer = document.getElementById('options-container');

    questionElement.textContent = data.question;
    optionsContainer.innerHTML = '';

    console.log(data.question)

    data.options.forEach((option, index) => {
        const optionButton = document.createElement('button');
        optionButton.textContent = option;
        optionButton.addEventListener('click', () => {
            submitAnswer(data._id, index);
        });
        optionsContainer.appendChild(optionButton);
    });
}

function submitAnswer(questionId, selectedOption) {
    socket.emit('submitAnswer', { questionId, selectedOption });
}

socket.on('quizEnded', (data) => {
    const { finalScores } = data;
    
    // Afficher les résultats
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.innerHTML = '<h2>Résultats du Quiz</h2>';

    finalScores.forEach((result, index) => {
        const scoreElement = document.createElement('p');
        scoreElement.innerHTML = `Place ${index + 1}: User ID ${result.userId} - Score: ${result.score}`;
        resultsContainer.appendChild(scoreElement);
    });

    // Ajouter bouton pour relancer
});
