import React, { Fragment, useRef, useState, useEffect } from 'react';
import db from '@src/Database';
import PropTypes from 'prop-types';
import './Views.css';
import scroll from '@assets/scroll.png';

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


const PlayerHeader = ({ name, level, race, playerClass, onClick }) => (
  <div className="PlayerHeader" onClick={onClick} >
    <img src={scroll} className="PlayerHeaderScroll" />
    <div className="PlayerName">{name}&nbsp;&nbsp;&nbsp;</div>
    <div className="PlayerLevel">{level}</div>
    <span className="PlayerRace">{race}</span>
    <div className="PlayerClass">{playerClass}</div>
  </div>
);

PlayerHeader.propTypes = {
  name: PropTypes.string,
  level: PropTypes.number,
  race: PropTypes.string,
  playerClass: PropTypes.string,
  onClick: PropTypes.func,
};


const PlayerDetails = ({ expanded }) => (
  <Fragment>
    <div className={'PlayerBody' + (expanded ? ' PlayerBody-Expanded' : '')}>
      {expanded &&
        <div className="PlayerBodyScroll" >
          <div className='PlayerDetails'>
            <div className='PlayerDetailsDescription'>
              <span>SOME DETAILS ABOUT THE PLAYER REEEE SOME DETAILS ABOUT THE PLAYER REEEE </span>
            </div>
            <div className='PlayerDetailsItems'>
              SOME ITEMS THE PLAYER HAS
            </div>
          </div>
        </div>
      }
    </div>
  </Fragment>
);

PlayerDetails.propTypes = {
  expanded: PropTypes.bool.isRequired
};


function PlayerListEntry(props) {
  const { name, level, race, playerClass } = props;

  const [expanded, setExpanded] = useState(false);

  return (
    <div className="PlayerEntryHolder">
      <PlayerHeader name={name} level={level} race={race} playerClass={playerClass}
        onClick={() => { setExpanded(!expanded); }}
      />
      <PlayerDetails expanded={expanded} />
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