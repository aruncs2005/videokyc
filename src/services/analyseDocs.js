import { API } from 'aws-amplify';


const extractDetails  = async data =>{
    console.log("inside extract details service:::", data);
    const apiName = 'AnalyseDocumentsAPI'; 
    const path = '/analysedocs'; 
    const myInit = {
        body: { file_path: data["path"], file_type: data["type"] }, 
        headers: {},
    };

 return await API
  .post(apiName, path, myInit)
    
}


export default {
  extractDetails
  }