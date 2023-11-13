const socketIo = require('socket.io');

module.exports = function(server) {
    const io = socketIo(server);

    let rooms = {}; // Assurez-vous que cette variable est accessible dans les événements

    io.on('connection', (socket) => {
        console.log('Nouvel utilisateur connecté:', socket.id);

        // Événement pour créer une salle
        socket.on('createRoom', (data) => {
            // Création d'une nouvelle salle
            const roomId = data.roomId;
            rooms[roomId] = { users: [socket.id] };
            socket.join(roomId);
        });

        // Événement pour rejoindre une salle
        socket.on('joinRoom', ({ roomId, userId }) => {
            socket.join(roomId);
            const newUser = { id: socket.id, name: userId };
            if (!rooms[roomId]) {
                rooms[roomId] = { users: [newUser] };
            } else {
                rooms[roomId].users.push(newUser);
            }
            io.to(roomId).emit('roomUsers', { roomId: roomId, users: rooms[roomId].users });
        });

        // Réception d'un message de chat
        socket.on('chatMessage', ({ userId, message }) => {
            const userName = userId;
            io.emit('chatMessage', { userName, message }); 
        });

        // Événement pour la déconnexion et la supréssion de son nom du salon
        socket.on('disconnect', () => {
            console.log('Utilisateur déconnecté:', socket.id);
            for (const [roomCode, room] of Object.entries(rooms)) {
                const userIndex = room.users.findIndex(user => user.id === socket.id);
                if (userIndex !== -1) {
                    room.users.splice(userIndex, 1);
                    io.to(roomCode).emit('userDisconnected', { userId: socket.id });
                    break;
                }
            }
        });
        socket.emit('updateRoom', { roomCode: 'ROOMCODE', participants: ['Utilisateur1', 'Utilisateur2'] });
    });
};
