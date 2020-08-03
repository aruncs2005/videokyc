import React,{ useState, useEffect } from "react";
import Image from 'react-bootstrap/Image'
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ProgressBar from 'react-bootstrap/ProgressBar'
import ListGroup from 'react-bootstrap/ListGroup'
import Table from 'react-bootstrap/Table'


export default ({setTabStatus,faceDetails}) => {
  
    const [gestures, setGestures] = useState([]); 
    //const [liveFaceUrl, setLiveFaceUrl] = useState(faceDetails["liveFaceUrl"]);

    useEffect(() => {
        
      }, []);
    
    return (

        <div>
            <Accordion defaultActiveKey="0">
                <Card>
                    <Card.Header>
                    <Accordion.Toggle as={Button} variant="link" eventKey="0">
                        Overall KYC Status
                    </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="0">
                    <Card.Body>Congrats KYC successfully done !!!!!</Card.Body>
                    </Accordion.Collapse>
                </Card>

                <Card>
                    <Card.Header>
                    <Accordion.Toggle as={Button} variant="link" eventKey="0">
                        Face Match Details.
                    </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="0">
                    <Card.Body>

                    <Container>
                        <Row>
                            <Col xs={6} md={4}>
                            <Image src={`data:image/jpeg;base64,${faceDetails["liveFaceUrl"]}`}  rounded />
                            </Col>
                            <Col xs={6} md={4}>
                            <Card>
                                <Card.Header as="h5">Face Match Details</Card.Header>
                                <Card.Body>
                                    <Card.Title>Match score</Card.Title>
                                    <ProgressBar now={faceDetails["matchScore"]} label={`${faceDetails["matchScore"]}%`}  />
                                    <Card.Text>
                                    Photo on left is the live picture and photo on right is obtained from ID document.
                                    </Card.Text>
                                   
                                </Card.Body>
                            </Card>
                            
                            </Col>
                            <Col xs={6} md={4} className="summary-image">
                            <Image src={`data:image/jpeg;base64,${faceDetails["scannedFaceUrl"]}`}  thumbnail />
                            </Col>
                        </Row>
                    </Container>

                    </Card.Body>
                    </Accordion.Collapse>
                </Card>
                <Card>
                    <Card.Header>
                    <Accordion.Toggle as={Button} variant="link" eventKey="0">
                       Data Extracted from ID documents.
                    </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="0">
                    <Card.Body>
                        <Container>
                            <Row>
                           
                            <Table responsive>
                               
                                <tbody>
                                    <tr>
                                    
                                    <td>Name</td>
                                    <td>{faceDetails["name"]}</td>
                                    </tr>
                                    <tr>
                                   
                                    <td>Date of Birth</td>
                                    <td>{faceDetails["dob"]}</td>
                                    </tr>
                                    <tr>
                                   
                                    <td>Gender</td>
                                    <td>{faceDetails["gender"]}</td>
                                    </tr>
                                    <tr>
                                   
                                   <td>ID Document Type</td>
                                   <td>{faceDetails["documentType"]}</td>
                                   </tr>
                                   <tr>
                                   
                                   <td>ID Document Number</td>
                                   <td>{faceDetails["documentNumberMasked"]}</td>
                                   </tr>
                                   <tr>
                                   
                                   <td>Issuing Authority</td>
                                   <td>{faceDetails["issuingAuthority"]}</td>
                                   </tr>
                                </tbody>
                                </Table>
                          
                            </Row>
                        </Container>

                    </Card.Body>
                    </Accordion.Collapse>
                </Card>

            
            </Accordion>
        </div>
    )
};