
import { useEffect, useState } from 'react';
import {Form, Row,Col, Button} from 'react-bootstrap';
import { io } from "socket.io-client";



const Teacher = ({setShowSubmitted}) => {

    const [teacherName,setTeacherName] = useState('')
    const [question,setQuestion] = useState('')
    const [options,setOptions] = useState([])
    const [answer,setAnswer] = useState([])
    const [allowedTime,setAllowedTime] = useState(1)
     const handleSubmit = async (e) => {
        e.preventDefault()
        const jsonData = {
            teacher_name :teacherName,
            question : question,
            options:options,
            answer:answer,
            allowed_time:allowedTime * 60
        }
        const url = "http://localhost:8000/addquestion"
        // console.log(data)
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

    return (
        <Form>
            <Form.Group as={Row} className="mb-3" controlId="teacherName" onSubmit={handleSubmit} >
                <Form.Label column sm="3">Teacher Name</Form.Label>
                <Col sm="6">

                <Form.Control
                required
                 type="text" placeholder="Enter Name" value={teacherName} onChange={(e) => setTeacherName(e.target.value)} />
                </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3" controlId="question">
                <Form.Label column sm="3">Question</Form.Label>
                <Col sm="6">
                <Form.Control required type="text" placeholder="Add question" value={question}  onChange={(e) => setQuestion(e.target.value)}/> 
                </Col>
            </Form.Group>
            <Form.Group as={Row} style={{marginLeft: '50px'}} className="mb-3" controlId="options">
                <Row>
                   

                    <Form.Label column sm="3">
                        <Form.Check 
                            type={'checkbox'}
                            inline
                            onChange={(e) => updateAnswer(e.target.checked , 0)}
                            checked={answer.includes(0)}
                        />
                        Options A
                    </Form.Label>  
                    <Col sm="6">
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

                    </Col>
                </Row>
                <Row>
                    <Form.Label column sm="3">
                        <Form.Check 
                            type={'checkbox'}
                            inline
                            onChange={(e) => updateAnswer(e.target.checked , 1)}
                            checked={answer.includes(1)}

                        />
                        Options B
                    </Form.Label>  
                    <Col sm="6">
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
                    </Col>
                </Row>
                <Row>
                    <Form.Label column sm="3">
                    <Form.Check 
                            type={'checkbox'}
                            inline
                            onChange={(e) => updateAnswer(e.target.checked , 2)}
                            checked={answer.includes(2)}

                        />
                        Options C</Form.Label>  
                    <Col sm="6">
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
                    </Col>
                </Row>
                <Row>
                    <Form.Label column sm="3">
                    <Form.Check 
                            type={'checkbox'}
                            inline
                            onChange={(e) => updateAnswer(e.target.checked , 3)}
                            checked={answer.includes(3)}

                        />
                        Options D</Form.Label>  
                    <Col sm="6">
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
                    </Col>
                </Row>
                
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="allowedTime">
                <Form.Label column sm="3">Add time( in minutes )</Form.Label>
                <Col sm="6">
                <Form.Control type="number" min={20} max={120} placeholder="Add allowed time" value={allowedTime} onChange={(e) => setAllowedTime(e.target.value)}/> 
                </Col>
            </Form.Group>

            <Button variant="primary" type="submit" onClick={handleSubmit}>Submit</Button>
           
        </Form>
    )
}

export default Teacher;