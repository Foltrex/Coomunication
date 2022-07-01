import React, { Component } from 'react';
import { Button, Form, Image, Alert } from 'react-bootstrap';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import { authenticateUser } from '../../store/actions/authActions';

import logo from '../../assets/images/logo.png';

class Login extends Component {
    #initialState = {
        email: '',
        password: '',
        error: ''
    };

    constructor(props) {
        super(props);
        this.state = this.#initialState;
    }

    handleCredentialChange = event => {
        this.setState({
            [event.target.name]:event.target.value
        });
    };

    // history is undefined
    handleLogin = () => {
        this.props.authenticateUser(this.state.email, this.state.password);
        setTimeout(() => {
            if (this.props.auth.isLoggedIn) {
                console.log("history: ", this.props.history);
                return this.props.history.push('/');
            } else {
                this.resetLoginForm();
                this.setState({error:'Invalid email or password'});
            }
        });
    };

    resetLoginForm = () => {
        this.setState(() => this.#initialState);
    }

    render() {
        const {email, password, error} = this.state;
        
        const formStyle = {
            maxWidth: '480px',
            margin:'auto',
        }

        const handleForgotPasswordClick = () => console.log("oh noo")

        return (
            <div className='text-center mt-5'>
                <Form className='bg-white border rounded-lg px-5 py-3' style={formStyle}>
                    <Image src={logo} alt='logo' className='img-fluid my-4' />

                    <h3 className="mb-3">
                        Log In
                    </h3>

                    <Form.Group className='mb-3' controlId="formBasicEmail">
                        <Form.Control required type="email" placeholder="Email" name='email'
                        value={email} onChange={this.handleCredentialChange}/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Control required type="password" placeholder="Password" name='password' 
                            value={password} onChange={this.handleCredentialChange} />
                    </Form.Group>

                    {error && <Alert variant='danger'>{error}</Alert>}

                    <div className='d-flex flex-row my-3 justify-content-between'>  
                        <Form.Check type="checkbox" label="Remember me" />
                        
                        <a href='#forgotModal' style={{textDecoration:'none'}} 
                            onClick={handleForgotPasswordClick}>
                            Forgot your Password?
                        </a>
                    </div>

                    <Button variant='primary' type='submit' className='btn btn-lg btn-block w-100' 
                        onClick={this.handleLogin}
                        disabled={this.state.email.length === 0 || this.state.password.length === 0}>
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
        );
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth
    }
};

const mapDispatchToProps = dispatch => {
    return {
        authenticateUser: (email, password) => dispatch(authenticateUser(email, password))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
