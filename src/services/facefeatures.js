import Amplify, { API } from 'aws-amplify';
import awsconfig from '../aws-exports';

Amplify.configure(awsconfig);


const identify_face_features  = data =>{
    const apiName = 'livelinessapi'; 
    const path = '/facefeatures'; 
    const myInit = {
        body: { image_bytes: data}, 
        headers: {},
    };

    API
  .post(apiName, path, myInit)
  .then(response => {
    // Add your code here
    return response
  })
  .catch(error => {
    console.log(error.response);
  });

    
}


export default {
    identify_face_features,
  }