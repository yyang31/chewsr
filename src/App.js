import React from "react";
import "./App.scss";

import Home from "./home/home";

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

    render() {
        return (
            <Row className="App justify-content-md-center no-gutters">
                <div id="background">
                    <div className="top"></div>
                    <div className="bottom"></div>
                </div>
                <LoadingOverlay showLoading={this.state.showLoading} />
                <ToastMessage
                    show={this.state.showToast}
                    messageType={this.state.ToastMessageType}
                    message={this.state.ToastMessage}
                    setToastMessage={this.setToastMessage}
                />
                <Col sm={12} md={7} lg={4} className="p-3">
                    <Row id="topNav">
                        <Col>
                            chews<span>r</span>
                        </Col>
                    </Row>
                    <Home
                        setToastMessage={this.setToastMessage}
                        toggleLoadingOverlay={this.toggleLoadingOverlay}
                    ></Home>
                </Col>
            </Row>
        );
    }
}

export default withCookies(App);
