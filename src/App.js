import React from 'react';
import './App.scss'

import SwipeBoard from './swipe_board/swipe_board';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class App extends React.Component {
  render() {
    return (
      <Row className="App justify-content-md-center">
        <Col md={12} lg={6}>
          <SwipeBoard />
        </Col>
      </Row>
    );
  }
}

export default App;
