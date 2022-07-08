import React from 'react';
import {Button} from 'react-bootstrap';


class Pagination extends React.Component {
    constructor(props) {
        super(props);
    }

    buildPagination = () => {
        var { totalPages, currentPage } = this.props;
        var pageLinks = [];
        for (let i = 1; i <= totalPages; ++i) {
            let changePageLink;
            if (i === currentPage) {
                changePageLink = 
                    <li className="page-item active">
                        <Button name='currentPage' type='button' className="page-link" value={i} onClick={this.props.changePage}>
                            {i}
                        </Button>
                    </li>;
            } else {
                changePageLink = 
                    <li className="page-item">
                        <Button name='currentPage' type='button' className="page-link" value={i} onClick={this.props.changePage}>
                            {i}
                        </Button>
                    </li>;
            }

            pageLinks.push(changePageLink);
        }

        return <nav aria-label="..."><ul class="pagination">{pageLinks}</ul></nav>;
    }

    render() {
        const {prevPage, nextPage} = this.props;
        const {currentPage, totalPages} = this.props;
        
        const pageLinks = this.buildPagination();

        return (
            <>
                <nav aria-label="...">
                    <ul className="pagination">
                        <li className={currentPage === 1 && 'disabled' + "page-item"}>
                            <Button 
                                type='button' 
                                className="page-link"
                                onClick={prevPage} 
                            >
                                &laquo;
                            </Button>
                        </li>

                        {pageLinks}

                        <li className={currentPage === totalPages && 'disabled'  + "page-item"}>
                            <Button 
                                type='button'
                                className="page-link" 
                                onClick={nextPage}
                            >
                                &raquo;
                            </Button>
                        </li>
                    </ul>
                </nav>
            </>
        );
    }
}

export default Pagination;