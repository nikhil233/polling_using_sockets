import { useEffect, useState } from "react"
import { Row, Stack, Button,Form } from "react-bootstrap";
import { io } from "socket.io-client";

const Student = ({setShowSubmitted}) => {
    const [activeQuestion,setActiveQuestion] = useState(null)
    const [isloaded,setIsLoaded] = useState(false)
    const [answer,setAnswer] = useState()

    let socket;
    const getActiveQuestion = async () => { 
        try{
            setIsLoaded(false)
            const url = "http://localhost:8000/getactivequestion";
            const respone = await fetch(url);
            const data = await respone.json();
            setActiveQuestion(data.question_data)
            setIsLoaded(true)
        }catch(err){
            console.log("err",err)
        }
    }
    useEffect(() => {
        getActiveQuestion()
    },[])

    useEffect(() => {
        if(isloaded && !socket){
            socket = io("http://localhost:8000/student",{
                transports: ["websocket"],
                retries:3,
                reconnectionAttempts: 3, 
                reconnectionDelay:5000 
              });
            socket.on("connected", () => {
                console.log("connected");   
            });
        }

        
        return () => {  
            if (socket) {
              socket.disconnect();
            }
      };
    },[isloaded])

    const SubmitAnswer = async () => {
        const jsonData = {
            question_id:activeQuestion._id,
            answer:answer,
            user_id:sessionStorage.getItem("student_id")
        }
        const url = "http://localhost:8000/submitanswer"
        try{
            const {data} = await fetch(url, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(jsonData),
            });
            setShowSubmitted(true)
        }catch(err){
            console.log("err",err)
        }
    }
    return (
        <Stack style={{width:"50%",textAlign:"center"}} gap={3}>
            <div>
                {activeQuestion?.question}
            </div>
            <div>
                {activeQuestion?.options.map((option,index) => {
                    return (<div className="p-2">
                         <Form.Check 
                            type={"radio"}
                            id={`default-radio-${index}`}
                            label={option}
                            name="radioGroup"
                            onChange={() => {
                                setAnswer(index)
                            }}
                            checked={answer === index}
                        />
                        </div>)
                })}
            </div>
            <div>
                <Button onClick={() => SubmitAnswer()}>Submit</Button>
            </div>
        </Stack>
    )
}

export default Student