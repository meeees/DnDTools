import Dexie from 'dexie';

var db = new Dexie('DnDToolsDB');

db.version(0.1).stores({
  players: '++id,name'
});

export default db;