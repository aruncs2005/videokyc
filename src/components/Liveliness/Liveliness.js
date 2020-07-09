import React,{ useState, useEffect } from "react";
import Webcam from "react-webcam";
import Button from 'react-bootstrap/Button'
import gest_data from './gestures.json'
import Alert from 'react-bootstrap/Alert'
import Accordion from "react-bootstrap/Accordion"
import Card from "react-bootstrap/Card"
import livelinessAPI from "../../services/facefeatures";
import ProgressBar from "react-bootstrap/ProgressBar"
const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
  };

function shuffleArray(array) {
    let i = array.length - 1;
    for (; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

function get_face_object(resp_data){

  let face_object = {
    gender: resp_data["Gender"],
    smile: resp_data["Smile"],
    agerange: {
      low: resp_data["AgeRange"]["Low"],
      high: resp_data["AgeRange"]["High"],
    },
    pose:{
      roll: resp_data["Pose"]["Roll"],
      yaw: resp_data["Pose"]["Yaw"],
      pitch: resp_data["Pose"]["Pitch"],
    },
    mouthopen: resp_data["MouthOpen"]

  };

  return face_object;
}


  export default ({setTabStatus,faceDetails,updateFaceDetails}) => {
    const [gestures, setGestures] = useState([]);
    const [showSpinner,setShowSpinner] = useState(false);
    const [alertMessage, setAlertMessage] = useState("You will be asked to do a series of random gestures which will enable us to detect a live feed.");
    const [showProgress, setShowProgress] = useState(false);
    const [progressValue, setProgressValue] = useState(5);
    const [showProceed, setShowProceed] = useState(false);
    const [gesture1Details,setGesture1Details] = useState({});
    const [gesture2Details,setGesture2Details] = useState({});


    useEffect(() => {
      setGestures(gest_data["gestures"])
    }, []);

    const proceedToNext = () => {
      setTabStatus("UploadDocs");

    }

    const validateGesture = (gestType,gestFaceDetails) =>{
      if(gestType == 'smile'){
        return gestFaceDetails["smile"];
        
      }
      if(gestType == 'eyesOpen'){
        return gestFaceDetails["eyesOpen"];
  
      }

      if(gestType == 'mouthOpen'){
        return gestFaceDetails["mouthOpen"];
      }

      if(gestType == 'eyesClose'){
        return !gestFaceDetails["eyesOpen"];
      }

      if(gestType == 'headRight'){
          if(gestFaceDetails["pose"]["yaw"] < -10){
            return true;
          }
          return false;
      }
      if(gestType == 'headLeft'){
        if(gestFaceDetails["pose"]["yaw"] > 10){
          return true;
        }
        return false;
      }

    }

    const processGestures = () => {
        console.log(gesture1Details);
        const gest_type1 = gesture1Details["gesture"]["name"]
        const gest_type2 = gesture2Details["gesture"]["name"]
        const gest1Status = validateGesture(gest_type1,gesture1Details);
        const gest2Status = validateGesture(gest_type2,gesture2Details);
        if(gest1Status && gest2Status){
          faceDetails["livelinessStatus"] = true;
          faceDetails["liveFaceUrl"] = gesture1Details["encoded_face_image"];
          faceDetails["ageRange"] = gesture1Details["agerange"];
          faceDetails["genderFromFace"] = gesture1Details["gender"];
          updateFaceDetails(faceDetails);
          setProgressValue(100);
          setShowProceed(true);
          setAlertMessage("Thank you !!! Liveliness test is successful");
        }
        else{
          setAlertMessage("Test unsuccessful, Please refresh the page and try again !!!");
        }
     
    }

    const gesture_2 = (shuffled_gestures) => {
      console.log("invoking gesture 2");
      setAlertMessage(shuffled_gestures[1]["description"]);
      setShowSpinner(true);
      setTimeout(() => {
        setShowSpinner(false);
        const imageSrc = webcamRef.current.getScreenshot({width: 800, height: 450});
        console.log("Gesture name ::",shuffled_gestures[0]["description"]);
        //console.log("based 64 data :::",imageSrc);
        
        //invoke api endpoint

        livelinessAPI.identify_face_features(imageSrc).then(response => {
          
          response["gesture"] = shuffled_gestures[1];
          console.log(response);
          setProgressValue(70);
          let temp = gesture2Details;
          temp["smile"] = response["smile"];
          temp["gesture"] = shuffled_gestures[1];
          temp["agerange"] = response["agerange"];
          temp["gender"] = response["gender"];
          temp["eyesOpen"] = response["eyesOpen"];
          temp["mouthOpen"] = response["mouthOpen"];
          temp["pose"] = response["pose"];
          temp["encoded_face_image"] = response["encoded_face_image"];

          setGesture2Details(temp);
          processGestures();
          
        })
        
      },3000);

    };


    const gesture_1 = (shuffled_gestures,gesture_2) => {
      setShowSpinner(false);
      const imageSrc = webcamRef.current.getScreenshot({width: 800, height: 450});
      console.log("Gesture name ::",shuffled_gestures[0]["description"]);
      //console.log("based 64 data :::",imageSrc);

      setShowSpinner(true);
      setTimeout(() => {
        const imageSrc2 = webcamRef.current.getScreenshot({width: 800, height: 450});       
     
        //console.log("based 64 data :::",imageSrc2);
        setShowSpinner(false);
        //trigger gesture 2 


        livelinessAPI.identify_face_features(imageSrc).then(response => {
          // Add your code here
          
          response["gesture"] = shuffled_gestures[0];
          console.log("respone from API call :::",response);
          let temp = gesture1Details;
          temp["smile"] = response["smile"];
          temp["gesture"] = shuffled_gestures[0];
          temp["agerange"] = response["agerange"];
          temp["gender"] = response["gender"];
          temp["eyesOpen"] = response["eyesOpen"];
          temp["mouthOpen"] = response["mouthOpen"];
          temp["pose"] = response["pose"];
          temp["encoded_face_image"] = response["encoded_face_image"];


          setGesture1Details(temp);

          console.log(response);
          setProgressValue(40);
          gesture_2(shuffled_gestures);

        })
        .catch(error => {
          console.log(error.response);
        });
    
        }, 300);

    };


    const start_test = () => {
      setShowProgress(true);
      let shuffled_gestures = shuffleArray(gestures)
      setShowSpinner(true)
      // wait for 3 seconds capture picture
      
      // wait for 100 ms and take snapshot
      setAlertMessage(shuffled_gestures[0]["description"]);
      setTimeout(() => gesture_1(shuffled_gestures,gesture_2), 3000);

      
    }

    const webcamRef = React.useRef(null);
   
    const capture = React.useCallback(
      () => {
        const imageSrc = webcamRef.current.getScreenshot({width: 800, height: 450});
      },
      [webcamRef]
    );
   
    return (
      <>
         <Accordion defaultActiveKey="0">
                <Card>
                    <Card.Header>
                    <Accordion.Toggle as={Button} variant="link" eventKey="0">
                    {alertMessage}
                    </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="0">
                    <Card.Body>
                    {/* <Alert variant="primary">
    <h5 className="text-center">{alertMessage}</h5>
        </Alert> */}
        {showSpinner && <div className="spinner" ></div>}
        <div className="video-padding">
        <Webcam
          audio={false}
          height={450}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={800}
          videoConstraints={videoConstraints}

        />
        </div>
           {!showProgress && <div className="live-button-align">
            <Button variant="outline-dark" className="button-padding" onClick={start_test}>Start</Button>
            
          </div>}

          {showProgress &&  <div className="live-progressbar"><ProgressBar now={progressValue} label={`${progressValue}%`} /></div> }

          {showProceed && <div className="live-button-align">
            <Button variant="outline-dark" className="button-padding" onClick={proceedToNext}>Proceed</Button>
          </div>}

      
          
                    </Card.Body>
                    </Accordion.Collapse>
                </Card>

        </Accordion>
      </>
    );
  };