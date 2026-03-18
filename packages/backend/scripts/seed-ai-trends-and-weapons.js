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
    icon: 'bolt',
    publishDate: '2026-03-17',
    order: 1,
    isActive: 1
  },
  {
    title: 'Midjourney v7 内测开启，光影细节实现跨越',
    summary: '不仅是画质，更重要的是对人类语言中潜台词的理解提升。室内设计师现可以一键生成物理准确的采光方案...',
    source: '图像生成',
    sourceUrl: '#',
    icon: 'brush',
    publishDate: '2026-03-17',
    order: 2,
    isActive: 1
  }
];

// 百工武器坊分类数据
const weaponCategories = [
  {
    name: '前端开发利器',
    description: '全流程 AI 加持',
    icon: 'code',
    order: 1,
    isActive: 1
  }
];

// 百工武器坊项目数据（等分类插入后获取ID再插入）
const weaponItems = [
  {
    name: 'SDD 需求设计',
    description: '将模糊需求转化为精确的系统设计文档',
    icon: null,
    order: 1,
    isActive: 1
  },
  {
    name: 'D2C 开发',
    description: 'Design to Code: 设计稿一键生成响应式组件',
    icon: null,
    order: 2,
    isActive: 1
  }
];

let done = 0;
let totalTasks = aiTrends.length + weaponCategories.length + weaponItems.length;

function checkDone() {
  done++;
  if (done === totalTasks) {
    console.log('\n所有数据插入完成！');
    conn.end();
  }
}

// 插入AI风向标数据
console.log('开始插入 AI风向标 数据...');
aiTrends.forEach(row => {
  conn.query(
    'INSERT INTO ai_trends (title, summary, source, sourceUrl, icon, publishDate, `order`, isActive, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
    [row.title, row.summary, row.source, row.sourceUrl, row.icon, row.publishDate, row.order, row.isActive],
    (err, result) => {
      if (err) console.error('ERROR inserting ai_trend:', err.message);
      else console.log('Inserted ai_trend id:', result.insertId, '-', row.title);
      checkDone();
    }
  );
});

// 插入武器坊分类数据
console.log('开始插入 武器坊分类 数据...');
weaponCategories.forEach(cat => {
  conn.query(
    'INSERT INTO weapon_categories (name, description, icon, `order`, isActive, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
    [cat.name, cat.description, cat.icon, cat.order, cat.isActive],
    (err, result) => {
      if (err) {
        console.error('ERROR inserting category:', err.message);
        checkDone();
        return;
      }
      const categoryId = result.insertId;
      console.log('Inserted category id:', categoryId, '-', cat.name);

      // 插入该分类下的武器项目
      weaponItems.forEach((item, index) => {
        conn.query(
          'INSERT INTO weapon_items (categoryId, name, description, icon, `order`, isActive, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
          [categoryId, item.name, item.description, item.icon, item.order, item.isActive],
          (err2, result2) => {
            if (err2) console.error('ERROR inserting weapon item:', err2.message);
            else console.log('Inserted weapon item id:', result2.insertId, '-', item.name);
            checkDone();
          }
        );
      });

      // 分类插入完成也算一个任务
      checkDone();
    }
  );
});
