import React from 'react';
import './App.scss'

// navbar import
import CustomNavbar from './navbar/navbar';

import SwipeBoard from './swipe_board/swipe_board';

// third party imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Button from 'react-bootstrap/Button';

function App() {
  return (
    <div className="App">
      <CustomNavbar />
      <SwipeBoard />
    </div>
  );
}

export default App;
