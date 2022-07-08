import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { connect } from 'react-redux';

import {fetchConversation} from '../../../services/actions/conversationsAction'

class DeleteQuestionModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            conversation: ''
        }
    }

    componentDidMount() {
        const id = +this.props.id;
        if (id) {
            this.findConversationById(id);
        }
    }

    findConversationById = id => {
        this.props.fetchConversation(id);
        setTimeout(() => {
            let _conversation = this.props.conversationObject.conversation;
    
            if (_conversation) {
                this.setState({
                    conversation: _conversation
                })
            }
        }, 100)
    }

    deleteConversation = e => {
        e.preventDefault();
        
        const { stompClient } = this.props;

        const {conversation} = this.state;

        console.log(conversation);

        stompClient.send('/app/conversation/delete', {}, JSON.stringify(conversation))
        this.props.closeDeleteQuestionModal();
    }

    render() {
        return (
            <>
                <Modal 
                    show={this.props.isVisible} 
                    onHide={()=>this.props.closeDeleteQuestionModal()}
                    style={{marginTop: "10%"}}
                >
                    <Form onSubmit={this.deleteConversation}>
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
                            <Button type='submit' className="w-25 bg-danger border-danger">
                                Delete
                            </Button>  
                        </Modal.Footer> 
                    </Form>
                </Modal>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        conversationObject: state.conversation
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchConversation: id => dispatch(fetchConversation(id))
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (DeleteQuestionModal);