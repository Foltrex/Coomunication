import React, {useContext} from 'react';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import {NavLink, Link, Outlet} from 'react-router-dom';
import {useSelector} from 'react-redux';
import store from '../services/store';

import logo from '../assets/images/logo.png'


const NavigationBar = () => {
    const auth = useSelector(state => state.auth);
    console.log(auth.user && auth.user.name);
    const name = (auth.user && auth.user.name) || localStorage.getItem('name');
    const surname = (auth.user && auth.user.surname) || localStorage.getItem('surname');

    const fullName = `${name} ${surname}`;

    const navLinkStyle = {
        textDecoration: 'none',
        margin: 'auto 7px',
        fontSize: '16px'
    }
    
    return (
        <>
            {(auth.user || localStorage.getItem('jwt_token'))  &&
            <Navbar bg="white" expand="lg" className='border-bottom shadow-sm'>
                <Container>
                    <Link to={'/questions'} className='navbar-brand'>
                        <img src={logo} alt='logo' width='43' height='43'/>
                    </Link>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            <NavLink 
                            to={'/questions'} 
                            className={({ isActive }) => (isActive ? "link-primary" : "link-secondary")}
                            style={navLinkStyle}>
                                Your questions
                            </NavLink>
                            <NavLink 
                            to={'/answers'} 
                            className={({ isActive }) => (isActive ? "link-primary" : "link-secondary")}
                            style={navLinkStyle}>
                                Answer the question
                            </NavLink>
                            <NavDropdown title={fullName} id="basic-nav-dropdown">
                            <NavDropdown.Item href="/user/edit">Edit Profile</NavDropdown.Item>
                            <NavDropdown.Item href="/user/delete">Delete Profile</NavDropdown.Item>
                            <NavDropdown.Item 
                                href="/user/logout" 
                                onClick={() => localStorage.clear()}>Log Out</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>}
            <Outlet />
        </>
    );
}

export default NavigationBar;