import React, { useReducer, useState } from 'react';
import {connect, useStore } from 'react-redux';
import {Button, Table} from 'react-bootstrap';
import QuestionModal from './QuestionModal';
import DeleteQuestionModal from './DeleteQuestionModal';
import PageSizeSelect from '../PageSizeSelect';
import Pagination from '../Pagination';
import { FaEdit } from "react-icons/fa";
import { GoPlus } from 'react-icons/go';
import { BsTrashFill } from "react-icons/bs";
import {fetchQuestions} from '../../../services/actions/conversationsAction';
import axios from 'axios';

import '../../../assets/css/Table.css';

class QuestionTable extends React.Component {
    constructor() {
        super();
        this.state = {
            conversations: [],
            currentConversationId: '',
                    
            currentPage: 1,
            currentPageSize: -1, // all records per page

            showAddQuestionModal:false,
            showEditQuestionModal:false,
            showDeleteQuestionModal:false,
        }
    }

    handleAddQuestionModalClick() {
        this.setState({showAddQuestionModal:!this.state.showAddQuestionModal});
    }

    handleEditQuestionModalClick(id) {
        this.setState({
            currentConversationId: id,
            showEditQuestionModal:!this.state.showEditQuestionModal
        });
    }

    handleDeleteQuestionModalClick(id) {
        this.setState({
            currentConversationId: id,
            showDeleteQuestionModal:!this.state.showDeleteQuestionModal
        });
    }

    componentDidMount() {
        this.findQuestions(this.state.currentPage);
    }

    findQuestions(targetPageNo, currentPageSize = this.state.currentPageSize) {
        if (currentPageSize === this.state.currentPageSize) {
            targetPageNo -= 1;
        } else {
            targetPageNo = 0;
        }

        this.props.fetchQuestions(targetPageNo, currentPageSize);

        setTimeout(() => {
            let pagination = this.props.conversationObject.pagination;
            var {content, totalPages, totalElements, number, numberOfElements } = pagination;

            if (content) {
                content.forEach(conversation => {
                    let answerType = conversation.answer.type;
                    answerType = answerType.toLowerCase();
                    answerType = answerType.replace(/_/g, ' ');
                    conversation.answer.type = answerType;
    
                    let answerText = conversation.answer.text;
                    conversation.answer.text = (!answerText.includes('|')) ? answerText : '';
                });

                this.setState({
                    conversations: content,
                    totalPages: totalPages,
                    totalElements: totalElements,
                    currentPage: number + 1,
                    numberOfElements: numberOfElements
                });
            }
        }, 50);
    }

    buildPagination = () => {
        var { totalPages, currentPage } = this.state;
        var pageLinks = [];
        for (let i = 1; i <= totalPages; ++i) {
            let changePageLink;
            if (i === currentPage) {
                changePageLink = 
                    <li className="page-item active">
                        <Button name='currentPage' type='button' className="page-link" value={i} onClick={this.changePage}>
                            {i}
                        </Button>
                    </li>;
            } else {
                changePageLink = 
                    <li className="page-item">
                        <Button name='currentPage' type='button' className="page-link" value={i} onClick={this.changePage}>
                            {i}
                        </Button>
                    </li>;
            }

            pageLinks.push(changePageLink);
        }

        return <nav aria-label="..."><ul class="pagination">{pageLinks}</ul></nav>;
    }

    changePage = (event) => {
        let targetPage = parseInt(event.target.value);
        this.findQuestions(targetPage);
        
        this.setState({
          [event.target.name]: targetPage,
        });
    };

    prevPage = () => {
        let prevPage = 1;
        if (this.state.currentPage > prevPage) {
            this.findQuestions(this.state.currentPage - prevPage)
        }
    };

    nextPage = () => {
        if (this.state.currentPage < Math.ceil(this.state.totalElements / this.state.currentPageSize)) {
            this.findQuestions(this.state.currentPage + 1);
        }
    }

    handleChangePageSize = event => {
        let targetPageSize = parseInt(event.target.value);
        this.findQuestions(1, targetPageSize);

        this.setState({
            [event.target.name]: targetPageSize
        });
    }

    hasntAnswer(answer) {
        var text = answer.text;
        return !text || text.includes('|') 
            || text.includes('\n') 
            || text.includes(',');
    }

    render() {
        var { conversations, currentPage, totalPages, totalElements, currentPageSize, numberOfElements } = this.state;
        var firstPageRecordNumber = (currentPage - 1) * currentPageSize + 1;
        var lastPageRecordNumber = (firstPageRecordNumber - 1) + numberOfElements;

        if (currentPageSize === -1) {
            currentPageSize = totalElements;
        }

        var pageLinks = this.buildPagination();

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
                               {this.state.showAddQuestionModal && <QuestionModal isVisible={this.state.showAddQuestionModal}  closeQuestionModal={() => this.handleAddQuestionModalClick()}/>}
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
                                {conversations.map(conversation => (
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
                                                onClick={() => this.handleEditQuestionModalClick(conversation.id)}
                                            >
                                                <FaEdit />
                                            </button>}

                                            <button 
                                                className='btn btn-link text-secondary' 
                                                data-toggle="modal"
                                                style={{fontSize: '20px'}}
                                                onClick={() => this.handleDeleteQuestionModalClick(conversation.id)}
                                            >
                                                <BsTrashFill />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {this.state.showEditQuestionModal && <QuestionModal id={this.state.currentConversationId} isVisible={this.state.showEditQuestionModal} closeQuestionModal={() => this.handleEditQuestionModalClick()} />}
                                {this.state.showDeleteQuestionModal && <DeleteQuestionModal id={this.state.currentConversationId} isVisible={this.state.showDeleteQuestionModal} closeQuestionModal={() => this.handleDeleteQuestionModalClick()} />}
                            </tbody>
                        </Table>
                        
                        <div className="d-flex justify-content-between align-items-center my-2">
                            <div className='hint-text'>
                                {firstPageRecordNumber} 
                                <span>&mdash;</span>  
                                {lastPageRecordNumber} of {totalElements}</div>

                            <nav aria-label="...">
                                <ul className="pagination">
                                    <li className={currentPage === 1 && 'disabled' + "page-item"}>
                                        <Button 
                                            type='button' 
                                            className="page-link"
                                            onClick={this.prevPage} 
                                        >
                                            &laquo;
                                        </Button>
                                    </li>

                                    {pageLinks}

                                    <li className={currentPage === totalPages && 'disabled'  + "page-item"}>
                                        <Button 
                                            type='button'
                                            className="page-link" 
                                            onClick={this.nextPage}
                                        >
                                            &raquo;
                                        </Button>
                                    </li>
                                </ul>
                            </nav>
                            
                            <div>
                                <select 
                                    className='form-select' 
                                    onChange={this.handleChangePageSize}
                                    name='currentPageSize'
                                >
                                    <option value='-1'>All</option>
                                    <option value='5'>5</option>
                                    <option value='10'>10</option>
                                </select>
                            </div>
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
        conversationObject: state.conversation
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchQuestions: (pageNo, pageSize) => dispatch(fetchQuestions(pageNo, pageSize))
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (QuestionTable);