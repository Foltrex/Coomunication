import React, { useReducer } from 'react';
import {connect, useStore } from 'react-redux';
import {Table, Button} from 'react-bootstrap';
import PageSizeSelect from '../PageSizeSelect';
import Pagination from '../Pagination';
import { FaEdit } from "react-icons/fa";
import {fetchAnswers} from '../../../services/actions/conversationsAction';
import axios from 'axios';

import '../../../assets/css/Table.css';
import AnswerModal from './AnswerModal';

class AnswerTable extends React.Component {
    constructor() {
        super();
        this.state = {
            conversations: [],
            currentConversationId: '',
                    
            currentPage: 1,
            currentPageSize: -1, // all records per page

            showAnswerModal: false
        }
    }

    handleAnswerModalClick(id) {
        this.setState({
            currentConversationId: id,
            showAnswerModal:!this.state.showAnswerModal
        });
    }

    componentDidMount() {
        this.findAnswers(this.state.currentPage);
    }

    findAnswers(targetPageNo, currentPageSize = this.state.currentPageSize) {
        if (currentPageSize === this.state.currentPageSize) {
            targetPageNo -= 1;
        } else {
            targetPageNo = 0;
        }

        this.props.fetchAnswers(targetPageNo, currentPageSize)

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
        this.findAnswers(targetPage);
        
        this.setState({
          [event.target.name]: targetPage,
        });
    };

    prevPage = () => {
        let prevPage = 1;
        if (this.state.currentPage > prevPage) {
            this.findAnswers(this.state.currentPage - prevPage)
        }
    };

    nextPage = () => {
        if (this.state.currentPage < Math.ceil(this.state.totalElements / this.state.currentPageSize)) {
            this.findAnswers(this.state.currentPage + 1);
        }
    }

    handleChangePageSize = event => {
        let targetPageSize = parseInt(event.target.value);
        this.findAnswers(1, targetPageSize);

        this.setState({
            [event.target.name]: targetPageSize
        });
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
                                    {conversations.map(conversation => (
                                        <tr id={'conversation-' + conversation.id}>
                                            <td>{conversation.sender.email}</td>
                                            <td>{conversation.questionText}</td>
                                            <td>{conversation.answer.text}</td>
                                            <td className='icons-column'>
                                                <button 
                                                    className='btn btn-link text-secondary' 
                                                    data-toggle="modal"
                                                    style={{fontSize: '20px'}}
                                                    onClick={() => this.handleAnswerModalClick(conversation.id)}
                                                >
                                                    <FaEdit />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {this.state.showAnswerModal && <AnswerModal id={this.state.currentConversationId} isVisible={this.state.showAnswerModal} closeAnswerModal={() => this.handleAnswerModalClick()} />}
                                </tbody>
                            </Table>

                                
                            <div className="d-flex justify-content-between align-items-center my-2">
                                <div className='hint-text'>
                                    {firstPageRecordNumber} 
                                    <span>-</span>  
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
        fetchAnswers: (pageNo, pageSize) => dispatch(fetchAnswers(pageNo, pageSize))
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (AnswerTable);