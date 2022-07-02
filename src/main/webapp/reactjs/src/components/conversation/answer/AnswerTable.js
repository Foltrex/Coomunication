import React, { useReducer } from 'react';
import {connect, useStore } from 'react-redux';
import {fetchQuestions} from '../../../store/actions/questionsAction';
import {Table} from 'react-bootstrap';
import PageSizeSelect from '../PageSizeSelect';
import Pagination from '../Pagination';
import { FaEdit } from "react-icons/fa";

import '../../../assets/css/Table.css';
import EditAnswerModal from './EditAnswerModal';

class AnswerTable extends React.Component {
    constructor() {
        super();
        this.state = {
            showEditAnswerModal: false
        }
    }

    handleEditAnswerModalClick() {
        this.setState({showEditAnswerModal:!this.state.showEditAnswerModal});
    }

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
                                                <button 
                                                    className='btn btn-link text-secondary' 
                                                    data-toggle="modal"
                                                    style={{fontSize: '20px'}}
                                                    onClick={() => this.handleEditAnswerModalClick()}
                                                >
                                                    <FaEdit />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {this.state.showEditAnswerModal && <EditAnswerModal isVisible={this.state.showEditAnswerModal} changeVisability={() => this.handleEditAnswerModalClick()} />}
                                </tbody>
                            </Table>

                            <div className="d-flex justify-content-between align-items-center my-2">
                                <div className='hint-text'>1-10 of 10</div>
                                <Pagination />
                                <PageSizeSelect />
                            </div>
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