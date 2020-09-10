import React, { useState } from 'react';
import { hot } from 'react-hot-loader';
import './App.css';
import NavbarComponent from '@src/Navbar';
import ViewController, { Views } from '@src/ViewController';

function AppComponent() {
  var [curPage, setCurPage] = useState(Views.HOME);

  function goToPage(newPage) {
    setCurPage(newPage);
  }
  return (
    <div className='App'>
      <NavbarComponent navCallback={goToPage} />
      <ViewController curView={curPage} />
    </div>
  );
}

export default hot(module)(AppComponent);
