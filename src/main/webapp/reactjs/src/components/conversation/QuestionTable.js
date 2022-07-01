import React, { useReducer } from 'react';
import {connect, useStore } from 'react-redux';
import {fetchQuestions} from '../../store/actions/questionActions';
import {Table} from 'react-bootstrap';

import '../../assets/css/Table.css';

class QuestionTable extends React.Component {
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
                                <h2 className="text-dark">Your questions</h2>
                            </div>
                            <div className="col-sm-6">
                                <a href="#addQuestionModal" className="addQuestionModal btn btn-success bg-primary" data-toggle="modal"><i className="fa-solid fa-plus"></i> <span>Add question</span></a>
                            </div>
                            </div>
                        </div>
                        <Table striped hover style={{fontSize: "11pt"}}>
                            <thead>
                            <tr>
                                <th>For user</th>
                                <th>Question</th>
                                <th>Answer Type</th>
                                <th>Answer</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody id="questionTable">
                                {questions.map(question => (
                                    <tr id={'question-' + question.id}>
                                        <td>{question.receiver.email}</td>
                                        <td>{question.questionText}</td>
                                        <td>{question.answer.type}</td>
                                        <td>{question.answer.text}</td>
                                        <td className='icons-column'>
                                            <a href=''><i className="fa-solid fa-pen-to-square" data-toggle="tooltip" title="Edit"></i></a>
                                            <a href=''><i className="fa-solid fa-trash-can" data-toggle="tooltip" title="Delete"></i></a>
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

export default connect(mapStateToProps, mapDispatchToProps) (QuestionTable);