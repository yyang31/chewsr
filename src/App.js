import React from 'react';
import './App.scss'

// navbar import
import CustomNavbar from './navbar/navbar';

import SwipeBoard from './swipe_board/swipe_board';

function App() {
  return (
    <div className="App">
      <CustomNavbar />
      <SwipeBoard />
    </div>
  );
}

export default App;
