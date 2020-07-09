/* src/App.js */
import React, { useState } from 'react'
import Amplify from 'aws-amplify'
import { withAuthenticator } from '@aws-amplify/ui-react'

import KYCContainer from './components/KYCContainer'

import './App.css'
import awsconfig from './aws-exports';

const initialState = { name: '', description: '' }

Amplify.configure(awsconfig);
const App = () => {
  
 
  
  return (
   <div>
     <KYCContainer/>
  </div>
   
  )
}

export default withAuthenticator(App)