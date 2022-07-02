import React from 'react';

class PageSizeSelect extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <div>
                    <select className='form-select'>
                        <option>All</option>
                        <option>5</option>
                        <option>10</option>
                    </select>
                </div>
            </>
        );
    }
}

export default PageSizeSelect;