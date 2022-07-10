import React from 'react';
import {Navigate} from 'react-router-dom';

const PrivateRoute = ({children}) => {
    const jwtToken = localStorage.getItem('jwt_token');
    return jwtToken ? children : <Navigate to='/login' />;
}

export default PrivateRoute;