const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { execFileSync, execSync, spawnSync } = require('node:child_process');

const rootDir = path.join(__dirname, '..', '..', '..');
const scriptPath = path.join(__dirname, 'seed-all.js');
const sourceDbName = 'ai_platform';

function runMysql(command) {
  return execFileSync('mysql', [ '-uroot', '-e', command ], {
    cwd: rootDir,
    stdio: 'pipe',
  }).toString();
}

test('seed-all accepts an explicitly empty DB_PASS', () => {
  const dbName = `ai_platform_seed_test_${Date.now()}_${process.pid}`;

  try {
    runMysql(`DROP DATABASE IF EXISTS \`${dbName}\`; CREATE DATABASE \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;`);
    execSync(`mysqldump -uroot --set-gtid-purged=OFF --no-data ${sourceDbName} | mysql -uroot ${dbName}`, {
      cwd: rootDir,
      stdio: 'pipe',
      shell: true,
    });

    const result = spawnSync(process.execPath, [ scriptPath ], {
      cwd: path.join(rootDir, 'packages', 'backend'),
      env: {
        ...process.env,
        DB_HOST: 'localhost',
        DB_PORT: '3306',
        DB_USER: 'root',
        DB_PASS: '',
        DB_NAME: dbName,
      },
      encoding: 'utf8',
    });

    assert.equal(result.status, 0, `seed script failed:\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`);
    assert.match(result.stdout, /全部种子数据插入完成/);
  } finally {
    runMysql(`DROP DATABASE IF EXISTS \`${dbName}\`;`);
  }
});
