import React from 'react';


class Pagination extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <nav aria-label="...">
                    <ul class="pagination">
                        <li class="page-item disabled">
                        <a class="page-link" href="#" tabindex="-1">&laquo;</a>
                        </li>
                        <li class="page-item"><a class="page-link" href="#">1</a></li>
                        <li class="page-item active"><a class="page-link" href="#">2</a></li>
                        <li class="page-item"><a class="page-link" href="#">3</a></li>
                        <li class="page-item">
                        <a class="page-link" href="#">&raquo;</a>
                        </li>
                    </ul>
                </nav>
            </>
        );
    }
}

export default Pagination;