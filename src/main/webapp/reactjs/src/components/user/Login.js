import React, { useState } from 'react';
import { Button, Form, Image, Alert } from 'react-bootstrap';
import {Link, useNavigate } from 'react-router-dom';
import { authenticateUser } from '../../services/actions/authActions';
import ForgotPasswordModal from './ForgotPasswordModal';
import { useDispatch } from "react-redux";

import logo from '../../assets/images/logo.png';

const Login = (props) => {
    const [error, setError] = useState();
    const [showAlerts, setshowAlerts] = useState(true);
    const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  
    const initialState = {
      email: "",
      password: "",
    };
  
    const [user, setUser] = useState(initialState);
  
    const credentialChange = (event) => {
      const { name, value } = event.target;
      setUser({ ...user, [name]: value });
    };
  
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const validateUser = () => {
        dispatch(authenticateUser(user.email, user.password))
            .then((response) => {
                localStorage.setItem('jwt_token', response.token);
                navigate('/')
            })
            .catch((error) => {
                console.log(error.message);
                setshowAlerts(true);
                resetLoginForm();
                setError("Invalid email and password");
            });
    };
  
    const resetLoginForm = () => {
      setUser(initialState);
    };

    return (
        <>
            <div className='text-center mt-5'>
                <Form className='bg-white border rounded-lg px-5 py-3' style={{maxWidth: '480px', margin: 'auto'}}>
                    <Image src={logo} alt='logo' className='img-fluid my-4' />

                    <h3 className="mb-3">
                        Log In
                    </h3>

                    <NameInput user={user} credentialChange={credentialChange} />

                    <PasswordInput user={user} credentialChange={credentialChange} />

                    {showAlerts && props.message && (
                        <Alert variant="success" onClose={() => setshowAlerts(false)} dismissible>
                            {props.message}
                        </Alert>
                    )}
                    {showAlerts && error && (
                        <Alert variant="danger" onClose={() => setshowAlerts(false)} dismissible>
                            {error}
                        </Alert>
                    )}

                    <div className='d-flex flex-row my-3 justify-content-between'>  
                        <Form.Check name="remember-me" type="checkbox" label="Remember me" />
        
                        <a 
                            href='#forgotPasswordModal'
                            data-toggle="modal"
                            style={{textDecoration: 'none'}}
                            onClick={() => setShowForgotPasswordModal(true)}
                        >
                            Forgot your Password?
                        </a>
                        {showForgotPasswordModal && <ForgotPasswordModal isVisible={showForgotPasswordModal} changeVisability={() => setShowForgotPasswordModal()} />}
                    </div>

                    <Button variant='primary' type='button' className='btn btn-lg btn-block w-100' 
                        onClick={validateUser}
                        disabled={user.email.length === 0 || user.password.length === 0}
                    >
                        LOG IN
                    </Button>

                    <div className='d-flex flex-row mt-3 justify-content-center'>
                        <p className='mx-1'>Don't have account? </p>
                        <Link to={'/register'} className="text-primary mx-1" style={{textDecoration:'none'}}>
                            Sign Up
                        </Link>
                    </div>
                </Form>
            </div>
        </>
    );
};


class NameInput extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {user} = this.props;
        const {credentialChange} = this.props;

        return  <>
                    <Form.Group className='mb-3' controlId="formBasicEmail">
                        <Form.Control 
                            equired type="email" 
                            placeholder="Email"  
                            name="email"
                            value={user.email}
                            onChange={credentialChange}
                        />
                    </Form.Group>
                </>
    }
}

class PasswordInput extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {user} = this.props;
        const {credentialChange} = this.props;

        return  <>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Control 
                            required 
                            type="password" 
                            placeholder="Password" 
                            name="password"
                            value={user.password}
                            onChange={credentialChange} 
                        />
                    </Form.Group>
                </>
    }
}

export default Login;
