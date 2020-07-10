import React from "react";
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"

class SuccesfulSubmit extends React.Component {
    
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
                  Success
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>
                  Files submitted successfully
                </p>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={this.props.onHide}>Close</Button>
              </Modal.Footer>
            </Modal>
        );
        
    }
}



export default SuccesfulSubmit;