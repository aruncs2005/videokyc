/* src/App.js */
import React, { useState } from 'react'
import { withAuthenticator } from '@aws-amplify/ui-react'

import KYCContainer from './components/KYCContainer'

import './App.css'

const initialState = { name: '', description: '' }


const App = () => {
  
 
  
  return (
   <div>
     <KYCContainer/>
  </div>
   
  )
}

export default withAuthenticator(App)