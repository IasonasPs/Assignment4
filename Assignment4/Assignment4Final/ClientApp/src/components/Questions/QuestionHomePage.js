import { Form, Button, Col, Row, FloatingLabel, Stack , Table, Container  } from 'react-bootstrap';
import {React,useState,useEffect} from 'react';

import axios from 'axios';
import { Link } from 'react-router-dom';
import Delete from './QuestionDelete';
import QuestionEdit from './QuestionEdit';

function Questions()
{
    const[data,setData] = useState([]);


    useEffect(() => {
        axios.get('https://localhost:7196/api/questions').then((response) => {  setData(response.data.data);
        }).catch((error) => {
            console.log(error);
        });
      }, []);
   
    //   console.log("Testing in Questions");
    //   console.log(data[0]);
      // resp.data.data[0].options[0].text


      //--------------------------------------------------
      //filters the text from the raw html 
      function Replace(temp)
      {
        var parser = new DOMParser();

        var doc = parser.parseFromString(temp,'text/html');

        return doc.body.innerText;

      }
      //--------------------------------------------------
      //--------------------------------------------------HANDLE DELETE
     const  handleDelete = (id) => {
        // Asks user if they are sure
        const confirmDelete = window.confirm("Are you sure you want to delete this certificate?");
        if (confirmDelete) {
            //send axios call with the request to delete using Id
            axios.delete(`https://localhost:7196/api/Questions/${id}`)
                .then(response => 
                    {
                                    setData(data.filter(item => item.id !== id));
                                    
                    }
                )
                .catch(function (error) {
                    console.log(error);
                });

                
                }
        }
  
//-----------------------------------------------------------
    return (

        <Container fluid="md">
            <Link to="/Questions/QuestionCreate"><Button variant='dark'>Create new Question</Button></Link> 
            <div>
                <Table hover striped >
                                <thead>
                                    <tr>
                                        <th scope='Col'>Id</th>
                                        <th scope='col'>MainText</th>
                                        <th scope='col'>Topic</th>
                                        <th scope='col'></th>
                                        <th scope='col'></th>
                                    </tr>
                                </thead>

                                <tbody>
                                        {data.map((item,index) => (
                                            <tr key={item.id}>
                                                <td>{item.id != null && item.id}</td>
                                                <td>{Replace(item.text)}</td>
                                                <td>{item.topic === null ? "No topic selected" : item.topic.name}</td>

                                               

                                                {/* <td><Link to='/Questions/QuestionEdit'> <Button  onClick={(event) => QuestionEdit(event)} name={index}>Edit</Button></Link> </td>

                                                <td><Button variant='dark' onClick={() => handleDelete(item.id)} name={index}>Delete</Button></td> */}
                                            </tr>
                                            
                                            ))}
                                </tbody>
                    </Table>
            </div>
          
              
        </Container>
    )
    


}



















export default Questions;
