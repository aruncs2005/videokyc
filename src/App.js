/* src/App.js */
import React, { useEffect, useState } from 'react'
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

import KYCContainer from './components/KYCContainer'

import './App.css'

const initialState = { name: '', description: '' }


const App = () => {
  const [formState, setFormState] = useState(initialState)
  const [todos, setTodos] = useState([])

  useEffect(() => {
    // fetchTodos()
  }, [])

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value })
  }

 

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
  };



  
  return (
   <div>
     <KYCContainer/>
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