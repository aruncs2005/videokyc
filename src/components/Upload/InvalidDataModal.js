import React from "react";
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"

class InvalidDataModal extends React.Component {
    

    render() {
        return (
            <Modal
              {...this.props}
              size="lg"
              aria-labelledby="contained-modal-title-vcenter"
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                  No files to submit
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>
                  Select front and back images before submitting.
                </p>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={this.props.onHide}>Close</Button>
              </Modal.Footer>
            </Modal>
        );
        
    }
}



export default InvalidDataModal;