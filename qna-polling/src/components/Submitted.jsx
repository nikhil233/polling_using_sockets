import { useEffect ,useState} from 'react'
import {Container, Row, Stack,Form ,Button} from 'react-bootstrap'
import { io } from "socket.io-client";
import Student from './Student';
import Teacher from './Teacher';

const Submitted = ({userType , userID ,submitStudent , setStudentName ,studentName}) => {
    const [optionsPerc,setOptionPerc] = useState({})
    const [submitData,setSubmitData] = useState({})
    const [isloaded,setIsLoaded] = useState(false)
    const [questionData,setQuestionData] = useState({})
    const [alreadySubmitted,setAlreadySubmitted] = useState(sessionStorage.getItem("question_id") ? true : false)
    const [total,setTotal]=useState(0)
    const [youAnswer,setYouAnswer] = useState(null)
    let socket;

    const getActiveQuestion = async () => { 
        try{
            setIsLoaded(false)
            const url = "http://localhost:8000/getactivequestion";
            const respone = await fetch(url);
            const {question_data} = await respone.json();
            if(!question_data){
                sessionStorage.removeItem("question_id")
            }
            setQuestionData(question_data)
            setIsLoaded(true)
        }catch(err){
            console.log("err",err)
        }
    }

    const getAnswers = async (question_id , question_data) => {
        try{
            setIsLoaded(false)
            const url = `http://localhost:8000/getanswers?question_id=${question_id}&user_id=${sessionStorage.getItem("user_id")}`;
            const respone = await fetch(url);
            const data = await respone.json();
            setSubmitData(data?.answers_data)
             const n = question_data?.options?.length;
            const optionsCounts = Object.assign({}, Array.from({ length: n }, (_, i) => (0)));
            let total = 0;
            data?.answers_data.forEach((item) => {
                optionsCounts[item?._id] = item?.submitted
                total += item?.submitted
                if(item?.is_your_answer){
                    setYouAnswer(item?._id)
                }
            })
            setOptionPerc(optionsCounts)
            setTotal(total)
            setIsLoaded(true)
        }catch(err){
            console.log("err",err)
        }
    }
    useEffect(() => {
        getActiveQuestion();
    },[] ); 

    useEffect(()=>{
        if(questionData?._id){
            getAnswers(questionData._id , questionData)
        }
    },[questionData])

    useEffect(() => {   

    }, [submitData]);
    
    useEffect(() => {
        if(isloaded && !socket){
            socket = io("http://localhost:8000/getanswers",{
                transports: ["websocket"],
                retries:3,
                reconnectionAttempts: 3, // Set the maximum number of reconnection attempts
                reconnectionDelay:5000 //5 secs 
              });
      
             
                socket.on("newAnswer", (data) => {
                    setOptionPerc((prev)=>({ ...prev, [data.answer]: prev[data.answer] + 1 }));
                    setTotal((prev)=>prev + 1)
                });
                socket.on("newQuestion", (data) => {
                    sessionStorage.removeItem("question_id")
                    setQuestionData(data)
                    setAlreadySubmitted(false)
                });
              return () => {
                  if (socket) {
                    socket.disconnect();
                  }
            };
        }
       
    },[isloaded])


    if((!questionData?._id && userType) || (userType == 1 && !alreadySubmitted)){
        return <>
        {
          userType == 2 ? <Teacher /> : 
            <>
              {!userID ? <>
                <Stack gap={3} className='text-center'>
                  <Form.Label>Enter your name</Form.Label>
                  <Form.Control type="text" placeholder="Enter your name" value={studentName} onChange={(e) => setStudentName(e.target.value)}/>
                  <Button variant="primary" onClick={() => submitStudent()}>Submit</Button>

                </Stack>
              </> :  <Student setAlreadySubmitted={setAlreadySubmitted} setYouAnswer={setYouAnswer} questionData={questionData}/>}
              
            </>
        }
        </>
    }
    return (
        <Container>
            {/* <Row>
               <div>
                    Question: {questionData?.question}
               </div>
               <Stack gap={3}>
                    {
                        questionData?.options?.map((option,index) => { 
                            return (<Stack key={index}>
                                <div className="p-2">{option}</div>
                                <div className="p-2 ms-auto">{optionsPerc[index]? `${(optionsPerc[index]/total) * 100} %` : "0 %"}</div>
                                {index == youAnswer ? "(Your Answer)" : ""}
                            </Stack>)
                         })
                    }
               </Stack>
            </Row> */}
            <Stack  className="question-stack">
            <div className="question-text">
                {questionData?.question} 
               
            </div>
            <Stack gap={3} className="options-stack">
                { questionData?.options?.map((option,index) => {
                    return(<div className='answer-radio gap-3 '>
                        <div className='progress' style={{width:`${optionsPerc[index]? `${((optionsPerc[index]/total) * 100).toFixed(2)} %` : "0 %"}`}}></div>

                        <div className={`answer-option d-flex justify-content-between ${index == youAnswer ? "is-selected" : ""}`}>
                        
                        <span className="">{option}</span>
                        <span className=" ">{optionsPerc[index]? `${((optionsPerc[index]/total) * 100).toFixed(2)} %` : "0 %"}</span>
                        </div>
                    
                    </div>)
                 })}
            </Stack>
          
            </Stack>
            {userType ==  1 ? <div className='text-center' style={{margin:"10px 0"}}>
                <p><b>Wait for the teacher to ask a new question..</b></p>
            </div> : <></>}
        </Container>
    )
}

export default Submitted