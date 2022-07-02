import React from 'react';
import { Form, Modal, Button } from 'react-bootstrap';

class EditAnswerModal extends React.Component {
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
                        <Modal.Title>Edit question</Modal.Title>
                    </Modal.Header>

                    <Modal.Body className="px-4">
                        <Form>
                            <Form.Group className="mt-3">
                                <Form.Label style={{fontSize:'initial'}}>
                                    From user
                                </Form.Label>

                                <Form.Control type='text' readOnly />
                            </Form.Group>

                            <Form.Group className="mt-3">
                                <Form.Label style={{fontSize: 'initial'}}>
                                    Question
                                </Form.Label>
                                <Form.Control type="text" readOnly />
                            </Form.Group>

                           

                            <Form.Group className="mt-3">
                                <Form.Control as="textarea" />
                            </Form.Group>
                        </Form>
                    </Modal.Body>  
                    
                    <div className='px-4 mb-3'>
                        <Button onClick={()=>this.props.changeVisability()} className="w-25">
                            Save
                        </Button>  
                    </div>
                </Modal>  
            </>
        );
    }
}

export default EditAnswerModal;