import React, { useRef, Fragment, useState, useEffect } from 'react';
import db from '@src/Database';
import PropTypes from 'prop-types';

function EncounterView() {

  const addEntityRef = useRef();
  const addInitiativeRef = useRef();
  const [encounter, setEncounter] = useState();
  const [encounterDirty, setEncounterDirty] = useState(true);
  useEffect(loadEncounter, [encounterDirty]);

  function loadEncounter() {
    if (!encounterDirty) {
      return;
    }
    var id = localStorage.getItem('encounterId');
    if (id == null || id == undefined) {
      db.encounters.add({
        name: 'New Encounter',
        entities: [],
        playersLoaded: false
      })
        .then((id) => {
          localStorage.setItem('encounterId', id);
          db.encounters.get(parseInt(id), e => {
            setEncounter(e);
            setEncounterDirty(false);
          });
        });
    }
    else {
      db.encounters.get(parseInt(id), e => {
        setEncounter(e);
        setEncounterDirty(false);
      });
    }
  }

  function updateEncounter(id, data) {
    db.encounters.update(id, data).then(setEncounterDirty(true));
  }

  function loadPlayers() {
    db.players.where('active').equals(1)
      .each(p => encounter.entities.push(
        {
          name: p.name,
          initiative: 0,
          subInit: 0,
          id: p.id
        }
      ))
      .then(updateEncounter(encounter.id, {
        entities: encounter.entities,
        playersLoaded: true
      }));
  }

  function reset() {
    updateEncounter(encounter.id, {
      entities: [],
      playersLoaded: false
    });
  }

  function updateInitiative(index, newInit, subInit = 0) {
    encounter.entities[index].initiative = parseInt(newInit);
    encounter.entities[index].subInit = subInit;
    console.log(encounter.entities);
    updateEncounter(encounter.id, { entities: encounter.entities });
  }

  function sortInitiative(e1, e2) {
    if (e1.initiative == e2.initiative) {
      return e2.subInit - e1.subInit;
    }
    return e2.initiative - e1.initiative;
  }

  function addEntity() {
    var id = addEntityRef.current.value;
    var num = 0;
    var testAgainst = encounter.entities.map(e => e.id);
    while (testAgainst.includes(id + '-' + num)) {
      num += 1;
    }
    var init = parseInt(addInitiativeRef.current.value);
    encounter.entities.push({
      name: addEntityRef.current.value,
      initiative: isNaN(init) ? 0 : init,
      subInit: 0,
      id: id + '-' + num
    });
    addEntityRef.current.value = '';
    addInitiativeRef.current.value = '';
    updateEncounter(encounter.id, { entities: encounter.entities });
  }

  return (
    <div>
      {encounter && <Fragment>
        {encounter.entities
          .sort((a, b) => sortInitiative(a, b))
          .map((e, i) =>
            <EncounterEntity key={e.id}
              name={e.name}
              init={e.initiative}
              subInit={e.subInit}
              updateInitiative={(val, subVal = 0) => updateInitiative(i, val, subVal)} />)}
        {!encounter.playersLoaded ?
          (<button onClick={loadPlayers}>Load Players</button>)
          : null}
        <form onSubmit={(e) => {
          e.preventDefault();
          addEntity();
        }}>
          <input type='text' ref={addEntityRef} />
          <input type='number' ref={addInitiativeRef} />
          <button type='submit'>Add</button>
        </form>
        <button onClick={reset}>Reset</button>
      </Fragment>
      }
    </div>
  );
}

// TODO: support drag/drop, set subInit to differentiate between same init rolls
function EncounterEntity({ name, init, subInit, updateInitiative }) {

  const [tempInit, setTempInit] = useState(init);
  return (
    <Fragment>
      <span>
        {name}
        <input type='number'
          value={tempInit}
          onChange={e => setTempInit(e.target.value)}
          onBlur={e => {
            if (e.target.value == '') {
              setTempInit(0);
              updateInitiative(0);
            }
            else {
              updateInitiative(e.target.value);
            }
          }} />
      </span>
      <br />
    </Fragment>
  );
}

EncounterEntity.propTypes = {
  name: PropTypes.string,
  init: PropTypes.number,
  subInit: PropTypes.number,
  updateInitiative: PropTypes.func
};

export default EncounterView;