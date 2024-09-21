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
import Submitted from './components/Submitted_new'
import Student from './components/Student'

console.log("env",import.meta.env)

function App() {

  const [userType, setUserType] = useState(sessionStorage.getItem('user_type') || 0)
  const [studentName, setStudentName] = useState(sessionStorage.getItem('studentName') || '') ;
  const [userID, setUserID] = useState(sessionStorage.getItem('user_id') || null)
  const [showSubmitted , setShowSubmitted] = useState(sessionStorage.getItem('user_type') ? true : false)
  const [radioValue, setRadioValue] = useState(0);
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
  const getTeacherCount = async() => {
    try{
        const url = import.meta.env.VITE_ENDPOINT+"/getteachercount";
        const respone = await fetch(url);
        const {teacher_count} = await respone.json();
        return teacher_count
    }catch(err){
        console.log("err",err)
        return 0;
    }
  }

  const setUserTypeFunc = async (val) => {
      if(userType === 2){
        let teachercount = await getTeacherCount();
        if(teachercount > 0){
          alert("Teacher already exits , try after sometime");
          return
        }
      }
      sessionStorage.setItem('user_type', userType)
      setShowSubmitted(true)
  }

  return (
    <div style={{margin:"20px 0"}} className='d-flex  align-items-center'>
      <Container >
          {userType === 0 || !showSubmitted ? <>
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
                  onChange={() => setUserType(1)}
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
                  onChange={() => setUserType(2)}
                />

              </Col>
            </Row>
            <div className='text-center'>
              <Button className='btn-custom' variant="primary" onClick={() => setUserTypeFunc()}>Continue</Button>

            </div>
            </Stack>
          </> : 
          <Submitted userType={userType} userID={userID} submitStudent={submitStudent} setStudentName={setStudentName} studentName={studentName}/>
          
          }
          
      </Container>
    </div>
  )

  
}

export default App
