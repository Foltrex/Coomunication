import React, { useReducer, useState } from 'react';
import {connect, useStore } from 'react-redux';
import {Button, Table} from 'react-bootstrap';
import QuestionModal from './QuestionModal';
import DeleteQuestionModal from './DeleteQuestionModal';
import { FaEdit } from "react-icons/fa";
import { GoPlus } from 'react-icons/go';
import { BsTrashFill } from "react-icons/bs";
import PageSizeSelect from '../PageSizeSelect';
import Pagination from '../Pagination';
import {fetchQuestions} from '../../../services/actions/conversationsAction';
import Question from './Question';
import {register} from '../../../websocket/websocket-listener';
import '../../../assets/css/Table.css';

var stompClient = null;
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


    componentDidMount() {
        this.findQuestions(this.state.currentPage);

        this.connect();
    }


    connect = () => {
        const loggedUserEmail = localStorage.getItem('email');

        stompClient = register([
            {route: '/topic/question/save/' + loggedUserEmail, callback: this.refreshAndGoToFirstPageWithAllRecords },
            {route: '/topic/question/delete/' + loggedUserEmail, callback: this.refreshAndGoToFirstPageWithAllRecords }
        ])
    }

    refreshAndGoToFirstPageWithAllRecords = () => {
        var firstPage = 1;
        var pageSize = -1;
        this.findQuestions(firstPage, pageSize);
    } 

    findQuestions(targetPageNo, currentPageSize = this.state.currentPageSize) {
        if (currentPageSize === this.state.currentPageSize) {
            targetPageNo -= 1;
        } else {
            targetPageNo = 0;
        }

        this.props.fetchQuestions(targetPageNo, currentPageSize);

        let timerId = setInterval(() => {
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

                clearInterval(timerId);
            }
        }, 100);
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

    handleChangePageSize = event => {
        let targetPageSize = parseInt(event.target.value);
        this.findQuestions(1, targetPageSize);

        this.setState({
            [event.target.name]: targetPageSize
        });
    }

    render() {
        var { conversations, currentPage, totalPages, totalElements, currentPageSize, numberOfElements } = this.state;

        const firstPageRecordNumber = totalElements !== 0 ? (currentPage - 1) * currentPageSize + 1 : 0;
        const lastPageRecordNumber = totalElements !== 0 ? (firstPageRecordNumber - 1) + numberOfElements : 0;

        conversations = conversations.map(conversation => {
            return  <>
                        <Question
                            conversation={conversation} 
                            handleEditQuestionModalClick={this.handleEditQuestionModalClick.bind(this)} 
                            handleDeleteQuestionModalClick={this.handleDeleteQuestionModalClick.bind(this)}
                        />
                    </>
        })

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

                               {
                               this.state.showAddQuestionModal && 
                               <QuestionModal 
                                    isVisible={this.state.showAddQuestionModal}  
                                    closeQuestionModal={() => this.handleAddQuestionModalClick()}
                                    stompClient={stompClient}
                                />
                               }

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

                                {conversations}

                                {this.state.showEditQuestionModal && 
                                <QuestionModal 
                                    id={this.state.currentConversationId} 
                                    isVisible={this.state.showEditQuestionModal} 
                                    closeQuestionModal={() => this.handleEditQuestionModalClick()} 
                                    stompClient={stompClient}
                                />
                                }

                                {this.state.showDeleteQuestionModal && 
                                <DeleteQuestionModal 
                                    id={this.state.currentConversationId} 
                                    isVisible={this.state.showDeleteQuestionModal} 
                                    closeDeleteQuestionModal={() => this.handleDeleteQuestionModalClick()} 
                                    stompClient={stompClient}
                                />
                                }
                            </tbody>
                        </Table>
                        
                        <div className="d-flex justify-content-between align-items-center my-2">
                            <div className='hint-text'>
                                {firstPageRecordNumber} 
                                <span>-</span>  
                                {lastPageRecordNumber} of {totalElements}
                            </div>

                            <Pagination 
                                prevPage={this.prevPage}
                                nextPage={this.nextPage}
                                currentPage={currentPage}
                                totalPages={totalPages}
                                changePage={this.changePage.bind(this)}
                            />
                            
                            <PageSizeSelect 
                                handleChangePageSize={this.handleChangePageSize.bind(this)}
                            />
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