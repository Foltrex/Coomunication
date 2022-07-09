import React from 'react';

class NotFound extends React.Component {
    
    render() {
        return  <div style={{textAlign: 'center', marginTop: '200px'}}>
                    <h1>
                        Page Not Found
                    </h1>

                    <a href='/' className='btn btn-primary'>
                        Go to Home
                    </a>
                </div>;
    }
}

export default NotFound;