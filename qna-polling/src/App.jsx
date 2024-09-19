import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Teacher from './components/Teacher'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Stack from 'react-bootstrap/Stack';
import { Button } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import Submitted from './components/submitted'
import Student from './components/Student'



function App() {

  const [isTeacher, setTeacher] = useState(sessionStorage.getItem('isTeacher') || 0)
  const [isStudent, setStudent] = useState(sessionStorage.getItem('isStudent') || 0)
  const [studentName, setStudentName] = useState('') ;
  const [studentID, setStudentID] = useState(sessionStorage.getItem('student_id') || null)
  const [showSubmitted , setShowSubmitted] = useState(false)

  const submitStudent = (questionsData) => {
    if(studentName === ''){
      alert('Please enter your name');
      return
    } 
    let student_id = `${studentName.replace(' ','_')}_${Date.now()}`
    sessionStorage.setItem('studentName', studentName)
    sessionStorage.setItem('isStudent', 1)
    sessionStorage.setItem('isTeacher', 0)
    setStudentID(student_id)
    sessionStorage.setItem('student_id', student_id)
    setStudent(1)
  }

  const teacherQuestionSubmitted = () => {
    
  }
  if(showSubmitted){
    return (<Submitted />)
  }
  return (
    <>
      <Container style={{ marginTop: '10px',textAlign: 'center' }}>
          {!isTeacher && !isStudent ? <>
            <Row>
              <Col sm={12} >
                <Stack gap={2}>
                  <div>
                    Add your Name :
                    <input type="text" name="name" onChange={(e) => setStudentName(e.target.value)} />
                  </div>
                  <div>
                    <Button variant="primary" onClick={() => submitStudent()}>I am a Student</Button>
                  </div>
                </Stack>
              </Col>
              <Col sm={12}>
                <div>Are you a Teacher?
                  <Button variant="link" onClick={() => {
                    sessionStorage.setItem('isTeacher', 1)
                    setTeacher(1)
                    }}>Yes</Button>
                </div>
              </Col>
            </Row>
          </> : 
          <>
          {
            Number(isTeacher) ? <Teacher setShowSubmitted={setShowSubmitted}/> : <Student setShowSubmitted={setShowSubmitted}/>
          }
          </>
          
          }
          
      </Container>
    </>
  )

  
}

export default App
