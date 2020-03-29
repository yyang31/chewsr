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

import "rc-slider/assets/index.css";
import "rc-tooltip/assets/bootstrap.css";
import Tooltip from "rc-tooltip";
import Slider from 'rc-slider';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faBars, faDollarSign } from '@fortawesome/free-solid-svg-icons'

import $ from 'jquery';

const createSliderWithTooltip = Slider.createSliderWithTooltip;

class OptionMenu extends Component {
    state = {
        show: false,
        restaurantTypes: ['all', 'fast food', 'chinese', 'italian', 'mexican', 'vegetarian'],
    }

    componentDidMount = () => {
        this.setState({
            radius: this.props.placesRequest.radius,
            keyword: this.props.placesRequest.keyword,
            maxprice: this.props.placesRequest.maxprice,
            openNow: this.props.placesRequest.openNow,
        });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.placesRequest !== this.props.placesRequest) {
            this.setState({
                radius: this.props.placesRequest.radius,
                keyword: this.props.placesRequest.keyword,
                maxprice: this.props.placesRequest.maxprice,
                openNow: this.props.placesRequest.openNow,
            });
        }
    }

    /**
     * handles click on custom restaurant type buttons
     */
    restTypeClick = (e) => {
        // return if current swiping
        if (this.props.uuid) return;

        // console.log(e.target);
        let restTypeBtn = $(e.target);

        // trigger the check on the radio button
        restTypeBtn.addClass('selected');
        restTypeBtn.find(':input[type=radio]').click();

        // remove class 'selected' from other radio buttons
        $('.type-radio-cont').not(restTypeBtn).removeClass('selected');

        // update search keyword
        let selectResType = restTypeBtn.find(':input[type=radio]').val();
        this.setState({
            keyword: selectResType == 'all' ? '' : selectResType
        });
    }

    /**
     * handle radius select option change
     */
    radiusChange = (e) => {
        this.setState({
            radius: e.target.value * 1609.34     // 1 mile = 1609.34 metters
        });
    }

    /**
     * handle max price slider
     */
    priceChange = (val) => {
        this.setState({
            maxprice: parseInt(val)
        });
    }

    renderPriceIcon = () => {
        let icons = [];

        for (let i = 0; i < this.state.maxprice + 1; i++) {
            icons.push(<FontAwesomeIcon className={"dollar-" + this.state.maxprice} key={i} icon={faDollarSign} />)
        }

        return icons;
    }

    toggleOpennow = () => {
        // return if current swiping
        if (this.props.uuid) return;

        $('.toggle-cont').toggleClass('true false');

        this.setState({
            openNow: $('.toggle-cont').hasClass('true') ? true : false,
        });
    }

    triggerShow = () => {
        this.setState({
            show: this.state.show ? false : true,
        })
    }

    filterSubmit = (e) => {
        e.preventDefault();

        let placesRequest = this.props.placesRequest;
        placesRequest.radius = this.state.radius;
        placesRequest.keyword = this.state.keyword;
        placesRequest.maxprice = this.state.maxprice;
        placesRequest.openNow = this.state.openNow;

        this.props.updateFilters(placesRequest);

        this.triggerShow();
    }

    render() {
        return (
            <>
                <Button id="optionMenuTrigger" variant="primary" onClick={() => { this.triggerShow() }}>
                    <FontAwesomeIcon icon={faBars} />
                </Button>

                <Modal show={this.state.show} onHide={() => { this.triggerShow() }}>
                    <Form onSubmit={this.filterSubmit}>
                        <Modal.Header>
                            <Modal.Title>
                                <div className="logo colored-text" onClick={() => { this.props.resetBoard() }}>
                                    Chews<span className="navbar-brand-r">r</span>
                                </div>
                                <div className="modal-sub-text">options</div>
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Row>


                                {this.props.uuid ? (
                                    <>
                                        {/* Filter Disabled Message */}
                                        <Col md={12} className="filter-disabled-msg">
                                            filters can not be changed during swipe
                                    </Col>

                                        {/* Group ID */}
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
                                    </>
                                ) : (
                                        null
                                    )}

                                {/* Seach Restaurant Type */}
                                <Col md={12}>
                                    <Row className="search-type">
                                        <Col md={12} className="option-title">restaurant type</Col>
                                        <Col id="restaurantTypeCont">
                                            {this.state.restaurantTypes.map((val, key) => {
                                                return (
                                                    <span key={val}
                                                        className={'type-radio-cont btn' + ((this.state.keyword == val || (this.state.keyword == '' && val == 'all')) ? ' selected' : '') + (this.props.uuid ? ' disabled' : '')}
                                                        onClick={(e) => { this.restTypeClick(e) }}>
                                                        {val}
                                                        <input type="radio" name="restaurant-type" value={val} />
                                                    </span>
                                                );
                                            })}
                                        </Col>
                                    </Row>
                                </Col>

                                {/* Max Price */}
                                <Col md={12}>
                                    <Row className="max-price">
                                        <Col md={12} className="option-title">price range</Col>
                                        <Col md={12} className="price-slider-cont">
                                            <div className="price-icons">
                                                {this.renderPriceIcon()}
                                            </div>
                                            <Slider
                                                max={4}
                                                defaultValue={this.state.maxprice}
                                                onChange={(val) => { this.priceChange(val) }}
                                                disabled={this.props.uuid ? true : false}
                                            />
                                        </Col>
                                    </Row>
                                </Col>

                                <Col md={12}>
                                    <Row>
                                        {/* Search Radius */}
                                        <Col className="search-radius">
                                            <Row>
                                                <Col md={12} className="option-title">search radius</Col>
                                                <Col>
                                                    <Form.Group controlId="exampleForm.ControlSelect1">
                                                        <Form.Control as="select" onChange={this.radiusChange} value={this.state.radius / 1609.34} disabled={this.props.uuid ? true : false}>
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

                                        {/* Open Now */}
                                        <Col className="open-now">
                                            <Row>
                                                <Col md={6}>
                                                    <Row className="open-now">
                                                        <Col md={12} className="option-title">open now</Col>
                                                        <Col>
                                                            <div className={"toggle-cont " + (this.state.openNow ? "true" : "false") + (this.props.uuid ? ' disabled' : '')}
                                                                onClick={() => { this.toggleOpennow() }}>
                                                                <div className="toggle-circle"></div>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Col>

                            </Row>
                        </Modal.Body>
                        <Modal.Footer className={this.props.uuid ? 'swiping' : ''}>
                            <Button variant="secondary" onClick={() => { this.triggerShow() }}>
                                {this.props.uuid ? 'close' : <FontAwesomeIcon icon={faTimes} />}
                            </Button>
                            <input type="submit" value="save" className="btn btn-primary" />
                        </Modal.Footer>
                    </Form>
                </Modal>
            </>
        );
    }
}

class CustomNavbar extends Component {
    render() {
        return (
            <Navbar bg="light" expand="lg">
                <Navbar.Brand className="logo logo-white" onClick={this.props.resetBoard}>
                    <span>Chews</span><span className="navbar-brand-r">r</span>
                </Navbar.Brand>
                <OptionMenu
                    uuid={this.props.uuid}
                    placesRequest={this.props.placesRequest}
                    updateFilters={this.props.updateFilters}
                    resetBoard={this.props.resetBoard}
                />
            </Navbar>
        );
    }
}

export default CustomNavbar;