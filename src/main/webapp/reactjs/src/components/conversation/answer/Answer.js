import React from 'react';
import { FaEdit } from "react-icons/fa";

class Answer extends React.Component {
    constructor(props) {
        super(props);
    }

    hasntAnswer(answer) {
        var text = answer.text;
        return !text || text.includes('|') 
            || text.includes('\n');
    }

    render() {
        const {conversation} = this.props;
        const {handleAnswerModalClick} = this.props;

        return  <>
                    <tr id={'conversation-' + conversation.id}>
                        <td>{conversation.sender.email}</td>
                        <td>{conversation.questionText}</td>
                        <td>{!this.hasntAnswer(conversation.answer) && conversation.answer.text}</td>
                        <td className='icons-column'>
                            <button 
                                className='btn btn-link text-secondary' 
                                data-toggle="modal"
                                style={{fontSize: '20px'}}
                                onClick={() => handleAnswerModalClick(conversation.id)}
                            >
                                <FaEdit />
                            </button>
                        </td>
                    </tr>
                </>
    }
}

export default Answer;