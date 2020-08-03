import React from "react";
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import Accordion from "react-bootstrap/Accordion"
import Card from "react-bootstrap/Card"

import InvalidDataModal from "./InvalidDataModal"
import SuccessfulSubmit from "./SuccessfulSubmit"

import { Storage } from 'aws-amplify'
import AnalyseDocs from "../../services/analyseDocs";
import CompareFaces from "../../services/comparefaces";

class Upload extends React.Component {
    constructor(props) {
      super(props);
      
      let documentType,frontImageFile,backImagefile, noFileSelected, isLoading, submitSuccess;  
      const documentTypes = [];
      documentTypes.push({key:"aadhaar", description:"Aadhaar Card"})
      documentTypes.push({key:"pancard", description:"PAN"})
      documentTypes.push({key:"passport", description:"Passport"})
      
      this.state = {
            documentType,
            documentTypes,
            frontImageFile,
            backImagefile,
            noFileSelected,
            isLoading,
            submitSuccess
        }
      
        //Storage.configure({ level: 'private' });  
    }

    submitID(frontS3Path, backS3Path) {
        AnalyseDocs.extractDetails({"path":frontS3Path,"type":this.state.documentType}).then(response =>{
                let faceDetails = this.props["faceDetails"];
                let data = {}
                let score = 0
                data["image_bytes_live"] = faceDetails["liveFaceUrl"]
                data["image_bytes_scan"] = response["encoded_face_image"]
                CompareFaces.compare(data).then(resp => {
                        console.log(resp);
                        if(resp["FaceMatches"].length > 0)
                        {
                            score = resp["FaceMatches"][0]["Similarity"];
                        }
                        console.log(response);
                        faceDetails["scannedFaceUrl"] = response["encoded_face_image"];
                        faceDetails["gender"] = response["textAnalysis"]["Gender"];
                        faceDetails["name"] = response["textAnalysis"]["PersonName"];
                        faceDetails["issuingAuthority"] = response["textAnalysis"]["IssuingEntity"];
                        faceDetails["dob"] = response["textAnalysis"]["DOB"];
                        faceDetails["documentNumber"] = response["textAnalysis"]["IDNumber"];
                        faceDetails["documentNumberMasked"] = "XXXX-XXXX-" +  response["textAnalysis"]["IDNumber"].split(" ")[2];
                        faceDetails["documentType"] = this.state.documentType;
                        faceDetails["matchScore"] = score;
                        console.log(faceDetails);
                        this.setState({isLoading:false});
                        this.props.updateFaceDetails(faceDetails);
                        this.props.setTabStatus("AnalysisDetails");
                    })
                 
                });       
        
    }

    
    

    onFrontChange(e) {
        // this.state.frontImageFile = e.target.files[0];
        this.setState({frontImageFile:e.target.files[0]})
    }

    onBackChange(e) {
        // this.state.backImagefile = e.target.files[0];
        this.setState({backImagefile:e.target.files[0]})
        
    }

    uploadToStorage = async (name,fileHandle) => {
        try {
          
          return Storage.put(name, fileHandle, {
            contentType: 'image/png',
          })
        } catch (err) {
          console.log(err)
        }
      }

    async onSubmitFiles(evt) {
        this.setState({isLoading:true});

        if(!this.state.frontImageFile || !this.state.backImagefile){
            
            this.setState({noFileSelected:true})
            this.setState({isLoading:false});
            return;
        }
            

        // submit the two files
        let frontResponse = await this.uploadToStorage('front.png', this.state.frontImageFile);
        console.log("printing front response");
        console.log(frontResponse);

        let backResponse = await this.uploadToStorage('back.png', this.state.backImagefile);
        console.log(backResponse);
        
        this.submitID(frontResponse["key"],backResponse["key"]);
        
        //this.setState({submitSuccess:true});
            
    }

    

    render() {
        
        const isLoading = this.state.isLoading;

        return (
            <div>
                <Accordion defaultActiveKey="0">
                        <Card>
                            <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                Please upload your ID documents.
                            </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey="0">
                            <Card.Body>
                            <Form>
                                <Form.Group controlId="exampleForm.ControlSelect1">
                                    <Form.Label>Choose document type</Form.Label>
                                    <Form.Control as="select" value={this.state.documentType}>
                                        {this.state.documentTypes.map((docType, index) =>
                                            <option key={index} value={docType.key}>{docType.description}</option>
                                        )}
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group>
                                    <Form.File id="exampleFormControlFile1" onChange={(evt) => this.onFrontChange(evt)} label="Upload front page of document" />
                                </Form.Group>

                                <Form.Group>
                                    <Form.File id="exampleFormControlFile2" onChange={(evt) => this.onBackChange(evt)} label="Upload back page document" />
                                </Form.Group>

                                <Button 
                                    variant="primary" 
                                    type="button" 
                                    disabled={isLoading}
                                    onClick={!isLoading ? (evt) => this.onSubmitFiles(evt) : null}
                                    >    
                                        {isLoading ? 'Submitting…' : 'Submit Documents'}
                                </Button>
                            </Form>

                            </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                
                </Accordion>
                <InvalidDataModal
                    show={this.state.noFileSelected}
                    onHide={() => this.setState({noFileSelected:false})}
                />
                <SuccessfulSubmit
                    show={this.state.submitSuccess}
                    onHide={() => this.setState({submitSuccess:false})}
                />

            </div> 
      );
    }
  }

  export default Upload