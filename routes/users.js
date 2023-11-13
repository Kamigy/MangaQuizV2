const express = require('express');
const router = express.Router();
const User = require('../models/Users');
const bcrypt = require('bcrypt');

router.post('/signup', async (req, res) => {
    const { username,email, password} = req.body;

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

router.get('/test-session', (req, res) => {
    if (req.session) {
        res.json({ session: req.session });
    } else {
        res.status(500).json({ message: "La session n'existe pas." });
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
    req.session.destroy((err) => {
        if (err) {
            console.error('Erreur lors de la destruction de la session:', err);
            res.status(500).send('Erreur lors de la déconnexion');
        } else {
            res.send({ message: 'Déconnecté avec succès', isAuthenticated: false });
        }
    });
});


module.exports = router;
