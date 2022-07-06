import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

class DeleteQuestionModal extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <Modal 
                    show={this.props.isVisible} 
                    onHide={()=>this.props.closeDeleteQuestionModal()}
                    style={{marginTop: "10%"}}
                >
                    <Form>
                        <Modal.Header closeButton style={{background: '#f5f5f5'}}>
                            <Modal.Title>Delete the question</Modal.Title>
                        </Modal.Header>

                        <Modal.Body className="px-4">
                            <h6>Are you sure you want to delete this Record?</h6>
                            <br />
                            <h6 className='text-warning'>This action cannot be undone.</h6>
                        </Modal.Body>

                        <Modal.Footer style={{background: '#f5f5f5'}}>  
                            <Button onClick={()=>this.props.closeDeleteQuestionModal()} className="w-25 bg-white text-dark border-white shadow-sm">
                                Cancel
                            </Button>  
                            <Button onClick={()=>this.props.closeDeleteQuestionModal()} className="w-25 bg-danger border-danger">
                                Delete
                            </Button>  
                        </Modal.Footer> 
                    </Form>
                </Modal>
            </>
        );
    }
}

export default DeleteQuestionModal;