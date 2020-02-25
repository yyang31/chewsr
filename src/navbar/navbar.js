import React, { Component } from 'react';
import './navbar.scss'
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';

class CustomNavbar extends Component {
    render() {
        return (
            <Navbar bg="light" expand="lg">
                <Navbar.Brand onClick={this.props.resetBoard}>
                    Chews<span className="navbar-brand-r">r</span>
                </Navbar.Brand>
                {this.props.uuid ? (
                    <Navbar.Text>
                        group ID: {this.props.uuid}
                    </Navbar.Text>
                ) : (
                        <>
                        </>
                    )}
            </Navbar>
        );
    }
}

export default CustomNavbar;