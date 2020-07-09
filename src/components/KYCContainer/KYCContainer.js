import React, { useEffect, useState } from 'react'
import Amplify,{ API, graphqlOperation } from 'aws-amplify'

import { AmplifySignOut } from '@aws-amplify/ui-react'
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import Jumbotron from 'react-bootstrap/Jumbotron'
import Button from 'react-bootstrap/Button'

import Liveliness from '../../components/Liveliness'

import Upload from '../../components/Upload'
import Summary from '../../components/Summary'


export default ({}) => {


  const [currentTabKey, setCurrentTabKey] = useState("welcome");
  const [faceDetails, setFaceDetails] = useState({
    liveFaceUrl:'',
    scannedFaceUrl:'',
    livelinessStatus:false,
    matchScore:0,
    name:'',
    dob:'',
    gender:'',
    documentType:'',
    documentNumber:'',
    ageRange:{},
    genderFromFace:''
  })

  const updateFaceDetails = (faceDetails) =>{
    setFaceDetails(faceDetails);
  }

  useEffect(() => {
    //fetchTodos()
  }, [])

 

  const startKyc = () => {
    setCurrentTabKey("Liveliness");

  }

  const onSelectTab = (eventkey) => {
    console.log("printing event key ",eventkey);
    setCurrentTabKey(eventkey);
  }

  const setTabStatus = (value) => {
    console.log("current tab value ", value);
    setCurrentTabKey(value);
  }


  
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
    <Tabs defaultActiveKey={currentTabKey} activeKey = {currentTabKey} id="uncontrolled-tab-example" onSelect={onSelectTab}>
    <Tab eventKey="welcome" title="Welcome">
    <Jumbotron>
  <h2 className="tab-element-align">Welcome to video KYC</h2>
  <div className="tab-element-align">
    <p>The KYC process consists of 3 simple steps. </p>
      <ul>
          <li>Liveliness Detection - The user will do a series of face gestures to determine whether its a live feed</li>
          <li>Upload Documents - upload valid ID documents to use for verification.</li>
          <li>Validation and summary</li>
      </ul>
  </div>
  <p className="tab-button-align">
    <Button variant="primary" onClick = {startKyc}>Start</Button>
  </p>
</Jumbotron>
  </Tab>
  <Tab eventKey="Liveliness" title="Liveliness Test" disabled>

    <div><Liveliness setTabStatus={setTabStatus} faceDetails={faceDetails} updateFaceDetails = {updateFaceDetails}/></div>
  </Tab>
  <Tab eventKey="UploadDocs" title="Upload Documents" disabled>
  <div ><Upload setTabStatus={setTabStatus}/></div>
  </Tab>
  <Tab eventKey="AnalysisDetails" title="Details of Analysis" disabled>
  <Summary setTabStatus={setTabStatus} faceDetails={faceDetails} />
  </Tab>

</Tabs>
    </Col>
  </Row>
  </Container>
  </div>
   
   

  )
}

