import React from "react";
import {Button, Modal, Form} from 'react-bootstrap';

import {connect} from 'react-redux';
import {saveConversation, fetchAnswerTypes} from '../../../services/actions/conversationsAction';
import {fetchUsers} from '../../../services/actions/userActions';

class QuestionModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            answerTypes: [],
            users: [],

            hasOption: true
        }
    }

    componentDidMount() {
        this.findAllAnswerTypes();
        this.findUsers();
    }

    findAllAnswerTypes = () => {
        this.props.fetchAnswerTypes();
        setTimeout(() => {
            var answerTypes = this.props.conversationObject.answerTypes;
            if (answerTypes) {
                this.setState({
                    answerTypes: answerTypes.map(answerType => {
                        return {value: answerType, display: answerType};
                    })
                })
            }
        }, 100);
    }

    findUsers = () => {
        this.props.fetchUsers();
        setTimeout(() => {
            var _users = this.props.userObject.users;
            if (_users) {
                this.setState({
                    users: _users
                })
            }
        }, 100);
    }

    handleAnswerTypeChange = (e) => {
        const answerType = e.target.value
        console.log(answerType)
        switch(answerType) {
            case 'checkbox':
            case 'radio button':
            case 'combobox':
                this.setState({hasOption:true});
                break;
            case 'single line text':
            case 'multiline text':
            case 'date':
            default:
                this.setState({hasOption:false});
                break;
                
        }
    }

    render() {
        return (
            <>
                <Modal 
                    show={this.props.isVisible} 
                    onHide={()=>this.props.closeQuestionModal()}
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
                                    {this.state.users.map(user => (
                                        <option key={user.id} value={user.id}>
                                            {user.email}
                                        </option>
                                    ))}
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
                                <Form.Select className="w-75" onChange={e => this.handleAnswerTypeChange(e)}>
                                    {this.state.answerTypes.map(answerType => (
                                        <option key={answerType.value} value={answerType.value}>
                                            {answerType.display}
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
                                    readOnly={!this.state.hasOption}
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>  

                    <Modal.Footer style={{background: '#f5f5f5'}}>  
                        <Button onClick={()=>this.props.closeQuestionModal()} className="w-25 bg-white text-dark border-white shadow-sm">
                            Close
                        </Button>  
                        <Button onClick={()=>this.props.closeQuestionModal()} className="w-25">
                            Save
                        </Button>  
                    </Modal.Footer>  
                </Modal>  
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        conversationObject: state.conversation,
        userObject: state.user
    };
};

const mapDispatchToProps = dispatch => {
    return {
        saveConversation: conversation => dispatch(saveConversation(conversation)),
        fetchAnswerTypes: () => dispatch(fetchAnswerTypes()),
        fetchUsers: () => dispatch(fetchUsers())
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (QuestionModal);