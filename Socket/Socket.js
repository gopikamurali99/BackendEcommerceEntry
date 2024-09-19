
// socket.js
 import { Server } from 'socket.io';

const createSocketServer = (httpServer) => {
    const io = new Server(httpServer);

    io.on('connection', (socket) => {
        console.log('Admin connected');

        socket.on('disconnect', () => {
            console.log('Admin disconnected');
        });

        // Additional event listeners can be added here
    });

    return io;
};

export default createSocketServer;