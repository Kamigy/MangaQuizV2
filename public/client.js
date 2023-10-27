document.addEventListener('DOMContentLoaded', function() {
    
    const registerButton = document.getElementById('registerButton');
    const usernameInput = document.getElementById('usernameInput');
    const passwordInput = document.getElementById('passwordInput');
    const emailInput = document.getElementById('emailInput');
    
    const loginButton = document.getElementById('loginButton');
    const usernameLogin = document.getElementById('usernameLogin')
    const pwdLogin = document.getElementById('pwdLogin');

    loginButton.addEventListener('click', function(event){
        event.preventDefault();

        const userData = {
            username: usernameLogin.value,
            password: pwdLogin.value
        };

        fetch('http://localhost:3000/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message);
            } else {
                console.error('Erreur lors de la connexion');
            }
        })
        .catch(error => {
            console.error('Erreur lors de la soumission du formulaire de connexion:', error);
        });
    })
    registerButton.addEventListener('click', function(event) {
        event.preventDefault();

        const userData = {
            username: usernameInput.value,
            password: passwordInput.value,
            email: emailInput.value
        };

        fetch('http://localhost:3000/users/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message);
            } else {
                console.error('Erreur lors de l\'inscription');
            }
        })
        .catch(error => {
            console.error('Erreur lors de la soumission du formulaire d\'inscription:', error);
        });
    });
});
