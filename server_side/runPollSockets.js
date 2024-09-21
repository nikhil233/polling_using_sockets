


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
        let userType = 0;
        socket.on('user_type', ({user_type,user_name}) => {
            userType = user_type
            if(user_type == 1){
                studentlive[socketId] = user_name
                Object.keys(teacherlive).forEach(element => {
                    io.of('/getanswers').to(element).emit("new_participant",{});
                });
            }
            if(user_type == 2){
                teacherlive[socketId] =1
            }
            console.log("teacherlive",teacherlive)
            console.log("studentlive",studentlive)
        })

        socket.on('disconnect', () => { 
            console.log("poll socket disconnect", socketId);
            delete studentlive[socketId]
            delete teacherlive[socketId]
            console.log("teacherlive",teacherlive)

        });
    });

}

export default runPollSockets

