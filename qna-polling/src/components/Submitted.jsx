import { useEffect ,useState} from 'react'
import {Container, Row, Stack} from 'react-bootstrap'
import { io } from "socket.io-client";

const Submitted = () => {
    const [optionsPerc,setOptionPerc] = useState({})
    const [submitData,setSubmitData] = useState({})
    const [isloaded,setIsLoaded] = useState(false)
    const [questionData,setQuestionData] = useState({})
    const [total,setTotal]=useState(0)
    let socket;

    const getActiveQuestion = async () => { 
        try{
            setIsLoaded(false)
            const url = "http://localhost:8000/getactivequestion";
            const respone = await fetch(url);
            const {question_data} = await respone.json();
            setQuestionData(question_data)
            getAnswers(question_data._id , question_data)
            setIsLoaded(true)
        }catch(err){
            console.log("err",err)
        }
    }

    const getAnswers = async (question_id , question_data) => {
        try{
            setIsLoaded(false)
            const url = `http://localhost:8000/getanswers?question_id=${question_id}&user_id=${sessionStorage.getItem("student_id")}`;
            const respone = await fetch(url);
            const data = await respone.json();
            setSubmitData(data?.answers_data)
             const n = question_data?.options?.length;
            const optionsCounts = Object.assign({}, Array.from({ length: n }, (_, i) => (0)));
            let total = 0;
            data?.answers_data.forEach((item) => {
                optionsCounts[item?._id] = item?.submitted
                total += item?.submitted
            })
            setOptionPerc(optionsCounts)
            setTotal(total)
            setIsLoaded(true)
        }catch(err){
            console.log("err",err)
        }
    }
    useEffect(() => {
        getActiveQuestion();
    },[] ); 
    
    useEffect(() => {
        if(isloaded && !socket){
            socket = io("http://localhost:8000/getanswers",{
                transports: ["websocket"],
                retries:3,
                reconnectionAttempts: 3, // Set the maximum number of reconnection attempts
                reconnectionDelay:5000 //5 secs 
              });
      
             
                socket.on("newAnswer", (data) => {
                    setOptionPerc((prev)=>({ ...prev, [data.answer]: prev[data.answer] + 1 }));
                    setTotal((prev)=>prev + 1)
                });
              return () => {
                  if (socket) {
                    socket.disconnect();
                  }
            };
        }
       
    },[isloaded])
    return (
        <Container>
            <Row>
               <div>
                    Question: {questionData?.question}
               </div>
               <Stack gap={3}>
                    {
                        questionData?.options?.map((option,index) => { 
                            return (<Stack>
                                <div className="p-2">{option}</div>
                                <div className="p-2 ms-auto">{optionsPerc[index]? `${(optionsPerc[index]/total) * 100} %` : "0 %"}</div>
                            </Stack>)
                         })
                    }
               </Stack>
            </Row>
        </Container>
    )
}

export default Submitted