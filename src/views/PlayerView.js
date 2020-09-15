import React, { useRef, useState, useEffect } from 'react';
import db from '@src/Database';
import PropTypes from 'prop-types';
import './PlayerView.css';
import scroll from '@assets/scroll.png';
import { supports_textonly_contenteditable } from '@src/Compatability.js';
import Modal from '../components/Modal';

var draggedItem = null;

function PlayerListComponent() {
  function loadPlayers() {
    if (!playersDirty) {
      return;
    }
    db.players
      .toArray()
      .then((res) => generatePlayerList(res))
      .then(setPlayersDirty(false));
  }

  function addPlayer(name, level, pClass, race) {
    db.players
      .put({
        name: name,
        level: parseInt(level),
        playerClass: pClass,
        race: race,
        // defaults
        description: '',
        items: [],
        active: 1
      })
      .then(clearInputValues)
      .then(setPlayersDirty(true));
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
    var ps = playerDefs.map((p) => (
      <PlayerListEntry
        key={p.id}
        playerData={p}
        editCallback={updatePlayer}
        deleteCallback={deletePlayer}
      />
    ));
    setPlayers(ps);
  }

  var [players, setPlayers] = useState([]);
  var [playersDirty, setPlayersDirty] = useState(true);
  useEffect(loadPlayers, [playersDirty]);

  return (
    <div className="PlayerList">
      {players}
      <br />
      <span>
        Player Name
        <input type="text" ref={nameRef} />
        &nbsp;&nbsp;&nbsp;&nbsp; Player Level
        <input type="number" ref={levelRef} />
      </span>
      <br />
      <span>
        Player Class
        <input type="text" ref={classRef} />
        &nbsp;&nbsp;&nbsp;&nbsp; Player Race
        <input type="text" ref={raceRef} />
      </span>
      <br />
      <button
        onClick={() =>
          addPlayer(
            nameRef.current.value,
            levelRef.current.value,
            classRef.current.value,
            raceRef.current.value,
          )
        }
      >
        Add Player
      </button>
      &nbsp;&nbsp;&nbsp;&nbsp;
      <button onClick={clearAllPlayers}>Clear All</button>
    </div>
  );
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
    <div className="PlayerEntryHolder"
      onDrop={itemDropped}
      onDragOver={enableDrop}>
      <PlayerHeader playerData={playerData}
        onClick={() => {
          setExpanded(!expanded);
          localStorage.setItem(expandedStore, expanded);
        }}
      />
      <PlayerDetails
        expanded={expanded}
        playerData={playerData}
        deleteCallback={() => deleteCallback(playerData.id)}
        editCallback={(data) => editCallback(playerData.id, data)}
      />
    </div>
  );
}

PlayerListEntry.propTypes = {
  playerData: PropTypes.object,
  deleteCallback: PropTypes.func,
  editCallback: PropTypes.func,
};


const PlayerHeader = ({ playerData, onClick }) => (
  <div className={'PlayerHeader' + (playerData.active == 1 ? '' : ' PlayerHeaderInactive')}
    onClick={onClick} >
    <img src={scroll} className='PlayerHeaderScroll' />
    <div className='PlayerName'>{playerData.name}&nbsp;&nbsp;&nbsp;</div>
    <div className='PlayerLevel'>{playerData.level}</div>
    <span className='PlayerRace'>{playerData.race}</span>
    <div className='PlayerClass'>{playerData.playerClass}</div>
  </div>
);

