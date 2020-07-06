import React,{ useState, useEffect } from "react";
import Webcam from "react-webcam";
import Button from 'react-bootstrap/Button'
import gest_data from './gestures.json'
import Alert from 'react-bootstrap/Alert'
import Accordion from "react-bootstrap/Accordion"
import Card from "react-bootstrap/Card"

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

  export default () => {
    const [gestures, setGestures] = useState([]);
    const [showSpinner,setShowSpinner] = useState(false);
    const [alertMessage, setAlertMessage] = useState("You will be asked to do a series of random gestures which will enable us to detect a live feed.");
    
    useEffect(() => {
      setGestures(gest_data["gestures"])
    }, []);

    const invoke_api = (shuffled_gestures) => {
      setShowSpinner(false);
      const imageSrc = webcamRef.current.getScreenshot();
      console.log("Gesture name ::",shuffled_gestures[0]["description"]);
      console.log("based 64 data :::",imageSrc);
      setTimeout(() => {
        const imageSrc2 = webcamRef.current.getScreenshot();
        setAlertMessage(shuffled_gestures[1]["description"]);
        setShowSpinner(true);
        setTimeout(() => {
          const imageSrc3 = webcamRef.current.getScreenshot();
          console.log("Gesture name ::",shuffled_gestures[1]["description"]);
          console.log("based 64 data :::",imageSrc3);
          setShowSpinner(false);
        }, 3000);
      }, 3000);
      // make api call here 
     

    }

    const start_test = () => {
      let shuffled_gestures = shuffleArray(gestures)
      setShowSpinner(true)
      // wait for 3 seconds capture picture
      
      // wait for 100 ms and take snapshot
      setAlertMessage(shuffled_gestures[0]["description"]);
      setTimeout(() => invoke_api(shuffled_gestures), 3000);

      
    }

    const webcamRef = React.useRef(null);
   
    const capture = React.useCallback(
      () => {
        const imageSrc = webcamRef.current.getScreenshot();
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
           <p className="live-button-align">
            <Button variant="outline-dark" className="button-padding" onClick={start_test}>Start</Button>
          </p>

                    </Card.Body>
                    </Accordion.Collapse>
                </Card>

        </Accordion>
      </>
    );
  };