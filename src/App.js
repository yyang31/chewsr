import React from "react";
import "./App.scss";

import Home from "./home/home";
import Board from "./board/board";

import ReactDOM from "react-dom";
import $ from "jquery";

// react bootstrap
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Toast from "react-bootstrap/Toast";
import Spinner from "react-bootstrap/Spinner";

import { withCookies } from "react-cookie";

class ToastMessage extends React.Component {
    render() {
        return (
            <Toast
                className={this.props.messageType}
                onClose={() => {
                    this.props.setToastMessage();
                }}
                show={this.props.show}
                delay={3000}
                autohide
            >
                <Toast.Header>
                    <strong className="mr-auto">
                        {this.props.messageType}
                    </strong>
                </Toast.Header>
                <Toast.Body>{this.props.message}</Toast.Body>
            </Toast>
        );
    }
}

class LoadingOverlay extends React.Component {
    componentDidUpdate = () => {
        let overlay = $(ReactDOM.findDOMNode(this));
        if (this.props.showLoading) {
            overlay.fadeIn();
        } else {
            overlay.fadeOut();
        }
    };

    render() {
        return (
            <Row id="loadingOverlay" className="no-gutters">
                <Col>
                    <Row>
                        <Col>
                            <Spinner animation="border" />
                        </Col>
                    </Row>
                    <Row>
                        <Col>loading</Col>
                    </Row>
                </Col>
            </Row>
        );
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showToast: false,
            ToastMessageType: "",
            ToastMessage: "",
            showLoading: false,
            groupCode: "",
            placesRequest: {
                formattedAddress: "",
                location: "",
                type: ["restaurant"],
                radius: 16093.4, // 16093.4 meters ~ 10 miles
                keyword: "", // The text string on which to search, for example: "restaurant" or "123 Main Street".
                minprice: 0,
                maxprice: 4, // price range from 0 ~ 4, with 0 been most affordable and 4 been most expensive
                openNow: true,
            },
        };
    }

    toggleLoadingOverlay = (show) => {
        if (this.state.showLoading !== show) {
            this.setState({
                showLoading: show,
            });
        }
    };

    setToastMessage = (messageType, message) => {
        this.setState({
            showToast: this.state.showToast && message == null ? false : true,
            ToastMessageType: messageType,
            ToastMessage: message,
        });
    };

    setPlacesRequest = (placesRequest) => {
        this.setState({
            placesRequest: placesRequest,
            groupCode: Math.floor(Math.random() * 90000) + 10000,
        });
        console.log(this.state.placesRequest);
    };

    render() {
        return (
            <Row className="App no-gutters">
                <LoadingOverlay showLoading={this.state.showLoading} />
                <ToastMessage
                    show={this.state.showToast}
                    messageType={this.state.ToastMessageType}
                    message={this.state.ToastMessage}
                    setToastMessage={this.setToastMessage}
                />
                {(() => {
                    if (this.state.groupCode) {
                        return (
                            <Col>
                                <Board
                                    placesRequest={this.state.placesRequest}
                                    setToastMessage={this.setToastMessage}
                                    toggleLoadingOverlay={
                                        this.toggleLoadingOverlay
                                    }
                                    setPlacesRequest={this.setPlacesRequest}
                                ></Board>
                            </Col>
                        );
                    } else {
                        return (
                            <Col>
                                <Home
                                    placesRequest={this.state.placesRequest}
                                    setToastMessage={this.setToastMessage}
                                    toggleLoadingOverlay={
                                        this.toggleLoadingOverlay
                                    }
                                    setPlacesRequest={this.setPlacesRequest}
                                ></Home>
                            </Col>
                        );
                    }
                })()}
            </Row>
        );
    }
}

export default withCookies(App);
