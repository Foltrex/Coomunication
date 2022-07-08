import React from "react";
import {Button, Modal, Form} from 'react-bootstrap';

import {connect} from 'react-redux';
import {saveConversation, fetchConversation} from '../../../services/actions/conversationsAction';
import {fetchUsers} from '../../../services/actions/userActions';
import {fetchAnswerTypes} from '../../../services/actions/answerActions';
import { clearInterval } from "stompjs";

class QuestionModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            sender: '',
            receiver: '',
            questionText: '',
            answer: '',

            answerTypes: [],
            users: [],

            hasOption: true
        }
    }

    componentDidMount() {
        const id = +this.props.id;
        if (id) {
            this.findConversationById(id);
        }

        this.findAllAnswerTypes();
        this.findUsers();

    }

    findConversationById = id => {
        this.props.fetchConversation(id);
        setTimeout(() => {
            let conversation = this.props.conversationObject.conversation;
    
            if (conversation) {
                let answerType = conversation.answer.type;
                answerType = answerType.replace(/_/g, ' ');
                answerType = answerType.toLowerCase();
                conversation.answer.type = answerType;

                this.setState({hasOption: this.hasOption(answerType)});
                
                this.setState({
                    id: conversation.id,
                    sender: conversation.sender,
                    receiver: conversation.receiver,
                    questionText: conversation.questionText,
                    answer: conversation.answer
                })
            }
        }, 100)
    }

    findAllAnswerTypes = () => {
        this.props.fetchAnswerTypes();
        setTimeout(() => {
            var answerTypes = this.props.answerObject.types;
            if (answerTypes) {
                this.setState({
                    answerTypes: answerTypes
                })
            }
        }, 100);
    }

    findUsers = () => {
        var _users;
        this.props.fetchUsers();
        let timerId = setInterval(() => {
            _users = this.props.userObject.users;
            if (_users) {
                this.setState({
                    users: _users
                })
                clearInterval(timerId);
            }
        }, 100);
    }

    saveConversation = (e) => {
        e.preventDefault();

        var convertedAnswerType = e.target.answer_type.value;
        convertedAnswerType = convertedAnswerType.replace(/ /g, '_');
        convertedAnswerType = convertedAnswerType.toUpperCase();

        const _receiver = {email: e.target.receiver_email.value};
        const _sender = {email: localStorage.getItem('email')};

        const conversation = {
            id: this.state.id,
            sender: _sender,
            receiver: _receiver,
            questionText: e.target.question_text.value,
            answer: {
                id: this.state.answer && this.state.answer.id,
                type: convertedAnswerType,
                text: e.target.answer_text.value
            }
        }

        const { stompClient } = this.props;
        console.log('Stomp client: ', stompClient);

        console.log(conversation);


        stompClient.send('/app/conversation/save', {}, JSON.stringify(conversation));
        
        // this.props.saveConversation(conversation);
        this.props.closeQuestionModal();
    }

    handleAnswerTypeChange = (e) => {
        const answerType = e.target.value
        this.setState({hasOption: this.hasOption(answerType)});
    }

    hasOption(type) {
        switch(type) {
            case 'checkbox':
            case 'radio button':
            case 'combobox':
                return true
            case 'single line text':
            case 'multiline text':
            case 'date':
            default:
                return false
        }
    }

    render() {
        const { id, receiver, questionText, answer } = this.state;
        const { users, answerTypes, hasOption } = this.state;

        return (
            <>
                <Modal 
                    show={this.props.isVisible} 
                    onHide={()=>this.props.closeQuestionModal()}
                    style={{marginTop: "10%"}}
                > 
                    <Form onSubmit={this.saveConversation}>
                        <Modal.Header closeButton style={{background: '#f5f5f5'}}>
                            <Modal.Title>
                                {id ? 'Edit the question' : 'Add question'}
                                </Modal.Title>
                        </Modal.Header>

                        <Modal.Body className="px-4">
                                <Form.Group className="mt-4 d-flex align-items-center">
                                    <Form.Label className="w-25" style={{fontSize:'initial'}}>
                                        For user <span style={{color:"red"}}>*</span>
                                    </Form.Label>
                                    <Form.Select name='receiver_email' className="w-75" defaultValue={receiver}>
                                        {users.map(user => (
                                            <option key={user.id} value={user.email} selected={receiver && user.id == receiver.id}>
                                                {user.email}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mt-3 d-flex aligh-items-center">
                                    <Form.Label className="w-25" style={{fontSize: 'initial'}}>
                                        Question <span style={{color:"red"}}>*</span>
                                    </Form.Label>
                                    <Form.Control 
                                        className="w-75" 
                                        type="text"
                                        name='question_text'
                                        defaultValue={questionText} 
                                    />
                                </Form.Group>

                                <Form.Group className="mt-3 d-flex aligh-items-center">
                                    <Form.Label className="w-25" style={{fontSize: 'initial'}}>
                                        Answer type <span style={{color:"red"}}>*</span>
                                    </Form.Label>
                                    <Form.Select 
                                        className="w-75" 
                                        onChange={e => this.handleAnswerTypeChange(e)}
                                        name='answer_type'
                                    >
                                        {answerTypes.map(answerType => (
                                            <option key={answerType} value={answerType} selected={answer && answerType == answer.type}>
                                                {answerType}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mt-3 d-flex aligh-items-center">
                                    <Form.Label className="w-25" style={{fontSize: 'initial'}}>
                                        Options
                                    </Form.Label>
                                    <Form.Control 
                                        className="w-75" 
                                        as="textarea" 
                                        readOnly={!hasOption}
                                        name='answer_text'
                                        defaultValue={answer && answer.text}
                                    />
                                </Form.Group>
                        </Modal.Body>  

                        <Modal.Footer style={{background: '#f5f5f5'}}>  
                            <Button onClick={()=>this.props.closeQuestionModal()} className="w-25 bg-white text-dark border-white shadow-sm">
                                Close
                            </Button>  
                            <Button type="submit" className="w-25">
                                Save
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
        conversationObject: state.conversation,
        answerObject: state.answer,
        userObject: state.user
    };
};

const mapDispatchToProps = dispatch => {
    return {
        saveConversation: conversation => dispatch(saveConversation(conversation)),
        fetchConversation: (id) => dispatch(fetchConversation(id)),
        fetchAnswerTypes: () => dispatch(fetchAnswerTypes()),
        fetchUsers: () => dispatch(fetchUsers())
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (QuestionModal);