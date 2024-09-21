import { useEffect, useState } from "react"
import { Row, Stack, Button,Form, Spinner } from "react-bootstrap";
import { io } from "socket.io-client";

const Student = ({setAlreadySubmitted ,setYouAnswer, questionData}) => {
    const [activeQuestion , setActiveQuestion] = useState(questionData)
    const [answer,setAnswer] = useState()
    const [remainingTime,setRemainingTime] = useState(60)
    const [isLoading , setIsLoading] = useState(false)
    const SubmitAnswer = async () => {
        const jsonData = {
            question_id:activeQuestion._id,
            answer:answer,
            user_id:sessionStorage.getItem("user_id")
        }
        setYouAnswer(answer)
        const url = import.meta.env.VITE_ENDPOINT+"/submitanswer"
        try{
            setIsLoading(true)
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
        }finally{
            setIsLoading(false)
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
        <Stack gap={3}>
            <div className="d-flex justify-content-between" style={{width:"100%"}}>
                <div>
                <p><b>Question           </b>   
                </p>
                </div>
                <div>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M18.3 8.09L19.21 7.19C19.3983 7.0017 19.5041 6.7463 19.5041 6.48C19.5041 6.2137 19.3983 5.9583 19.21 5.77C19.0217 5.5817 18.7663 5.47591 18.5 5.47591C18.2337 5.47591 17.9783 5.5817 17.79 5.77L16.89 6.68C15.4886 5.59585 13.7669 5.00764 11.995 5.00764C10.2232 5.00764 8.50147 5.59585 7.10003 6.68L6.19003 5.76C6.0004 5.5717 5.74373 5.46644 5.47649 5.46737C5.20925 5.46831 4.95333 5.57537 4.76503 5.765C4.57672 5.95463 4.47146 6.2113 4.4724 6.47854C4.47334 6.74578 4.5804 7.0017 4.77003 7.19L5.69003 8.1C4.59304 9.49755 3.99782 11.2233 4.00003 13C3.99676 14.2754 4.29849 15.5331 4.88005 16.6683C5.46161 17.8034 6.30614 18.783 7.34322 19.5254C8.38029 20.2679 9.57985 20.7516 10.8418 20.9362C12.1038 21.1208 13.3917 21.0011 14.598 20.5869C15.8043 20.1727 16.8941 19.4761 17.7764 18.5552C18.6588 17.6342 19.3082 16.5157 19.6705 15.2928C20.0328 14.0699 20.0974 12.7781 19.859 11.5251C19.6206 10.2722 19.0861 9.0944 18.3 8.09ZM12 19C10.8133 19 9.6533 18.6481 8.6666 17.9888C7.67991 17.3295 6.91087 16.3925 6.45675 15.2961C6.00262 14.1997 5.8838 12.9933 6.11531 11.8295C6.34683 10.6656 6.91827 9.59647 7.75739 8.75736C8.5965 7.91824 9.6656 7.3468 10.8295 7.11529C11.9934 6.88378 13.1998 7.0026 14.2961 7.45672C15.3925 7.91085 16.3296 8.67988 16.9888 9.66658C17.6481 10.6533 18 11.8133 18 13C18 14.5913 17.3679 16.1174 16.2427 17.2426C15.1174 18.3679 13.5913 19 12 19ZM10 4H14C14.2652 4 14.5196 3.89464 14.7071 3.70711C14.8947 3.51957 15 3.26522 15 3C15 2.73478 14.8947 2.48043 14.7071 2.29289C14.5196 2.10536 14.2652 2 14 2H10C9.73481 2 9.48046 2.10536 9.29292 2.29289C9.10538 2.48043 9.00003 2.73478 9.00003 3C9.00003 3.26522 9.10538 3.51957 9.29292 3.70711C9.48046 3.89464 9.73481 4 10 4ZM13 10C13 9.73478 12.8947 9.48043 12.7071 9.29289C12.5196 9.10536 12.2652 9 12 9C11.7348 9 11.4805 9.10536 11.2929 9.29289C11.1054 9.48043 11 9.73478 11 10V11.89C10.7736 12.0925 10.614 12.359 10.5423 12.6542C10.4707 12.9495 10.4904 13.2595 10.5988 13.5433C10.7072 13.8271 10.8992 14.0712 11.1494 14.2435C11.3996 14.4158 11.6962 14.508 12 14.508C12.3038 14.508 12.6004 14.4158 12.8507 14.2435C13.1009 14.0712 13.2929 13.8271 13.4013 13.5433C13.5097 13.2595 13.5294 12.9495 13.4577 12.6542C13.3861 12.359 13.2265 12.0925 13 11.89V10Z" fill="black"/>
</svg>

<span className="text-red">{
                formatTime(remainingTime)
                }
                    
                    </span>      
                
                </div>                 
                
            </div>
        <Stack  className="question-stack">
            <div className="question-text">
                {activeQuestion?.question} 
               
            </div>
            <div className="options-stack">
                {activeQuestion?.options.map((option,index) => {
                    return (<div className="p-2">
                         <Form.Check 
                            type={"radio"}
                            id={`default-radio-${index}`}
                            label={
                                <div className="answer-option">
                                    {option}
                                    </div>
                                
                            }
                            className="answer-radio"
                            name="radioGroup"
                            onChange={() => {
                                setAnswer(index)
                            }}
                            checked={answer === index}
                        />
                        </div>)
                })}
            </div>
           
        </Stack>
        <div className="d-flex justify-content-end">
                <Button className="btn-custom"  disabled={isLoading} onClick={() => SubmitAnswer()}>
                    {isLoading ? <Spinner animation="border" role="status" /> : ""}
                    Submit</Button>
            </div>
        </Stack>
    )
}

export default Student