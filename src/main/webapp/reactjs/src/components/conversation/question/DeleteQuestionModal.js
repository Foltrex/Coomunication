import React from 'react';
import { Modal, Button } from 'react-bootstrap';

class DeleteQuestionModal extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <Modal 
                    show={this.props.isVisible} 
                    onHide={()=>this.props.changeVisability()}
                    style={{marginTop: "10%"}}
                >
                    <Modal.Header closeButton style={{background: '#f5f5f5'}}>
                        <Modal.Title>Edit the question</Modal.Title>
                    </Modal.Header>

                    <Modal.Body className="px-4">
                        <h6>Are you sure you want to delete these Records?</h6>
                        <br />
                        <h6 className='text-warning'>This action cannot be undone.</h6>
                    </Modal.Body>

                    <Modal.Footer style={{background: '#f5f5f5'}}>  
                        <Button onClick={()=>this.props.changeVisability()} className="w-25 bg-white text-dark border-white shadow-sm">
                            Cancel
                        </Button>  
                        <Button onClick={()=>this.props.changeVisability()} className="w-25 bg-danger border-danger">
                            Delete
                        </Button>  
                    </Modal.Footer> 
                </Modal>
            </>
        );
    }
}

export default DeleteQuestionModal;