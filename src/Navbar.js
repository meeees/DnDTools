import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Views } from '@src/ViewController';

import homeImg from '@assets/nav_icons/home.png';
import encounterImg from '@assets/nav_icons/encounters.png';
import areaImg from '@assets/nav_icons/areas.png';
import npcImg from '@assets/nav_icons/npcs.png';
import playerImg from '@assets/nav_icons/players.png';

function NavbarComponent(props) {
  return (
    <div className='Navbar'>
      <NavbarItem symbol={homeImg} name='Home' navCallback={props.navCallback} toView={Views.HOME} />
      <br />
      <NavbarItem symbol={playerImg} name='Players' navCallback={props.navCallback} toView={Views.PLAYERS} />
      <br />
      <NavbarItem symbol={encounterImg} name='Encounters' navCallback={props.navCallback} toView={Views.ENCOUNTERS} />
      <br />
      <NavbarItem symbol={areaImg} name='Areas' navCallback={props.navCallback} toView={Views.AREAS} />
      <br />
      <NavbarItem symbol={npcImg} name='NPCs' navCallback={props.navCallback} toView={Views.NPCS} />
    </div>
  );
}

NavbarComponent.propTypes = {
  navCallback: PropTypes.func
};

function NavbarItem(props) {

  const [expanded, setExpanded] = useState(false);

  function expandItem(e) {
    e.target.className = 'NavbarButton NavbarButton-Expanded';
    setExpanded(true);
  }

  function collapseItem(e) {
    e.target.className = 'NavbarButton NavbarButton-Collapsed';
    setExpanded(false);
  }

  function triggerNav() {
    props.navCallback(props.toView);
  }

  return (
    <div className='NavbarButtonDiv'>
      <button className='NavbarButton NavbarButton-Collapsed' onMouseOver={expandItem} onMouseLeave={collapseItem} onClick={triggerNav}>
        <img src={props.symbol} />
        {expanded ? <span>{props.name}</span> : null}
      </button>
    </div>
  );
}

NavbarItem.propTypes = {
  name: PropTypes.string,
  symbol: PropTypes.object,
  navCallback: PropTypes.func,
  toView: PropTypes.string
};

export default NavbarComponent;