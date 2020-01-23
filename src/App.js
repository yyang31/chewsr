import React from 'react';
import './App.scss'

// navbar import
import CustomNavbar from './navbar/navbar';

// third party imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Button from 'react-bootstrap/Button';

function App() {
  return (
    <div className="App">
      <CustomNavbar />
    </div>
  );
}

export default App;
