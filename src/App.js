import React from 'react';
import './App.scss'

import SwipeBoard from './swipe_board/swipe_board';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <SwipeBoard />
      </div>
    );
  }
}

export default App;
