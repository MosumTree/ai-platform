const mysql = require('e:/Projects/ai-platform/node_modules/.pnpm/mysql2@3.19.1_@types+node@20.19.37/node_modules/mysql2');
const conn = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'ai_platform_123',
  database: 'ai_platform'
});

const rows = [
  {
    name: 'CodeAgent',
    desc: '全自动编程助手，理解复杂业务逻辑并生成生产级代码。',
    icon: '⌨',
    iconColor: '#3b82f6',
    installUrl: '#',
    guideUrl: '#',
    order: 1,
    isActive: 1,
  },
  {
    name: 'RooCode',
    desc: '可视化开发神器，通过拖拽式指令构建复杂的系统架构。',
    icon: '⚡',
    iconColor: '#6366f1',
    installUrl: '#',
    guideUrl: '#',
    order: 2,
    isActive: 1,
  },
  {
    name: 'OpenCode',
    desc: '开源协作引擎，集成全球优质开源模型与工作流模版。',
    icon: '◎',
    iconColor: '#10b981',
    installUrl: '#',
    guideUrl: '#',
    order: 3,
    isActive: 1,
  },
  {
    name: 'TestMate',
    desc: '智能测试伙伴，自动生成用例并覆盖边界情况的安全守护者。',
    icon: '✓',
    iconColor: '#f59e0b',
    installUrl: '#',
    guideUrl: '#',
    order: 4,
    isActive: 1,
  },
];

let done = 0;
rows.forEach(row => {
  conn.query(
    'INSERT INTO tool_guides (name, `desc`, icon, iconColor, installUrl, guideUrl, `order`, isActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [row.name, row.desc, row.icon, row.iconColor, row.installUrl, row.guideUrl, row.order, row.isActive],
    (err, result) => {
      if (err) console.error('ERROR:', err.message);
      else console.log('Inserted id:', result.insertId, '-', row.name);
      done++;
      if (done === rows.length) conn.end();
    }
  );
});
