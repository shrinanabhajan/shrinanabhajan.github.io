(function () {
  "use strict";

  const DB_PATH = './db/bhajans.sqlite';
  const LIB_PATH = './lib';
  const state = {
    sql: null,
    database: null,
    ready: null
  };

  function mapRows(rows) {
    if (!rows || !rows.length) {
      return [];
    }

    const first = rows[0];
    return first.values.map((valueRow) => {
      const row = {};
      first.columns.forEach((column, index) => {
        row[column] = valueRow[index];
      });
      return row;
    });
  }

  async function readDatabaseBuffer() {
    try {
      const response = await fetch(DB_PATH, { cache: 'no-store' });
      if (response && response.ok) {
        return await response.arrayBuffer();
      }
    } catch (error) {
      console.warn('SQLite DB network fetch failed; checking cache.', error);
    }

    if ('caches' in window) {
      const cachedResponse = await caches.match(DB_PATH);
      if (cachedResponse && typeof cachedResponse.arrayBuffer === 'function') {
        return await cachedResponse.arrayBuffer();
      }
    }

    throw new Error(`Unable to load SQLite database from ${DB_PATH}`);
  }

  async function loadDatabase() {
    if (state.database) {
      return state.database;
    }

    if (state.ready) {
      return state.ready;
    }

    state.ready = (async () => {
      if (!window.initSqlJs) {
        console.warn('sql.js is not loaded; falling back to original file-based loading.');
        return null;
      }

      const SQL = await window.initSqlJs({
        locateFile: (file) => `${LIB_PATH}/${file}`
      });

      const buffer = await readDatabaseBuffer();
      state.sql = SQL;
      state.database = new SQL.Database(new Uint8Array(buffer));
      return state.database;
    })();

    return state.ready;
  }

  async function getAllBhajans() {
    try {
      const db = await loadDatabase();
      if (!db) {
        return [];
      }

      const rows = db.exec(`
        SELECT file_id AS fileId, dir, id, eng, hin, bk, pg, title, content
        FROM bhajans
        ORDER BY dir, CAST(id AS INTEGER), id
      `);
      return mapRows(rows);
    } catch (error) {
      console.warn('SQLite bhajan load failed:', error);
      return [];
    }
  }

  async function getBhajanByFileId(fileId) {
    try {
      const db = await loadDatabase();
      if (!db) {
        return null;
      }

      const rows = db.exec(`
        SELECT file_id AS fileId, dir, id, eng, hin, bk, pg, title, content
        FROM bhajans
        WHERE file_id = ?
      `, [fileId]);
      const mapped = mapRows(rows);
      return mapped[0] || null;
    } catch (error) {
      console.warn('SQLite bhajan lookup failed:', error);
      return null;
    }
  }

  window.bhajanDb = {
    loadDatabase,
    getAllBhajans,
    getBhajanByFileId
  };
}());
