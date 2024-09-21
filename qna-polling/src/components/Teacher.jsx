
import { useEffect, useState } from 'react';
import {Form, Row,Col, Button, Stack} from 'react-bootstrap';
import { io } from "socket.io-client";



const Teacher = ({}) => {

    const [teacherName,setTeacherName] = useState('')
    const [question,setQuestion] = useState('')
    const [options,setOptions] = useState([])
    const [answer,setAnswer] = useState([])
    const [allowedTime,setAllowedTime] = useState(1)
    const [showAllQuestions,setShowAllQuestions] = useState(false)
    const [allQuestions,setAllQuestions] = useState([])
    const [answerStats,setAnswerStats] = useState({})
     const handleSubmit = async (e) => {
        e.preventDefault()
        const jsonData = {
            teacher_name :teacherName,
            question : question,
            options:options,
            answer:answer,
            allowed_time:allowedTime * 60
        }
        const url = import.meta.env.VITE_ENDPOINT+"/addquestion"
        try{
            const {data} = await fetch(url, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(jsonData),
              });

        }catch(err){
            console.log("err",err)
        }
    }
    const updateAnswer = (e , key) => {
        if(e){
            setAnswer((prev) => {
                return [...prev , key]
            })
        }else{
            setAnswer((prev) => {
                return prev.filter((item) => item !== key)
            })
        }
        
    }

    const getAllQuestions = async()=>{
        try{
            const url = import.meta.env.VITE_ENDPOINT+"/getallquestions"
            let resp  =await fetch(url)
            const data = await resp.json();
            // let newQuestions = data.questions.map(e => {
            //     e.options_stats = {}
            //     e.options.map(val,index=>{
            //         e.options_stats = {...e.options_stats , [index]:}
            //     })
            // });
            setAllQuestions(data.questions)
            setAnswerStats(data.answers_stats)
        }catch(err){

        }
    }

    useEffect(() => {
        if(showAllQuestions){
            getAllQuestions();

        }
    },[showAllQuestions])

    if(showAllQuestions){
        return (
            <Stack gap={3} style={{margin:"10px 0",width:"100%"}}>
            {allQuestions.length === 0 && <div>No Questions Found</div>}
            {allQuestions.map((item,index) => (
                <>
                {/* <Stack key={index} style={{margin:"10px 0",width:"100%"}}>
                    <div>
                        <div>{item.question}</div>
                    </div>
                    <div>
                        {item.options.map((opt,index) => (
                            <div style={{display:"flex",justifyContent:"space-between"}} key={index}>
                                <span>{opt}</span>
                                <span>{answerStats[item._id] && answerStats[item._id][index]  && answerStats[item._id].total ? (((answerStats[item._id][index] ?? 0)/answerStats[item._id].total)*100).toFixed(2) : 0}% </span>
                            </div>
                    ))}
                    </div>
                </Stack> */}
                <div>
                    <div><b>Question {index+1}</b></div>
                </div>
            <Stack  className="question-stack">
                <div className="question-text">
                    {item?.question} 
                
                </div>
                <Stack gap={3} className="options-stack">
                    { item?.options?.map((option,index) => {
                        return(
                        
                        <div className="answer-radio gap-3 position-relative">
                            <span
                                className="progress"
                                style={{
                                width: `${answerStats[item._id] && answerStats[item._id][index]  && answerStats[item._id].total ? (((answerStats[item._id][index] ?? 0)/answerStats[item._id].total)*100).toFixed(2) : 0}%`,
                                backgroundColor: '#6766D5',
                                }}
                            ></span>

                            <div className="answer-option d-flex justify-content-between position-relative">
                                <span className="text-foreground">{option}</span>
                                <span className="text-foreground">{answerStats[item._id] && answerStats[item._id][index]  && answerStats[item._id].total ? (((answerStats[item._id][index] ?? 0)/answerStats[item._id].total)*100).toFixed(2) : 0}%</span>
                            </div>

                            <div
                                className="answer-option d-flex justify-content-between position-absolute top-0 left-0 w-100"
                                style={{
                                color: '#fff', 
                                clipPath: `inset(0 ${100 - (answerStats[item._id] && answerStats[item._id][index]  && answerStats[item._id].total ? (((answerStats[item._id][index] ?? 0)/answerStats[item._id].total)*100).toFixed(2) : 0)}% 0 0)`,
                                pointerEvents: 'none', 
                                }}
                            >
                                <span>{option}</span>
                                <span>{ `${answerStats[item._id] && answerStats[item._id][index]  && answerStats[item._id].total ? (((answerStats[item._id][index] ?? 0)/answerStats[item._id].total)*100).toFixed(2) : 0}%` }</span>
                            </div>
                            </div>

                        
                    
                    )
                    })}
                </Stack>
             </Stack>
             </>
            ))}

            </Stack>
        )
    }
    
    return (
       <>
        <div className='d-flex justify-content-between'> 
                <div>
                <h1>Let’s <b>Get Started</b></h1>
                <p>you’ll have the ability to create and manage polls, ask questions, and monitor your students' responses in real-time.</p>
                </div>
                <div>
                    <Button  size="sm" style={{backgroundColor:"#6766D5"}} className='btn-custom' variant="primary" onClick={() => setShowAllQuestions(true)}>

                        Show Questions</Button>

                    </div>
                
            </div>
        <Form>
             <div style={{width:"60%"}}>
           
            <Form.Group className="mb-3" controlId="question">
                <Stack gap={3}>
                <div className='d-flex justify-content-between'>
                <Form.Label className='labelquestion'><b>Enter your question</b></Form.Label>
                <Form.Select size='sm' className='time-select' aria-label="" onChange={(e) => setAllowedTime(e.target.value)}>
                    <option selected={allowedTime == 1} value="1">60 seconds </option>
                    <option selected={allowedTime == 2} value="2">Two minutes</option>
                    <option selected={allowedTime == 3} value="3">Three minutes</option>
                </Form.Select>
                </div>
                <Form.Control required as="textarea" rows="7" type="text" placeholder="Add question" value={question}  onChange={(e) => setQuestion(e.target.value)}/> 
            </Stack>
            </Form.Group>
            <Form.Group   className="mb-3" controlId="options">
               
                <Form.Label ><b>Edit Options</b></Form.Label>
                <Stack gap={3}>
                    <Form.Control 
                        required 
                        size="sm" 
                        type="text" 
                        placeholder="Add option A" 
                        value={options[0]} 
                        onChange={(e) => 
                            setOptions((val) => {
                                const newOptions = [...val]; 
                                newOptions[0] = e.target.value; 
                                return newOptions; 
                            })
                        }
                    />
                    <Form.Control 
                        required 
                        size="sm" 
                        type="text" 
                        placeholder="Add option B" 
                        value={options[1]} 
                        onChange={(e) => 
                            setOptions((val) => {
                                const newOptions = [...val]; 
                                newOptions[1] = e.target.value; 
                                return newOptions; 
                            })
                        }
                    />
                    <Form.Control 
                        required 
                        size="sm" 
                        type="text" 
                        placeholder="Add option C" 
                        value={options[2]} 
                        onChange={(e) => 
                            setOptions((val) => {
                                const newOptions = [...val]; 
                                newOptions[2] = e.target.value; 
                                return newOptions; 
                            })
                        }
                    />                    
                    
                    <Form.Control 
                        required 
                        size="sm" 
                        type="text" 
                        placeholder="Add option D" 
                        value={options[3]} 
                        onChange={(e) => 
                            setOptions((val) => {
                                const newOptions = [...val]; 
                                newOptions[3] = e.target.value; 
                                return newOptions; 
                            })
                        }
                    />
                </Stack>
            </Form.Group>

            {/* <Form.Group as={Row} className="mb-3" controlId="allowedTime">
                <Form.Label column sm="3">Add time( in minutes )</Form.Label>
                <Col sm="6">
                <Form.Control type="number" min={20} max={120} placeholder="Add allowed time" value={allowedTime} onChange={(e) => setAllowedTime(e.target.value)}/> 
                </Col>
            </Form.Group> */}
            </div>
            <div className='d-flex justify-content-end footer mt-3'>
            <Button variant="primary" className='btn-custom' type="submit" onClick={handleSubmit}>Ask Question</Button>
            </div>
           
        </Form>
        </>

    )
}

export default Teacher;