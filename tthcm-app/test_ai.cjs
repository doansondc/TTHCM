const io = require('socket.io-client');
const socket = io('http://34.126.106.92:', { transports: ['websocket'] });

socket.on('connect', () => {
    socket.emit('analyze_poll_ai', {
      title: "Ai sẽ chiến thắng?",
      totalVotes: 100,
      resultTitle: "Nga",
      options: [{ id: "nga", label: "Nga"}, { id: "my", label: "Mỹ" }]
    }, (res) => {
        console.log('Result:', res);
        process.exit(0);
    });
});