PlayerHeader.propTypes = {
  playerData: PropTypes.object,
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
    editCallback({ items });
  }

  function removeItem(item) {
    let items = [...getItems()];
    items.splice(item, 1);
    editCallback({ items });
  }

  const itemNameRef = useRef();

  return (
    <div className={'PlayerBody' + (expanded ? ' PlayerBody-Expanded' : '')}>
      {expanded && (
        <div className="PlayerBodyScroll">
          <table style={{ borderCollapse: 'separate', borderSpacing: '1rem 0' }}>
            <tbody>
              <tr>
                <td className="PlayerTableLeft" style={{ paddingBottom: '0.5rem' }}>
                  <b>Level</b>
                  <button className='PlayerModifyButton PlayerModifyButtonSquare'
                    style={{ marginLeft: '0.5rem' }}
                    onClick={() => {
                      if (playerData.level > 1) {
                        editCallback({ level: playerData.level - 1 });
                      }
                    }}
                  >
                    <b>-</b>
                  </button>
                  <button
                    className="PlayerModifyButton PlayerModifyButtonSquare"
                    style={{ marginLeft: '0.2rem' }}
                    onClick={() => {
                      editCallback({ level: playerData.level + 1 });
                    }}
                  >
                    <b>+</b>
                  </button>
                  <button className="PlayerModifyButton"
                    style={{ marginLeft: '5rem' }}
                    onClick={() => editCallback({ active: playerData.active == 1 ? 0 : 1 })}>
                    <b>{playerData.active == 1 ? 'Disable' : 'Enable'}</b>
                  </button>
                </td>
                <td
                  className="PlayerTableRight"
                  style={{ paddingBottom: '0.5rem', textAlign: 'right' }}
                >

                  <button className="PlayerModifyButton"><b>Delete</b></button>
                </td>
              </tr>
              <tr>
                <td className="PlayerTableLeft">
                  <b>Notes</b>
                </td>
                <td className="PlayerTableRight">
                  <b>Items</b>
                </td>
              </tr>
              <tr>
                <td className="PlayerTableLeft">
                  <div
                    className="PlayerDetails PlayerNotes"
                    contentEditable={
                      supports_textonly_contenteditable() ? 'plaintext-only' : 'true'
                    }
                    onBlur={(e) => editCallback({ description: e.target.innerText })}
                    suppressContentEditableWarning="true"
                  >
                    {playerData.description}
                  </div>
                </td>
                <td className="PlayerTableRight">
                  {!getItems().length ? null : (
                    <div className="PlayerDetails PlayerItems">
                      {getItems().map((it, i) => (
                        <PlayerItem
                          playerId={playerData.id}
                          name={it}
                          key={i}
                          removeItem={() => removeItem(i)}
                        />
                      ))}
                    </div>
                  )}
                  <form
                    className="PlayerAddItemHolder"
                    onSubmit={(e) => {
                      e.preventDefault();
                      addItem();
                    }}
                  >
                    <input type="text" className="PlayerAddItem" ref={itemNameRef} />
                    <button
                      type="submit"
                      className="PlayerModifyButton PlayerModifyButtonSquare"
                      onClick={(e) => {
                        e.target.blur();
                      }}
                    >
                      <b>+</b>
                    </button>
                  </form>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )
      }
    </div >
  );
};

PlayerDetails.propTypes = {
  expanded: PropTypes.bool.isRequired,
  playerData: PropTypes.object,
  deleteCallback: PropTypes.func,
  editCallback: PropTypes.func,
};

function PlayerItem({ playerId, name, removeItem }) {
  const [showModal, setShowModal] = useState(false);

  const [left, setLeft] = useState(0);
  const [top, setTop] = useState(0);

  function setupDrag() {
    draggedItem = {
      name: name,
      playerId: playerId,
      removeCall: removeItem,
    };
  }

  function endDrag() {
    draggedItem = null;
  }

  return (
    <div className="PlayerItemEntry" draggable="true" onDragStart={setupDrag} onDragEnd={endDrag}>
      {name}
      <button
        className="PlayerModifyButton PlayerModifyButtonSquare PlayerItemDeleteButton"
        onClick={(e) => {
          setShowModal(!showModal);
          const boundingRect = e.target.getBoundingClientRect();
          setLeft(boundingRect.left);
          setTop(boundingRect.top);
        }}
      />
      {showModal && (
        <Modal left={left} top={top} offsetX={24}>
          Delete item?
          <button className='PlayerModifyButton'
            onClick={() => { removeItem(); setShowModal(false); }}>Confirm</button>
        </Modal>
      )}
    </div>
  );
}

PlayerItem.propTypes = {
  name: PropTypes.string,
  removeItem: PropTypes.func,
  playerId: PropTypes.number,
};

export default PlayerListComponent;
