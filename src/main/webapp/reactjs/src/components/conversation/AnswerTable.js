import React, { useReducer } from 'react';
import {connect, useStore } from 'react-redux';
import {fetchQuestions} from '../../store/actions/questionActions';
import {Table} from 'react-bootstrap';

import '../../assets/css/Table.css';

class AnswerTable extends React.Component {
    componentDidMount() {
        this.props.fetchQuestions();
    }

    render() {
        const questions = this.props.questionsData.questions;

        return (
            <>
                <div className="container-xl w-75 my-5 mx-auto bg-white border rounded-lg">
                    <div className="table-responsive">
                        <div className="table-wrapper">
                            <div className="table-title">
                                <div className="row">
                                <div className="col-sm-6">
                                    <h2 className="text-dark">Answer the question</h2>
                                </div>
                                </div>
                            </div>
                            <Table striped hover style={{fontSize: "11pt"}}>
                                <thead>
                                <tr>
                                    <th>From user</th>
                                    <th>Question</th>
                                    <th>Answer</th>
                                    <th></th>
                                </tr>
                                </thead>
                                <tbody id="answerTable">
                                    {questions.map(question => (
                                        <tr id={'question-' + question.id}>
                                            <td>{question.sender.email}</td>
                                            <td>{question.questionText}</td>
                                            <td>{question.answer.text}</td>
                                            <td className='icons-column'>
                                                <a href=''><i className="fa-solid fa-pen-to-square" data-toggle="tooltip" title="Edit"></i></a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        questionsData: state.questions
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchQuestions: () => dispatch(fetchQuestions())
    };
};

export default connect(mapStateToProps, mapDispatchToProps) (AnswerTable);