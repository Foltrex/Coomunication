import React from 'react';
import {Form, Modal, Button } from 'react-bootstrap';

class DeleteUser extends React.Component {
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
                <div className='mt-5'>
                    <Form className='border rounded-lg px-4 bg-white' style={formStyle}>
                        <Modal.Header>
                            <Modal.Title>Delete Profile</Modal.Title>
                        </Modal.Header>

                        <Form.Group className='mt-3 px-4'>
                            <Form.Label style={{fontSize:'initial'}}>
                                Your Password <span style={{color:'red', fontSize:'20px'}}>*</span>
                            </Form.Label>
                            <Form.Control type='password'/>
                        </Form.Group>

                        <div className='px-4 my-3'>
                            <Button variant="primary" type="submit" size='lg'>
                                DELETE
                            </Button>
                        </div>
                    </Form>
                </div>
            </>
        );
    }
}

export default DeleteUser;