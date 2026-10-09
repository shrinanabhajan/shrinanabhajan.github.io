const fs = require('fs');
const path = require('path');
const vm = require('vm');

const rootDir = path.resolve(__dirname, '..');
const scriptsDir = path.join(rootDir, 'scripts');
const bhajanDir = path.join(rootDir, 'bhajans');
const outDir = path.join(rootDir, 'db');
const outFile = path.join(outDir, 'bhajans.sqlite');

const initSqlJs = require('sql.js');

function loadJsArray(fileName) {
  const filePath = path.join(scriptsDir, fileName);
  const source = fs.readFileSync(filePath, 'utf8');
  const sandbox = { console };
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox);
  return sandbox[fileName.replace(/\.js$/, '')] || [];
}

function normalizeItem(item) {
  const dir = String(item.dir || '').trim();
  const id = String(item.id || '').trim();
  const fileId = `${dir}-${id}`;
  const contentPath = path.join(bhajanDir, dir, `${id}.txt`);
  const content = fs.existsSync(contentPath) ? fs.readFileSync(contentPath, 'utf8') : '';
  return {
    file_id: fileId,
    dir,
    id,
    eng: String(item.eng || '').trim(),
    hin: String(item.hin || '').trim(),
    bk: String(item.bk || '').trim(),
    pg: String(item.pg || '').trim(),
    title: String(item.hin || item.eng || '').trim(),
    content
  };
}

async function buildDatabase() {
  const SQL = await initSqlJs();
  const db = new SQL.Database();
  db.run(`
    CREATE TABLE bhajans (
      id INTEGER,
      file_id TEXT PRIMARY KEY,
      dir TEXT,
      eng TEXT,
      hin TEXT,
      bk TEXT,
      pg TEXT,
      title TEXT,
      content TEXT
    );
  `);

  const records = [];
  ['dt', 'b1', 'b2', 'ntn', 'mv'].forEach(name => {
    const list = loadJsArray(`${name}.js`);
    if (!Array.isArray(list)) {
      return;
    }

    list.forEach(item => {
      if (!item || !item.dir || !item.id) {
        return;
      }
      records.push(normalizeItem(item));
    });
  });

  const insertStatement = db.prepare(`
    INSERT INTO bhajans (id, file_id, dir, eng, hin, bk, pg, title, content)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  records.forEach(record => {
    insertStatement.run([
      Number(record.id) || 0,
      record.file_id,
      record.dir,
      record.eng,
      record.hin,
      record.bk,
      record.pg,
      record.title,
      record.content
    ]);
  });

  insertStatement.free();

  fs.mkdirSync(outDir, { recursive: true });
  const data = db.export();
  fs.writeFileSync(outFile, Buffer.from(data));

  return records.length;
}

buildDatabase().then((count) => {
  console.log(`Built ${count} bhajan records in ${outFile}`);
}).catch((error) => {
  console.error('Failed to build SQLite database:', error);
  process.exit(1);
});
