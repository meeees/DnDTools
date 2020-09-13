import React, { useRef, useState, useEffect } from 'react';
import db from '@src/Database';
import PropTypes from 'prop-types';
import './PlayerView.css';
import scroll from '@assets/scroll.png';
import { supports_textonly_contenteditable } from '@src/Compatability.js';

var draggedItem = null;

function PlayerListComponent() {

  function loadPlayers() {
    if (!playersDirty) {
      return;
    }
    db.players.toArray().then((res) => generatePlayerList(res)).then(setPlayersDirty(false));
  }

  function addPlayer(name, level, pClass, race) {
    db.players.put(
      {
        name: name, level: parseInt(level), playerClass: pClass, race: race,
        // defaults
        description: '', items: []
      })
      .then(clearInputValues).then(setPlayersDirty(true));
  }

  function updatePlayer(id, nameAndField) {
    //console.log(nameAndField);
    db.players.update(id, nameAndField).then(setPlayersDirty(true));
  }

  function deletePlayer(id) {
    db.players.delete(id).then(setPlayersDirty(true));
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
    //console.log(playerDefs);
    var ps = playerDefs.map((p) =>
      <PlayerListEntry key={p.id} playerData={p}
        editCallback={updatePlayer}
        deleteCallback={deletePlayer}
      />);
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
  const { playerData, deleteCallback, editCallback } = props;
  const expandedStore = 'p-' + playerData.id + '-expanded';
  const [expanded, setExpanded] = useState(Boolean(localStorage.getItem(expandedStore)));

  function itemDropped(e) {
    e.preventDefault();
    // if this is the current player, don't do anything
    if (draggedItem == null || draggedItem.playerId == playerData.id) {
      return;
    }
    // otherwise remove it and add it to the current player
    draggedItem.removeCall();
    if (playerData.items === undefined) {
      playerData.items = [];
    }
    playerData.items.push(draggedItem.name);
    editCallback(playerData.id, { items: playerData.items });
  }

  function enableDrop(e) {
    e.preventDefault();
  }

  return (
    <div className="PlayerEntryHolder" onDrop={itemDropped} onDragOver={enableDrop}>
      <PlayerHeader name={playerData.name} level={playerData.level} race={playerData.race} playerClass={playerData.playerClass}
        onClick={() => { setExpanded(!expanded); localStorage.setItem(expandedStore, expanded); }}
      />
      <PlayerDetails expanded={expanded} playerData={playerData} deleteCallback={deleteCallback} editCallback={editCallback} />
    </div>
  );
}

PlayerListEntry.propTypes = {
  playerData: PropTypes.object,
  deleteCallback: PropTypes.func,
  editCallback: PropTypes.func
};


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


const PlayerDetails = ({ expanded, playerData, deleteCallback, editCallback }) => {

  function getItems() {
    if (playerData.items == undefined) {
      return [];
    }
    return playerData.items;
  }

  function addItem() {
    const name = itemNameRef.current.value;
    if (name === '') {
      return;
    }
    itemNameRef.current.value = '';
    var items = getItems();
    items.push(name);
    editCallback(playerData.id, { items });
  }

  function removeItem(item) {
    let items = [...getItems()];
    items.splice(item, 1);
    editCallback(playerData.id, { items });
  }

  const itemNameRef = useRef();

  return (
    <div className={'PlayerBody' + (expanded ? ' PlayerBody-Expanded' : '')}>
      {expanded &&
        <div className="PlayerBodyScroll">
          <table style={{ borderCollapse: 'separate', borderSpacing: '1rem 0' }}><tbody>
            <tr>
              <td className='PlayerTableLeft'><b>Notes</b></td>
              <td className='PlayerTableRight'><b>Items</b></td>
            </tr>
            <tr>
              <td className='PlayerTableLeft'>
                <div className="PlayerDetails PlayerNotes" contentEditable={supports_textonly_contenteditable() ? 'plaintext-only' : 'true'}
                  onBlur={e => editCallback(playerData.id, { description: e.target.innerText })}
                  suppressContentEditableWarning='true' >
                  {playerData.description}
                </div>
              </td>
              <td className='PlayerTableRight'>
                {!getItems().length ? null : <div className='PlayerDetails PlayerItems'>
                  {getItems().map((it, i) => <PlayerItem playerId={playerData.id} name={it} key={i} removeItem={() => removeItem(i)} />)}
                </div>}
                <div className='PlayerAddItemHolder'>
                  <input type='text' className='PlayerAddItem' ref={itemNameRef} />
                  <button className='PlayerModifyButton' onClick={(e) => { addItem(); e.target.blur(); }}>+</button>
                </div>
              </td>
            </tr>
          </tbody></table>
        </div>
      }
    </div>);
};

PlayerDetails.propTypes = {
  expanded: PropTypes.bool.isRequired,
  playerData: PropTypes.object,
  deleteCallback: PropTypes.func,
  editCallback: PropTypes.func
};

function PlayerItem({ playerId, name, removeItem }) {
  function resolveDeletePress() {
    if (confirmDelete) {
      removeItem();
      // need to do this because using index as key
      setConfirmDelete(false);
    }
    else {
      setConfirmDelete(true);
    }
  }

  function clearConfirm() {
    setConfirmDelete(false);
  }

  function setupDrag() {
    draggedItem = { name: name, playerId: playerId, removeCall: removeItem };
  }

  function endDrag() {
    draggedItem = null;
  }

  const [confirmDelete, setConfirmDelete] = useState(false);
  return (
    <div className='PlayerItemEntry' draggable='true' onDragStart={setupDrag} onDragEnd={endDrag}>
      {confirmDelete ? 'Delete item?' : name}
      <div className='PlayerItemDeleteButtonHolder'>
        <button
          className={'PlayerModifyButton PlayerItemDeleteButton' + (confirmDelete ? ' PlayerItemDeleteButtonConfirm' : '')}
          onClick={resolveDeletePress} onMouseLeave={(e) => { clearConfirm(); e.target.blur(); }} onBlur={clearConfirm}
        />
      </div>
    </div>
  );
}

PlayerItem.propTypes = {
  name: PropTypes.string,
  removeItem: PropTypes.func,
  playerId: PropTypes.number
};

export default PlayerListComponent;