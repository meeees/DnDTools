import Dexie from 'dexie';

var db = new Dexie('DnDToolsDB');

db.version(0.2).stores({
  players: '++id,name,active',
  encounters: '++id,name'
});

export default db;