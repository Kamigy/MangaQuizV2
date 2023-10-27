const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let rooms = {};

io.on('connection', (socket) => {
    console.log('Nouvel utilisateur connecté:', socket.id);
    
    socket.on('createRoom', (data) => {
        // Création d'une nouvelle salle
        const roomId = data.roomId;
        rooms[roomId] = {users: [socket.id]};
        socket.join(roomId);
    });

    socket.on('joinRoom', (data) => {
        const roomId = data.roomId;

        if (rooms[roomId]) {
            rooms[roomId].users.push(socket.id);
            socket.join(roomId);
        } else {
            // Traitez l'erreur ici (par exemple, si la salle n'existe pas)
        }
    });
    
    socket.on('disconnect', () => {
        console.log('Utilisateur déconnecté:', socket.id);
    });
});


