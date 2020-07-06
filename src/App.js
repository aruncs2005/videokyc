/* src/App.js */
import React, { useEffect, useState } from 'react'
import { API, graphqlOperation } from 'aws-amplify'
import { createTodo } from './graphql/mutations'
import { listTodos } from './graphql/queries'
import { withAuthenticator,AmplifySignOut } from '@aws-amplify/ui-react'
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

import Liveliness from './components/Liveliness'

import Upload from './components/Upload'
import Summary from './components/Summary'

import './App.css'

const initialState = { name: '', description: '' }


const App = () => {
  const [formState, setFormState] = useState(initialState)
  const [todos, setTodos] = useState([])

  useEffect(() => {
    fetchTodos()
  }, [])

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value })
  }

  async function fetchTodos() {
    try {
      const todoData = await API.graphql(graphqlOperation(listTodos))
      const todos = todoData.data.listTodos.items
      setTodos(todos)
    } catch (err) { console.log('error fetching todos') }
  }

  async function addTodo() {
    try {
      if (!formState.name || !formState.description) return
      const todo = { ...formState }
      setTodos([...todos, todo])
      setFormState(initialState)
      await API.graphql(graphqlOperation(createTodo, {input: todo}))
    } catch (err) {
      console.log('error creating todo:', err)
    }
  }

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
  };

  
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
  <Summary/>
  </Tab>
</Tabs>
    </Col>
  </Row>
  </Container>
  </div>
   
   

  )
}

const styles = {
  container: { width: '100%', margin: '0 auto', display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'center', padding: 20 },
  todo: {  marginBottom: 15 },
  input: { border: 'none', backgroundColor: '#ddd', marginBottom: 10, padding: 8, fontSize: 18 },
  todoName: { fontSize: 20, fontWeight: 'bold' },
  todoDescription: { marginBottom: 0 },
  button: { backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 18, padding: '12px 0px' }
}

export default withAuthenticator(App)