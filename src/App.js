import React, { useState } from 'react';
import { hot } from 'react-hot-loader';
import './App.css';
import NavbarComponent from '@src/Navbar';
import ViewController, { Views } from '@src/ViewController';

function AppComponent() {
  var [curView, setCurrentView] = useState(loadStoredView() || Views.HOME);

  function loadStoredView() {
    return localStorage.getItem('currentView');
  }
  function goToView(newView) {
    localStorage.setItem('currentView', newView);
    setCurrentView(newView);
  }
  return (
    <div className='App'>
      <NavbarComponent navCallback={goToView} curView={curView} />
      <ViewController curView={curView} />
    </div>
  );
}

export default hot(module)(AppComponent);
