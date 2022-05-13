import React from "react";
import "./App.scss";

import Home from "./home/home";
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
                <div id="background">
                    <div className="top"></div>
                    <div className="bottom"></div>
                </div>
                <Col sm={12} md={7} lg={4} className="p-3">
                    <Row id="topNav">
                        chews<span>r</span>
                    </Row>
                    <Home></Home>
                </Col>
            </Row>
        );
    }
}

export default withCookies(App);
