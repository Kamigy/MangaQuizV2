const express = require('express');
const router = express.Router();
const User = require('../models/Users');
const bcrypt = require('bcrypt');

router.post('/signup', async (req, res) => {
    const { username,email, password} = req.body;

    // Vérifier si l'utilisateur existe déjà en fonction de l'username
    const existingUser = await User.findOne({ username });

    if (existingUser) {
        return res.status(400).send('L\'utilisateur existe déjà');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        username,
        email,
        password: hashedPassword,
        score: 0
    });

    user.save()
        .then(() => res.send('Inscription réussie'))
        .catch(err => res.status(500).send(err.message));
        
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(400).send('Nom d\'utilisateur ou mot de passe incorrect');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).send('Nom d\'utilisateur ou mot de passe incorrect');
    }

    if (isMatch) {
        req.session.user = { id: user._id, username: user.username };
        return res.send({ message: 'Connexion réussie', isAuthenticated: true });
    } 

});

router.get('/check-authentication', (req, res) => {
    if (req.session && req.session.user) {
        res.json({ isAuthenticated: true });
    } else {
        res.json({ isAuthenticated: false });
    }
});


router.get('/logout', (req, res) => {
    req.session.destroy();
    res.send({ message: 'Déconnecté avec succès', isAuthenticated: false });
});

module.exports = router;
