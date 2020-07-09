import { API } from 'aws-amplify';


const identify_face_features  = async data =>{
    console.log("inside liveliness service:::", data);
    const apiName = 'livelinessdetector'; 
    const path = '/liveliness'; 
    const myInit = {
        body: { image_bytes: data, height: 450, width:800}, 
        headers: {},
    };

 return await API
  .post(apiName, path, myInit)
 

    
}


export default {
    identify_face_features,
  }