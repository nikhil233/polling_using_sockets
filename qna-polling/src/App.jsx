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
            <Stack gap={3}>
              <div style={{textAlign:"center"}}>
                <h1>Welcome to the Live Polling System</h1>
                <p>Please select the role that best describes you to begin using the live polling system</p>
                </div>
               
            <Row>
              <Col>
                <Form.Check
                  inline
                  className='raidoBoxwarpper'
                  label={
                    <>
                    <div className='raidoBox'>
                     <h5>Are you a Student</h5>
                      <p>
                      Lorem Ipsum is simply dummy text of the printing and typesetting industry
                      </p>
                    </div>
                    </>
                  }
                  name="isStudent"
                  type={"radio"}
                  id={`init-radio-1`}
                  onChange={() => setUserTypeFunc(1)}
                />
              </Col>
              <Col>
              <Form.Check
                  inline
                  className='raidoBoxwarpper'
                  label={
                    <>
                    <div className='raidoBox'>
                     <h5>Are you a Teacher</h5>
                      <p>
                        Submit answers and view live poll results in real-time.
                      </p>
                    </div>
                    </>
                  }
                  name="isStudent"
                  type={"radio"}
                  id={`init-radio`}
                  onChange={() => setUserTypeFunc(2)}
                />

              </Col>
            </Row>
            </Stack>
          </> : 
          <Submitted userType={userType} userID={userID} submitStudent={submitStudent} setStudentName={setStudentName} studentName={studentName}/>
          
          }
          
      </Container>
    </>
  )

  
}

export default App
