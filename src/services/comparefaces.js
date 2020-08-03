import { API } from 'aws-amplify';


const compare  = async data =>{
    console.log("inside compare faces service:::", data);
    const apiName = 'CompareFacesAPI'; 
    const path = '/comparefaces'; 
    const myInit = {
        body: { image_bytes_live: data["image_bytes_live"], image_bytes_scan: data["image_bytes_scan"] }, 
        headers: {},
    };

 return await API
  .post(apiName, path, myInit)
    
}


export default {
  compare
  }