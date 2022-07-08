import React from 'react';

class PageSizeSelect extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {handleChangePageSize} = this.props;

        return (
            <>
                <div>
                    <select 
                        className='form-select' 
                        onChange={handleChangePageSize}
                        name='currentPageSize'
                    >
                        <option value='-1'>All</option>
                        <option value='5'>5</option>
                        <option value='10'>10</option>
                    </select>
                </div>
            </>
        );
    }
}

export default PageSizeSelect;