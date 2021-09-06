import React from "react";
import "./App.scss";

import Home from "./home/home";
import SwipeBoard from "./swipe_board/swipe_board";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { withCookies } from "react-cookie";

class App extends React.Component {
    render() {
        return (
            // <Row className="App justify-content-md-center no-gutters">
            //   <Col sm={12} md={6} lg={4}>
            //     <SwipeBoard cookies={this.props.cookies} />
            //   </Col>
            // </Row>
            <Row className="App justify-content-md-center no-gutters">
                <Col sm={12} md={7} lg={4}>
                    <Home></Home>
                </Col>
            </Row>
        );
    }
}

export default withCookies(App);
