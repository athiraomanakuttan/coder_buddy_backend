import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';

const configureSocket = (server: HttpServer) => {
    const io = new Server(server, {
        cors: { origin: "*", methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'] }, 
    });

    const rooms = new Map<string, Set<string>>();

    io.on('connection', (socket) => {

        // ** Room Joining Logic **
        socket.on('join-room', ({ roomId }) => {
            if (!rooms.has(roomId)) {
                rooms.set(roomId, new Set());
            }
            const room = rooms.get(roomId)!;

            // Optional: Limit room to 2 participants
            if (room.size >= 2) {
                socket.emit('room-full');
                return;
            }

            socket.join(roomId);
            room.add(socket.id);
            io.to(roomId).emit('participant-count', room.size);
        });

        // ** Chat Handlers **
        socket.on('chat-message', (data) => {
            console.log('Backend received chat message:', data);
            io.to(data.chatId).emit('chat-message', data);
          });

          socket.on('join-chat', (chatId) => {
            socket.join(chatId);
          });

          socket.on('leave-chat', (chatId) => {
            socket.leave(chatId);
          });

        socket.on('typing', ({ roomId, isTyping }) => {
            console.log("typing");
            // Notify other participants in the room about typing status
            socket.to(roomId).emit('typing', { from: socket.id, isTyping });
        });

        // ** Video Call Handlers **
        socket.on('offer', (data) => {
            socket.to(data.roomId).emit('offer', data);
        });

        socket.on('answer', (data) => {
            socket.to(data.to).emit('answer', data);
        });

        socket.on('ice-candidate', (data) => {
            socket.to(data.roomId).emit('ice-candidate', data);
        });

        // ** Room Leaving Logic **
        socket.on('leave-room', ({ roomId }) => {
            handleLeaveRoom(socket, roomId);
        });

        socket.on('disconnect', () => {
            // console.log('Client disconnected:', socket.id);
            for (const [roomId, participants] of rooms.entries()) {
                if (participants.has(socket.id)) {
                    handleLeaveRoom(socket, roomId);
                }
            }
        });

        function handleLeaveRoom(socket: any, roomId: string) {
            const room = rooms.get(roomId);
            if (room) {
                room.delete(socket.id);
                socket.leave(roomId);
                if (room.size === 0) {
                    rooms.delete(roomId);
                } else {
                    io.to(roomId).emit('participant-count', room.size);
                    io.to(roomId).emit('participant-left');
                }
            }
        }
    });

    return io;
};

export default configureSocket;
