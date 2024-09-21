const runPollSockets = (io , teacherlive , studentlive) => {
    console.log('runPollSockets');
    io.on('connection', (socket) => {
        const socketId = socket.id;
        console.log("poll socket", socketId); 
        socket.emit("test","test");       
        socket.on('disconnect', () => {

        });
    });

    io.of('/getanswers').on('connection', (socket) => {
        const socketId = socket.id;
        
        socket.on('user_type', ({user_type,user_name}) => {
            if(user_type == 1){
                studentlive[socketId] = user_name
                teacherlive.forEach(element => {
                    io.of('/getanswers').to(element).emit("new_participant",{});
                });
            }
            if(user_type == 2){
                teacherlive.push(socketId)
                teacherlive = [...new Set(teacherlive)]
            }
            console.log("teacherlive",teacherlive)
            console.log("studentlive",studentlive)
        })

        socket.on('disconnect', () => { 
            console.log("poll socket disconnect", socketId);
            delete studentlive[socketId]
            teacherlive = teacherlive.filter((item) => item !== socketId)
        });
    });

}

export default runPollSockets