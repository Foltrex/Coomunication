import React from 'react';
import {Form, Modal, Button, Alert } from 'react-bootstrap';
import {Navigate} from 'react-router-dom';
import {connect} from 'react-redux';
import {fetchUser, updateUser} from '../../services/actions/userActions';
import bcrypt from 'bcryptjs';
import { logoutUser } from '../../services/actions/authActions';

class EditUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            name: '',
            surname: '',
            email: '',
            phoneNumber: '',
            password: '',

            showAlerts: false,
            errorMessage: ''
        }
    }

    setshowAlerts(value) {
        this.setState({showAlerts: value});
    }

    componentDidMount() {
        var email = localStorage.getItem('email')
        this.findUserByEmail(email);
    }

    findUserByEmail = email => {
        this.props.fetchUser(email);
        setTimeout(() => {
            let user = this.props.userObject.user;
            if (user) {
                this.setState({
                    id: user.id,
                    name: user.name,
                    surname: user.surname,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                    currentPassword: user.password
                });
            }
        }, 100);
    }

    updateUser = e => {
        e.preventDefault();

        const user = {
            id: this.state.id,
            name: this.state.name,
            surname: this.state.surname,
            email: this.state.email,
            phoneNumber: this.state.phoneNumber,
            password: this.state.password
        };

        if (this.isEnteredPasswordValid(this.state.enteredPassword)) {
            if (!user.password) {
                user.password = this.state.currentPassword;
            }

            this.props.updateUser(user);
            setTimeout(() => {
                this.props.logoutUser();
                window.location.href = '';
            }, 200)
        } else {
            this.setshowAlerts(true);
            this.setState({errorMessage: 'Invalid password'})
        }
    };

    isEnteredPasswordValid = enteredPassword => {
        enteredPassword = enteredPassword ? enteredPassword : ''
        const { currentPassword } = this.state;
        return bcrypt.compareSync(enteredPassword, currentPassword);
    }

    userChange = e => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    };

    render() {
        const { name, surname, email, phoneNumber } = this.state;
        const { showAlerts, errorMessage } = this.state;
        return (
            <>
                <div className='mt-4'>
                    <Form 
                        className='border rounded-lg px-4 bg-white' 
                        style={{maxWidth: '480px', margin:'auto'}}
                        onSubmit={this.updateUser}
                    >
                        <Modal.Header>
                            <Modal.Title>Edit Profile</Modal.Title>
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

                        <NameInput 
                            name={name} 
                            userChange={this.userChange.bind(this)} 
                        />

                        <SurnameInput 
                            surname={surname} 
                            userChange={this.userChange.bind(this)} 
                        />

                        <EmailInput 
                            email={email} 
                            userChange={this.userChange.bind(this)} 
                        />

                        <PhoneNumberInput 
                            phoneNumber={phoneNumber} 
                            userChange={this.userChange.bind(this)} 
                        />

                        <CurrentPasswordInput 
                            userChange={this.userChange.bind(this)} 
                        />

                        <NewPasswordInput 
                            userChange={this.userChange.bind(this)} 
                        />

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

class NameInput extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {name} = this.props;
        const {userChange} = this.props;

        return  <>
                    <Form.Group className='mt-3 px-4'>
                        <Form.Label style={{fontSize:'initial'}}>
                            First Name
                        </Form.Label>
                        <Form.Control 
                            type='text'
                            name='name'
                            value={name}
                            onChange={userChange}
                        />
                    </Form.Group>
                </>
    }
}

class SurnameInput extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {surname} = this.props;
        const {userChange} = this.props;

        return  <>
                    <Form.Group className='mt-3 px-4'>
                        <Form.Label style={{fontSize:'initial'}}>
                            Last Name
                        </Form.Label>
                        <Form.Control 
                            type='text'
                            name='surname'
                            value={surname}
                            onChange={userChange}
                        />
                    </Form.Group>
                </>
    }
}

class EmailInput extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {email} = this.props;
        const {userChange} = this.props;

        return  <>
                    <Form.Group className='mt-3 px-4'>
                        <Form.Label style={{fontSize:'initial'}}>
                            Email <span style={{color: 'red', fontSize: '20px'}}>*</span>
                        </Form.Label>
                        <Form.Control 
                            type='text'
                            name='email'
                            value={email}
                            onChange={userChange}
                        />
                    </Form.Group>
                </>
    }
}

class PhoneNumberInput extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {phoneNumber} = this.props;
        const {userChange} = this.props;

        return  <>
                    <Form.Group className='mt-3 px-4'>
                        <Form.Label style={{fontSize:'initial'}}>
                            Phone Number
                        </Form.Label>
                        <Form.Control 
                            type='text'
                            name='phoneNumber'
                            value={phoneNumber}
                            onChange={userChange}
                        />
                    </Form.Group>
                </>
    }
}

class CurrentPasswordInput extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {userChange} = this.props;

        return  <>
                    <Form.Group className='mt-3 px-4'>
                        <Form.Label style={{fontSize:'initial'}}>
                            Current Password <span style={{color:'red', fontSize:'20px'}}>*</span>
                        </Form.Label>
                        <Form.Control 
                            type='password'
                            name='enteredPassword'
                            onChange={userChange}
                        />
                    </Form.Group>
                </>
    }    
}

class NewPasswordInput extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {userChange} = this.props;

        return  <>
                    <Form.Group className='mt-3 px-4'>
                        <Form.Label style={{fontSize:'initial'}}>
                            New Password
                        </Form.Label>
                        <Form.Control 
                            type='password'
                            name='password'
                            onChange={userChange}
                        />
                    </Form.Group>
                </>
    }
}

const mapStateToProps = state => {
    return {
        userObject: state.user,
        authObject: state.auth
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchUser: email => dispatch(fetchUser(email)),
        updateUser: user => dispatch(updateUser(user)),
        logoutUser: () => dispatch(logoutUser())
    };
};

export default connect(mapStateToProps, mapDispatchToProps) (EditUser); 