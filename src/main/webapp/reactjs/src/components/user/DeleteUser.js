import React from 'react';
import {Form, Modal, Button, Alert } from 'react-bootstrap';

import {fetchUser, deleteUser} from '../../services/actions/userActions';
import {connect} from 'react-redux';
import bcrypt from 'bcryptjs';

class DeleteUser extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: '',

            enteredPassword: '',

            showAlerts: false,
            errorMessage: ''
        }
    }

    setshowAlerts(value) {
        this.setState({showAlerts: value});
    }

    componentDidMount() {
        var email = localStorage.getItem('email');
        this.findUserByEmail(email);
    }

    findUserByEmail = email => {
        this.props.fetchUser(email);
        setTimeout(() => {
            let _user = this.props.userObject.user;
            if (_user) {
                this.setState({user: _user});
            }
        }, 100);
    }

    deleteUser = e => {
        e.preventDefault();

        const { id } = this.state.user;
        const enteredPassword = this.state.enteredPassword;
        if (this.isEnteredPasswordValid(enteredPassword)) {
            this.props.deleteUser(id);
            
            setTimeout(() => {
                window.location.href = '/user/logout';
            }, 400)
        } else {
            this.setshowAlerts(true);
            this.setState({errorMessage: 'Invalid password'})
        }
    }


    isEnteredPasswordValid = enteredPassword => {
        enteredPassword = enteredPassword ? enteredPassword : ''
        const { password } = this.state.user;
        return bcrypt.compareSync(enteredPassword, password);
    }

    passwordChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    render() {
        const { showAlerts, errorMessage } = this.state;

        return (
            <> 
                <div className='mt-5'>
                    <Form 
                        className='border rounded-lg px-4 bg-white' 
                        style={{maxWidth: '480px', margin: 'auto'}}
                        onSubmit={this.deleteUser}
                    >
                        <Modal.Header>
                            <Modal.Title>Delete Profile</Modal.Title>
                        </Modal.Header>

                        {showAlerts && errorMessage && (
                        <Alert 
                            variant="danger" 
                            onClose={() => this.setshowAlerts(false)} 
                            dismissible
                            className='mt-1 px-4'
                        >
                            {errorMessage}
                        </Alert>
                        )}

                        <Form.Group className='mt-3 px-4'>
                            <Form.Label style={{fontSize:'initial'}}>
                                Your Password <span style={{color:'red', fontSize:'20px'}}>*</span>
                            </Form.Label>
                            <Form.Control name='enteredPassword' type='password' onChange={this.passwordChange}/>
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

const mapStateToProps = state => {
    return {
        userObject: state.user
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchUser: email => dispatch(fetchUser(email)),
        deleteUser: id => dispatch(deleteUser(id))
    };
};

export default connect(mapStateToProps, mapDispatchToProps) (DeleteUser);