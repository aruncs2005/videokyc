import React from "react";
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import Accordion from "react-bootstrap/Accordion"
import Card from "react-bootstrap/Card"

class Upload extends React.Component {
    constructor(props) {
      super(props);
      
      let documentType;  
      const documentTypes = [];
      documentTypes.push({key:"aadhaar", description:"Aadhaar Card"})
      documentTypes.push({key:"pancard", description:"PAN"})
      documentTypes.push({key:"passport", description:"Passport"})
      
      this.state = {
            documentType,
            documentTypes
        }
      
    }



    render() {
        
        // this.state.activeDocument = this.state.documentTypes.find((docType) => docType.key == this.state.documentType );  

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
                                            <option selected={this.state.documentType === docType.key} key={index} value={docType.key}>{docType.description}</option>
                                        )}
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group>
                                    <Form.File id="exampleFormControlFile1" label="Upload front page of document" />
                                </Form.Group>

                                <Form.Group>
                                    <Form.File id="exampleFormControlFile2" label="Upload back page document" />
                                </Form.Group>

                                <Button variant="primary" type="submit">
                                        Submit Documents
                                </Button>
                            </Form>

                            </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                
                </Accordion>
            </div> 
      );
    }
  }

  export default Upload