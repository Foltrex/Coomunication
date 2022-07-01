import React, { Component } from 'react';
import { Form, Image, Button } from 'react-bootstrap';
import {Link} from 'react-router-dom';

import logo from '../../assets/images/logo.png'

class Register extends Component {
    render() {
        const form = {
            maxWidth:'480px',
            margin:'auto',
        }

        return (
            <div className='text-center mt-2'>
                <Form className='bg-white border rounded-lg px-4' style={form}>
                    <Image src={logo} alt='logo' className='img-fluid my-3' />

                    <h3 className='mb-3'>
                        Sign Up
                    </h3>

                    <Form.Group className='mb-2' controlId="formBasicEmail">
                        <Form.Control type="email" placeholder="Email" />
                    </Form.Group>

                    <Form.Group className="mb-2" controlId="formBasicPassword">
                        <Form.Control type="password" placeholder="Password" />
                    </Form.Group>
                    
                    <Form.Group className="mb-2" controlId="formBasicPassword">
                        <Form.Control type="password" placeholder="Password" />
                    </Form.Group>

                    <Form.Group className='mb-2' controlId="formBasicFirstName">
                        <Form.Control type="text" placeholder="First Name" />
                    </Form.Group>

                    <Form.Group className='mb-2' controlId="formBasicLastName">
                        <Form.Control type="text" placeholder="Last Name" />
                    </Form.Group>

                    <Form.Group className='mb-4' controlId="formBasicPhoneNumber">
                        <Form.Control type="text" placeholder="Phone Number" />
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

export default Register;
