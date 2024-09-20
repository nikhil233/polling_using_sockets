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
        const { question, options, answer, teacher_id,allowed_time } = req.body;
        const created_at  =  Math.ceil(Date.now()/1000);
        const end_time  = created_at + ((allowed_time ?? 60));
        let newQuestion = new db.questions({
            question,
            options,
            answer,
            teacher_id,
            allowed_time,
            end_time
          });
        newQuestion.save();
        io.of('/getanswers').emit('newQuestion', {...req.body,_id:newQuestion._id , end_time});
        res.status(200).json({ code:200,message: 'Question added successfully!'});
    }catch(err){
        res.status(400).json({ message: 'Question added failed!'});
        console.log(err);
    }
})


app.post("/submitanswer", (req, res) => {
    try{
        const { user_id,name,answer,question_id } = req.body;
        let test = io.of('/getanswers').emit('newAnswer',{answer,question_id});
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

app.get("/getactivequestion", async (req, res) => {
    try{  
        const nowTime =  Math.floor(Date.now()/1000);
        const agg = [
          {
            '$match': {
              'end_time': {
                '$gt': nowTime
              }
            }
          }, {
            '$project': {
              'question': 1, 
              'options': 1, 
              'end_time': 1, 
              '_id': 1
            }
          }, {
            '$sort': {
              'createdAt': -1
            }
          }, {
            '$limit': 1
          }
        ];
        let cursor =  db.questions.aggregate(agg)
        let data = await cursor.exec();
        res.status(200).json({ code:200,message: 'Question fetched successfully!',question_data:(data.length > 0 ? data[0] : null)});
    }catch(err){
        res.status(400).json({ message: 'Something went wrong!'});
        console.log(err);
    }
})

app.get('/getanswers', async (req, res) => {
    try{ 
        let question_id = req.query.question_id;
        let user_id = req.query.user_id;
        const agg = [
          {
            '$match': {
              'question_id': question_id
            }
          }, {
            '$group': {
              '_id': '$answer', 
              'submitted': {
                '$sum': 1
              }, 
              'is_your_submisstions': {
                '$first': {
                  '$cond': {
                    'if': {
                      '$eq': [
                        '$user_id', user_id
                      ]
                    }, 
                    'then': true, 
                    'else': false
                  }
                }
              }
            }
          }
        ];
        let cursor =  db.pollanswers.aggregate(agg)
        let data = await cursor.exec();
        res.status(200).json({ code:200,message: 'Answers fetched successfully!',answers_data:data});
     }catch(err){
        res.status(400).json({ message: 'Something went wrong!'});
        console.log(err);
    }
})

app.get("/getallquestions", async (req, res) => {
  try{
    let cursor = db.questions.find()
    let agg = [
      {
        '$group': {
          '_id': {
            'question': "$question_id",
            'option': "$answer"
          },
          'submitted': {
            '$sum': 1
          }
        }
      },
      {
        '$project': {
          "submitted": 1,
          "question": "$_id.question",
          "option": "$_id.option",
          "_id":0
        }
      }
    ]
    
    let questions = await cursor.exec();
    let cursor2 = db.pollanswers.aggregate(agg)
    let answerStats = await cursor2.exec();

    let questionsData = {};

    answerStats.forEach(element => {
      if(!questionsData[element.question]){
        questionsData[element.question] = {}
      }
      questionsData[element.question] =  {
        ...questionsData[element.question],
        [element.option]: element.submitted
      }
    });
  
    res.status(200).json({ code:200,message: 'Questions fetched successfully!',answers_stats:answerStats, questions: questions});
  }catch(err){
    res.status(400).json({ message: 'Something went wrong!'});
    console.log(err);
  }
       
})
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
