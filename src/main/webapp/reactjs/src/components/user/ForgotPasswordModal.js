import React from 'react';
import {Modal, Button} from 'react-bootstrap';

class ForgotPasswordModal extends React.Component {

    render() {
        return (
            <>
                <Modal 
                    show={this.props.isVisible} 
                    onHide={()=>this.props.changeVisability()}
                    style={{marginTop: "10%"}}
                >
                    <Modal.Header closeButton style={{background: '#f5f5f5'}}>
                        <Modal.Title>Forgot Password ?</Modal.Title>
                    </Modal.Header>

                    <Modal.Body className="px-4">
                        <h6>It was necessary to remember</h6>
                        <br />
                        <h6 className='text-secondary'>It's not my concern to remind it</h6>
                    </Modal.Body>

                    <Modal.Footer style={{background: '#f5f5f5'}}>  
                        <Button onClick={()=>this.props.changeVisability()} className="w-25 bg-white text-dark border-white shadow-sm">
                            Cancel
                        </Button>
                    </Modal.Footer> 
                </Modal>
            </>
        );
    }
}

export default ForgotPasswordModal;