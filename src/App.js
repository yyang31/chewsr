import React from "react";
import "./App.scss";

import Home from "./home/home";
import Board from "./board/board";

import ReactDOM from "react-dom";
import $ from "jquery";

// react bootstrap
import { Container, Row, Col, Toast, Spinner } from "react-bootstrap";

import { withCookies } from "react-cookie";
import { addPlaceGroup, getPlaceGroupByGroupCode } from "./common/_firebase";

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
            <Container fluid id="loadingOverlay">
                <Row>
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
            </Container>
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
            docId: "",
            groupCode: "",
            placesRequest: {
                formattedAddress: "",
                location: "",
                type: ["restaurant", "bar", "cafe"],
                radius: 16093.4, // 16093.4 meters ~ 10 miles
                keyword: "", // The text string on which to search, for example: "restaurant" or "123 Main Street".
                minPrice: 0,
                maxPrice: 4, // price range from 0 ~ 4, with 0 been most affordable and 4 been most expensive
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

    generateGroupCode = (length) => {
        let result = "";
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
            result += characters.charAt(
                Math.floor(Math.random() * charactersLength)
            );
            counter += 1;
        }
        return result;
    };

    setPlacesRequest = async (placesRequest) => {
        let groupCode = this.state.groupCode;
        if (groupCode === "") {
            groupCode = this.generateGroupCode(
                process.env.REACT_APP_GROUP_CODE_MAX_LENGTH
            );
        }
        let placeGroup = await addPlaceGroup(groupCode, placesRequest);

        this.setState({
            docId: placeGroup.id,
            placesRequest: placesRequest,
            groupCode: groupCode,
        });
    };

    setGroupCode = async (groupCode) => {
        let placeGroup = await getPlaceGroupByGroupCode(groupCode);

        if (placeGroup.error) {
            // error handling
        }

        this.setState({
            docId: placeGroup.id,
            placesRequest: placeGroup.data.placesRequest,
            groupCode: groupCode,
        });
    };

    render() {
        return (
            <Container fluid>
                <Row className="App">
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
                                        setGroupCode={this.setGroupCode}
                                    ></Home>
                                </Col>
                            );
                        }
                    })()}
                </Row>
            </Container>
        );
    }
}

export default withCookies(App);
