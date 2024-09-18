import mongoose from 'mongoose';
import dotenv from 'dotenv';  
dotenv.config();
import { questions,pollanswers } from './models/questions.js';
mongoose.Promise = global.Promise;
mongoose.set('strictQuery', true);
const db = {};
db.mongoose = mongoose;
db.url = process.env.MONGO_DB_CONNECTION;
db.questions = questions(mongoose);
db.pollanswers = pollanswers(mongoose);

export default db;
