import React, { useEffect, useState } from 'react'
import Webcam from "react-webcam";
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import Jumbotron from 'react-bootstrap/Jumbotron'
import Button from 'react-bootstrap/Button'
import Alert from "react-bootstrap/Alert"

import { withAuthenticator,AmplifySignOut } from '@aws-amplify/ui-react'

import Liveliness from '../Liveliness'
import Upload from '..//Upload'
import Summary from '../Summary'

class KYCContainer extends React.Component {
    constructor(props) {
      super(props);
      
      this.state = {
        liveFaceUrl:'result1.png',
        scannedFaceUrl:'result2.png',
        matchScore:90,
        name:'Jane Doe',
        dob:'01/01/2000',
        gender:'Female',
        documentType:'Aadhaar',
        documentNumber:'XXXX-XXXX-2323'
      }
    }
  
  
  
    render() {
      
        const name = this.state.name;
  
      return (
        <div>
          <Container>
            <Row>
                <Col>
                <Navbar bg="dark" variant="dark">
                <Navbar.Brand href="#"><h2 className="app-title">Video KYC</h2></Navbar.Brand>
                <span className="logout">
                <AmplifySignOut/>
                </span>
                </Navbar>
                </Col>
            </Row>
            <Row><Col><br></br></Col></Row>
            <Row>
                <Col>
                <Tabs defaultActiveKey="welcome" id="uncontrolled-tab-example">
                <Tab eventKey="welcome" title="Welcome">
                <Jumbotron>
            <h2 className="tab-element-align">Welcome to video KYC</h2>
            <p className="tab-element-align">
                The KYC process consists of 3 simple steps. 
                <ul>
                    <li>Liveliness Detection - The user will do a series of face gestures to determine whether its a live feed</li>
                    <li>Upload Documents - upload valid ID documents to use for verification.</li>
                    <li>Validation and summary</li>
                </ul>
            </p>
            <p className="tab-button-align">
                <Button variant="primary">Start</Button>
            </p>
            </Jumbotron>
            </Tab>
            <Tab eventKey="Liveliness" title="Liveliness Test">

                <div><Liveliness/></div>
            </Tab>
            <Tab eventKey="UploadDocs" title="Upload Documents">
            <div ><Upload/></div>
            </Tab>
            <Tab eventKey="summary" title="Summary">
            <Summary 
                name={this.state.name} 
                liveFaceUrl={this.state.liveFaceUrl}
                scannedFaceUrl={this.state.scannedFaceUrl}
                matchScore={this.state.matchScore}
                dob={this.state.dob}
                gender={this.state.gender}
                documentType={this.state.documentType}
                documentNumber={this.state.documentNumber}
            />
            </Tab>
            </Tabs>
                </Col>
            </Row>
            </Container>
        </div>
      );
    }
  }

  export default KYCContainer