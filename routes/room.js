const express = require('express');
const router = express.Router();
const Room = require('../models/Room');

// Fonction pour générer un code de room unique
function generateUniqueCode() {
    return Math.random().toString(36).substr(2, 6).toUpperCase();
}

// Route pour créer une room
router.post('/create', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Vous devez être connecté pour créer un salon.' });
    }

    try {
        const roomCode = generateUniqueCode();
        const newRoom = new Room({
            code: roomCode,
            host: req.session.user.id,
            participants: [], 
        });

        await newRoom.save();
        res.status(201).json({ message: 'Salon créé avec succès!', roomCode: roomCode });
    } catch (error) {
        console.error('Erreur lors de la création d\'un salon:', error);
        res.status(500).json({ message: "Erreur interne du serveur." });
    }
});

router.get('/:roomCode', (req, res) => {
    const roomCode = req.params.roomCode;
    const userId = req.session.user.username || 'Utilisateur anonyme'; 
    res.render('room', { roomCode, userId });
});

router.post('/join', async (req, res) => {
    const { roomCode } = req.body; 

    if (!req.session.user) {
        return res.status(401).json({ message: 'Vous devez être connecté pour rejoindre un salon.' });
    }

    try {
        const room = await Room.findOne({ code: roomCode });
        if (!room) {
            return res.status(404).json({ message: 'Salon non trouvé.' });
        }
        room.participants.push(req.session.user.id);
        await room.save();

        res.json({ message: 'Vous avez rejoint le salon avec succès!', roomCode: room.code });
    } catch (error) {
        console.error('Erreur lors de la tentative de rejoindre le salon:', error);
        res.status(500).json({ message: "Erreur interne du serveur." });
    }
});
module.exports = router;
