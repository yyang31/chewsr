import React, { Component } from 'react';
import './navbar.scss'
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';

class CustomNavbar extends Component {
    render() {
        return (
            <div id="customNavbar">
                <Navbar bg="light" expand="lg">
                    <Navbar.Brand onClick={this.props.resetBoard}>
                        Chews<span className="navbar-brand-r">r</span>
                    </Navbar.Brand>
                </Navbar>
            </div>
        );
    }
}

export default CustomNavbar;