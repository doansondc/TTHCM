const io = require('socket.io-client');
const socket = io('http://34.126.106.92:3000', { transports: ['websocket'] });

socket.on('connect', () => {
    console.log('Connected to Live Server');
    socket.emit('change_gemini_key', { key: 'AIzaSyBK4eGLsAC1x5dzrKHsZtCbMF3XYC-OCCk' }, (res) => {
        console.log('Key saved: ', res);
        process.exit(0);
    });
});
