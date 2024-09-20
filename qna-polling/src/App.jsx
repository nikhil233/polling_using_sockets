import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Teacher from './components/Teacher'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Stack from 'react-bootstrap/Stack';
import { Button,Form } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import Submitted from './components/submitted'
import Student from './components/Student'



function App() {

  const [userType, setUserType] = useState(sessionStorage.getItem('user_type') || 0)
  const [studentName, setStudentName] = useState('') ;
  const [userID, setUserID] = useState(sessionStorage.getItem('user_id') || null)
  const [showSubmitted , setShowSubmitted] = useState(false)

  const submitStudent = (questionsData) => {
    if(studentName === ''){
      alert('Please enter your name');
      return
    } 
    let student_id = `${studentName.replace(' ','_')}_${Date.now()}`
    sessionStorage.setItem('studentName', studentName)
    setUserID(student_id)
    sessionStorage.setItem('user_id', student_id)
  }

  const setUserTypeFunc = (val) => {
      setUserType(val)
      sessionStorage.setItem('user_type', val)
      setShowSubmitted(true)
  }

  return (
    <>
      <Container >
          {userType === 0 ? <>
            <Row>
              <Col sm={12} >
                {/* <Stack gap={2}>
                  <div>
                    Add your Name :
                    <input type="text" name="name" onChange={(e) => setStudentName(e.target.value)} />
                  </div>
                  <div>
                    <Button variant="primary" onClick={() => submitStudent()}>I am a Student</Button>
                  </div>
                </Stack> */}
              </Col>
              <Col sm={12}>
                {/* <div>Are you a Teacher?
                  <Button variant="link" onClick={() => {
                    sessionStorage.setItem('isTeacher', 1)
                    setTeacher(1)
                    }}>Yes</Button>
                </div> */}
              </Col>

              <Col>
                <Form.Check
                  inline
                  label="Are you a Student"
                  name="isStudent"
                  type={"radio"}
                  id={`inline-1`}
                  onChange={() => setUserTypeFunc(1)}
                />
              </Col>
              <Col>
              <Form.Check
                  inline
                  label="Are you a Teacher"
                  name="isStudent"
                  type={"radio"}
                  id={`inline-2`}
                  onChange={() => setUserTypeFunc(2)}
                />

              </Col>
            </Row>
          </> : 
          <Submitted userType={userType} userID={userID} submitStudent={submitStudent} setStudentName={setStudentName} studentName={studentName}/>
          
          }
          
      </Container>
    </>
  )

  
}

export default App
