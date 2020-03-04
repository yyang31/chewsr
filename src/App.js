import React from 'react';
import './App.scss'

import SwipeBoard from './swipe_board/swipe_board';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class App extends React.Component {
  render() {
    return (
      <Row className="App justify-content-md-center no-gutters">
        <Col sm={12} md={6} lg={4}>
          <SwipeBoard />
        </Col>
      </Row>
    );
  }
}

export default App;
