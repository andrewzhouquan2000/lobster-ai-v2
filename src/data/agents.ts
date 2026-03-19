// AI 员工市场 - 120 个 Agent 数据

export interface Agent {
  id: string;
  name: string;
  avatar: string;
  category: string;
  subCategory: string;
  description: string;
  skills: string[];
  rating: number;
  uses: number;
  trending?: boolean;
}

export const categories = [
  { id: 'dev', name: '开发', icon: '💻', count: 30 },
  { id: 'design', name: '设计', icon: '🎨', count: 20 },
  { id: 'marketing', name: '营销', icon: '📢', count: 20 },
  { id: 'analysis', name: '分析', icon: '📊', count: 15 },
  { id: 'writing', name: '写作', icon: '✍️', count: 20 },
  { id: 'operations', name: '运营', icon: '⚙️', count: 15 },
];

export const agents: Agent[] = [
  // ========== 开发类 (30个) ==========
  // 前端开发
  { id: 'dev-fe-01', name: '前端架构师', avatar: '🔷', category: 'dev', subCategory: '前端开发', description: '精通 React/Vue/Angular 全家桶，擅长大型前端架构设计', skills: ['React', 'TypeScript', '架构设计'], rating: 4.9, uses: 12580, trending: true },
  { id: 'dev-fe-02', name: 'React 专家', avatar: '⚛️', category: 'dev', subCategory: '前端开发', description: '深度掌握 React 生态，Hooks、Context、性能优化', skills: ['React', 'Redux', 'Next.js'], rating: 4.8, uses: 18920 },
  { id: 'dev-fe-03', name: 'Vue 工程师', avatar: '💚', category: 'dev', subCategory: '前端开发', description: 'Vue3 组合式 API 专家，Nuxt 全栈开发', skills: ['Vue3', 'Pinia', 'Nuxt'], rating: 4.7, uses: 15230 },
  { id: 'dev-fe-04', name: '小程序开发', avatar: '📱', category: 'dev', subCategory: '前端开发', description: '微信/支付宝/抖音小程序多端开发', skills: ['小程序', 'Taro', 'UniApp'], rating: 4.6, uses: 9850 },
  { id: 'dev-fe-05', name: 'CSS 魔术师', avatar: '🎨', category: 'dev', subCategory: '前端开发', description: '精通 CSS3 动画、Tailwind、响应式设计', skills: ['CSS3', 'Tailwind', '动画'], rating: 4.8, uses: 8720 },

  // 后端开发
  { id: 'dev-be-01', name: '后端架构师', avatar: '🏗️', category: 'dev', subCategory: '后端开发', description: '微服务架构设计，高并发系统优化', skills: ['微服务', '分布式', '架构'], rating: 4.9, uses: 11250, trending: true },
  { id: 'dev-be-02', name: 'Node.js 专家', avatar: '💚', category: 'dev', subCategory: '后端开发', description: 'Express/Koa/NestJS 全栈开发', skills: ['Node.js', 'NestJS', 'TypeScript'], rating: 4.7, uses: 14320 },
  { id: 'dev-be-03', name: 'Python 后端', avatar: '🐍', category: 'dev', subCategory: '后端开发', description: 'Django/FastAPI 企业级后端开发', skills: ['Python', 'FastAPI', 'Django'], rating: 4.8, uses: 16890 },
  { id: 'dev-be-04', name: 'Go 工程师', avatar: '🔵', category: 'dev', subCategory: '后端开发', description: '高性能后端服务，云原生开发', skills: ['Go', 'gRPC', 'K8s'], rating: 4.9, uses: 9560, trending: true },
  { id: 'dev-be-05', name: 'Java 架构师', avatar: '☕', category: 'dev', subCategory: '后端开发', description: 'Spring Boot/Cloud 微服务架构', skills: ['Java', 'Spring', '微服务'], rating: 4.8, uses: 13240 },

  // 全栈开发
  { id: 'dev-full-01', name: '全栈工程师', avatar: '🔄', category: 'dev', subCategory: '全栈开发', description: '前后端通吃，快速交付完整产品', skills: ['全栈', 'React', 'Node.js'], rating: 4.8, uses: 21560, trending: true },
  { id: 'dev-full-02', name: 'Next.js 专家', avatar: '▲', category: 'dev', subCategory: '全栈开发', description: 'Next.js App Router 全栈应用开发', skills: ['Next.js', 'React', 'Vercel'], rating: 4.9, uses: 18450 },
  { id: 'dev-full-03', name: 'T3 Stack 工程师', avatar: '🔷', category: 'dev', subCategory: '全栈开发', description: 'TypeScript + Tailwind + tRPC 全栈', skills: ['TypeScript', 'Prisma', 'tRPC'], rating: 4.7, uses: 7820 },

  // 移动端开发
  { id: 'dev-mobile-01', name: 'iOS 开发', avatar: '🍎', category: 'dev', subCategory: '移动端开发', description: 'Swift/SwiftUI 原生 iOS 开发', skills: ['Swift', 'SwiftUI', 'iOS'], rating: 4.8, uses: 9870 },
  { id: 'dev-mobile-02', name: 'Android 开发', avatar: '🤖', category: 'dev', subCategory: '移动端开发', description: 'Kotlin/Jetpack Compose 现代安卓开发', skills: ['Kotlin', 'Compose', 'Android'], rating: 4.7, uses: 8650 },
  { id: 'dev-mobile-03', name: 'Flutter 工程师', avatar: '🦋', category: 'dev', subCategory: '移动端开发', description: '跨平台移动应用开发，一套代码多端运行', skills: ['Flutter', 'Dart', '跨平台'], rating: 4.8, uses: 12340 },
  { id: 'dev-mobile-04', name: 'React Native', avatar: '⚛️', category: 'dev', subCategory: '移动端开发', description: 'React Native 跨平台移动开发', skills: ['RN', 'TypeScript', '原生模块'], rating: 4.6, uses: 10560 },

  // 游戏开发
  { id: 'dev-game-01', name: 'Unity 开发', avatar: '🎮', category: 'dev', subCategory: '游戏开发', description: 'Unity 2D/3D 游戏开发，C# 脚本', skills: ['Unity', 'C#', '游戏开发'], rating: 4.7, uses: 8920 },
  { id: 'dev-game-02', name: 'WebGL 工程师', avatar: '🌐', category: 'dev', subCategory: '游戏开发', description: 'Three.js/WebGL 3D 可视化开发', skills: ['Three.js', 'WebGL', '3D'], rating: 4.8, uses: 6730 },

  // 区块链开发
  { id: 'dev-web3-01', name: '智能合约开发', avatar: '⛓️', category: 'dev', subCategory: '区块链开发', description: 'Solidity 智能合约开发与审计', skills: ['Solidity', 'Ethereum', 'Web3'], rating: 4.9, uses: 7640, trending: true },
  { id: 'dev-web3-02', name: 'DeFi 工程师', avatar: '💰', category: 'dev', subCategory: '区块链开发', description: 'DeFi 协议开发，AMM、借贷协议', skills: ['DeFi', 'Solidity', '经济模型'], rating: 4.8, uses: 5230 },
  { id: 'dev-web3-03', name: 'NFT 开发', avatar: '🖼️', category: 'dev', subCategory: '区块链开发', description: 'NFT 市场和藏品合约开发', skills: ['NFT', 'IPFS', '智能合约'], rating: 4.6, uses: 4890 },

  // DevOps
  { id: 'dev-devops-01', name: 'DevOps 工程师', avatar: '🔧', category: 'dev', subCategory: 'DevOps', description: 'CI/CD 流水线，容器化部署', skills: ['Docker', 'K8s', 'CI/CD'], rating: 4.8, uses: 14230 },
  { id: 'dev-devops-02', name: '云架构师', avatar: '☁️', category: 'dev', subCategory: 'DevOps', description: 'AWS/阿里云 云架构设计', skills: ['AWS', '云原生', '架构'], rating: 4.9, uses: 9870 },
  { id: 'dev-devops-03', name: 'SRE 工程师', avatar: '📈', category: 'dev', subCategory: 'DevOps', description: '站点可靠性工程，监控告警', skills: ['SRE', '监控', '自动化'], rating: 4.7, uses: 6540 },

  // 数据库
  { id: 'dev-db-01', name: '数据库专家', avatar: '🗄️', category: 'dev', subCategory: '数据库', description: 'MySQL/PostgreSQL 数据库优化', skills: ['MySQL', 'PostgreSQL', '优化'], rating: 4.8, uses: 11230 },
  { id: 'dev-db-02', name: 'NoSQL 工程师', avatar: '🍃', category: 'dev', subCategory: '数据库', description: 'MongoDB/Redis 非关系型数据库', skills: ['MongoDB', 'Redis', 'NoSQL'], rating: 4.7, uses: 8450 },

  // AI/ML
  { id: 'dev-ai-01', name: 'AI 工程师', avatar: '🤖', category: 'dev', subCategory: 'AI/ML', description: 'LLM 应用开发，Prompt 工程', skills: ['LLM', 'Prompt', 'AI'], rating: 4.9, uses: 25670, trending: true },
  { id: 'dev-ai-02', name: '机器学习工程师', avatar: '🧠', category: 'dev', subCategory: 'AI/ML', description: '模型训练与部署，特征工程', skills: ['ML', 'PyTorch', 'MLOps'], rating: 4.8, uses: 14560 },

  // ========== 设计类 (20个) ==========
  // UI 设计
  { id: 'design-ui-01', name: 'UI 设计师', avatar: '🎨', category: 'design', subCategory: 'UI 设计', description: '界面设计，设计系统构建', skills: ['Figma', 'UI', '设计系统'], rating: 4.9, uses: 18760, trending: true },
  { id: 'design-ui-02', name: '移动端 UI', avatar: '📱', category: 'design', subCategory: 'UI 设计', description: 'App 界面设计，HIG/MD 规范', skills: ['App设计', 'Figma', 'iOS/Android'], rating: 4.7, uses: 12430 },
  { id: 'design-ui-03', name: 'Web UI 设计师', avatar: '🌐', category: 'design', subCategory: 'UI 设计', description: '网页界面设计，响应式布局', skills: ['Web设计', 'Figma', '响应式'], rating: 4.8, uses: 15890 },

  // UX 设计
  { id: 'design-ux-01', name: 'UX 设计师', avatar: '👤', category: 'design', subCategory: 'UX 设计', description: '用户体验设计，用户研究', skills: ['UX', '用户研究', '原型'], rating: 4.8, uses: 11240 },
  { id: 'design-ux-02', name: '交互设计师', avatar: '👆', category: 'design', subCategory: 'UX 设计', description: '交互设计，动效原型', skills: ['交互', '原型', '动效'], rating: 4.7, uses: 8560 },

  // 平面设计
  { id: 'design-graphic-01', name: '平面设计师', avatar: '🖼️', category: 'design', subCategory: '平面设计', description: '海报、Banner、宣传物料设计', skills: ['PS', 'AI', '平面'], rating: 4.8, uses: 16780 },
  { id: 'design-graphic-02', name: '品牌设计师', avatar: '💎', category: 'design', subCategory: '平面设计', description: '品牌 VI 设计，Logo 设计', skills: ['品牌', 'Logo', 'VI'], rating: 4.9, uses: 9450 },
  { id: 'design-graphic-03', name: 'PPT 设计师', avatar: '📊', category: 'design', subCategory: '平面设计', description: '商业演示文稿设计，模板定制', skills: ['PPT', '演示', 'Keynote'], rating: 4.6, uses: 21340 },

  // 3D 设计
  { id: 'design-3d-01', name: '3D 建模师', avatar: '🎲', category: 'design', subCategory: '3D 设计', description: 'Blender/C4D 3D 建模渲染', skills: ['Blender', 'C4D', '建模'], rating: 4.8, uses: 7890 },
  { id: 'design-3d-02', name: '产品渲染', avatar: '💡', category: 'design', subCategory: '3D 设计', description: '产品三维渲染，场景搭建', skills: ['渲染', '产品', 'Keyshot'], rating: 4.7, uses: 5670 },

  // 动效设计
  { id: 'design-motion-01', name: '动效设计师', avatar: '✨', category: 'design', subCategory: '动效设计', description: 'UI 动效，Lottie 动画', skills: ['AE', 'Lottie', '动效'], rating: 4.8, uses: 9870 },
  { id: 'design-motion-02', name: '视频后期', avatar: '🎬', category: 'design', subCategory: '动效设计', description: '视频剪辑，特效制作', skills: ['PR', 'AE', '剪辑'], rating: 4.7, uses: 12340 },

  // 插画设计
  { id: 'design-illust-01', name: '插画师', avatar: '🖍️', category: 'design', subCategory: '插画设计', description: '商业插画，角色设计', skills: ['插画', 'Procreate', '角色'], rating: 4.8, uses: 11230 },
  { id: 'design-illust-02', name: '图标设计师', avatar: '🎯', category: 'design', subCategory: '插画设计', description: '图标设计，图标库构建', skills: ['图标', 'SVG', '设计系统'], rating: 4.6, uses: 8450 },

  // 设计辅助
  { id: 'design-support-01', name: '设计助理', avatar: '📋', category: 'design', subCategory: '设计辅助', description: '设计规范整理，素材搜集', skills: ['Figma', '整理', '规范'], rating: 4.5, uses: 6540 },

  // 更多设计...
  { id: 'design-web-01', name: '网页设计师', avatar: '🌐', category: 'design', subCategory: 'UI 设计', description: '企业官网、落地页设计', skills: ['Web', 'Figma', '落地页'], rating: 4.7, uses: 14560 },
  { id: 'design-app-01', name: 'App 设计师', avatar: '📲', category: 'design', subCategory: 'UI 设计', description: '移动应用 UI/UX 设计', skills: ['App', 'Figma', '交互'], rating: 4.8, uses: 13240 },
  { id: 'design-sys-01', name: '设计系统专家', avatar: '📐', category: 'design', subCategory: 'UI 设计', description: '设计系统搭建与维护', skills: ['设计系统', '组件库', '规范'], rating: 4.9, uses: 5230 },
  { id: 'design-acc-01', name: '无障碍设计师', avatar: '♿', category: 'design', subCategory: 'UX 设计', description: '无障碍设计，可访问性优化', skills: ['无障碍', 'WCAG', '可访问性'], rating: 4.7, uses: 3420 },
  { id: 'design-data-01', name: '数据可视化设计师', avatar: '📈', category: 'design', subCategory: 'UI 设计', description: '数据图表、Dashboard 设计', skills: ['数据可视化', '图表', 'Dashboard'], rating: 4.8, uses: 8760 },

  // ========== 营销类 (20个) ==========
  // 内容运营
  { id: 'mkt-content-01', name: '内容运营', avatar: '📝', category: 'marketing', subCategory: '内容运营', description: '内容策划、选题、排版发布', skills: ['内容', '选题', '运营'], rating: 4.7, uses: 18920 },
  { id: 'mkt-content-02', name: '文案策划', avatar: '✍️', category: 'marketing', subCategory: '内容运营', description: '广告文案、产品文案创作', skills: ['文案', '创意', '广告'], rating: 4.8, uses: 15670 },
  { id: 'mkt-content-03', name: '视频内容策划', avatar: '🎥', category: 'marketing', subCategory: '内容运营', description: '短视频脚本、分镜策划', skills: ['短视频', '脚本', '分镜'], rating: 4.6, uses: 12340 },

  // 社媒运营
  { id: 'mkt-social-01', name: '社媒运营', avatar: '📱', category: 'marketing', subCategory: '社媒运营', description: '微信公众号、小红书运营', skills: ['公众号', '小红书', '社群'], rating: 4.7, uses: 21450 },
  { id: 'mkt-social-02', name: '抖音运营', avatar: '🎵', category: 'marketing', subCategory: '社媒运营', description: '抖音账号运营、内容分发', skills: ['抖音', '短视频', '直播'], rating: 4.8, uses: 18920, trending: true },
  { id: 'mkt-social-03', name: 'B站运营', avatar: '📺', category: 'marketing', subCategory: '社媒运营', description: 'B站账号运营、UP主合作', skills: ['B站', '视频', '社区'], rating: 4.6, uses: 9870 },

  // SEO 优化
  { id: 'mkt-seo-01', name: 'SEO 优化师', avatar: '🔍', category: 'marketing', subCategory: 'SEO 优化', description: '网站 SEO 优化，关键词布局', skills: ['SEO', '关键词', '内容'], rating: 4.7, uses: 13450 },
  { id: 'mkt-seo-02', name: '技术 SEO', avatar: '⚙️', category: 'marketing', subCategory: 'SEO 优化', description: '技术 SEO 优化，网站结构优化', skills: ['技术SEO', '结构化数据', '性能'], rating: 4.8, uses: 7230 },

  // 广告投放
  { id: 'mkt-ads-01', name: '信息流广告', avatar: '📺', category: 'marketing', subCategory: '广告投放', description: '巨量引擎、腾讯广告投放', skills: ['信息流', '巨量', '投放'], rating: 4.8, uses: 11230 },
  { id: 'mkt-ads-02', name: '搜索广告优化', avatar: '🔎', category: 'marketing', subCategory: '广告投放', description: '百度、Google SEM 投放', skills: ['SEM', '竞价', 'ROI'], rating: 4.7, uses: 8450 },
  { id: 'mkt-ads-03', name: '投放数据分析师', avatar: '📊', category: 'marketing', subCategory: '广告投放', description: '广告数据分析、效果优化', skills: ['数据分析', '投放', '优化'], rating: 4.8, uses: 7890 },

  // 品牌策划
  { id: 'mkt-brand-01', name: '品牌策划', avatar: '💎', category: 'marketing', subCategory: '品牌策划', description: '品牌定位、品牌策略制定', skills: ['品牌', '定位', '策略'], rating: 4.9, uses: 9670 },
  { id: 'mkt-brand-02', name: '活动策划', avatar: '🎉', category: 'marketing', subCategory: '品牌策划', description: '线上线下活动策划执行', skills: ['活动', '策划', '执行'], rating: 4.7, uses: 11340 },

  // 增长运营
  { id: 'mkt-growth-01', name: '增长运营', avatar: '📈', category: 'marketing', subCategory: '增长运营', description: '用户增长、裂变增长策略', skills: ['增长', '裂变', '转化'], rating: 4.8, uses: 14560, trending: true },
  { id: 'mkt-growth-02', name: '私域运营', avatar: '💬', category: 'marketing', subCategory: '增长运营', description: '私域流量池搭建与运营', skills: ['私域', '社群', '企微'], rating: 4.7, uses: 12890 },

  // 更多营销
  { id: 'mkt-pr-01', name: '公关媒介', avatar: '📰', category: 'marketing', subCategory: '品牌策划', description: '媒体关系、公关策划', skills: ['公关', '媒体', '危机'], rating: 4.6, uses: 5670 },
  { id: 'mkt-kol-01', name: 'KOL 运营', avatar: '⭐', category: 'marketing', subCategory: '社媒运营', description: '达人合作、MCN 对接', skills: ['KOL', '达人', '合作'], rating: 4.7, uses: 9840 },
  { id: 'mkt-video-01', name: '短视频运营', avatar: '🎬', category: 'marketing', subCategory: '内容运营', description: '短视频账号矩阵运营', skills: ['短视频', '矩阵', '运营'], rating: 4.8, uses: 16780 },
  { id: 'mkt-live-01', name: '直播运营', avatar: '🎥', category: 'marketing', subCategory: '社媒运营', description: '直播策划、直播带货', skills: ['直播', '带货', '运营'], rating: 4.7, uses: 13450 },
  { id: 'mkt-comm-01', name: '社群运营', avatar: '👥', category: 'marketing', subCategory: '社媒运营', description: '社群搭建、用户活跃', skills: ['社群', '活跃', '运营'], rating: 4.6, uses: 15670 },

  // ========== 分析类 (15个) ==========
  // 数据分析
  { id: 'ana-data-01', name: '数据分析师', avatar: '📊', category: 'analysis', subCategory: '数据分析', description: '业务数据分析、报表搭建', skills: ['SQL', 'Python', 'Tableau'], rating: 4.8, uses: 16780, trending: true },
  { id: 'ana-data-02', name: 'BI 工程师', avatar: '📈', category: 'analysis', subCategory: '数据分析', description: 'BI 报表开发、数据可视化', skills: ['BI', '可视化', '报表'], rating: 4.7, uses: 9840 },
  { id: 'ana-data-03', name: '埋点分析师', avatar: '📍', category: 'analysis', subCategory: '数据分析', description: '数据埋点设计、行为分析', skills: ['埋点', '神策', 'GA'], rating: 4.6, uses: 6230 },

  // 财务分析
  { id: 'ana-finance-01', name: '财务分析师', avatar: '💰', category: 'analysis', subCategory: '财务分析', description: '财务报表分析、预算编制', skills: ['财务', '报表', '预算'], rating: 4.8, uses: 11230 },
  { id: 'ana-finance-02', name: '投资分析师', avatar: '💹', category: 'analysis', subCategory: '财务分析', description: '行业研究、投资分析', skills: ['投资', '研究', '估值'], rating: 4.9, uses: 8560 },

  // 竞品分析
  { id: 'ana-competitor-01', name: '竞品分析师', avatar: '🎯', category: 'analysis', subCategory: '竞品分析', description: '竞品调研、竞争策略分析', skills: ['竞品', '调研', '策略'], rating: 4.7, uses: 9870 },
  { id: 'ana-competitor-02', name: '行业研究员', avatar: '📚', category: 'analysis', subCategory: '竞品分析', description: '行业研究、市场调研', skills: ['行业研究', '报告', '市场'], rating: 4.8, uses: 7650 },

  // 用户研究
  { id: 'ana-user-01', name: '用户研究员', avatar: '👤', category: 'analysis', subCategory: '用户研究', description: '用户访谈、可用性测试', skills: ['用户研究', '访谈', '测试'], rating: 4.7, uses: 8230 },
  { id: 'ana-user-02', name: '体验分析师', avatar: '💡', category: 'analysis', subCategory: '用户研究', description: 'NPS 调研、满意度分析', skills: ['NPS', '满意度', '体验'], rating: 4.6, uses: 5450 },

  // 市场分析
  { id: 'ana-market-01', name: '市场分析师', avatar: '🌍', category: 'analysis', subCategory: '市场分析', description: '市场规模估算、趋势分析', skills: ['市场', '趋势', '预测'], rating: 4.7, uses: 7340 },
  { id: 'ana-market-02', name: '产品分析师', avatar: '📦', category: 'analysis', subCategory: '市场分析', description: '产品数据分析、迭代优化', skills: ['产品', '数据', '迭代'], rating: 4.8, uses: 10560 },

  // 更多分析
  { id: 'ana-risk-01', name: '风险分析师', avatar: '⚠️', category: 'analysis', subCategory: '财务分析', description: '风险评估、风控建模', skills: ['风险', '风控', '建模'], rating: 4.7, uses: 4560 },
  { id: 'ana-ops-01', name: '运营分析师', avatar: '🔧', category: 'analysis', subCategory: '数据分析', description: '运营数据分析、漏斗分析', skills: ['运营', '漏斗', '转化'], rating: 4.6, uses: 8970 },
  { id: 'ana-ab-01', name: 'A/B 测试专家', avatar: '🧪', category: 'analysis', subCategory: '数据分析', description: '实验设计、A/B 测试分析', skills: ['A/B测试', '实验', '统计'], rating: 4.8, uses: 6780 },

  // ========== 写作类 (20个) ==========
  // 文案写作
  { id: 'write-copy-01', name: '文案写手', avatar: '✍️', category: 'writing', subCategory: '文案写作', description: '广告文案、营销文案创作', skills: ['文案', '创意', '营销'], rating: 4.7, uses: 23450 },
  { id: 'write-copy-02', name: '电商文案', avatar: '🛒', category: 'writing', subCategory: '文案写作', description: '商品详情页、推广文案', skills: ['电商', '详情页', '转化'], rating: 4.6, uses: 18760 },
  { id: 'write-copy-03', name: '品牌文案', avatar: '💎', category: 'writing', subCategory: '文案写作', description: '品牌故事、品牌调性文案', skills: ['品牌', '故事', '调性'], rating: 4.8, uses: 12340 },

  // 技术文档
  { id: 'write-tech-01', name: '技术文档工程师', avatar: '📖', category: 'writing', subCategory: '技术文档', description: 'API 文档、技术规范编写', skills: ['文档', 'API', '技术写作'], rating: 4.8, uses: 9870 },
  { id: 'write-tech-02', name: '产品文档', avatar: '📋', category: 'writing', subCategory: '技术文档', description: 'PRD 文档、需求文档编写', skills: ['PRD', '需求', '文档'], rating: 4.7, uses: 11230 },
  { id: 'write-tech-03', name: '知识库维护', avatar: '📚', category: 'writing', subCategory: '技术文档', description: '产品帮助文档、知识库', skills: ['知识库', '帮助中心', 'FAQ'], rating: 4.5, uses: 6540 },

  // 小说创作
  { id: 'write-fiction-01', name: '小说作家', avatar: '📚', category: 'writing', subCategory: '小说创作', description: '网络小说、故事创作', skills: ['小说', '故事', '创作'], rating: 4.6, uses: 15670 },
  { id: 'write-fiction-02', name: '剧本编剧', avatar: '🎬', category: 'writing', subCategory: '小说创作', description: '影视剧本、短视频脚本', skills: ['剧本', '编剧', '脚本'], rating: 4.7, uses: 8920 },

  // 新闻撰写
  { id: 'write-news-01', name: '新闻编辑', avatar: '📰', category: 'writing', subCategory: '新闻撰写', description: '新闻稿撰写、媒体稿件', skills: ['新闻', '稿件', '媒体'], rating: 4.6, uses: 7890 },
  { id: 'write-news-02', name: '公关稿件', avatar: '📢', category: 'writing', subCategory: '新闻撰写', description: '公关稿件、企业宣传稿', skills: ['公关', '宣传', '稿件'], rating: 4.5, uses: 5670 },

  // 内容创作
  { id: 'write-content-01', name: '内容创作者', avatar: '📝', category: 'writing', subCategory: '内容创作', description: '公众号文章、知乎回答', skills: ['公众号', '知乎', '内容'], rating: 4.7, uses: 21340 },
  { id: 'write-content-02', name: '短视频脚本', avatar: '🎥', category: 'writing', subCategory: '内容创作', description: '抖音、B站视频脚本', skills: ['短视频', '脚本', '分镜'], rating: 4.6, uses: 16780 },
  { id: 'write-content-03', name: '直播脚本', avatar: '🎤', category: 'writing', subCategory: '内容创作', description: '直播话术、直播脚本', skills: ['直播', '话术', '脚本'], rating: 4.5, uses: 9870 },

  // 专业写作
  { id: 'write-pro-01', name: '学术写作', avatar: '🎓', category: 'writing', subCategory: '专业写作', description: '论文润色、学术写作', skills: ['论文', '学术', '润色'], rating: 4.7, uses: 6230 },
  { id: 'write-pro-02', name: '法律文书', avatar: '⚖️', category: 'writing', subCategory: '专业写作', description: '合同起草、法律文书', skills: ['法律', '合同', '文书'], rating: 4.8, uses: 4560 },
  { id: 'write-pro-03', name: '商业计划书', avatar: '📊', category: 'writing', subCategory: '专业写作', description: '商业计划书、融资 BP', skills: ['BP', '商业计划', '融资'], rating: 4.8, uses: 7890 },

  // 更多写作
  { id: 'write-social-01', name: '社媒文案', avatar: '💬', category: 'writing', subCategory: '文案写作', description: '朋友圈、微博、小红书文案', skills: ['朋友圈', '微博', '小红书'], rating: 4.5, uses: 19870 },
  { id: 'write-seo-01', name: 'SEO 文案', avatar: '🔍', category: 'writing', subCategory: '文案写作', description: 'SEO 优化文章、关键词布局', skills: ['SEO', '关键词', '文章'], rating: 4.6, uses: 11230 },
  { id: 'write-local-01', name: '本地化翻译', avatar: '🌍', category: 'writing', subCategory: '专业写作', description: '多语言本地化、翻译', skills: ['翻译', '本地化', '多语言'], rating: 4.7, uses: 7650 },

  // ========== 运营类 (15个) ==========
  // 产品运营
  { id: 'ops-product-01', name: '产品运营', avatar: '📦', category: 'operations', subCategory: '产品运营', description: '产品迭代、用户反馈收集', skills: ['产品运营', '迭代', '反馈'], rating: 4.7, uses: 13450 },
  { id: 'ops-product-02', name: '新用户运营', avatar: '🆕', category: 'operations', subCategory: '产品运营', description: '新用户引导、激活留存', skills: ['新用户', '激活', '引导'], rating: 4.6, uses: 9870 },

  // 用户运营
  { id: 'ops-user-01', name: '用户运营', avatar: '👥', category: 'operations', subCategory: '用户运营', description: '用户分层、生命周期管理', skills: ['用户运营', '分层', '生命周期'], rating: 4.7, uses: 15670 },
  { id: 'ops-user-02', name: '会员运营', avatar: '👑', category: 'operations', subCategory: '用户运营', description: '会员体系、权益设计', skills: ['会员', '权益', '体系'], rating: 4.8, uses: 11230 },
  { id: 'ops-user-03', name: '客服运营', avatar: '🎧', category: 'operations', subCategory: '用户运营', description: '客服流程、工单管理', skills: ['客服', '工单', '流程'], rating: 4.5, uses: 8760 },

  // 活动运营
  { id: 'ops-event-01', name: '活动运营', avatar: '🎉', category: 'operations', subCategory: '活动运营', description: '活动策划、执行落地', skills: ['活动', '策划', '执行'], rating: 4.7, uses: 13450 },
  { id: 'ops-event-02', name: '大促运营', avatar: '🛍️', category: 'operations', subCategory: '活动运营', description: '双11、618 大促策划', skills: ['大促', '电商', '活动'], rating: 4.8, uses: 9870 },

  // 数据运营
  { id: 'ops-data-01', name: '数据运营', avatar: '📊', category: 'operations', subCategory: '数据运营', description: '数据监控、报表分析', skills: ['数据', '监控', '报表'], rating: 4.6, uses: 11230 },
  { id: 'ops-data-02', name: '策略运营', avatar: '🎯', category: 'operations', subCategory: '数据运营', description: '运营策略制定、效果优化', skills: ['策略', '优化', '迭代'], rating: 4.7, uses: 8450 },

  // 商家运营
  { id: 'ops-merchant-01', name: '商家运营', avatar: '🏪', category: 'operations', subCategory: '商家运营', description: '商家入驻、商家成长', skills: ['商家', '入驻', '成长'], rating: 4.6, uses: 7650 },
  { id: 'ops-merchant-02', name: '类目运营', avatar: '📂', category: 'operations', subCategory: '商家运营', description: '商品类目管理、品类规划', skills: ['类目', '品类', '规划'], rating: 4.5, uses: 5430 },

  // 更多运营
  { id: 'ops-content-01', name: '内容运营', avatar: '📝', category: 'operations', subCategory: '内容运营', description: '内容审核、内容分发', skills: ['内容', '审核', '分发'], rating: 4.6, uses: 12340 },
  { id: 'ops-risk-01', name: '风控运营', avatar: '🛡️', category: 'operations', subCategory: '数据运营', description: '风险识别、风控策略', skills: ['风控', '审核', '策略'], rating: 4.7, uses: 6540 },
  { id: 'ops-quality-01', name: '质量运营', avatar: '✅', category: 'operations', subCategory: '产品运营', description: '质量监控、问题追踪', skills: ['质量', '监控', '追踪'], rating: 4.5, uses: 4560 },
  { id: 'ops-cross-01', name: '跨部门协作', avatar: '🤝', category: 'operations', subCategory: '产品运营', description: '跨部门项目协调、资源对接', skills: ['协作', '沟通', '协调'], rating: 4.6, uses: 7890 },
];

