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
        answers: [],

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
        }, 150)
    }

    saveConversation = e => {
        e.preventDefault();
        let {conversation} = this.state;
        let {answer} = conversation;
        const {answers} = this.state;

        answer.text = e.target.answerText.value || answers.join(', ') || '';
        conversation.answer = answer;

        const {stompClient} = this.props;
        stompClient.send('/app/conversation/save', {}, JSON.stringify(conversation));
        // this.props.saveConversation(conversation);
        this.props.closeAnswerModal();
    }

    handleAnswerChange = (e) => {
        const { value, checked } = e.target;
        const { answers } = this.state;
         
        if (checked) {
          this.setState({
            answers: [...answers, value]
          });
        } else {
          this.setState({
            answers: answers.filter((e) => e !== value)
          });
        }
    }

    buildAnswerBox = (conversation) => {
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
        return answerList.map(option => {
            return <div class="form-check">
                        <input name='answerText' class="form-check-input" type="checkbox" onChange={this.handleAnswerChange} value={option}/>
                        <label class="form-check-label">
                            {option}
                        </label>
                    </div>;
        });
    }

    buildTextArea = () => {
        return <Form.Control as="textarea" name='answerText' />
    }

    buildRadioButtons = (answer) => {
        const answerList = this.splitAnswer(answer);
        return answerList.map(option => {
            return <div class="form-check">
                        <input name="answerText" class="form-check-input" type="radio" onChange={this.handleAnswerChange} value={option} />
                        <label class="form-check-label">
                            {option}
                        </label>
                    </div>
        });
    }

    buildCombobox = (answer) => {
        const answerList = this.splitAnswer(answer);
        var answerOptions = answerList.map(option => <option value={option}>{option}</option>);

        return <><input class='form-control' name='answerText' type='text' list='answerOptions' /> {answerOptions}<datalist id='answerOptions'></datalist></>;
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
                    <Form onSubmit={this.saveConversation}>
                        <Modal.Header closeButton style={{background: '#f5f5f5'}}>
                            <Modal.Title>Answer the question</Modal.Title>
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
                            <Button type='submit' className="w-25">
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
        fetchConversation: id => dispatch(fetchConversation(id)),
        saveConversation: conversation => dispatch(saveConversation(conversation))
    }
};

export default connect(mapStateToProps, mapDispatchToProps) (EditAnswerModal);