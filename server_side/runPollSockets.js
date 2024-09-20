const runPollSockets = (io) => {
    console.log('runPollSockets');
    io.on('connection', (socket) => {
        const socketId = socket.id;
        console.log("poll socket", socketId); 
        socket.emit("test","test");       
        socket.on('disconnect', () => {

        });
    });

    io.of('/teacher').on('connection', (socket) => {
        const socketId = socket.id;
        console.log("teacher socket", socketId);

    });

    io.of('/getanswers').on('connection', (socket) => {
        const socketId = socket.id;
        console.log("student socket", socketId);
    });

}

export default runPollSockets