// 模板组合
export const templates = [
  {
    id: 'startup-team',
    name: '创业团队套餐',
    description: '适合初创公司的核心团队配置',
    agents: ['dev-full-01', 'design-ui-01', 'mkt-growth-01', 'write-content-01'],
    icon: '🚀',
  },
  {
    id: 'content-studio',
    name: '内容工作室',
    description: '短视频和图文内容生产组合',
    agents: ['write-content-01', 'design-motion-01', 'mkt-social-01', 'ana-data-01'],
    icon: '🎬',
  },
  {
    id: 'product-team',
    name: '产品研发组',
    description: '产品设计和开发核心团队',
    agents: ['dev-fe-01', 'dev-be-01', 'design-ux-01', 'ana-user-01'],
    icon: '📱',
  },
  {
    id: 'marketing-squad',
    name: '营销铁军',
    description: '全渠道营销推广团队',
    agents: ['mkt-social-01', 'mkt-ads-01', 'write-copy-01', 'ana-competitor-01'],
    icon: '📢',
  },
  {
    id: 'data-team',
    name: '数据分析组',
    description: '数据驱动的分析团队',
    agents: ['ana-data-01', 'ana-user-01', 'ops-data-01', 'dev-ai-01'],
    icon: '📊',
  },
];

// 获取热门 Agent
export const getTrendingAgents = () => agents.filter(a => a.trending);

// 按分类获取 Agent
export const getAgentsByCategory = (categoryId: string) => 
  agents.filter(a => a.category === categoryId);

// 按子分类获取 Agent
export const getAgentsBySubCategory = (category: string, subCategory: string) =>
  agents.filter(a => a.category === category && a.subCategory === subCategory);

// 搜索 Agent
export const searchAgents = (query: string) => {
  const q = query.toLowerCase();
  return agents.filter(a => 
    a.name.toLowerCase().includes(q) ||
    a.description.toLowerCase().includes(q) ||
    a.skills.some(s => s.toLowerCase().includes(q))
  );
};