import io from 'socket.io-client';
import { baseUrl } from '../../config/HTTP';



let socket = null;

export const initSocket = () => {
    if (!socket) {
        socket = io(baseUrl.SOCKET_URL, {
            transports: ["websocket"],
            reconnection: true,
            reconnectionAttempts: 5, 
            reconnectionDelay: 1000, 
            reconnectionDelayMax: 5000, 
            randomizationFactor: 0.5 
        });

        socket.on('connect', () => {
            console.warn('Socket connected');
        });

        socket.on('disconnect', () => {
            console.warn('Socket disconnected');
        });

        socket.on('reconnect', (attemptNumber) => {
            console.warn(`Socket reconnected after ${attemptNumber} attempts`);
        });

        socket.on('reconnect_attempt', () => {
            console.warn('Attempting to reconnect...');
        });

        socket.on('reconnect_error', (error) => {
            console.error('Reconnection attempt failed:', error);
        });
    }

    return socket;
};

export const getSocket = () => {
    return socket;
};
