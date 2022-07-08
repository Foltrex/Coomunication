import React from 'react';
import { BsTrashFill } from "react-icons/bs";
import { FaEdit } from "react-icons/fa";

class Question extends React.Component {
    constructor(props) {
        super(props);
    }

    hasntAnswer(answer) {
        var text = answer.text;
        return !text || text.includes('|') 
            || text.includes('\n');
    }
    
    render() {
        const {conversation, stompClient} = this.props;
        const {handleDeleteQuestionModalClick, handleEditQuestionModalClick} = this.props;

        return <>
                    <tr id={'conversation-' + conversation.id}>
                        <td>{conversation.receiver.email}</td>
                        <td>{conversation.questionText}</td>
                        <td>{conversation.answer.type}</td>
                        <td>{conversation.answer.text}</td>
                        <td className='icons-column'>
                            {this.hasntAnswer(conversation.answer) && <button 
                                className='btn btn-link text-secondary' 
                                data-toggle="modal"
                                style={{fontSize: '20px'}}
                                onClick={() => handleEditQuestionModalClick(conversation.id)}
                            >
                                <FaEdit />
                            </button>}

                            <button 
                                className='btn btn-link text-secondary' 
                                data-toggle="modal"
                                style={{fontSize: '20px'}}
                                onClick={() => handleDeleteQuestionModalClick(conversation.id)}
                            >
                                <BsTrashFill />
                            </button>
                        </td>
                    </tr>
                </>;
    }
}

export default Question;