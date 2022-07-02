import React from "react";
import {Button, Modal, Form} from 'react-bootstrap';

class AddQuestionModal extends React.Component {
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
                        <Modal.Title>Add question</Modal.Title>
                    </Modal.Header>

                    <Modal.Body className="px-4">
                        <Form>
                            <Form.Group className="mt-4 d-flex align-items-center">
                                <Form.Label className="w-25" style={{fontSize:'initial'}}>
                                    For user <span style={{color:"red"}}>*</span>
                                </Form.Label>
                                <Form.Select className="w-75">
                                    <option>One</option>
                                    <option>Two</option>
                                    <option>Three</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mt-3 d-flex aligh-items-center">
                                <Form.Label className="w-25" style={{fontSize: 'initial'}}>
                                    Question <span style={{color:"red"}}>*</span>
                                </Form.Label>
                                <Form.Control className="w-75" type="text" />
                            </Form.Group>

                            <Form.Group className="mt-3 d-flex aligh-items-center">
                                <Form.Label className="w-25" style={{fontSize: 'initial'}}>
                                    Answer type <span style={{color:"red"}}>*</span>
                                </Form.Label>
                                <Form.Select className="w-75">
                                    <option>One</option>
                                    <option>Two</option>
                                    <option>Three</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mt-3 d-flex aligh-items-center">
                                <Form.Label className="w-25" style={{fontSize: 'initial'}}>
                                    Options <span style={{color:"red"}}>*</span>
                                </Form.Label>
                                <Form.Control className="w-75" as="textarea" />
                            </Form.Group>
                        </Form>
                    </Modal.Body>  

                    <Modal.Footer style={{background: '#f5f5f5'}}>  
                        <Button onClick={()=>this.props.changeVisability()} className="w-25 bg-white text-dark border-white shadow-sm">
                            Close
                        </Button>  
                        <Button onClick={()=>this.props.changeVisability()} className="w-25">
                            Save
                        </Button>  
                    </Modal.Footer>  
                </Modal>  
            </>
        );
    }
}

export default AddQuestionModal;