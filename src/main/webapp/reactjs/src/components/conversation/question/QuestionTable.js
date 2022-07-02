import React, { useReducer, useState } from 'react';
import {connect, useStore } from 'react-redux';
import {fetchQuestions} from '../../../store/actions/questionsAction';
import {Table} from 'react-bootstrap';
import AddQuestionModal from './AddQuestionModal';
import EditQuestionModal from './EditQuestionModal';
import DeleteQuestionModal from './DeleteQuestionModal';
import PageSizeSelect from '../PageSizeSelect';
import Pagination from '../Pagination';
import { FaEdit } from "react-icons/fa";
import { GoPlus } from 'react-icons/go';
import { BsTrashFill } from "react-icons/bs";

import '../../../assets/css/Table.css';

class QuestionTable extends React.Component {
    constructor() {
        super();
        this.state = {
            showAddQuestionModal:false,
            showEditQuestionModal:false,
            showDeleteQuestionModal:false
        }
    }

    handleAddQuestionModalClick() {
        this.setState({showAddQuestionModal:!this.state.showAddQuestionModal});
    }

    handleEditQuestionModalClick() {
        this.setState({showEditQuestionModal:!this.state.showEditQuestionModal});
    }

    handleDeleteQuestionModalClick() {
        this.setState({showDeleteQuestionModal:!this.state.showDeleteQuestionModal});
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
                                <h2 className="text-dark">Your questions</h2>
                            </div>
                            <div className="col-sm-6">
                                <button
                                className="addQuestionModal btn btn-success bg-primary" 
                                data-toggle="modal"
                                onClick={() => this.handleAddQuestionModalClick()}
                                style={{width: '150px', fontSize: '15px'}}
                                >
                                    <GoPlus style={{fontSize: '20px'}} />
                                    Add question
                                </button>
                               {this.state.showAddQuestionModal && <AddQuestionModal isVisible={this.state.showAddQuestionModal}  changeVisability={() => this.handleAddQuestionModalClick()}/>}
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
                                            <button 
                                                className='btn btn-link text-secondary' 
                                                data-toggle="modal"
                                                style={{fontSize: '20px'}}
                                                onClick={() => this.handleEditQuestionModalClick()}
                                            >
                                                <FaEdit />
                                            </button>

                                            <button 
                                                className='btn btn-link text-secondary' 
                                                data-toggle="modal"
                                                style={{fontSize: '20px'}}
                                                onClick={() => this.handleDeleteQuestionModalClick()}
                                            >
                                                <BsTrashFill />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {this.state.showEditQuestionModal && <EditQuestionModal isVisible={this.state.showEditQuestionModal} changeVisability={() => this.handleEditQuestionModalClick()} />}
                                {this.state.showDeleteQuestionModal && <DeleteQuestionModal isVisible={this.state.showDeleteQuestionModal} changeVisability={() => this.handleDeleteQuestionModalClick()} />}
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

export default connect(mapStateToProps, mapDispatchToProps) (QuestionTable);