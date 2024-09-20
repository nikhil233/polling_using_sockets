import { useEffect, useState } from "react"
import { Row, Stack, Button,Form, Spinner } from "react-bootstrap";
import { io } from "socket.io-client";

const Student = ({setAlreadySubmitted ,setYouAnswer, questionData}) => {
    const [activeQuestion , setActiveQuestion] = useState(questionData)
    const [answer,setAnswer] = useState()
    const [remainingTime,setRemainingTime] = useState(60)

    const SubmitAnswer = async () => {
        const jsonData = {
            question_id:activeQuestion._id,
            answer:answer,
            user_id:sessionStorage.getItem("user_id")
        }
        setYouAnswer(answer)
        const url = "http://localhost:8000/submitanswer"
        try{
            const {data} = await fetch(url, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(jsonData),
            });
            sessionStorage.setItem("question_id", activeQuestion._id)
            setAlreadySubmitted(true)
        }catch(err){
            console.log("err",err)
        }
    }
    useEffect(() => {
        setActiveQuestion(questionData)
    },[questionData])
    useEffect(()=>{
        if(activeQuestion?._id){
            setRemainingTime( activeQuestion.end_time  - Math.floor(Date.now()/1000))
           
            setInterval(() => {
                setRemainingTime(prev => prev - 1)
            },1000)
        }
    },[activeQuestion])

    useEffect(() => {
        if(remainingTime === 0 && activeQuestion?._id){
            sessionStorage.setItem("question_id", activeQuestion._id)
            setAlreadySubmitted(false)
            setActiveQuestion(null)
        }
    },[remainingTime])
    if(!activeQuestion?._id){
        return <>
        <Stack gap={3}>
            <div style={{textAlign:"center"}}>
                <Spinner animation="border" role="status" />

            </div>
         <div>
            Waiting for teacher to add question

        </div>
        </Stack>
           
        </>
    }
    const formatTime = (time)=>{
        const minutes = Math.floor(time / 60)
        const seconds = time % 60
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
    }
    return (
        <Stack style={{width:"50%",textAlign:"center"}} gap={3}>
            <div>
                {activeQuestion?.question} 
                <p className="text-red">{formatTime(remainingTime)}</p> 
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