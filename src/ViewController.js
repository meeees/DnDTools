import React from 'react';
import NotImplementedComponent from '@src/views/NotImplemented';
import HomePageComponent from '@src/views/HomePage';
import PropTypes from 'prop-types';

export const Views = {
  HOME: 'home',
  PLAYERS: 'players',
  ENCOUNTERS: 'encounters',
  AREAS: 'areas',
  NPCS: 'npcs'
};

function ViewController(props) {

  var comp;
  console.log(props.curView);
  switch (props.curView) {
    case Views.HOME:
      comp = <HomePageComponent />;
      break;
    case Views.PLAYERS:
      comp = <NotImplementedComponent name='Players' />;
      break;
    case Views.ENCOUNTERS:
      comp = <NotImplementedComponent name='Encounters' />;
      break;
    case Views.AREAS:
      comp = <NotImplementedComponent name='Areas' />;
      break;
    case Views.NPCS:
      comp = <NotImplementedComponent name='NPCs' />;
      break;
  }
  return comp;
}

ViewController.propTypes = {
  curView: PropTypes.string
};

export default ViewController;