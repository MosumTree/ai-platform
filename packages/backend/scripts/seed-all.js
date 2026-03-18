/**
 * 一键插入全量种子数据（Banner / 工具指南 / AI风向标 / 白宫武器坊 / 实战实验室 / 案例百科）
 * 用于本地或现网环境初始化数据。
 *
 * 使用方式：
 *   cd packages/backend && pnpm run seed
 *   或：node scripts/seed-all.js
 * 现网：先设置环境变量再执行（或配置 .env）：
 *   DB_HOST=现网库地址 DB_USER=root DB_PASS=密码 DB_NAME=ai_platform node scripts/seed-all.js
 *
 * 注意：若目标库对应表里已有数据，会重复插入；需要干净库时请先清空相关表或使用新库。
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mysql = require('mysql2');

const conn = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'ai_platform_123',
  database: process.env.DB_NAME || 'ai_platform',
  charset: 'utf8mb4',
});

// ---------- 1. Banners ----------
const banners = [
  { title: 'AI 辅助研发平台', description: '让 AI 成为每位研发的智能助手，提升研发效能', buttonText: '立即体验', buttonLink: '/courses', imageUrl: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1600', tags: JSON.stringify(['AI', '效率']), order: 1, isActive: 1 },
  { title: '能力市场上线', description: '汇聚全团队 AI 工具与能力，一键接入使用', buttonText: '查看能力', buttonLink: '/capabilities', imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1600', tags: JSON.stringify(['能力市场', '工具']), order: 2, isActive: 1 },
  { title: '优秀案例展示', description: '看看同事们是如何用 AI 解决实际研发难题的', buttonText: '浏览案例', buttonLink: '/cases', imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1600', tags: JSON.stringify(['案例', '实践']), order: 3, isActive: 1 },
];

// ---------- 2. 工具指南 ----------
const toolGuides = [
  { name: 'CodeAgent', desc: '全自动编程助手，理解复杂业务逻辑并生成生产级代码。', icon: '⌨', iconColor: '#3b82f6', installUrl: '#', guideUrl: '#', order: 1, isActive: 1 },
  { name: 'RooCode', desc: '可视化开发神器，通过拖拽式指令构建复杂的系统架构。', icon: '⚡', iconColor: '#6366f1', installUrl: '#', guideUrl: '#', order: 2, isActive: 1 },
  { name: 'OpenCode', desc: '开源协作引擎，集成全球优质开源模型与工作流模版。', icon: '◎', iconColor: '#10b981', installUrl: '#', guideUrl: '#', order: 3, isActive: 1 },
  { name: 'TestMate', desc: '智能测试伙伴，自动生成用例并覆盖边界情况的安全守护者。', icon: '✓', iconColor: '#f59e0b', installUrl: '#', guideUrl: '#', order: 4, isActive: 1 },
];

// ---------- 3. AI 风向标 ----------
const aiTrends = [
  { title: 'OpenAI 发布新一代推理模型，逻辑能力提升 200%', summary: '最新的测试数据显示，新模型在解决复杂编程和数学难题方面展现了类人的思考过程...', source: '推理模型', sourceUrl: '#', icon: 'bolt', publishDate: '2026-03-17', order: 1, isActive: 1 },
  { title: 'Midjourney v7 内测开启，光影细节实现跨越', summary: '不仅是画质，更重要的是对人类语言中潜台词的理解提升。室内设计师现可以一键生成物理准确的采光方案...', source: '图像生成', sourceUrl: '#', icon: 'brush', publishDate: '2026-03-17', order: 2, isActive: 1 },
];

// ---------- 4. 白宫武器坊（分类 + 武器项） ----------
const weaponCategories = [
  { name: '前端开发利器', description: '全流程 AI 加持', icon: 'code', order: 1, isActive: 1 },
];
const weaponItems = [
  { name: 'SDD 需求设计', description: '将模糊需求转化为精确的系统设计文档', icon: null, order: 1, isActive: 1 },
  { name: 'D2C 开发', description: 'Design to Code: 设计稿一键生成响应式组件', icon: null, order: 2, isActive: 1 },
];

// ---------- 5. 实战实验室 ----------
const labs = [
  { title: 'AI 自动化财务报表实战演练', subtitle: '手把手教你配置 Python 工作流', coverUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800', duration: '12:45', videoUrl: '#', order: 1, isPublished: 1 },
  { title: 'Figma AI 插件深度应用指南', subtitle: '从草图到高保真原型的快速进阶', coverUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800', duration: '08:30', videoUrl: '#', order: 2, isPublished: 1 },
  { title: '大模型重构旧系统架构全过程', subtitle: 'Java 到 Rust 的平滑迁移秘籍', coverUrl: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800', duration: '15:20', videoUrl: '#', order: 3, isPublished: 1 },
];

// ---------- 6. 案例百科 ----------
const wikiCases = [
  { title: '电商财务报表自动化方案', summary: '详尽记录了利用 LLM + Python 工具链实现报表自动化清洗与核对的全过程架构设计。', coverUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800', tags: JSON.stringify(['Python', 'GPT-4o']), readUrl: '#', order: 1, isPublished: 1 },
  { title: 'UI 交互全自动化设计指南', summary: '记录了从 Midjourney 构思到 Figma AI 快速生成响应式布局的方法论体系。', coverUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800', tags: JSON.stringify(['Design', 'UI/UX']), readUrl: '#', order: 2, isPublished: 1 },
  { title: '多语言代码库迁移自动化', summary: '分析 Claude 3.5 在复杂架构转换中的角色，涵盖了从 Java 8 到 Rust 的迁移逻辑与风险控制。', coverUrl: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800', tags: JSON.stringify(['DevOps', 'Cloud']), readUrl: '#', order: 3, isPublished: 1 },
];

function run(sql, params, label) {
  return new Promise((resolve, reject) => {
    conn.query(sql, params, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

async function main() {
  console.log('目标数据库:', (process.env.DB_HOST || 'localhost') + '/' + (process.env.DB_NAME || 'ai_platform'));
  console.log('开始一键插入种子数据...\n');

  try {
    // 1. Banners
    console.log('[1/6] Banners');
    for (const row of banners) {
      await run(
        'INSERT INTO banners (title, description, buttonText, buttonLink, imageUrl, tags, `order`, isActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [row.title, row.description, row.buttonText, row.buttonLink, row.imageUrl, row.tags, row.order, row.isActive]
      );
      console.log('  -', row.title);
    }

    // 2. 工具指南
    console.log('\n[2/6] 工具指南');
    for (const row of toolGuides) {
      await run(
        'INSERT INTO tool_guides (name, `desc`, icon, iconColor, installUrl, guideUrl, `order`, isActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [row.name, row.desc, row.icon, row.iconColor, row.installUrl, row.guideUrl, row.order, row.isActive]
      );
      console.log('  -', row.name);
    }

    // 3. AI 风向标
    console.log('\n[3/6] AI 风向标');
    for (const row of aiTrends) {
      await run(
        'INSERT INTO ai_trends (title, summary, source, sourceUrl, icon, publishDate, `order`, isActive, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
        [row.title, row.summary, row.source, row.sourceUrl, row.icon, row.publishDate, row.order, row.isActive]
      );
      console.log('  -', row.title);
    }

    // 4. 白宫武器坊（先分类，再武器项）
    console.log('\n[4/6] 白宫武器坊');
    for (const cat of weaponCategories) {
      const res = await run(
        'INSERT INTO weapon_categories (name, description, icon, `order`, isActive, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
        [cat.name, cat.description, cat.icon, cat.order, cat.isActive]
      );
      const categoryId = res.insertId;
      console.log('  - 分类:', cat.name, '(id:', categoryId + ')');
      for (const item of weaponItems) {
        await run(
          'INSERT INTO weapon_items (categoryId, name, description, icon, `order`, isActive, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
          [categoryId, item.name, item.description, item.icon, item.order, item.isActive]
        );
        console.log('    -', item.name);
      }
    }

    // 5. 实战实验室
    console.log('\n[5/6] 实战实验室');
    for (const row of labs) {
      await run(
        'INSERT INTO labs (title, subtitle, coverUrl, duration, videoUrl, `order`, isPublished) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [row.title, row.subtitle, row.coverUrl, row.duration, row.videoUrl, row.order, row.isPublished]
      );
      console.log('  -', row.title);
    }

    // 6. 案例百科
    console.log('\n[6/6] 案例百科');
    for (const row of wikiCases) {
      await run(
        'INSERT INTO wiki_cases (title, summary, coverUrl, tags, readUrl, `order`, isPublished) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [row.title, row.summary, row.coverUrl, row.tags, row.readUrl, row.order, row.isPublished]
      );
      console.log('  -', row.title);
    }

    console.log('\n全部种子数据插入完成。');
  } catch (e) {
    console.error('插入失败:', e.message);
    process.exit(1);
  } finally {
    conn.end();
  }
}

main();
