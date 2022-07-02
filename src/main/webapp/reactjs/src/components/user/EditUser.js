import React from 'react';
import {Form, Modal, Button } from 'react-bootstrap';

class EditUser extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const formStyle = {
            maxWidth: '480px',
            margin:'auto',
        }

        return (
            <>
                <div className='mt-4'>
                    <Form className='border rounded-lg px-4 bg-white' style={formStyle}>
                        <Modal.Header>
                            <Modal.Title>Edit Profile</Modal.Title>
                        </Modal.Header>

                        <Form.Group className='mt-3 px-4'>
                            <Form.Label style={{fontSize:'initial'}}>
                                First Name
                            </Form.Label>
                            <Form.Control type='text'/>
                        </Form.Group>

                        <Form.Group className='mt-3 px-4'>
                            <Form.Label style={{fontSize:'initial'}}>
                                Last Name
                            </Form.Label>
                            <Form.Control type='text'/>
                        </Form.Group>

                        <Form.Group className='mt-3 px-4'>
                            <Form.Label style={{fontSize:'initial'}}>
                                Email <span style={{color: 'red', fontSize: '20px'}}>*</span>
                            </Form.Label>
                            <Form.Control type='text'/>
                        </Form.Group>

                        <Form.Group className='mt-3 px-4'>
                            <Form.Label style={{fontSize:'initial'}}>
                                Phone Number
                            </Form.Label>
                            <Form.Control type='text'/>
                        </Form.Group>

                        <Form.Group className='mt-3 px-4'>
                            <Form.Label style={{fontSize:'initial'}}>
                                Current Password <span style={{color:'red', fontSize:'20px'}}>*</span>
                            </Form.Label>
                            <Form.Control type='password'/>
                        </Form.Group>

                        <Form.Group className='mt-3 px-4'>
                            <Form.Label style={{fontSize:'initial'}}>
                                New Password
                            </Form.Label>
                            <Form.Control type='password'/>
                        </Form.Group>

                        <div className='px-4 my-3'>
                            <Button variant="primary" type="submit" size='lg'>
                                SAVE
                            </Button>
                        </div>
                    </Form>
                </div>
            </>
        );
    }
}

export default EditUser;