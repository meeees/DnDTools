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

  function addPlayer(name, level) {
    console.log(typeof (level));
    db.players.put({ name: name, level: parseInt(level) }).then(clearInputValues).then(setPlayersDirty(true));
  }

  function clearInputValues() {
    nameRef.current.value = '';
    levelRef.current.value = '';
  }

  function clearAllPlayers() {
    db.players.clear().then(setPlayersDirty(true));
  }

  const nameRef = useRef();
  const levelRef = useRef();


  function generatePlayerList(playerDefs) {
    // console.log(playerDefs);
    var ps = playerDefs.map((p, i) =>
      <Fragment key={i}>
        <PlayerListEntry name={p.name} level={p.level} />
      </Fragment>);
    setPlayers(ps);
  }

  var [players, setPlayers] = useState([]);
  var [playersDirty, setPlayersDirty] = useState(true);
  useEffect(loadPlayers, [playersDirty]);

  return <div>
    {players}
    <span>Player Name <input type='text' ref={nameRef} /></span>
    <br />
    <span>Player Level <input type='number' ref={levelRef} /></span>
    <br />
    <button onClick={() => addPlayer(nameRef.current.value, levelRef.current.value)}>Add Player</button>
    &nbsp;&nbsp;&nbsp;&nbsp;
    <button onClick={clearAllPlayers}>Clear All</button>
  </div>;
}

function PlayerListEntry(props) {
  return (
    <div className="PlayerEntry">
      {props.name} {props.level}
    </div>
  );
}

PlayerListEntry.propTypes = {
  name: PropTypes.string,
  level: PropTypes.number
};


export default PlayerListComponent;