﻿import React, { useEffect, useState, useContext } from 'react';
import { AuthenticationContext } from '../auth/AuthenticationContext'

import { ListGroup, ListGroupItem, Button, Table, Row, Stack } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { withRouter } from '../Common/with-router';
import { BrowserRouter, Route, useParams } from "react-router-dom";
import Certificate_Create from './Certificate_Create'
import Certificate_Edit from './CertificateForm'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
//import { faEnvelope, faTrashCan } from '@fortawesome/free-solid-svg-icons'


function CertificateList(props) {

    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const { update, claims } = useContext(AuthenticationContext);
    const [role, setRole] = useState(claims.find(claim => claim.name === 'role').value)

    //---------------------------------------
    //need to implement random select for examIds
    //-----------------------------------
    //const generateRandomNumber = () => {
    //    const randomNumber = Math.floor(Math.random() * questionAnswer.length);
    //    setRandomNumber(randomNumber)
    //}
    // --------------------------------

    useEffect(() => {
        axios.get('https://localhost:7196/api/Certificates')
            .then(res => {
                if (role === "candidate") {
                    // if the user is a candidate, show only active products
                    setData({ data: res.data.data.filter(item => item.active === true) },
                        () => { console.log(this.state.data) })
                    console.log(res.data.data)
                    this.setState(
                    );
                } else {
                    //if none of the above, show all products
                    setData(res.data.data)
                    console.log(res.data.data)
                }
            })
            .catch(err => {
                console.error(err);
            });

    }, [])

    const handleBuy = (id) => {
        //console.log("handle buy")
        const cert = data.filter(item => item.id === id)[0];
        //console.log(cert);
        //console.log(cert.exams[0].id);

        const examDTO = { id: cert.exams[0].id, cert }
        console.log(JSON.stringify(examDTO))

        axios.post(`https://localhost:7196/api/CandidateExam`, examDTO)
            .then(res => {
                console.log(res);
                //this.setState({ data: res.data.data });
            })
            .catch(err => {
                console.error(err);
            });
    }

    const handleDelete = (id) => {
        // Asks user if they are sure
        const confirmDelete = window.confirm("Are you sure you want to delete this certificate?");

        if (confirmDelete) {
            //send axios call with the request to delete using Id
            axios.delete(`https://localhost:7196/api/Certificates/${id}`)
                .then(response => {
                    console.log(response.data.data);
                    let newCerts = data.filter(item => item.id !== id)
                    setData(newCerts)
                    // this.setState(prevState => ({
                    //     data: prevState.data.filter(item => item.id !== id)
                    // }));
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    };

    const makebuttons = (certId) => {

        if (role === "candidate") {
            return (
                <td>
                    <div className='d-flex '>
                        <Button variant="success" onClick={() => handleBuy(certId)} >buy</Button>
                        <Button>details</Button>
                    </div>
                </td>
            );
        } else if ((role === "qualitycontrol")) {
            return (
                <td>
                    <Button onClick={() => { navigate(`/certificate/edit/${certId}`) }}>Details</Button>
                </td>
            );
        }
        return (
            <td>
                <div className='d-flex gap-2'>
                    <Button onClick={() => { navigate(`/certificate/edit/${certId}`) }}>Edit</Button>
                    <Button variant="dark" onClick={() => handleDelete(certId)}>
                        Delete
                    </Button>
                </div>
            </td>
        );

    };

    return (
        <div className='container-fluid'>
            {role === "admin" ?
                <Button variant='dark' 
                className='d-grid gap-2 col-6 mx-auto py-2 my-2' 
                onClick={()=> navigate('/certificate/create')}
                > Create a new Certificate </Button>
                : null}
            <Table striped hover borderless align-middle className="text-center" id='list_of_allcerts'>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th className='ml-2' >Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((certificate, index) => (
                        <tr key={index}>
                            <td>{certificate.title}</td>
                            <td>{certificate.description}</td>
                            <td>{certificate.category}</td>
                            <td>{certificate.price}</td>

                            {makebuttons(certificate.id)}
                            <td>
                            </td>

                        </tr>

                    ))}
                </tbody>
            </Table>
        </div>
    );
};



export default CertificateList;