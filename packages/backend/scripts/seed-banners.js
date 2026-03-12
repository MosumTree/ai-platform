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
    title: 'AI 辅助研发平台',
    description: '让 AI 成为每位研发的智能助手，提升研发效能',
    buttonText: '立即体验',
    buttonLink: '/courses',
    imageUrl: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1600',
    tags: JSON.stringify(['AI', '效率']),
    order: 1,
    isActive: 1
  },
  {
    title: '能力市场上线',
    description: '汇聚全团队 AI 工具与能力，一键接入使用',
    buttonText: '查看能力',
    buttonLink: '/capabilities',
    imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1600',
    tags: JSON.stringify(['能力市场', '工具']),
    order: 2,
    isActive: 1
  },
  {
    title: '优秀案例展示',
    description: '看看同事们是如何用 AI 解决实际研发难题的',
    buttonText: '浏览案例',
    buttonLink: '/cases',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1600',
    tags: JSON.stringify(['案例', '实践']),
    order: 3,
    isActive: 1
  }
];

let done = 0;
rows.forEach(row => {
  conn.query(
    'INSERT INTO banners (title, description, buttonText, buttonLink, imageUrl, tags, `order`, isActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [row.title, row.description, row.buttonText, row.buttonLink, row.imageUrl, row.tags, row.order, row.isActive],
    (err, result) => {
      if (err) console.error('ERROR:', err.message);
      else console.log('Inserted id:', result.insertId, '-', row.title);
      done++;
      if (done === rows.length) conn.end();
    }
  );
});
