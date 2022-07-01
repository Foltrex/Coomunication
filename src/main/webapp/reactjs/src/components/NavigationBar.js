import React from 'react';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import {NavLink, Link, Outlet} from 'react-router-dom';

import logo from '../assets/images/logo.png'


class NavigationBar extends React.Component {
    render() {
        const navLinkStyle = {
            textDecoration: 'none',
            margin: 'auto 7px',
            fontSize: '16px'
        }

        const userNavbar = (
            <>
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
                    <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                    <NavDropdown.Item href="#action/3.1">Edit Profile</NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.2">Delete Profile</NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.3">Log Out</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
                </Navbar.Collapse>
            </>
        );

        const guestNavbar = (
            <>
                <img src={logo} alt='logo' width='43' height='43'/>
            </>
        );

        return (
            <>
                <Navbar bg="white" expand="lg" className='border-bottom shadow-sm'>
                    <Container>
                        {userNavbar}
                        {/* TODO: delete upper line */}
                        {/* {this.props.auth.isLoggedIn ? userNavbar : guestNavbar} */}
                    </Container>
                </Navbar>
                <Outlet />
            </>
        );
    }
}

export default NavigationBar;