import React from "react";
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import Accordion from "react-bootstrap/Accordion"
import Card from "react-bootstrap/Card"

class Upload extends React.Component {
    constructor(props) {
      super(props);
    }

    render() {
        
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
                            <Form.Control as="select">
                            <option>Adhaar Card</option>
                            <option>PAN</option>
                            <option>Passport</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group>
                            <Form.File id="exampleFormControlFile1" label="Upload the selected ID document" />
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
        )
    }
}

 export default Upload