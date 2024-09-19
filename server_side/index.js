import dotenv from 'dotenv';  
dotenv.config();
console.log("MONGO_DB_CONNECTION:", process.env.MONGO_DB_CONNECTION);

import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import db from './db.js';
import runPollSockets from './runPollSockets.js';
import cors from 'cors';

const app = express();
app.use(cors())
app.use(express.json());
const server = http.createServer(app);

var io;
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
    io = new Server(server,{
        cors: {
          origin: "*", 
          methods: ['GET', 'POST'],
          credentials: true,
        },
      });
      runPollSockets(io);

  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();

});

app.post("/addquestion", (req, res) => {
    try{
        // let question = req.body.question;
        // let options = req.body.options;
        // let answer = req.body.answer;
        // let teacher_id = req.body.teacher_id;
        const { question, options, answer, teacher_id,allowed_time } = req.body;

        let newQuestion = new db.questions({
            question,
            options,
            answer,
            teacher_id,
            allowed_time
        });
        newQuestion.save();
        io.emit('newQuestion', {...req.body,question_id:newQuestion._id});
        res.status(200).json({ code:200,message: 'Question added successfully!'});
    }catch(err){
        res.status(400).json({ message: 'Question added failed!'});
        console.log(err);
    }
})


app.post("/submitanswer", (req, res) => {
    try{
        const { user_id,name,answer,question_id } = req.body;
        let test = io.of('/teacher').emit('newAnswer',{answer,question_id});
        let newQuestion = new db.pollanswers({
            user_id,name,answer,question_id
        });
        newQuestion.save();
        res.status(200).json({ code:200,message: 'Question updated successfully!'});
    }catch(err){
        res.status(400).json({ message: 'Question updated failed!'});
        console.log(err);
    }
})

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
