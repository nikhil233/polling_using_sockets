
export const questions = (mongoose) =>{
    const schema = mongoose.Schema(
        {
          question:String,
          options:Array,
          answer:String,
          teacher_id:Number,
          allowed_time:Number
        },
        { timestamps: true }
      );
  
    return mongoose.model('questions', schema);
}

export const pollanswers = (mongoose) =>{
    const schema = mongoose.Schema(
        {
          user_id:String,
          name:String,
          answer:String,
          question_id:String
        },
        { timestamps: true }
      );
  
    return mongoose.model('pollanswers', schema);
}

  