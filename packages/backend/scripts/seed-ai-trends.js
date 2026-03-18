const mysql = require('mysql2');
const conn = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'ai_platform_123',
  database: process.env.DB_NAME || 'ai_platform'
});

// AI风向标数据
const aiTrends = [
  {
    title: 'OpenAI 发布新一代推理模型，逻辑能力提升 200%',
    summary: '最新的测试数据显示，新模型在解决复杂编程和数学难题方面展现了类人的思考过程...',
    source: '推理模型',
    sourceUrl: '#',
    icon: 'Lightning',
    publishDate: '2026-03-17',
    order: 1,
    isActive: 1
  },
  {
    title: 'Midjourney v7 内测开启，光影细节实现跨越',
    summary: '不仅是画质，更重要的是对人类语言中潜台词的理解提升。室内设计师现可以一键生成物理准确的采光方案...',
    source: '图像生成',
    sourceUrl: '#',
    icon: 'Brush',
    publishDate: '2026-03-17',
    order: 2,
    isActive: 1
  }
];

console.log('开始插入 AI风向标 数据...');

let done = 0;
aiTrends.forEach(row => {
  conn.query(
    'INSERT INTO ai_trends (title, summary, source, sourceUrl, icon, publishDate, `order`, isActive, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
    [row.title, row.summary, row.source, row.sourceUrl, row.icon, row.publishDate, row.order, row.isActive],
    (err, result) => {
      if (err) console.error('ERROR inserting ai_trend:', err.message);
      else console.log('Inserted ai_trend id:', result.insertId, '-', row.title);
      done++;
      if (done === aiTrends.length) {
        console.log('\nAI风向标数据插入完成！');
        conn.end();
      }
    }
  );
});
