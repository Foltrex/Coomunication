import React, { Component } from 'react';
import { Form, Image, Button, Alert } from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {registerUser} from '../../services/actions/userActions';

import logo from '../../assets/images/logo.png'

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            name: '',
            surname: '',
            phoneNumber: '',

            repeatedPassword: '',
            showAlerts: false,
            errorMessage: ''
        }
    }

    registerUser = e => {
        e.preventDefault();

        const user = {
            email: this.state.email,
            password: this.state.password,
            name: this.state.name,
            surname: this.state.surname,
            phoneNumber: this.state.phoneNumber
        }

        const { password, repeatedPassword } = this.state;
        console.log(password);
        console.log(repeatedPassword)
        if (password == repeatedPassword) {
            this.props.registerUser(user)
                .then(() => {
                    setTimeout(() => {
                        window.location.href = '/login'
                    }, 400)
                })
                .catch(error => {
                    console.log(error)
                })
        } else {
            this.setState({showAlerts: true});
            this.setState({errorMessage: 'Passwords do not match'})
        }
    }

    userChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    render() {
        const { showAlerts, errorMessage } = this.state;

        return (
            <div className='text-center mt-2'>
                <Form 
                    className='bg-white border rounded-lg px-4' 
                    style={{maxWidth: '480px', margin: 'auto'}}
                    onSubmit={this.registerUser}
                >
                    <Image src={logo} alt='logo' className='img-fluid my-3' />

                    <h3 className='mb-3'>
                        Sign Up
                    </h3>
                    
                    {showAlerts && errorMessage && (
                    <Alert 
                        variant="danger" 
                        onClose={() => this.setState({showAlerts: false})} 
                        dismissible
                        className='mt-1 px-4'
                    >
                        {errorMessage}
                    </Alert>
                    )}

                    <Form.Group className='mb-2' controlId="formBasicEmail">
                        <Form.Control name='email' onChange={this.userChange} type="email" placeholder="Email" />
                    </Form.Group>

                    <Form.Group className="mb-2" controlId="formBasicPassword">
                        <Form.Control name='password' onChange={this.userChange} type="password" placeholder="Password" />
                    </Form.Group>
                    
                    <Form.Group className="mb-2" controlId="formBasicPassword">
                        <Form.Control name='repeatedPassword' onChange={this.userChange} type="password" placeholder="Confirm Password" />
                    </Form.Group>

                    <Form.Group className='mb-2' controlId="formBasicFirstName">
                        <Form.Control name='name' onChange={this.userChange} type="text" placeholder="First Name" />
                    </Form.Group>

                    <Form.Group className='mb-2' controlId="formBasicLastName">
                        <Form.Control name='surname' onChange={this.userChange} type="text" placeholder="Last Name" />
                    </Form.Group>

                    <Form.Group className='mb-4' controlId="formBasicPhoneNumber">
                        <Form.Control name='phoneNumber' onChange={this.userChange} type="text" placeholder="Phone Number" />
                    </Form.Group>

                    <Button variant='primary' type='submit' className='btn btn-lg btn-block w-100 mb-3'>
                        SIGN UP
                    </Button>

                    <div className='d-flex flex-row justify-content-center'>
                        <p className="mx-1">Already have account?</p>
                        <Link to={'/login'} className="text-primary mx-1" style={{textDecoration:'none'}}>
                            Log In
                        </Link>
                    </div>
                </Form>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        registerUser: user => dispatch(registerUser(user)),
    };
};

export default connect(null, mapDispatchToProps) (Register);
