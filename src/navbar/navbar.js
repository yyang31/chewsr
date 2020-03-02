import React, { Component } from 'react';
import './navbar.scss'

import {
    Navbar,
    Modal,
    Button,
    Row,
    Col,
    Form
} from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faBars } from '@fortawesome/free-solid-svg-icons'

import $ from 'jquery';

class OptionMenu extends Component {
    state = {
        show: false,
        restaurantTypes: ['all', 'chinese', 'italian', 'mexican', 'vegetarian'],
    }

    componentDidMount = () => {
        console.log(this.props.keyword);
    }

    /**
     * handles click on custom restaurant type buttons
     */
    restTypeClick = (e) => {
        // console.log(e.target);
        let restTypeBtn = $(e.target);

        // trigger the check on the radio button
        restTypeBtn.addClass('selected');
        restTypeBtn.find(':input[type=radio]').click();

        // remove class 'selected' from other radio buttons
        $('.type-radio-cont').not(restTypeBtn).removeClass('selected');

        console.log(restTypeBtn);
    }

    triggerShow = () => {
        this.setState({
            show: this.state.show ? false : true,
        })
    }

    render() {
        return (
            <>
                <Button id="optionMenuTrigger" variant="primary" onClick={() => { this.triggerShow() }}>
                    <FontAwesomeIcon icon={faBars} />
                </Button>

                <Modal show={this.state.show} onHide={() => { this.triggerShow() }}>
                    <Modal.Header>
                        <Modal.Title>
                            <div className="logo">
                                Chews<span className="navbar-brand-r">r</span>
                            </div>
                            <div className="modal-sub-text">options</div>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Row>
                                {/* Group ID */}
                                {this.props.uuid ? (
                                    <Col md={12}>
                                        <Row>
                                            <Col md={12} className="option-title">
                                                group ID
                                                </Col>
                                            <Col md={12}>
                                                {this.props.uuid}
                                            </Col>
                                        </Row>
                                    </Col>
                                ) : (
                                        null
                                    )}

                                {/* Seach Restaurant Type */}
                                <Col md={12}>
                                    <Row className="search-type">
                                        <Col md={12} className="option-title">Restaurant Type</Col>
                                        <Col id="restaurantTypeCont">
                                            {this.state.restaurantTypes.map((val, key) => {
                                                return (
                                                    <span key={val} className={'type-radio-cont btn' + ((this.props.keyword == val || (this.props.keyword == '' && val == 'all')) ? ' selected' : '')} onClick={(e) => { this.restTypeClick(e) }}>
                                                        {val}
                                                        <input type="radio" name="restaurant-type" value={val} />
                                                    </span>
                                                );
                                            })}
                                        </Col>
                                    </Row>
                                </Col>

                                {/* Search Radius */}
                                <Col md={12}>
                                    <Row className="search-radius">
                                        <Col md={12} className="option-title">search radius</Col>
                                        <Col>
                                            <Form.Group controlId="exampleForm.ControlSelect1">
                                                <Form.Control as="select">
                                                    <option>5</option>
                                                    <option>10</option>
                                                    <option>25</option>
                                                    <option>50</option>
                                                    <option>100</option>
                                                </Form.Control>
                                                <span>miles</span>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => { this.triggerShow() }}>
                            <FontAwesomeIcon icon={faTimes} />
                        </Button>
                        <Button variant="primary" onClick={() => { this.triggerShow() }}>Save</Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}

class CustomNavbar extends Component {
    render() {
        return (
            <Navbar bg="light" expand="lg">
                <Navbar.Brand className="logo" onClick={this.props.resetBoard}>
                    Chews<span className="navbar-brand-r">r</span>
                </Navbar.Brand>
                <OptionMenu uuid={this.props.uuid} keyword={this.props.keyword} />
            </Navbar>
        );
    }
}

export default CustomNavbar;