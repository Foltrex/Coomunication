import React, { useReducer } from 'react';
import {connect, useStore } from 'react-redux';
import {Table, Button} from 'react-bootstrap';
import PageSizeSelect from '../PageSizeSelect';
import Pagination from '../Pagination';
import { FaEdit } from "react-icons/fa";
import Answer from './Answer';
import {fetchAnswers} from '../../../services/actions/conversationsAction';
import axios from 'axios';
import {register} from '../../../websocket/websocket-listener';

import '../../../assets/css/Table.css';
import AnswerModal from './AnswerModal';

var stompClient = null;
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

        this.connect();
    }
    
    connect = () => {
        const loggedUserEmail = localStorage.getItem('email');

        stompClient = register([
            {route: '/topic/answer/save/' + loggedUserEmail, callback: this.refreshAndGoToFirstPageWithAllRecords },
            {route: '/topic/answer/delete/' + loggedUserEmail, callback: this.refreshAndGoToFirstPageWithAllRecords }
        ])
    }

    refreshAndGoToFirstPageWithAllRecords = () => {
        var firstPage = 1;
        var pageSize = -1;
        this.findAnswers(firstPage, pageSize);
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
        }, 100);
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
        var firstPageRecordNumber = totalElements !== 0 ? (currentPage - 1) * currentPageSize + 1 : 0;
        var lastPageRecordNumber = totalElements !== 0 ? (firstPageRecordNumber - 1) + numberOfElements : 0;

        if (currentPageSize === -1) {
            currentPageSize = totalElements;
        }

        conversations = conversations.map(conversation => {
            return  <>
                        <Answer
                            conversation={conversation} 
                            handleAnswerModalClick={this.handleAnswerModalClick.bind(this)}
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
                                    {conversations}
                                   
                                    {this.state.showAnswerModal && 
                                    <AnswerModal 
                                        id={this.state.currentConversationId} 
                                        isVisible={this.state.showAnswerModal} 
                                        closeAnswerModal={() => this.handleAnswerModalClick()} 
                                        stompClient={stompClient}
                                    />
                                    }
                                </tbody>
                            </Table>

                                
                            <div className="d-flex justify-content-between align-items-center my-2">
                                <div className='hint-text'>
                                    {firstPageRecordNumber} 
                                    <span>-</span>  
                                    {lastPageRecordNumber} of {totalElements}</div>

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
        fetchAnswers: (pageNo, pageSize) => dispatch(fetchAnswers(pageNo, pageSize))
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (AnswerTable);