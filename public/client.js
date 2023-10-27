document.addEventListener('DOMContentLoaded', function() {
    
    const registerButton = document.getElementById('registerButton');
    const registerButtonF = document.getElementById('register-btn');
    const usernameInput = document.getElementById('usernameInput');
    const passwordInput = document.getElementById('passwordInput');
    const emailInput = document.getElementById('emailInput');
    
    const loginButton = document.getElementById('loginButton');
    const loginButtonF = document.getElementById('login-btn')
    const usernameLogin = document.getElementById('usernameLogin')
    const pwdLogin = document.getElementById('pwdLogin');

    const logoutButton = document.getElementById('logoutButton');
    
    const profileButton = document.getElementById('profileButton'); 

function updateUI(isAuthenticated) {
    if (isAuthenticated) {
        loginButtonF.style.display = 'none';
        registerButtonF.style.display = 'none';
        profileButton.style.display = 'block';
        logoutButton.style.display = 'block';
    } else {
        loginButtonF.style.display = 'block';
        registerButtonF.style.display = 'block';
        profileButton.style.display = 'none';
        logoutButton.style.display = 'none';
    }
}

fetch('http://localhost:3000/users/check-authentication') 
.then(response => response.json())
.then(data => {
    updateUI(data.isAuthenticated);
});
    
    logoutButton.addEventListener('click', function() {
        fetch('http://localhost:3000/users/logout')
        .then(response => response.json())
        .then(data => {
            if (data.message){
                alert(data.message);
            }
            updateUI(data.isAuthenticated);
        })
    });
    
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
            updateUI(data.isAuthenticated);
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
