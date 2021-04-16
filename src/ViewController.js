import React from 'react';
import NotImplementedComponent from '@src/views/NotImplemented';
import HomePageComponent from '@src/views/HomePage';
import PlayerListComponent from '@src/views/PlayerView';
import EncounterView from '@src/views/EncounterView';
import RandomBolt from '@src/views/RandomArrows';
import PropTypes from 'prop-types';

export const Views = {
  HOME: 'home',
  PLAYERS: 'players',
  ENCOUNTERS: 'encounters',
  AREAS: 'areas',
  NPCS: 'npcs',
  RANDOMBOLT: 'randombolt'
};

function ViewController(props) {

  var comp;
  switch (props.curView) {
    case Views.HOME:
      comp = <HomePageComponent />;
      break;
    case Views.PLAYERS:
      comp = <PlayerListComponent />;
      break;
    case Views.ENCOUNTERS:
      comp = <EncounterView />;
      break;
    case Views.AREAS:
      comp = <NotImplementedComponent name='Areas' />;
      break;
    case Views.NPCS:
      comp = <RandomBolt />;
      break;
  }
  return comp;
}

ViewController.propTypes = {
  curView: PropTypes.string
};

export default ViewController;