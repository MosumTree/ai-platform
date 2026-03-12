const mysql = require('e:/Projects/ai-platform/node_modules/.pnpm/mysql2@3.19.1_@types+node@20.19.37/node_modules/mysql2');
const conn = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'ai_platform_123',
  database: 'ai_platform',
  charset: 'utf8mb4',
});

const labs = [
  {
    title: 'AI 自动化财务报表实战演练',
    subtitle: '手把手教你配置 Python 工作流',
    coverUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    duration: '12:45',
    videoUrl: '#',
    order: 1,
    isPublished: 1,
  },
  {
    title: 'Figma AI 插件深度应用指南',
    subtitle: '从草图到高保真原型的快速进阶',
    coverUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
    duration: '08:30',
    videoUrl: '#',
    order: 2,
    isPublished: 1,
  },
  {
    title: '大模型重构旧系统架构全过程',
    subtitle: 'Java 到 Rust 的平滑迁移秘籍',
    coverUrl: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800',
    duration: '15:20',
    videoUrl: '#',
    order: 3,
    isPublished: 1,
  },
];

const wikiCases = [
  {
    title: '电商财务报表自动化方案',
    summary: '详尽记录了利用 LLM + Python 工具链实现报表自动化清洗与核对的全过程架构设计。',
    coverUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    tags: JSON.stringify(['Python', 'GPT-4o']),
    readUrl: '#',
    order: 1,
    isPublished: 1,
  },
  {
    title: 'UI 交互全自动化设计指南',
    summary: '记录了从 Midjourney 构思到 Figma AI 快速生成响应式布局的方法论体系。',
    coverUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
    tags: JSON.stringify(['Design', 'UI/UX']),
    readUrl: '#',
    order: 2,
    isPublished: 1,
  },
  {
    title: '多语言代码库迁移自动化',
    summary: '分析 Claude 3.5 在复杂架构转换中的角色，涵盖了从 Java 8 到 Rust 的迁移逻辑与风险控制。',
    coverUrl: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800',
    tags: JSON.stringify(['DevOps', 'Cloud']),
    readUrl: '#',
    order: 3,
    isPublished: 1,
  },
];

let done = 0;
const total = labs.length + wikiCases.length;

labs.forEach(row => {
  conn.query(
    'INSERT INTO labs (title, subtitle, coverUrl, duration, videoUrl, `order`, isPublished) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [row.title, row.subtitle, row.coverUrl, row.duration, row.videoUrl, row.order, row.isPublished],
    (err, result) => {
      if (err) console.error('labs ERROR:', err.message);
      else console.log('[labs] Inserted id:', result.insertId, '-', row.title);
      if (++done === total) conn.end();
    }
  );
});

wikiCases.forEach(row => {
  conn.query(
    'INSERT INTO wiki_cases (title, summary, coverUrl, tags, readUrl, `order`, isPublished) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [row.title, row.summary, row.coverUrl, row.tags, row.readUrl, row.order, row.isPublished],
    (err, result) => {
      if (err) console.error('wiki_cases ERROR:', err.message);
      else console.log('[wiki_cases] Inserted id:', result.insertId, '-', row.title);
      if (++done === total) conn.end();
    }
  );
});
