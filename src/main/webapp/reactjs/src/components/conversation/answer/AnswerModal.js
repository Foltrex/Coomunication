import React from 'react';
import { Form, Modal, Button } from 'react-bootstrap';
import DatePicker from 'react-date-picker';

import {connect} from 'react-redux';
import {saveConversation, fetchConversation} from '../../../services/actions/conversationsAction';

class EditAnswerModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.#initialState;
    }

    #initialState = {
        conversation: '',

        answerBox: ''
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
                this.setState({conversation: _conversation});

                this.setState({answerBox: this.buildAnswerBox(_conversation)});
            }
        }, 200)
    }

    buildAnswerBox = (conversation) => {
        console.log(conversation)
        const {answer} = conversation;
        const type = answer && answer.type;
        
        switch(type) {
            case 'CHECKBOX':
                return (this.buildCheckBoxes(answer));                     
            case 'SINGLE_LINE_TEXT':
                return (this.buildSingleLineInput());
            case 'MULTILINE_TEXT':
                return (this.buildTextArea());
            case 'RADIO_BUTTON':
                return (this.buildRadioButtons(answer));
            case 'COMBOBOX':
                return (this.buildCombobox(answer));
            case 'DATE':
                return (this.buildDate());
            default:
                return (this.buildSingleLineInput());
                
        }
    }

    buildSingleLineInput = () => {
        return <Form.Control type='text' name='answerText' />
    }

    buildCheckBoxes = (answer) => {
        const answerList = this.splitAnswer(answer);
        console.log(answerList)
        return <div/>
    }

    buildTextArea = () => {
        return <Form.Control as="textarea" name='answerText' />
    }

    buildRadioButtons = (answer) => {
        const answerList = this.splitAnswer(answer);
        console.log(answerList)
        return <div/>
    }

    buildCombobox = (answer) => {
        const answerList = this.splitAnswer(answer);
        console.log(answerList)
        return <div/>
    }

    buildDate = () => {
        return <DatePicker onChange={() => this.setState({date: new Date()})} value={this.state.date} />
    }

    splitAnswer = (answer) => {
        const text = answer && answer.text || '';

        const regex = /[\n*,|]/;
        return text.split(regex);
    }

    render() {
        const { sender, questionText } = this.state.conversation;
        const {answerBox} = this.state;

        return (
            <> 
                <Modal 
                    show={this.props.isVisible} 
                    onHide={()=>this.props.closeAnswerModal()}
                    style={{marginTop: "10%"}}
                > 
                    <Form>
                        <Modal.Header closeButton style={{background: '#f5f5f5'}}>
                            <Modal.Title>Edit question</Modal.Title>
                        </Modal.Header>

                        <Modal.Body className="px-4">
                                <Form.Group className="mt-3">
                                    <Form.Label style={{fontSize:'initial'}}>
                                        From user
                                    </Form.Label>

                                    <Form.Control 
                                        type='text' 
                                        value={sender && sender.email} 
                                        readOnly 
                                    />
                                </Form.Group>

                                <Form.Group className="mt-3">
                                    <Form.Label style={{fontSize: 'initial'}}>
                                        Question
                                    </Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        value={questionText} 
                                        readOnly 
                                    />
                                </Form.Group>

                                <Form.Group className="mt-3">
                                    {answerBox}
                                </Form.Group>
                        </Modal.Body>  
                        
                        <div className='px-4 mb-3'>
                            <Button type='submit' onClick={()=>this.props.closeAnswerModal()} className="w-25">
                                Save
                            </Button>  
                        </div>
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
        fetchConversation: (id) => dispatch(fetchConversation(id))
    }
};

export default connect(mapStateToProps, mapDispatchToProps) (EditAnswerModal);