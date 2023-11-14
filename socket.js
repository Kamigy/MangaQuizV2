const socketIo = require('socket.io');

module.exports = function(server) {
    const io = socketIo(server);
    let rooms = {}; // Stocke les informations des salons

    io.on('connection', (socket) => {
        console.log('Nouvel utilisateur connecté:', socket.id);

        // Événement pour créer une salle
        socket.on('createRoom', (data) => {
            const roomId = data.roomId;
            // L'utilisateur qui crée la salle devient l'hôte
            rooms[roomId] = { hostId: socket.id, users: [{ id: socket.id, name: data.userId }] };
            socket.join(roomId);
            // Informer l'utilisateur qu'il est l'hôte
            socket.emit('hostCheck', { isHost: true });
        });

        // Événement pour rejoindre une salle
        socket.on('joinRoom', ({ roomId, userId }) => {
            socket.join(roomId);
            let isHost = false;
            const newUser = { id: socket.id, name: userId };
            // Si la salle n'existe pas ou si l'utilisateur est le premier, il devient l'hôte
            if (!rooms[roomId]) {
                rooms[roomId] = { hostId: socket.id, users: [newUser] };
                isHost = true;
                console.log(userId)
            } else {
                rooms[roomId].users.push(newUser);
                // Informer l'utilisateur qu'il n'est pas l'hôte
                socket.emit('hostCheck', { isHost });
            }
            // Informer tous les participants de la salle à jour
            io.to(roomId).emit('updateUserList', rooms[roomId].users);
        });

        // Événement pour démarrer le quiz
        socket.on('startQuiz', ({ roomCode, gameMode }) => {
            const room = rooms[roomCode];
            if (room && room.hostId === socket.id) {
                // Seul l'hôte peut démarrer le quiz
                io.to(roomCode).emit('quizStarted', { gameMode });
                // Initialisation du quiz ici...
            } else {
                socket.emit('error', { message: "Vous n'êtes pas autorisé à démarrer le quiz." });
            }
        });

        // Réception d'un message de chat
        socket.on('chatMessage', ({ userId, message }) => {
            const userName = userId; // Ici, vous devriez probablement chercher le nom de l'utilisateur par son ID
            io.emit('chatMessage', { userName, message }); 
        });

        // Événement pour la déconnexion et la suppression de l'utilisateur du salon
        socket.on('disconnect', () => {
            console.log('Utilisateur déconnecté:', socket.id);
            // Suppression de l'utilisateur des salles et notification des participants
            for (const [roomCode, room] of Object.entries(rooms)) {
                const userIndex = room.users.findIndex(user => user.id === socket.id);
                if (userIndex !== -1) {
                    room.users.splice(userIndex, 1);
                    io.to(roomCode).emit('userDisconnected', { userId: socket.id });
                    if (room.hostId === socket.id) {
                        if (room.users.length > 0) {
                            room.hostId = room.users[0].id;
                            io.to(room.users[0].id).emit('hostCheck', { isHost: true });
                        } else {
                            delete rooms[roomCode];
                        }
                    }
                    break;
                }
            }
        });
    });
};
