import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Views } from '@src/ViewController';

function NavbarComponent(props) {
  return (
    <div className='Navbar'>
      <NavbarItem symbol='H' name='Home' navCallback={props.navCallback} toView={Views.HOME} />
      <br />
      <NavbarItem symbol='P' name='Players' navCallback={props.navCallback} toView={Views.PLAYERS} />
      <br />
      <NavbarItem symbol='E' name='Encounters' navCallback={props.navCallback} toView={Views.ENCOUNTERS} />
      <br />
      <NavbarItem symbol='A' name='Areas' navCallback={props.navCallback} toView={Views.AREAS} />
      <br />
      <NavbarItem symbol='N' name='NPCs' navCallback={props.navCallback} toView={Views.NPCS} />
    </div>
  );
}

NavbarComponent.propTypes = {
  navCallback: PropTypes.func
};

function NavbarItem(props) {

  const [text, setText] = useState(props.symbol);

  function expandItem(e) {
    e.target.className = 'NavbarButton NavbarButton-Expanded';
    setText(props.name);
  }

  function collapseItem(e) {
    e.target.className = 'NavbarButton NavbarButton-Collapsed';
    setText(props.symbol);
  }

  function triggerNav() {
    props.navCallback(props.toView);
  }

  return (
    <div className='NavbarButtonDiv'>
      <button className='NavbarButton NavbarButton-Collapsed' onMouseOver={expandItem} onMouseLeave={collapseItem} onClick={triggerNav}><span>{text}</span></button>
    </div>
  );
}

NavbarItem.propTypes = {
  name: PropTypes.string,
  symbol: PropTypes.string,
  navCallback: PropTypes.func,
  toView: PropTypes.string
};

export default NavbarComponent;