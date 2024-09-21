import { useEffect ,useRef,useState} from 'react'
import {Container, Row, Stack,Form ,Button, OverlayTrigger, Tooltip, Overlay} from 'react-bootstrap'
import { io } from "socket.io-client";
import Student from './Student.jsx';
import Teacher from './Teacher.jsx';




const Submitted = ({userType , userID ,submitStudent , setStudentName ,studentName}) => {
    const [optionsPerc,setOptionPerc] = useState({})
    const [submitData,setSubmitData] = useState({})
    const [isloaded,setIsLoaded] = useState(false)
    const [questionData,setQuestionData] = useState({})
    const [alreadySubmitted,setAlreadySubmitted] = useState(sessionStorage.getItem("question_id") ? true : false)
    const [total,setTotal]=useState(0)
    const [youAnswer,setYouAnswer] = useState(null)
    const [show, setShow] = useState(false);
    const target = useRef(null);
    const [socket,setSocket] = useState(null)
    const [participantCount,setParticipantCount] = useState(0)
    const [participants,setParticipants] = useState({})
    const [userKickedOut,setUserKickedOut] = useState(sessionStorage.getItem("kicked_out") || false)
    const getParticipanyts = async () => {
        try{
            const url = import.meta.env.VITE_ENDPOINT+"/getactivestudents";
            const respone = await fetch(url);
            const data = await respone.json();
            setParticipants(data?.students)
        }catch(err){
            console.log("err",err)
        }
    }
    const getActiveQuestion = async () => { 
        try{
            setIsLoaded(false)
            const url = import.meta.env.VITE_ENDPOINT+"/getactivequestion";
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

    const removeParticpant = async (socket_id) => {
        try{
            const url = import.meta.env.VITE_ENDPOINT+"/removeparticipant";
            const respone = await fetch(url, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({socket_id}),
              });
        }catch(err){
            console.log("err",err)
        }
    }

   
    const getAnswers = async (question_id , question_data) => {
        try{
            setIsLoaded(false)
            const url = import.meta.env.VITE_ENDPOINT+`/getanswers?question_id=${question_id}&user_id=${sessionStorage.getItem("user_id")}`;
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
            setParticipantCount(total)
            setIsLoaded(true)
        }catch(err){
            console.log("err",err)
        }
    }

    useEffect(() => {
        if(socket && userKickedOut){
            socket.disconnect();
        }
    },[userKickedOut , socket] );
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
            setSocket(io(import.meta.env.VITE_ENDPOINT+"/getanswers",{
                transports: ["websocket"],
                retries:3,
                reconnectionAttempts: 3, // Set the maximum number of reconnection attempts
                reconnectionDelay:5000 //5 secs 
              })) 
                     
              return () => {
                  if (socket) {
                    socket.disconnect();
                    setSocket(null);
                  }
            };
        }
       
    },[isloaded])
    useEffect(() => {
        if(socket){
            socket.on("newAnswer", (data) => {
                setOptionPerc((prev)=>({ ...prev, [data.answer]: prev[data.answer] + 1 }));
                setTotal((prev)=>prev + 1)
            });
            socket.on("newQuestion", (data) => {
                sessionStorage.removeItem("question_id")
                setQuestionData(data)
                setAlreadySubmitted(false)
            });
            socket.on("remove_participant",()=>{
                if(userType == 1){
                    sessionStorage.setItem("kicked_out",true)
                    setUserKickedOut(true)
                }
                
            })
            socket.on("new_participant",()=>{
               setparticipantCount((prev)=>prev+1)
            })
        }
    },[socket])

    const emitUserInfo = () => {
        if(socket && ((userType == 1 &&  studentName) || userType == 2)){
            socket.emit("user_type",{
                user_type:userType,
                user_name:studentName
            })
        }
    }
    useEffect(() => {
        emitUserInfo()
    },[userType , socket])

    if(userKickedOut){
        return <>
        <div className="text-center">
        <h1>You’ve been Kicked out !</h1>
        <p>
        Looks like the teacher had removed you from the poll system .Please 
        Try again sometime.
        </p>
        </div>
        </>
    }

    if((!questionData?._id && userType) || (userType == 1 && !alreadySubmitted)){
        return <>
        {
          userType == 2 ? <Teacher /> : 
            <>
              {!userID ? <>
                <Stack gap={3} className='text-center'>
                  <Form.Label>Enter your name</Form.Label>
                  <Form.Control type="text" placeholder="Enter your name" value={studentName} onChange={(e) => setStudentName(e.target.value)}/>
                  <Button variant="primary" className='btn-custom' onClick={() => {
                        emitUserInfo()
                        submitStudent()
                  }
                    }>Submit</Button>

                </Stack>
              </> :  <Student setAlreadySubmitted={setAlreadySubmitted} setYouAnswer={setYouAnswer} questionData={questionData}/>}
              
            </>
        }
        </>
    }
    return (
        <>
        
        <Container>
            <Stack  className="question-stack">
            <div className="question-text">
                {questionData?.question} 
               
            </div>
            <Stack gap={3} className="options-stack">
                { questionData?.options?.map((option,index) => {
                    return(
                    
                    <div className="answer-radio gap-3 position-relative">
                        <span
                            className="progress"
                            style={{
                            width: `${optionsPerc[index] ? `${((optionsPerc[index] / total) * 100).toFixed(2)}%` : "0%"}`,
                            backgroundColor: '#6766D5',
                            }}
                        ></span>

                        <div className="answer-option d-flex justify-content-between position-relative">
                            <span className="text-foreground">{option}</span>
                            <span className="text-foreground">{optionsPerc[index] ? `${((optionsPerc[index] / total) * 100).toFixed(2)} %` : "0 %"}</span>
                        </div>

                        <div
                            className="answer-option d-flex justify-content-between position-absolute top-0 left-0 w-100"
                            style={{
                            color: '#fff', 
                            clipPath: `inset(0 ${100 - (optionsPerc[index] ? ((optionsPerc[index] / total) * 100) : 0)}% 0 0)`,
                            pointerEvents: 'none', 
                            }}
                        >
                            <span>{option}</span>
                            <span>{optionsPerc[index] ? `${((optionsPerc[index] / total) * 100).toFixed(2)} %` : "0 %"}</span>
                        </div>
                        </div>

                    
                
                )
                 })}
            </Stack>
          
            </Stack>
            {userType ==  1 ? <div className='text-center' style={{margin:"10px 0"}}>
                <p><b>Wait for the teacher to ask a new question..</b></p>
            </div> : <></>}

            {userType == 2  ? <div className='d-flex justify-content-end' style={{margin:"10px 0"}}>
                 <Button className='btn-custom ' 
                 disabled={
                    total <= participantCount
                 }
                 onClick={() => {
                    // setAddQuestion(true)
                    setAlreadySubmitted(true)
                    setQuestionData(null)
                    }}>
                        + Add a new question
                </Button>

                
                    
            </div> : <></>}


            
        </Container>
        {userType == 2  &&
        <div className='chatButton'>
            <Button variant="primary" size='sm' ref={target} style={{borderRadius:"50%", textAlign:"center",padding:"19px 20px 14px 20px"}} onClick={() => {
                getParticipanyts()
                setShow(!show)
                }}>
                    <svg width="20" height="20" viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M30.625 0H7.875C6.58207 0 5.34209 0.513615 4.42785 1.42785C3.51361 2.34209 3 3.58207 3 4.875V21.125C3 22.4179 3.51361 23.6579 4.42785 24.5721C5.34209 25.4864 6.58207 26 7.875 26H26.7087L32.7213 32.0288C32.8731 32.1794 33.0532 32.2985 33.2512 32.3794C33.4491 32.4603 33.6611 32.5012 33.875 32.5C34.0882 32.5055 34.2996 32.461 34.4925 32.37C34.7893 32.2481 35.0433 32.0411 35.2226 31.775C35.4019 31.509 35.4984 31.1958 35.5 30.875V4.875C35.5 3.58207 34.9864 2.34209 34.0721 1.42785C33.1579 0.513615 31.9179 0 30.625 0ZM32.25 26.9588L28.5287 23.2213C28.3769 23.0706 28.1968 22.9515 27.9988 22.8706C27.8009 22.7898 27.5889 22.7488 27.375 22.75H7.875C7.44402 22.75 7.0307 22.5788 6.72595 22.274C6.42121 21.9693 6.25 21.556 6.25 21.125V4.875C6.25 4.44402 6.42121 4.0307 6.72595 3.72595C7.0307 3.42121 7.44402 3.25 7.875 3.25H30.625C31.056 3.25 31.4693 3.42121 31.774 3.72595C32.0788 4.0307 32.25 4.44402 32.25 4.875V26.9588Z" fill="white"/>
                    </svg>

            </Button>


            <Overlay target={target.current} show={show} placement="top">
                {({
                placement: _placement,
                arrowProps: _arrowProps,
                show: _show,
                popper: _popper,
                hasDoneInitialMeasure: _hasDoneInitialMeasure,
                ...props
                }) => (
                <div
                    {...props}
                    style={{
                    ...props.style,
                    }}
                    className='popover-chat'
                >
                    <Stack gap={3}>
                   <div className='d-flex justify-content-between ' style={{borderBottom:"1px solid #726F6F",paddingBottom:"10px"}}>
                        Participants
                   </div>
                   <div>
                    <div className='d-flex justify-content-between'>
                        <div style={{color:"#726F6F"}}>Name</div>
                        <div style={{color:"#726F6F"}}>Action</div>
                    </div>
                    {Object.keys(participants)?.map((item,index) => {
                        return (
                            <div key={index} className='d-flex justify-content-between'>
                                <div>{participants[item]}</div>
                                <div>
                                    <Button variant="link" size="sm"   onClick={() => {removeParticpant(item)
                                        setShow(!show)}}>
                                        Kick out  
                                    </Button>
                                </div>
                            </div>
                        )
                    })}
                   </div>
                   </Stack>
                   
                </div>
                )}
            </Overlay>
        </div>}
        </>
    )
}

export default Submitted