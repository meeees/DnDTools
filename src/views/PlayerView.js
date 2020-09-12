import React, { Fragment, useRef, useState, useEffect } from 'react';
import db from '@src/Database';
import PropTypes from 'prop-types';
import './Views.css';

function PlayerListComponent() {

  function loadPlayers() {
    if (!playersDirty) {
      return;
    }
    db.players.toArray().then((res) => generatePlayerList(res)).then(setPlayersDirty(false));
  }

  function addPlayer(name, level, pClass, race) {
    db.players.put(
      { name: name, level: parseInt(level), playerClass: pClass, race: race })
      .then(clearInputValues).then(setPlayersDirty(true));
  }

  function clearInputValues() {
    nameRef.current.value = '';
    //levelRef.current.value = '';
    classRef.current.value = '';
    raceRef.current.value = '';
  }

  function clearAllPlayers() {
    db.players.clear().then(setPlayersDirty(true));
  }

  // TODO: forms
  const nameRef = useRef();
  const levelRef = useRef();
  const classRef = useRef();
  const raceRef = useRef();


  function generatePlayerList(playerDefs) {
    // console.log(playerDefs);
    var ps = playerDefs.map((p, i) =>
      <PlayerListEntry key={i} name={p.name} level={p.level} race={p.race} playerClass={p.playerClass} />);
    setPlayers(ps);
  }

  var [players, setPlayers] = useState([]);
  var [playersDirty, setPlayersDirty] = useState(true);
  useEffect(loadPlayers, [playersDirty]);

  return <div className="PlayerList">
    {players}
    <br />
    <span>Player Name <input type='text' ref={nameRef} />
      &nbsp;&nbsp;&nbsp;&nbsp;
      Player Level <input type='number' ref={levelRef} />
    </span>
    <br />
    <span>Player Class <input type='text' ref={classRef} />
      &nbsp;&nbsp;&nbsp;&nbsp;
      Player Race <input type='text' ref={raceRef} />
    </span>
    <br />
    <button onClick={() => addPlayer(nameRef.current.value, levelRef.current.value, classRef.current.value, raceRef.current.value)}>Add Player</button>
    &nbsp;&nbsp;&nbsp;&nbsp;
    <button onClick={clearAllPlayers}>Clear All</button>
  </div>;
}

function PlayerListEntry(props) {

  const [expanded, setExpanded] = useState(false);
  return (
    <div className="PlayerEntry">
      <div className="PlayerEntryMain" onClick={() => { setExpanded(!expanded); }}>
        <div>
          <span><b>{props.name}</b></span>
          <span>Level: {props.level}</span>
        </div>
        <div>
          <span>{props.race}</span>
          <span>{props.playerClass}</span>
        </div>
      </div>
      {
        expanded ? <Fragment><br /><hr color='rgb(26, 85, 21)' /><br /><PlayerEntryDetails /></Fragment> : null
      }
    </div>
  );
}

function PlayerEntryDetails(props) {
  return (
    <div className='PlayerEntryDetails'>
      <div className='PlayerEntryDetailsDescription'>
        SOME DETAILS ABOUT THE PLAYER REEEE
      </div>
      <div>
        SOME ITEMS THE PLAYER HAS
      </div>
    </div>
  );
}

PlayerListEntry.propTypes = {
  name: PropTypes.string,
  level: PropTypes.number,
  race: PropTypes.string,
  playerClass: PropTypes.string
};


export default PlayerListComponent;