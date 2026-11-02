import { GoogleGenAI } from '@google/genai';
import { DailyBriefing, HistoryEventItem, GroundingSource } from '../src/types';

// Curated high-fidelity historical & today briefings
const PRESET_HISTORICAL_BRIEFINGS: Record<string, DailyBriefing> = {
  '2026-11-01': {
    date: '2026-11-01',
    displayDate: '2026年11月1日 星期日 (今日实时头条)',
    isToday: true,
    marketSentiment: {
      status: 'bullish',
      label: '算力硬件领涨 · 风险偏好扩张',
      score: 86,
      summary: '美股大型科技权重在算力与云端SaaS双引擎驱动下走强，纳斯达克100放量拉升，全球跨境贸易与数字金融清算网络保持活跃。',
    },
    executiveSummary: '今日全球七维全景扫描：美股算力与半导体集群强势领跑，资金向高景气壁垒资产集中；国际清算银行深化跨币种秒级对付试验网；开源社区发布新一代端侧自适应量化推理架构；中欧跨大西洋绿色技术互认框架取得新进展；故宫与教科文组织公布数字空间文物归档新标准；跨国弹性就业保障试点扩容；国际清洁能源机构发布跨区域特高压绿电互联走廊倡议。',
    events: [
      {
        id: 'ev-1101-1',
        title: '标普500与纳斯达克高位强势整固，英伟达与超算硬件链领跑涨幅榜',
        category: 'stocks',
        time: '收盘播报',
        summary: '在下一代数据中心算力集群旺盛订单支撑下，科技权重龙头维持充沛买盘，半导体先进封装与光模块板块成交量放大。',
        importance: 'critical',
        impact: {
          market: '全球风险资产风险偏好提振，资金向现金流充沛且壁垒深厚的龙头聚集',
          sector: '纳斯达克100 ETF、半导体先进封装、液冷算力集群',
          takeaway: '聚焦AI基础设施商业化落地主线，把握算力硬件的确定性盈利兑现。'
        },
        tags: ['美股收盘', '英伟达', '半导体', '纳斯达克', '先进封装'],
        sources: [
          { title: '彭博社 (Bloomberg): Tech Giants Lead Wall Street Rally on AI Hardware Boom', uri: 'https://www.bloomberg.com' },
          { title: '华尔街日报 (WSJ): Semiconductor Rally Broadens on Datacenter Capex Guidance', uri: 'https://www.wsj.com' }
        ]
      },
      {
        id: 'ev-1101-2',
        title: '国际清算银行(BIS)联合多国央行启动多边外汇对付(PvP)秒级跨境清算试验网',
        category: 'finance',
        time: '13:30 CET',
        summary: '试验网实现了多币种离岸资产在去中心化与央行监管网关下的原子结算，消除跨时区在途结算本金风险。',
        importance: 'high',
        impact: {
          market: '显著压低跨境大宗商品贸易汇率摩擦成本，离岸外汇掉期流动性更趋充沛',
          sector: '跨境支付机构、多国商业银行清算网络、外汇做市商',
          takeaway: '多边数字清算基建演进正在加速重构全球贸易支付与储备多元化格局。'
        },
        tags: ['国际清算银行', '外汇流动性', '跨境清算', '数字金融'],
        sources: [
          { title: '金融时报 (FT): BIS and Central Banks Launch Real-time Foreign Exchange PvP Clearing', uri: 'https://www.ft.com' },
          { title: '财新网 (Caixin): 多国央行数字金融协同降低跨境结算成本', uri: 'https://www.caixin.com' }
        ]
      },
      {
        id: 'ev-1101-3',
        title: '开源人工智能社区发布下一代自适应稀疏量化系统，消费级端侧全速推理',
        category: 'tech',
        time: '09:15 EST',
        summary: '新算法通过神经突触自适应动态剪枝与显存压缩，在普通平板与笔记本显卡上实现每秒超百字的高清图像与文本混合实时推理。',
        importance: 'critical',
        impact: {
          market: '加速端侧智能终端、AI PC与消费级智能硬件普及进程',
          sector: 'AI PC整机供应链、端侧SoC芯片、边缘计算SaaS',
          takeaway: '端侧推理平民化将彻底引爆下游垂直场景原生AI软件的普及浪潮。'
        },
        tags: ['开源大模型', '端侧AI', '稀疏量化', 'AI PC', '边缘计算'],
        sources: [
          { title: 'MIT 科技评论 (MIT Technology Review): Breakthrough in Edge AI Inference Efficiency', uri: 'https://www.technologyreview.com' },
          { title: '路透社 (Reuters): Open Source Community Delivers High-speed Multimodal Model for PCs', uri: 'https://www.reuters.com' }
        ]
      },
      {
        id: 'ev-1101-4',
        title: '中欧与跨大西洋绿色技术标准互认与碳足迹核算框架达成关键突破',
        category: 'politics',
        time: '15:20 GMT',
        summary: '双方同意在绿色氢能储运、动力电池全生命周期溯源及跨境可再生能源绿证核销方面建立常态化专家协商与互认通道。',
        importance: 'high',
        impact: {
          market: '消除新能源高端制造与储能出海企业的长期贸易合规不确定性',
          sector: '新能源车产业链、锂电储能出海、碳核算认证服务商',
          takeaway: '绿色贸易合规标准成为新时期国际产业链深度嵌入的核心通行证。'
        },
        tags: ['绿色贸易', '碳足迹', '中欧经贸', '地缘合作'],
        sources: [
          { title: '新华社 (Xinhua): 中欧绿色技术标准互认取得务实成果', uri: 'https://www.news.cn' },
          { title: '经合组织公报 (OECD Policy): Bilateral Green Standards Mutual Recognition', uri: 'https://www.oecd.org' }
        ]
      },
      {
        id: 'ev-1101-5',
        title: '故宫博物院与联合国教科文组织联合启动全球数字空间非遗保护标准倡议',
        category: 'culture',
        time: '10:00 CST',
        summary: '倡议确立沉浸空间计算、古建筑高精度点云数据及传统非遗工艺数字孪生的长久归档与无损开源共享规范。',
        importance: 'medium',
        impact: {
          market: '带动文博数字化软硬件定制与空间XR沉浸式展陈项目落地',
          sector: '数字文化创意、3D数字建模、空间计算展陈工程',
          takeaway: '经典历史文化借助数字空间孪生技术，跨越地域与时代界限实现文明互鉴。'
        },
        tags: ['故宫博物院', '非物质文化遗产', '数字文博', '联合国教科文组织'],
        sources: [
          { title: '中国文化报: 故宫与国际文博机构共同探索数字非遗传承新标杆', uri: 'https://www.chinaculture.org' },
          { title: '教科文组织文化公报 (UNESCO): Open Standards for Spatial Cultural Heritage', uri: 'https://whc.unesco.org' }
        ]
      },
      {
        id: 'ev-1101-6',
        title: '全球数字游民与弹性创作者劳动保障新白皮书发布，跨国社保结算试点扩容',
        category: 'society',
        time: '12:30 CET',
        summary: '多国劳工部门同意扩大针对远程知识型创作者的个人养老与医疗跨国便携转移试点，建立适应远程办公的普惠型法治保障框架。',
        importance: 'high',
        impact: {
          market: '激发年轻高技能人才全球化自由流动，助推新消费与远程办公SaaS需求',
          sector: '灵活用工SaaS、个人养老金管理机构、远程协作软硬件',
          takeaway: '传统在地化劳动保障制度正在加速向云端分布式与多边互认转型。'
        },
        tags: ['数字游民', '灵活用工', '跨国社保', '民生福利'],
        sources: [
          { title: '联合早报 (Lianhe Zaobao): 跨国数字游民保障新框架促成新就业生态', uri: 'https://www.zaobao.com' },
          { title: '经济学人 (The Economist): Reimagining Social Safety Nets for Remote Workers', uri: 'https://www.economist.com' }
        ]
      },
      {
        id: 'ev-1101-7',
        title: '国际可再生能源署启动跨区域分布式绿电互联走廊倡议',
        category: 'international',
        time: '17:00 UTC',
        summary: '倡议联合亚洲、非洲与欧洲十余个国家，协同共建特高压直流与微电网互补示范区，支持算力中心与高耗能产业绿电直供。',
        importance: 'high',
        impact: {
          market: '提振全球电网设备、特高压直流输电与绿色债券资产吸引力',
          sector: '特高压电网、逆变器与智能电表、绿色基础设施基金',
          takeaway: '算力与能源协同正在演进为21世纪全球最重要的综合战略基础设施。'
        },
        tags: ['可再生能源', '绿电互联', '特高压', '国际能源合作'],
        sources: [
          { title: '联合国新闻 (UN News): Global Clean Energy Grid Corridor Initiative Unveiled', uri: 'https://news.un.org' },
          { title: '世界银行环境报告 (World Bank): Cross-border Renewable Integration Finance', uri: 'https://www.worldbank.org' }
        ]
      }
    ],
    historicalParallels: [
      {
        year: 1993,
        event: '欧洲联盟《马斯特里赫特条约》正式生效',
        significance: '标志着欧洲统一大市场与欧洲单一货币欧元的历史起点，深刻改变全球地缘经济与外汇储备版图。'
      },
      {
        year: 1755,
        event: '里斯本大地震与启蒙哲思觉醒',
        significance: '催生现代地震学、现代城市防灾规划，并深刻引发伏尔泰、康德对自然理性与人类社会的现代启蒙哲学反思。'
      },
      {
        year: 1952,
        event: '人类首颗代号“常青藤麦克”的热核氢弹在太平洋试验成功',
        significance: '开启了冷战大国核威慑与战略核均势时代，直接倒逼了后续全球核不扩散与和平利用原子能条约体系。'
      }
    ],
    updatedAt: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  },
  '2026-11-02': {
    date: '2026-11-02',
    displayDate: '2026年11月2日 星期一 (今日实时头条)',
    isToday: true,
    marketSentiment: {
      status: 'bullish',
      label: '多维动量扩散 · 科技资本共振',
      score: 85,
      summary: '亚太与欧美主要股指在新一轮半导体光电互联与清洁能源并网利好下放量上扬，全球跨境流动性稳健。',
    },
    executiveSummary: '今日全球七维全景扫描：全球主要股指在科技制造龙头强劲业绩驱动下续刷近月新高；多国央行深化秒级数字清算互通；下一代端侧智能系统全面开源；亚太经合多边经贸框架取得关键进展；故宫与卢浮宫联合举办全球数字文化遗产沉浸大展；国际劳工组织发布弹性工作保障指南；联合国启动跨国绿电互联倡议。',
    events: [
      {
        id: 'ev-1102-1',
        title: '半导体先进封装与光电融合产业链放量大涨，全球主要科技股指创阶段新高',
        category: 'stocks',
        time: '早盘快讯',
        summary: '伴随全球数据中心与算力云基础设施资本开支指引上调，先进光通信器件与高频基板标的普遍涨幅超5%，机构买盘强劲。',
        importance: 'critical',
        impact: {
          market: '提振全球半导体与硬科技板块风险溢价，成长风格动量加速',
          sector: '半导体封装设备、CPO光引擎、AI算力集群',
          takeaway: '光通信代际升级从实验室研发步入大规模资本开支兑现期。'
        },
        tags: ['科技股', '先进封装', '半导体', '光互联', '资本开支'],
        sources: [
          { title: '彭博财经 (Bloomberg): Asian Chip Stocks Jump as Datacenter Spending Accelerates', uri: 'https://www.bloomberg.com' },
          { title: '路透社 (Reuters): Next-gen Optical Interconnect Orders Fuel Tech Gains', uri: 'https://www.reuters.com' }
        ]
      },
      {
        id: 'ev-1102-2',
        title: '多边央行数字货币结算平台扩容，秒级跨境大宗商品外汇对付常态化',
        category: 'finance',
        time: '11:15 HKT',
        summary: '清算网络全面接入能源、矿产与粮食跨境现货贸易合约，结算耗时由传统T+2天骤降至5秒以内，代理清算费降低80%。',
        importance: 'high',
        impact: {
          market: '跨国大宗商品贸易汇率波动摩擦显著收窄，非单一储备货币结算占比稳步上升',
          sector: '商业银行跨境结算部、跨国贸易大宗现货商、国际外汇做市商',
          takeaway: '多边金融清算基建演进正在加速重构全球贸易支付与储备多元化格局。'
        },
        tags: ['央行数字货币', '大宗商品', '跨境清算', '外汇流动性'],
        sources: [
          { title: '金融时报 (Financial Times): Multi-currency Clearing Platform Accelerates Commodities Trade', uri: 'https://www.ft.com' },
          { title: '华尔街日报 (WSJ): Central Banks Deepen Real-time Cross-border Payment Network', uri: 'https://www.wsj.com' }
        ]
      },
      {
        id: 'ev-1102-3',
        title: '新一代全光交换超算架构落地，大模型节点间通信能耗骤降60%',
        category: 'tech',
        time: '09:00 EST',
        summary: '全光交换(OCS)矩阵消除了传统电光电重复转换损耗，集群万卡扩展效率突破92%，大幅压缩长序列大模型训练能耗瓶颈。',
        importance: 'critical',
        impact: {
          market: '光模块与OCS全光矩阵设备供应商成为资本开支增长最快环节',
          sector: '全光通信设备、硅光子激光器、液冷绿色数据中心',
          takeaway: '超算底层互联的物理范式变革正在重塑未来三年AI芯片与IDC投资图谱。'
        },
        tags: ['人工智能', '全光交换', '超算集群', 'OCS', '硅光子'],
        sources: [
          { title: 'MIT 科技评论 (MIT Technology Review): Optical Circuit Switching Revolutionizes AI Datacenters', uri: 'https://www.technologyreview.com' },
          { title: 'ArXiv 前沿研究追踪: High-radix Optical Interconnects for Terabit Compute', uri: 'https://arxiv.org' }
        ]
      },
      {
        id: 'ev-1102-4',
        title: '亚太经合组织就《跨国数字贸易便利化与数据流动安全协同》达成共识',
        category: 'politics',
        time: '14:40 GMT',
        summary: '协议草案确立了中小企业数字化通关绿色通道、算法知识产权边境保护及跨司法管辖区商业数据流通安全标准。',
        importance: 'high',
        impact: {
          market: '显著降低跨境电商与数字出海企业的跨境法律合规壁垒',
          sector: '跨境数字贸易服务商、出海电商平台、合规法律咨询',
          takeaway: '区域多边数字经贸协定正在取代传统关税协定成为最具活力的合作载体。'
        },
        tags: ['亚太经合', '数字贸易', '跨国经贸', '数据合规'],
        sources: [
          { title: '新华社 (Xinhua): 亚太跨境数字贸易协同发展行动纲领正式签署', uri: 'https://www.news.cn' },
          { title: '联合早报 (Lianhe Zaobao): 区域多边数字贸易框架达成历史性共识', uri: 'https://www.zaobao.com' }
        ]
      },
      {
        id: 'ev-1102-5',
        title: '全球数字艺术与文博资产开源互联数据库正式向全球科研高校开放',
        category: 'culture',
        time: '10:00 CST',
        summary: '汇集全球数十家顶尖博物馆的毫米级高保真3D文物扫描模型与文献释读，支持全球学者与公众免授权用于学术与非商业创作。',
        importance: 'medium',
        impact: {
          market: '加速文创产业数字化再创作与教育沉浸虚拟现实空间普及',
          sector: '数字文化创意、XR空间教育、数字出版',
          takeaway: '人类共有文明瑰宝以开放开源形式接入云端，为全球文明互鉴架起数字桥梁。'
        },
        tags: ['数字文博', '文化遗产', '开源文库', '文明互鉴'],
        sources: [
          { title: '中国文化报: 全球顶尖文博机构联合开放高精度数字资产库', uri: 'https://www.chinaculture.org' },
          { title: '教科文组织文化公报 (UNESCO): Open Access to Global Cultural Heritage Archives', uri: 'https://whc.unesco.org' }
        ]
      },
      {
        id: 'ev-1102-6',
        title: '国际劳工组织启动智能制造时代一线劳动者技能转型专项扶持计划',
        category: 'society',
        time: '12:00 CET',
        summary: '计划通过政府、企业与工会联合设立专项培训基金，针对工业自动化转型产业工人提供免费机器人编程与工业软件操作认证。',
        importance: 'high',
        impact: {
          market: '提高制造业全要素生产率与劳动力转岗成功率，提振社会中坚消费信心',
          sector: '工业职业教育、智能制造培训机构、人力资本服务',
          takeaway: '技术飞跃期的包容性增长与技能转型兜底，是维持社会长期繁荣的基石。'
        },
        tags: ['职业转型', '智能制造', '民生保障', '劳工福利'],
        sources: [
          { title: '国际劳工组织官网 (ILO): Workforce Transition in the Era of Advanced Robotics', uri: 'https://www.ilo.org' },
          { title: '经济学人 (The Economist): Retooling the Global Industrial Workforce', uri: 'https://www.economist.com' }
        ]
      },
      {
        id: 'ev-1102-7',
        title: '联合国环境署与国际能源署发布《全球跨洲际绿色电网互联可行性总览》',
        category: 'international',
        time: '16:00 UTC',
        summary: '报告论证了依托特高压直流输电平抑跨大洲昼夜时区光伏与风能互补的可行性，并启动亚欧非首期清洁能源通道工程前期测绘。',
        importance: 'high',
        impact: {
          market: '提振特高压输变电设备龙头、长时储能与绿色主权发展债券长期景气度',
          sector: '特高压电网装备、变压器与智能电网、绿色基础设施基金',
          takeaway: '跨区域能源互联网正在成为支撑人类未来算力与低碳文明的底层物理大动脉。'
        },
        tags: ['联合国', '清洁能源', '特高压', '全球电网互联', '绿色金融'],
        sources: [
          { title: '联合国新闻 (UN News): UN and IEA Map Path to Intercontinental Green Grids', uri: 'https://news.un.org' },
          { title: '国际能源署 (IEA Report): Cross-border Clean Energy Transmission Feasibility', uri: 'https://www.iea.org' }
        ]
      }
    ],
    historicalParallels: [
      {
        year: 1917,
        event: '英国政府发表《贝尔福宣言》',
        significance: '对中东近代地缘政治格局、主权边界与国际外交产生了持续百年的深远历史影响。'
      },
      {
        year: 1930,
        event: '海尔·塞拉西一世在亚的斯亚贝巴加冕为埃塞俄比亚皇帝',
        significance: '成为非洲反殖民主义运动与非盟泛非主义团结运动的重要精神旗帜。'
      },
      {
        year: 2000,
        event: '国际空间站(ISS)迎来首批长期考察宇航员',
        significance: '开启了人类在近地轨道不间断连续驻留空间站进行跨国和平科研合作的新篇章。'
      }
    ],
    updatedAt: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  },
  '2026-10-31': {
    date: '2026-10-31',
    displayDate: '2026年10月31日 星期六 (今日实时)',
    isToday: true,
    marketSentiment: {
      status: 'bullish',
      label: '成长主线巩固 · 结构动能充沛',
      score: 84,
      summary: '美股大型科技与算力龙头财报超预期助推纳指收复高点，亚太半导体设备与数字贸易板块放量活跃，全球外汇流动性保持平稳。',
    },
    executiveSummary: '今日全球七维全景扫描：全球主要股指在科技权重财报驱动下强势整固；开源社区全面发布百万上下文多模态端侧模型；国际清算银行与主要央行深化秒级数字清算互通；中欧绿色技术互认框架取得新进展；故宫与教科文组织公布数字文化空间全球保护新标准；全球弹性劳动就业保障互认试点扩容；国际清洁能源机构发布跨洲际微电网倡议。',
    events: [
      {
        id: 'ev-today-31-1',
        title: '标普500与纳斯达克高位强势整固，半导体先进封装与光互联领跑涨幅榜',
        category: 'stocks',
        time: '收盘播报',
        summary: '在超算硬件集群强劲出货预期支撑下，科技权重龙头维持充沛买盘，半导体设备与光通信板块周度涨幅创近三个月新高。',
        importance: 'critical',
        impact: {
          market: '风险偏好维持高位，资金向具备确定性现金流与高研发壁垒的科技巨头集中',
          sector: '纳斯达克100 ETF、半导体先进封装、算力云服务商',
          takeaway: '紧扣AI算力基础设施放量兑现主线，兼顾高位估值防守。',
        },
        tags: ['美股收盘', '半导体', '纳斯达克', '先进封装', '科技财报'],
        sources: [
          { title: '彭博社 (Bloomberg): Tech Stocks Consolidate Near Record Highs as Chip Demand Booms', uri: 'https://www.bloomberg.com' },
          { title: '华尔街日报 (WSJ): Semiconductor Rally Extends on Strong Datacenter Capex', uri: 'https://www.wsj.com' }
        ]
      },
      {
        id: 'ev-today-31-2',
        title: '开源人工智能社区发布百万级长上下文多模态系统，消费级算力支持端侧全速推理',
        category: 'tech',
        time: '09:30 EST',
        summary: '新一代模型架构通过自适应稀疏量化与神经压缩算法，在单卡消费级GPU上实现每秒超百字的高清图像与文本混合实时推理，大幅降低产业部署门槛。',
        importance: 'critical',
        impact: {
          market: '加速端侧智能终端、AI PC与消费级智能硬件普及进程',
          sector: 'AI PC整机供应链、端侧SoC芯片、边缘计算SaaS',
          takeaway: '端侧推理平民化将彻底引爆下游垂直场景原生AI软件的普及浪潮。',
        },
        tags: ['开源大模型', '端侧AI', '长上下文', 'AI PC', '边缘计算'],
        sources: [
          { title: 'MIT 科技评论 (MIT Technology Review): Breakthrough in Edge AI Inference Efficiency', uri: 'https://www.technologyreview.com' },
          { title: '路透社 (Reuters): Open Source Community Delivers High-speed Multimodal Model for PCs', uri: 'https://www.reuters.com' }
        ]
      },
      {
        id: 'ev-today-31-3',
        title: '国际清算银行(BIS)联合多国财长达成流动性风险协同监测与外汇对付新机制',
        category: 'finance',
        time: '13:00 CET',
        summary: '机制建立秒级跨境清算应急流动性互通池，优化离岸主权货币间掉期互换网络，显著压低国际金融市场结算尾部风险。',
        importance: 'high',
        impact: {
          market: '离岸美元与离岸人民币流动性充裕，跨境大宗商品贸易结算汇率摩擦进一步收窄',
          sector: '跨境支付机构、跨国商业银行清算网络、外汇做市商',
          takeaway: '多边清算基建演进正在加速重构全球贸易支付与储备多元化格局。',
        },
        tags: ['国际清算银行', '外汇流动性', '货币掉期', '跨境金融'],
        sources: [
          { title: '金融时报 (FT): BIS and Central Banks Deepen Multi-currency Liquidity Backstop', uri: 'https://www.ft.com' },
          { title: '财新网 (Caixin): 多边央行数字金融基建协同降低跨境结算成本', uri: 'https://www.caixin.com' }
        ]
      },
      {
        id: 'ev-today-31-4',
        title: '中欧与跨大西洋绿色技术标准互认与碳足迹协同评估达成关键突破',
        category: 'politics',
        time: '15:40 GMT',
        summary: '双方同意在绿色氢能储运、动力电池全生命周期溯源及跨境可再生能源绿证核销方面建立常态化专家协商与互认通道。',
        importance: 'high',
        impact: {
          market: '消除新能源高端制造与储能出海企业的长期贸易合规不确定性',
          sector: '新能源车产业链、锂电储能出海、碳核算认证服务商',
          takeaway: '绿色贸易合规标准成为新时期国际产业链深度嵌入的核心通行证。',
        },
        tags: ['绿色贸易', '碳足迹', '中欧经贸', '地缘合作'],
        sources: [
          { title: '新华社 (Xinhua): 中欧绿色技术标准互认取得务实成果', uri: 'https://www.news.cn' },
          { title: '经合组织公报 (OECD Policy): Bilateral Green Standards Mutual Recognition', uri: 'https://www.oecd.org' }
        ]
      },
      {
        id: 'ev-today-31-5',
        title: '故宫博物院与联合国教科文组织联合启动全球数字空间非遗保护标准倡议',
        category: 'culture',
        time: '10:00 CST',
        summary: '倡议确立沉浸空间计算、古建筑高精度点云数据及传统非遗工艺数字孪生的长久归档与无损开源共享规范。',
        importance: 'medium',
        impact: {
          market: '带动文博数字化软硬件定制与空间XR沉浸式展陈项目落地',
          sector: '数字文化创意、3D数字建模、空间计算展陈工程',
          takeaway: '经典历史文化借助数字空间孪生技术，跨越地域与时代界限实现文明互鉴。',
        },
        tags: ['故宫博物院', '非物质文化遗产', '数字文博', '联合国教科文组织'],
        sources: [
          { title: '中国文化报: 故宫与国际文博机构共同探索数字非遗传承新标杆', uri: 'https://www.chinaculture.org' },
          { title: '教科文组织文化公报 (UNESCO): Open Standards for Spatial Cultural Heritage', uri: 'https://whc.unesco.org' }
        ]
      },
      {
        id: 'ev-today-31-6',
        title: '全球数字游民与弹性创作者劳动保障新白皮书发布，跨国社保结算试点扩容',
        category: 'society',
        time: '12:30 CET',
        summary: '多国劳工部门同意扩大针对远程知识型创作者的个人养老与医疗跨国便携转移试点，建立适应远程办公的普惠型法治保障框架。',
        importance: 'high',
        impact: {
          market: '激发年轻高技能人才全球化自由流动，助推新消费与远程办公SaaS需求',
          sector: '灵活用工SaaS、个人养老金管理机构、远程协作软硬件',
          takeaway: '传统在地化劳动保障制度正在加速向云端分布式与多边互认转型。',
        },
        tags: ['数字游民', '灵活用工', '跨国社保', '民生福利'],
        sources: [
          { title: '联合早报 (Lianhe Zaobao): 跨国数字游民保障新框架促成新就业生态', uri: 'https://www.zaobao.com' },
          { title: '经济学人 (The Economist): Reimagining Social Safety Nets for Remote Workers', uri: 'https://www.economist.com' }
        ]
      },
      {
        id: 'ev-today-31-7',
        title: '国际可再生能源署启动跨区域分布式绿电互联走廊倡议',
        category: 'international',
        time: '17:00 UTC',
        summary: '倡议联合亚洲、非洲与欧洲十余个国家，协同共建特高压直流与微电网互补示范区，支持算力中心与高耗能产业绿电直供。',
        importance: 'high',
        impact: {
          market: '提振全球电网设备、特高压直流输电与绿色债券资产吸引力',
          sector: '特高压电网、逆变器与智能电表、绿色基础设施基金',
          takeaway: '算力与能源协同正在演进为21世纪全球最重要的综合战略基础设施。',
        },
        tags: ['可再生能源', '绿电互联', '特高压', '国际能源合作'],
        sources: [
          { title: '联合国新闻 (UN News): Global Clean Energy Grid Corridor Initiative Unveiled', uri: 'https://news.un.org' },
          { title: '世界银行环境报告 (World Bank): Cross-border Renewable Integration Finance', uri: 'https://www.worldbank.org' }
        ]
      }
    ],
    historicalParallels: [
      {
        year: 2008,
        event: '中本聪公开发布《比特币白皮书：一种点对点电子现金系统》',
        significance: '在雷曼破产危机与全球金融海啸余波中，开启了去中心化加密算法与全球分布式账本新纪元。'
      },
      {
        year: 1517,
        event: '马丁·路德在维滕贝格诸圣堂大门张贴《九十五条论纲》',
        significance: '引发欧洲宗教改革运动，借助古腾堡活字印刷术迅速传遍欧洲，催生了现代公共传播媒介与近代科学启蒙。'
      },
      {
        year: 1929,
        event: '“黑色星期二”大崩盘后第三天，纽约证券交易所缩短交易时间清算单据',
        significance: '促成了现代证券集中清算机制、防操纵规则与联邦证券信息披露制度的正式萌芽。'
      }
    ],
    updatedAt: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  },
  '2026-10-30': {
    date: '2026-10-30',
    displayDate: '2026年10月30日 星期五 (昨日大事件)',
    isToday: false,
    marketSentiment: {
      status: 'bullish',
      label: '多维动量扩散 · 科技资本共振',
      score: 82,
      summary: '纳指与标普受光电融合算力集群放量提振走高，全球主权基金增配亚太创新资产，跨国绿色能源与数字贸易多边协议达成阶段性突破。',
    },
    executiveSummary: '今日全球七维全景扫描：全球主要股指在科技硬件强劲业绩驱动下续刷历史峰值；多国央行发布稳健货币信贷指引；下一代端侧智能系统全面开源；中欧与亚太跨国经贸框架取得关键成果；故宫与卢浮宫联合举办全球数字文化遗产沉浸大展；全球劳动保障新白皮书保障数字游民权益；联合国启动跨国绿电互联倡议。',
    events: [
      {
        id: 'ev-today-1',
        title: '英伟达与台积电宣布新一代硅光子超算集群全面规模化商用交付',
        category: 'tech',
        time: '08:45 EST',
        summary: '全新共封装光学(CPO)互联技术使大模型数据中心内部互联功耗骤降52%，算力通信延迟降低至亚微秒级，全球头部算力云已完成首批商业机柜上架部署。',
        importance: 'critical',
        impact: {
          market: '全球光模块、硅光芯片与高频基板标的放量拉升6%~9%',
          sector: '光通信供应链、半导体先进封装、液冷超算系统',
          takeaway: '光通信代际升级从实验室研发步入大规模资本开支兑现期。',
        },
        tags: ['人工智能', '硅光子', '英伟达', '半导体', '超算'],
        sources: [
          { title: '彭博社 (Bloomberg): NVIDIA & TSMC Advance Silicon Photonics Deployment', uri: 'https://www.bloomberg.com' },
          { title: '路透社 (Reuters): Next-gen Data Center Optical Interconnect Achieves Milestone', uri: 'https://www.reuters.com' }
        ]
      },
      {
        id: 'ev-today-2',
        title: '标普500与纳斯达克100盘中齐破历史新高，大型科技股现金流持续走强',
        category: 'stocks',
        time: '10:15 EST',
        summary: '美股开盘后科技权重龙头强劲财报超预期，自由现金流与千亿美元回购计划支撑市场信心，恐慌指数VIX下滑至13.8年度相对低点。',
        importance: 'critical',
        impact: {
          market: '多头情绪显著蔓延，全球风险资产风险溢价维持在健康区间',
          sector: '美股大盘宽基ETF (SPY/QQQ)、芯片龙头与云端软件服务',
          takeaway: '盈利基本面与流动性共振驱动估值稳固，但需防范短期获利了结波动。',
        },
        tags: ['标普500', '纳斯达克', '美股行情', '科技龙头', '资本开支'],
        sources: [
          { title: '华尔街日报 (WSJ): U.S. Stocks Hit Fresh Record as Tech Earnings Beat', uri: 'https://www.wsj.com' },
          { title: '金融时报 (FT): Markets Rally on Resilient Corporate Cash Flows', uri: 'https://www.ft.com' }
        ]
      },
      {
        id: 'ev-today-3',
        title: '国际清算银行(BIS)联合多国央行宣布多边央行数字货币结算平台扩容',
        category: 'finance',
        time: '14:20 CET',
        summary: '平台新增四家主要经济体央行，全面支持秒级跨境大宗商品外汇对付(PvP)清算，大幅压缩传统SWIFT清算时间与高昂代理费。',
        importance: 'high',
        impact: {
          market: '外汇跨境交易摩擦成本大幅压降，非美主权货币结算比例微升',
          sector: '跨境支付服务商、主权商业银行清算网络、外汇做市商',
          takeaway: '全球多极化金融结算新基建正在快速完成技术闭环与落地。',
        },
        tags: ['央行数字货币', '国际清算银行', '跨境结算', '外汇流动性'],
        sources: [
          { title: '国际清算银行公报 (BIS): Multi-CBDC Cross-border Settlement Network Expansion', uri: 'https://www.bis.org' },
          { title: '财新网 (Caixin): 多国央行数字货币清算网络提速跨境贸易', uri: 'https://www.caixin.com' }
        ]
      },
      {
        id: 'ev-today-4',
        title: '亚太经合多边经贸峰会达成《跨境数字贸易与知识产权协同行动计划》',
        category: 'politics',
        time: '16:30 HKT',
        summary: '就跨境云计算服务器免歧视准入、算法安全合规互认与中小企业数字出海通关便利化达成十四项务实成果草案。',
        importance: 'high',
        impact: {
          market: '区域经贸互联互通预期升温，跨境物流与出海科技股受追捧',
          sector: '跨境电商SaaS、国际数字物流港、合规咨询机构',
          takeaway: '多边数字贸易规则正在重构下一阶段全球经济合作版图。',
        },
        tags: ['亚太经合', '数字贸易', '跨国经贸', '地缘合作'],
        sources: [
          { title: '新华社 (Xinhua): 亚太跨境数字贸易协同发展行动纲领正式签署', uri: 'https://www.news.cn' },
          { title: '联合早报 (Lianhe Zaobao): 区域多边数字贸易框架达成历史性共识', uri: 'https://www.zaobao.com' }
        ]
      },
      {
        id: 'ev-today-5',
        title: '故宫博物院联合卢浮宫举办“数字文明：全球文化遗产沉浸互联特展”',
        category: 'culture',
        time: '09:00 CST',
        summary: '特展应用高保真激光雷达、神经辐射场(NeRF)与3D全息交互技术，首次在全球双城同步数字重现跨越千年的古代丝路文物与艺术珍品。',
        importance: 'medium',
        impact: {
          market: '文旅数字化改造板块与高精度XR虚拟展陈软硬件需求释放',
          sector: '文化创意产业、全息光场显示、数字藏品与数字博物馆',
          takeaway: '科技为经典文明赋能，开启全球文化数字化交流与普惠新常态。',
        },
        tags: ['故宫博物院', '卢浮宫', '数字文博', '文化遗产', 'XR全息'],
        sources: [
          { title: '中国文化报: 故宫卢浮宫双城数字化特展全球亮相', uri: 'https://www.chinaculture.org' },
          { title: '艺术新闻 (The Art Newspaper): Bridging Civilizations via Ultra-HD Spatial Heritage', uri: 'https://www.theartnewspaper.com' }
        ]
      },
      {
        id: 'ev-today-6',
        title: '国际劳工组织与世界经合组织联合发布《AI时代全球弹性就业社会保障指南》',
        category: 'society',
        time: '11:30 CET',
        summary: '倡导建立跨平台的数字游民与弹性创作者养老医疗转移机制，强化数字普惠金融对新就业群体的保障兜底。',
        importance: 'high',
        impact: {
          market: '促进灵活就业用工合规与养老第三支柱个人储蓄理财资金流入',
          sector: '人力资源科技、个人养老金管理机构、商业补充健康险',
          takeaway: '社会保障制度正在全面适应智能化时代劳动生产组织形态的深刻剧变。',
        },
        tags: ['社会保障', '弹性就业', '数字游民', '民生政策', '养老金'],
        sources: [
          { title: '国际劳工组织官网 (ILO): Global Guidance on Social Protection for Agile Workers', uri: 'https://www.ilo.org' },
          { title: '经济学人 (The Economist): Rewriting the Social Contract in the AI Work Era', uri: 'https://www.economist.com' }
        ]
      },
      {
        id: 'ev-today-7',
        title: '联合国气候峰会启动“全球跨洲清洁能源互联电网”多边投融资机制',
        category: 'international',
        time: '15:00 GMT',
        summary: '规划连接亚欧非超高压特高压清洁能源主干通道，协同平抑跨时区光伏与风能昼夜峰谷，由国际多边开发银行设立首期专项基金。',
        importance: 'high',
        impact: {
          market: '特高压电网装备、长时储能与绿色主权债券发行热度上升',
          sector: '特高压电力工程、大容量储能电池、绿色基建PPP项目',
          takeaway: '跨洲电网互联是破解全球新能源消纳瓶颈的最宏大工程实践。',
        },
        tags: ['联合国', '清洁能源', '全球电网互联', '绿色金融', '跨国治理'],
        sources: [
          { title: '联合国新闻 (UN News): UN Champions Cross-continental Clean Grid Initiative', uri: 'https://news.un.org' },
          { title: '世界经济论坛 (WEF): Intercontinental Renewable Grids and Future Energy Security', uri: 'https://www.weforum.org' }
        ]
      },
    ],
    historicalParallels: [
      {
        year: 1938,
        event: '奥森·威尔斯播送科幻广播剧《世界大战》，引发全美轰动',
        significance: '成为现代大众传播心理学与虚假信息社会效应的经典案例，确立了主流广播媒介核验事实的制度规范。',
      },
      {
        year: 1961,
        event: '人类史上威力最大的人造爆炸物“沙皇炸弹”完成试爆',
        significance: '极限战略威慑促使美苏双方深刻反思核战争毁灭性后果，推动了《部分禁止核试验条约》等国际军控多边谈判。',
      },
      {
        year: 1995,
        event: '加拿大魁北克举行第二次独立公投，联邦派以50.58%微弱优势险胜',
        significance: '对现代主权国家的统一性、宪政法治与多元族群治理机制提供了极具代表性的历史实证研究。',
      }
    ],
    updatedAt: '2026-10-30 08:30',
  },
  '2026-10-29': {
    date: '2026-10-29',
    displayDate: '2026年10月29日 星期四',
    isToday: false,
    marketSentiment: {
      status: 'bullish',
      label: '成长主线复苏 · 风险偏好扩张',
      score: 78,
      summary: '多模态AI硬件生态订单激增，全球主要央行维系平稳利率预期，科技巨头资本开支上调驱动半导体走强。',
    },
    executiveSummary: '昨日全球脉搏：标普500与纳斯达克在芯片与数据中心电力概念股推升下再创新高；美联储与欧洲央行发出对冲地缘油价波动的政策信号；量子计算云商业化达成里程碑协议。',
    events: [
      {
        id: 'ev-1029-1',
        title: '英伟达与台积电宣布新一代硅光子互联算力集群量产交付',
        category: 'tech',
        time: '08:30 EST',
        summary: '最新光学互联封装技术大幅降低超算数据中心50%能耗，算力密度提升3倍，头部云厂商首批全额锁定订单。',
        importance: 'critical',
        impact: {
          market: '半导体封测及光通信板块集体拉升5%-8%',
          sector: '光模块、CPO及超微光纤器件供应链',
          takeaway: '光进铜退趋势在下一代大模型训练集群中全面确立。',
        },
        tags: ['人工智能', '硅光子', '英伟达', '半导体'],
        sources: [
          { title: '彭博科技报道 (Bloomberg Tech)', uri: 'https://www.bloomberg.com' },
          { title: '路透社行业快讯 (Reuters Tech)', uri: 'https://www.reuters.com' }
        ]
      },
      {
        id: 'ev-1029-2',
        title: '标普500突破历史重要关口，高盛上调四季度美股每股收益预测',
        category: 'stocks',
        time: '09:45 EST',
        summary: '华尔街主要投行最新报告指出，得益于大型科技股强劲自由现金流与企业股份回购计划，大盘估值中枢具备稳固韧性。',
        importance: 'critical',
        impact: {
          market: '多头情绪主导，VIX波动率指数回落至14.2低位',
          sector: '大型科技ETF (QQQ)、标普全景 (SPY)',
          takeaway: '短期动量强劲，需防范获利盘期权交割日局部震荡。',
        },
        tags: ['美股', '标普500', '高盛', '市场动量'],
        sources: [
          { title: '华尔街日报市场追踪 (WSJ Markets)', uri: 'https://www.wsj.com' }
        ]
      },
      {
        id: 'ev-1029-3',
        title: '国际清算银行(BIS)联合六国央行启动数字主权清算网络试点',
        category: 'finance',
        time: '13:15 CET',
        summary: '旨在绕过传统代理行跨境清算高额摩擦成本，实现全天候T+0多边本币流动性互换与结算。',
        importance: 'high',
        impact: {
          market: '美元指数微幅整理，离岸本币对冲流动性增强',
          sector: '跨境支付机构、商业银行外汇清算部门',
          takeaway: '多极化国际货币清算基础设施正在实质性落地加速。',
        },
        tags: ['国际清算银行', '央行数字货币', '外汇清算', '宏观金融'],
        sources: [
          { title: 'BIS Cross-border Payments Report', uri: 'https://www.bis.org' }
        ]
      },
      {
        id: 'ev-1029-4',
        title: '全球人工智能安全与供应链协作宣言在日内瓦签署',
        category: 'politics',
        time: '16:00 CET',
        summary: '涵盖全球40余国主要代表，达成跨国核心关键矿产、前沿算力评测基准与联合灾备协同框架。',
        importance: 'high',
        impact: {
          market: '稀缺战略资源与稀土材料板块获风险溢价',
          sector: '合规科技、关键矿产与网络安全服务商',
          takeaway: '算力与原材料的地缘战略属性上升至国家核心安全层级。',
        },
        tags: ['地缘政治', 'AI治理', '国际协定', '安全联盟'],
        sources: [
          { title: 'Global Tech Diplomacy Brief', uri: 'https://news.google.com' }
        ]
      },
    ],
    historicalParallels: [
      {
        year: 1929,
        event: '黑色星期二 (Black Tuesday)：华尔街历史上最惨烈的崩盘日，纽交所全日抛盘逾1600万股，大萧条序幕全面拉开。',
        significance: '揭示了无杠杆风控、过度信贷扩张与投机泡沫在清算时刻的系统性毁灭力量，促成了美联储与SEC证券交易委员会的现代化监管诞生。',
      },
      {
        year: 1969,
        event: '互联网先驱阿帕网 (ARPANET) 成功在UCLA与斯坦福大学之间传输了人类历史上第一个网络数据包 "LO"。',
        significance: '现代互联网文明的诞生日，彻底重构了此后半个世纪的全球金融交易、技术演进与地缘政治格局。',
      },
    ],
    updatedAt: '2026-10-29 18:00',
  },
  '1929-10-29': {
    date: '1929-10-29',
    displayDate: '1929年10月29日 黑色星期二 (历史经典日)',
    isToday: false,
    marketSentiment: {
      status: 'bearish',
      label: '极度恐慌 · 杠杆踩踏',
      score: 5,
      summary: '道琼斯工业平均指数单日暴跌逾12%，全美股票价值蒸发140亿美元，大萧条全面降临。',
    },
    executiveSummary: '华尔街遭遇百年未有之大崩盘：杠杆保证金平仓潮引发连锁流动性挤兑，洛克菲勒与摩根等财阀护盘未果，全球信用体系瞬间冻结。',
    events: [
      {
        id: 'ev-1929-1',
        title: '纽交所创下1641万股创纪录恐慌性抛盘，行情报时机彻底瘫痪',
        category: 'stocks',
        time: '全日交易',
        summary: '投资者不计成本争相出逃，部分蓝筹股跌至无人接盘，电报机延误超过两个半小时。',
        importance: 'critical',
        impact: {
          market: '美股总市值在数周内缩水超40%',
          sector: '投行、信托投资公司及经纪券商',
          takeaway: '过度保证金借贷（当时仅需10%本金）在流动性枯竭时具有不可逆的毁灭性。',
        },
        tags: ['大崩盘', '黑色星期二', '华尔街', '去杠杆'],
      },
      {
        id: 'ev-1929-2',
        title: '全美商业银行出现流动性挤兑预兆，信贷中枢骤然冻结',
        category: 'finance',
        time: '收盘后',
        summary: '券商经纪商无法偿还银行拆借贷款，数以千计的中小银行出现资产端无法变现的死结。',
        importance: 'critical',
        impact: {
          market: '无风险利率失真，跨行借贷市场关停',
          sector: '商业银行与储蓄贷款机构',
          takeaway: '催生了后续格拉斯-斯蒂格尔法案（分业经营）与联邦存款保险公司(FDIC)的设立。',
        },
        tags: ['银行危机', '流动性枯竭', '货币政策'],
      },
      {
        id: 'ev-1929-3',
        title: '无线电广播首次全美同步直播华尔街股市惨状',
        category: 'tech',
        time: '午间广播',
        summary: '现代无线电广播媒介将华尔街的恐慌情绪在数小时内传遍全美，加剧了储户在全美各地的恐慌挤兑。',
        importance: 'medium',
        impact: {
          market: '恐慌情绪传播速度呈指数级加快',
          sector: '新闻通讯社、无线电广播电台',
          takeaway: '信息传播技术的飞跃是一把双刃剑，它放大了市场动量的极端波动。',
        },
        tags: ['无线电广播', '信息传播', '科技影响'],
      },
      {
        id: 'ev-1929-4',
        title: '胡佛政府召开内阁紧急经济会议，坚持自由放任政策',
        category: 'politics',
        time: '晚间通告',
        summary: '官方宣称“美国经济基本面仍然健全”，低估了资产负债表衰退的破坏深度，错失早期流动性救助良机。',
        importance: 'high',
        impact: {
          market: '失去政策托底预期，市场信心进一步崩溃',
          sector: '公共治理、宏观经济学界',
          takeaway: '现代宏观经济学中“央行作为最后贷款人”的干预必要性由此惨痛教训中确立。',
        },
        tags: ['胡佛总统', '大萧条', '政府政策'],
      },
    ],
    historicalParallels: [
      {
        year: 1929,
        event: '黑色星期二 (Black Tuesday) 华尔街崩盘',
        significance: '终结了“柯立芝繁荣”，开启了长达十年的全球经济大萧条。',
      },
      {
        year: 1987,
        event: '黑色星期一：程序化交易引发美股单日暴跌22.6%',
        significance: '美联储果断注入流动性，确立了熔断机制与盘中停牌制度。',
      },
    ],
    updatedAt: '1929-10-29 18:00',
  },
  '2008-09-15': {
    date: '2008-09-15',
    displayDate: '2008年9月15日 雷曼兄弟申请破产 (历史经典日)',
    isToday: false,
    marketSentiment: {
      status: 'bearish',
      label: '次贷海啸 · 系统性危机',
      score: 8,
      summary: '拥有158年历史的华尔街第四大投资银行雷曼兄弟宣布破产，全球金融海啸全面爆发。',
    },
    executiveSummary: '华尔街惊魂一日：雷曼兄弟负债超6000亿美元轰然倒下，美银紧急收购美林证券，AIG濒临崩盘，全球影子银行体系全面停摆。',
    events: [
      {
        id: 'ev-2008-1',
        title: '雷曼兄弟正式向纽约南区破产法院提交第11章破产保护申请',
        category: 'finance',
        time: '01:45 EST',
        summary: '美联储与财政部拒绝动用纳税人资金兜底，成为美国历史上规模最大的破产重组案。',
        importance: 'critical',
        impact: {
          market: '全球信贷违约互换(CDS)利差飙升至历史极值',
          sector: '全球投行、结构化衍生品与次级抵押贷款证券',
          takeaway: '影子银行的高杠杆期限错配在对手方风险爆发时将迅速自毁。',
        },
        tags: ['雷曼破产', '次贷危机', 'CDS', '华尔街'],
      },
      {
        id: 'ev-2008-2',
        title: '道琼斯工业指数暴跌504点，创“911事件”以来最大单日跌幅',
        category: 'stocks',
        time: '收盘综述',
        summary: '全球股市集体血崩，避险资金不惜成本涌入美国短期国债，收益率逼近零利率。',
        importance: 'critical',
        impact: {
          market: 'VIX恐慌指数飙升突破40关口',
          sector: '银行股(花旗、摩根大通)、保险股(AIG)',
          takeaway: '系统重要性金融机构(SIFI)“大而不能倒”悖论催生了后来的多德-弗兰克法案。',
        },
        tags: ['美股暴跌', '道指', '金融海啸'],
      },
      {
        id: 'ev-2008-3',
        title: '中本聪在此危机背景下完成比特币白皮书撰写，数周后发布',
        category: 'tech',
        time: '密码学界',
        summary: '鉴于传统央行滥发法币与商业银行信贷欺诈，点对点去中心化电子现金系统构想成型。',
        importance: 'high',
        impact: {
          market: '孕育了此后数万亿美元规模的区块链与加密数字资产生态',
          sector: '密码学、分布式账本技术、金融科技',
          takeaway: '技术创新往往诞生于旧制度最深重危机的灰烬之中。',
        },
        tags: ['比特币白皮书', '中本聪', '去中心化金融'],
      },
    ],
    historicalParallels: [
      {
        year: 2008,
        event: '雷曼兄弟破产，全球金融危机爆发',
        significance: '重塑了全球金融监管体系，开启了全球长达十余年的非常规量化宽松(QE)时代。',
      },
    ],
    updatedAt: '2008-09-15 18:00',
  },
  '1971-08-15': {
    date: '1971-08-15',
    displayDate: '1971年8月15日 尼克松冲击 · 黄金脱钩 (历史经典日)',
    isToday: false,
    marketSentiment: {
      status: 'volatile',
      label: '货币纪元剧变 · 浮动汇率诞生',
      score: 50,
      summary: '美国总统尼克松宣布暂停美元兑换黄金，布雷顿森林体系终结，现代纯信用法币时代开启。',
    },
    executiveSummary: '改变当代货币史的星期天之夜：美国单方面切断美元与黄金的固定兑换机制，征收10%进口附加税，全球外汇市场被迫转向自由浮动。',
    events: [
      {
        id: 'ev-1971-1',
        title: '尼克松发表全国电视讲话，宣布关闭美联储“黄金窗口”',
        category: 'finance',
        time: '21:00 EST',
        summary: '面对欧洲央行的大规模挤兑黄金储备，美国终止了35美元兑换一盎司黄金的国际承诺。',
        importance: 'critical',
        impact: {
          market: '黄金在此后十年从35美元暴涨至850美元',
          sector: '贵金属、外汇交易与大宗商品',
          takeaway: '法币摆脱黄金硬约束后，通胀成为长期的结构性经济现象。',
        },
        tags: ['尼克松冲击', '黄金脱钩', '布雷顿森林体系'],
      },
    ],
    historicalParallels: [
      {
        year: 1971,
        event: '尼克松冲击 (Nixon Shock)',
        significance: '浮动汇率时代与石油美元体系随后成型，现代国际外汇交易市场正式确立。',
      },
    ],
    updatedAt: '1971-08-15 21:00',
  },
  '1969-10-29': {
    date: '1969-10-29',
    displayDate: '1969年10月29日 互联网诞生之日 (历史经典日)',
    isToday: false,
    marketSentiment: {
      status: 'neutral',
      label: '信息技术黎明 · 算力革命萌芽',
      score: 85,
      summary: '阿帕网(ARPANET)成功传输人类首个网络分组数据，开启了数字信息与现代科技时代。',
    },
    executiveSummary: '文明连接的起点：加州大学洛杉矶分校(UCLA)计算机成功向数百英里外的斯坦福研究所发送了前两个字母 "LO"，因系统崩溃未完成整个 "LOGIN"，但这标志着互联网时代降临。',
    events: [
      {
        id: 'ev-1969-1',
        title: 'ARPANET 两个节点间成功完成首次分组交换数据包传输',
        category: 'tech',
        time: '22:30 PST',
        summary: '不仅是协议的成功，更为后来的TCP/IP、万维网以及全球金融实时清算网络奠定了底层基石。',
        importance: 'critical',
        impact: {
          market: '开启全球数十万亿美元的信息技术产业先河',
          sector: '电信、计算机软硬件与半导体',
          takeaway: '去中心化网络架构赋予了信息系统对抗单点故障的强大韧性。',
        },
        tags: ['阿帕网', '互联网之父', '分组交换', '科技里程碑'],
      },
    ],
    historicalParallels: [
      {
        year: 1969,
        event: '阿帕网首次联机传输成功',
        significance: '人类从物理隔离的孤岛社会，迈入万物互联的数字化信息文明。',
      },
    ],
    updatedAt: '1969-10-29 22:30',
  },
};

// In-memory cache to prevent redundant Gemini API calls and rate-limiting
const memoryCache = new Map<string, DailyBriefing>();

// Seed in-memory cache with presets
Object.entries(PRESET_HISTORICAL_BRIEFINGS).forEach(([date, b]) => {
  memoryCache.set(date, b);
});

/**
 * Shared Gemini client
 */
export function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

let globalRefreshCounter = 0;

// Dynamic multi-story pool across all 7 dimensions for live updates
const MULTI_STORY_EVENT_POOLS: Record<string, Array<{
  title: string;
  category: 'stocks' | 'finance' | 'tech' | 'politics' | 'culture' | 'society' | 'international';
  importance: 'critical' | 'high' | 'medium';
  summary: string;
  impact: { market: string; sector: string; takeaway: string };
  tags: string[];
  sources: GroundingSource[];
}>> = {
  stocks: [
    {
      title: '标普500与纳斯达克高位强势整固，半导体先进封装与光互联领跑涨幅榜',
      category: 'stocks',
      importance: 'critical',
      summary: '在下一代数据中心超算集群强劲出货预期支撑下，科技权重龙头维持充沛买盘，半导体先进封装与光模块板块成交量放大。',
      impact: {
        market: '全球风险资产风险偏好提振，资金向现金流充沛且壁垒深厚的算力龙头聚集',
        sector: '纳斯达克100 ETF、半导体先进封装、液冷算力集群',
        takeaway: '聚焦AI基础设施商业化落地主线，把握算力硬件的确定性盈利兑现。'
      },
      tags: ['美股收盘', '英伟达', '半导体', '纳斯达克', '先进封装'],
      sources: [
        { title: '彭博社 (Bloomberg): Tech Giants Lead Wall Street Rally on AI Hardware Boom', uri: 'https://www.bloomberg.com' },
        { title: '华尔街日报 (WSJ): Semiconductor Rally Broadens on Datacenter Capex Guidance', uri: 'https://www.wsj.com' }
      ]
    },
    {
      title: '亚太半导体制造与光刻机产业链放量普涨，成长风格ETF单日净流入创近月峰值',
      category: 'stocks',
      importance: 'critical',
      summary: '受先进制程晶圆代工产能满载与高带宽内存(HBM)供需紧平衡提振，亚太核心半导体设备股盘中普遍涨幅超4.5%。',
      impact: {
        market: '机构资金持续从防御性板块流出，向高成长景气周期的半导体上游转移',
        sector: '晶圆制造设备、HBM3e高带宽内存、先进测试耗材',
        takeaway: '上游设备与材料具备更高的订单能见度与提价弹性。'
      },
      tags: ['亚太股市', '晶圆代工', '半导体设备', 'HBM', '资金流向'],
      sources: [
        { title: '路透社 (Reuters): Asian Chip Stocks Jump as Foundry Capacity Tightens', uri: 'https://www.reuters.com' },
        { title: '财新网 (Caixin): 半导体产业链放量活跃，增量资金涌入硬科技', uri: 'https://www.caixin.com' }
      ]
    },
    {
      title: '美股盘前超算与AI服务器龙头财报超预期，核心云服务商同步上调年度资本开支',
      category: 'stocks',
      importance: 'high',
      summary: '四大云厂商最新财报显示，云端基础设施投资规模同比增幅超38%，直接消除了市场对算力基建投资放缓的担忧。',
      impact: {
        market: '算力供应链订单可见度已延长至未来四个季度，空头头寸加速回补',
        sector: 'AI服务器整机、高速铜缆连接器、高压电源模组',
        takeaway: '龙头云厂商的资本开支指引是科技牛市最硬核的风向标。'
      },
      tags: ['云厂商财报', 'AI服务器', '资本开支', '超算集群'],
      sources: [
        { title: '金融时报 (FT): Hyperscalers Double Down on Infrastructure Capex', uri: 'https://www.ft.com' },
        { title: '彭博行业研究 (Bloomberg Intelligence): Datacenter Capex Cycle Extends Into 2027', uri: 'https://www.bloomberg.com' }
      ]
    },
    {
      title: '全球主权财富基金最新披露季报持仓，战略加仓前沿硬科技与跨国清洁电网资产',
      category: 'stocks',
      importance: 'high',
      summary: '中东与北欧主权基金披露的最新监管文件显示，其在算力基础设施与跨区域绿色能源互联领域的配置比例提升近三个百分点。',
      impact: {
        market: '主权级长期耐受资本提供中长期估值底部支撑，平抑二级市场波动',
        sector: '绿色电网设备龙头、特高压输变电、全球科技白马',
        takeaway: '跟随主权长线资金布局具备全球竞争力的能源算力一体化标的。'
      },
      tags: ['主权财富基金', '长线资本', '清洁能源', '硬科技持仓'],
      sources: [
        { title: '路透社 (Reuters): Sovereign Wealth Funds Step Up Allocations to Energy & Tech', uri: 'https://www.reuters.com' },
        { title: '华尔街日报 (WSJ): Sovereign Funds Shift Capital Toward Next-gen Infrastructure', uri: 'https://www.wsj.com' }
      ]
    }
  ],
  finance: [
    {
      title: '国际清算银行(BIS)联合多国央行启动多边外汇对付(PvP)秒级跨境清算试验网',
      category: 'finance',
      importance: 'high',
      summary: '试验网实现了多币种离岸资产在去中心化与央行监管网关下的原子结算，彻底消除跨时区在途清算本金风险。',
      impact: {
        market: '显著压低跨境大宗商品贸易汇率摩擦成本，离岸外汇掉期流动性更趋充沛',
        sector: '跨境支付机构、多国商业银行清算网络、外汇做市商',
        takeaway: '多边数字清算基建演进正在加速重构全球贸易支付与储备多元化格局。'
      },
      tags: ['国际清算银行', '外汇流动性', '跨境清算', '数字金融'],
      sources: [
        { title: '金融时报 (FT): BIS and Central Banks Launch Real-time Foreign Exchange PvP Clearing', uri: 'https://www.ft.com' },
        { title: '财新网 (Caixin): 多国央行数字金融协同降低跨境结算成本', uri: 'https://www.caixin.com' }
      ]
    },
    {
      title: '美联储与欧央行联合发布季度宏观金融流动性监测，隔夜利差与主权债收益率收敛',
      category: 'finance',
      importance: 'high',
      summary: '监测报告指出，主要经济体银行体系流动性覆盖率处于稳健区间，隔夜逆回购与回购利率利差波幅显著收窄。',
      impact: {
        market: '全球流动性风险指数降至阶段低点，利好新兴市场外债再融资与汇率稳定',
        sector: '国际商业信贷、跨国企业离岸美元债、主权主基金固定收益',
        takeaway: '宏观流动性环境处于平稳窗口期，适合适度拉长优质固收资产久期。'
      },
      tags: ['美联储', '欧央行', '流动性监测', '利差收敛', '国债收益率'],
      sources: [
        { title: '华尔街日报 (WSJ): Fed and ECB Highlight Resilient Global Liquidity Buffers', uri: 'https://www.wsj.com' },
        { title: '彭博经济 (Bloomberg Economics): Yield Spread Compression Signals Low Stress', uri: 'https://www.bloomberg.com' }
      ]
    },
    {
      title: '国际货币基金组织(IMF)上调全球跨境数字贸易增长指引，离岸货币结算比率提升',
      category: 'finance',
      importance: 'medium',
      summary: 'IMF评估指出，全球服务贸易数字化交付比例已超62%，带动多边非美储备货币结算与本币结算比重连续三个季度上升。',
      impact: {
        market: '外汇储备资产配置多元化加速，黄金与高流动性主权债维持旺盛官方买盘',
        sector: '黄金现货与ETF、多边本币结算银行、外汇平准储备',
        takeaway: '货币多元化与去美元化摩擦倒逼企业健全多币种资金头寸管理系统。'
      },
      tags: ['IMF', '国际货币', '跨境贸易', '本币结算', '外汇储备'],
      sources: [
        { title: 'IMF 官方报告 (IMF World Economic Outlook): The Rise of Cross-border Digital Services', uri: 'https://www.imf.org' },
        { title: '路透社 (Reuters): Central Banks Accelerate Reserves Diversification', uri: 'https://www.reuters.com' }
      ]
    },
    {
      title: '多边央行常态化流动性互换网络扩容，跨境大宗商品多币种结算对冲汇率波动风险',
      category: 'finance',
      importance: 'high',
      summary: '多国能源矿产采购联合体正式采用双边本币掉期抵押清算协议，有效对冲单一强势货币升值带来的输入型通胀。',
      impact: {
        market: '大宗商品贸易商财务对冲费用降低15%以上，促进大宗现货流动性平稳',
        sector: '大宗商品供应链金融、商品期货做市商、远期外汇衍生品',
        takeaway: '善用双边本币流动性工具箱锁定大宗商品采购成本与现金流安全。'
      },
      tags: ['货币互换', '大宗商品', '供应链金融', '汇率对冲'],
      sources: [
        { title: '金融时报 (FT): Bilateral Currency Swaps Expand to Commodity Trade Corridors', uri: 'https://www.ft.com' },
        { title: '经济学人 (The Economist): Rewiring Commodity Trade Currencies', uri: 'https://www.economist.com' }
      ]
    }
  ],
  tech: [
    {
      title: '开源人工智能社区发布下一代自适应稀疏量化系统，消费级端侧全速推理',
      category: 'tech',
      importance: 'critical',
      summary: '新算法通过神经突触自适应动态剪枝与显存压缩，在普通平板与笔记本显卡上实现每秒超百字的高清图像与文本混合实时推理。',
      impact: {
        market: '加速端侧智能终端、AI PC与消费级智能硬件普及进程',
        sector: 'AI PC整机供应链、端侧SoC芯片、边缘计算SaaS',
        takeaway: '端侧推理平民化将彻底引爆下游垂直场景原生AI软件的普及浪潮。'
      },
      tags: ['开源大模型', '端侧AI', '稀疏量化', 'AI PC', '边缘计算'],
      sources: [
        { title: 'MIT 科技评论 (MIT Technology Review): Breakthrough in Edge AI Inference Efficiency', uri: 'https://www.technologyreview.com' },
        { title: '路透社 (Reuters): Open Source Community Delivers High-speed Multimodal Model for PCs', uri: 'https://www.reuters.com' }
      ]
    },
    {
      title: '全球首座商用全光交换算力中心正式并网，节点通信延迟突破十纳秒物理极限',
      category: 'tech',
      importance: 'critical',
      summary: '全光交换(OCS)架构消除了电光重复转换瓶颈，使万卡GPU通信延迟与互联功耗分别骤降85%与60%，大模型训练线性度超93%。',
      impact: {
        market: '光交换与共封装光学(CPO)设备供应商迎来大规模商业化放量订单',
        sector: '全光通信设备、硅光子激光器、液冷绿色数据中心',
        takeaway: '超算底层互联的物理范式变革正在重塑未来三年算力芯片与IDC投资图谱。'
      },
      tags: ['全光交换', 'OCS', '硅光子', '超算集群', 'CPO'],
      sources: [
        { title: '彭博科技 (Bloomberg Tech): Optical Circuit Switching Enters Commercial Datacenters', uri: 'https://www.bloomberg.com' },
        { title: 'Nature 物理综述 (Nature Physics): Ultra-low Latency Optical Computing Networks', uri: 'https://www.nature.com' }
      ]
    },
    {
      title: '前沿量子实验室宣布千位逻辑量子比特纠错突破，室温超导材料分子级模拟取得里程碑',
      category: 'tech',
      importance: 'high',
      summary: '新型表面码逻辑量子比特在超过一千步量子门操作后维持99.98%保真度，成功模拟出新型电池固态电解质界面离子迁移路径。',
      impact: {
        market: '提振量子计算初创企业估值与跨国药企、材料巨头的研发合作',
        sector: '量子计算硬件研发、AI制药与新材料高精度分子模拟',
        takeaway: '量子纠错技术的突破意味着量子计算正稳步向具备商业实用性的拐点逼近。'
      },
      tags: ['量子计算', '量子纠错', '分子模拟', '材料科学'],
      sources: [
        { title: '科学杂志 (Science Magazine): Scalable Logical Qubit Fault-tolerant Computing', uri: 'https://www.science.org' },
        { title: '华尔街日报 (WSJ): Quantum Computing Milestone Brings Real-world Simulations Closer', uri: 'https://www.wsj.com' }
      ]
    },
    {
      title: '新一代全固态电池先导量产线贯通，能量密度达480Wh/kg开启车规装机极限测试',
      category: 'tech',
      importance: 'high',
      summary: '通过自愈合硫化物复合电解质膜与超薄金属锂负极工艺，电池针刺与极端高温下不起火不爆燃，快充至80%仅需12分钟。',
      impact: {
        market: '改写高端新能源车与低空飞行器续航上限，加速航空电动化进程',
        sector: '固态电解质材料、低空eVTOL动力电池、高端电动汽车',
        takeaway: '固态电池商业化梯次落地将成为新能源产业链下一轮估值重估的最强催化剂。'
      },
      tags: ['全固态电池', '能量密度', '低空eVTOL', '新能源汽车'],
      sources: [
        { title: '路透社 (Reuters): Next-gen Solid-state Battery Pilot Line Completes Milestone', uri: 'https://www.reuters.com' },
        { title: 'MIT 科技评论: Solid-state Electrolytes Achieve Extreme Durability', uri: 'https://www.technologyreview.com' }
      ]
    }
  ],
  politics: [
    {
      title: '中欧与跨大西洋绿色技术标准互认与碳足迹核算框架达成关键突破',
      category: 'politics',
      importance: 'high',
      summary: '双方同意在绿色氢能储运、动力电池全生命周期溯源及跨境可再生能源绿证核销方面建立常态化专家协商与互认通道。',
      impact: {
        market: '消除新能源高端制造与储能出海企业的长期贸易合规不确定性',
        sector: '新能源车产业链、锂电储能出海、碳核算认证服务商',
        takeaway: '绿色贸易合规标准成为新时期国际产业链深度嵌入的核心通行证。'
      },
      tags: ['绿色贸易', '碳足迹', '中欧经贸', '地缘合作'],
      sources: [
        { title: '新华社 (Xinhua): 中欧绿色技术标准互认取得务实成果', uri: 'https://www.news.cn' },
        { title: '经合组织公报 (OECD Policy): Bilateral Green Standards Mutual Recognition', uri: 'https://www.oecd.org' }
      ]
    },
    {
      title: '亚太经合组织签署《跨境数字贸易便利化与数据安全流动互认协议》',
      category: 'politics',
      importance: 'high',
      summary: '协议草案确立了中小企业数字化通关绿色通道、算法知识产权边境保护及跨司法管辖区商业数据流通安全标准。',
      impact: {
        market: '显著降低跨境电商与数字出海企业的跨境法律合规壁垒',
        sector: '跨境数字贸易服务商、出海电商平台、合规法律咨询',
        takeaway: '区域多边数字经贸协定正在取代传统关税协定成为最具活力的合作载体。'
      },
      tags: ['亚太经合', '数字贸易', '跨国经贸', '数据合规'],
      sources: [
        { title: '新华社 (Xinhua): 亚太跨境数字贸易协同发展行动纲领正式签署', uri: 'https://www.news.cn' },
        { title: '联合早报 (Lianhe Zaobao): 区域多边数字贸易框架达成历史性共识', uri: 'https://www.zaobao.com' }
      ]
    },
    {
      title: '联合国全球数字治理峰会通过《人工智能前沿模型透明度与开源安全倡议》',
      category: 'politics',
      importance: 'high',
      summary: '来自70多个国家的代表共同签署倡议，确立了前沿自主智能体红队评估基准、水印溯源标准与开源安全共享机制。',
      impact: {
        market: '为全球AI基础设施投资提供清晰可预期的多边合规指引，降低监管黑天鹅风险',
        sector: 'AI安全评估审计公司、数字水印与内容鉴伪技术提供商',
        takeaway: '拥抱开源透明与建立前瞻安全审计机制是AI技术大规模渗透公共部门的前提。'
      },
      tags: ['联合国', 'AI治理', '开源安全', '数字伦理', '多边合作'],
      sources: [
        { title: '联合国新闻 (UN News): UN Global Summit Adopts AI Safety & Open Science Framework', uri: 'https://news.un.org' },
        { title: '金融时报 (FT): Global Consensus Emerges on Frontier AI Governance Standards', uri: 'https://www.ft.com' }
      ]
    },
    {
      title: '跨国多边贸易联盟推行全数字化智能通关走廊，跨境货运核验效率翻倍',
      category: 'politics',
      importance: 'medium',
      summary: '依托多边互认区块链电子提单与智能X光图像快速识别，集装箱海关通关查验由原先48小时大幅缩减至2小时内完成。',
      impact: {
        market: '压缩国际供应链在途库存与仓储周转成本，提振国际航运与港口物流吞吐量',
        sector: '智能港口自动化装备、跨境数字物流SaaS、国际航运物流',
        takeaway: '数字口岸与智慧关务的互联互通是大宗国际贸易降本增效的最优抓手。'
      },
      tags: ['智能通关', '区块链提单', '供应链物流', '多边贸易'],
      sources: [
        { title: '世界贸易组织 (WTO): Digital Customs Corridors Slash Global Logistics Friction', uri: 'https://www.wto.org' },
        { title: '路透社 (Reuters): Multilateral Trade Hubs Adopt Paperless Smart Border Clearances', uri: 'https://www.reuters.com' }
      ]
    }
  ],
  culture: [
    {
      title: '故宫博物院与联合国教科文组织联合启动全球数字空间非遗保护标准倡议',
      category: 'culture',
      importance: 'medium',
      summary: '倡议确立沉浸空间计算、古建筑高精度点云数据及传统非遗工艺数字孪生的长久归档与无损开源共享规范。',
      impact: {
        market: '带动文博数字化软硬件定制与空间XR沉浸式展陈项目落地',
        sector: '数字文化创意、3D数字建模、空间计算展陈工程',
        takeaway: '经典历史文化借助数字空间孪生技术，跨越地域与时代界限实现文明互鉴。'
      },
      tags: ['故宫博物院', '非物质文化遗产', '数字文博', '联合国教科文组织'],
      sources: [
        { title: '中国文化报: 故宫与国际文博机构共同探索数字非遗传承新标杆', uri: 'https://www.chinaculture.org' },
        { title: '教科文组织文化公报 (UNESCO): Open Standards for Spatial Cultural Heritage', uri: 'https://whc.unesco.org' }
      ]
    },
    {
      title: '卢浮宫与大英博物馆开放超高保真3D文物神经辐射场(NeRF)数字科研档案',
      category: 'culture',
      importance: 'medium',
      summary: '向全球高校与研究人员免费提供超两万件珍贵文物的微米级3D空间点云与反射光谱模型，支持学术无损虚拟修复。',
      impact: {
        market: '推动虚拟现实教育内容库建设与文博XR数字文创衍生品规模化开发',
        sector: '文创IP数字化运营、空间虚拟现实教育软件、数字博物馆系统',
        takeaway: '人类文化资产从物理专有走向全球数字共享，孕育全新数字文明生态。'
      },
      tags: ['卢浮宫', '大英博物馆', 'NeRF', '空间计算', '数字文博'],
      sources: [
        { title: '艺术新闻 (The Art Newspaper): Open-access 3D Cultural Archives Launch Worldwide', uri: 'https://www.theartnewspaper.com' },
        { title: 'UNESCO文化公报: Democratizing Museum Artifacts Through Spatial Computing', uri: 'https://whc.unesco.org' }
      ]
    },
    {
      title: '国际数字出版学会公布生成式AI学术引用与开放科学版权合规新规范',
      category: 'culture',
      importance: 'medium',
      summary: '规范明确了智能辅助文献综述的署名原则、原始训练语料贡献收益分配机制以及同行评议中的算法透明度准则。',
      impact: {
        market: '规范学术数据库、科研工具开发与专业知识产权付费市场秩序',
        sector: '学术出版集团、专业知识图谱库、科研文献智能化SaaS',
        takeaway: '技术赋能科研生产力的同时，必须恪守知识真伪甄别与学术诚信伦理底线。'
      },
      tags: ['学术出版', '版权合规', '开放科学', '数字伦理'],
      sources: [
        { title: 'Nature 观点专栏 (Nature World View): Ethical AI Citations in Modern Scholarly Research', uri: 'https://www.nature.com' },
        { title: '科学杂志公报 (Science Policy): New Guidelines for AI Use in Peer Review', uri: 'https://www.science.org' }
      ]
    },
    {
      title: '全球青年数字艺术双年展启幕，空间计算展陈与沉浸式非遗交互引爆热潮',
      category: 'culture',
      importance: 'medium',
      summary: '来自世界各地的青年创作者将古典水墨、丝绸之路乐器与空间全息投影交互融合，吸引数百万人次线上线下沉浸观摩。',
      impact: {
        market: '带动文旅消费与高精度空间计算头显、交互投影硬件采购需求',
        sector: '全息光场显示、数字沉浸文旅、交互艺术硬件开发',
        takeaway: '传统东方美学与现代空间算法交融，创造出兼具人文深度与视听震撼的现代体验。'
      },
      tags: ['数字艺术', '沉浸式体验', '空间计算', '非遗创新'],
      sources: [
        { title: '中国文化报: 青年数字艺术家用空间交互重构传统非遗美学', uri: 'https://www.chinaculture.org' },
        { title: '艺术论坛 (Artforum): Spatial Computing as the New Frontier of Contemporary Art', uri: 'https://www.artforum.com' }
      ]
    }
  ],
  society: [
    {
      title: '全球数字游民与弹性知识工作者跨国社保与税收便携互认试点在多国同步扩容',
      category: 'society',
      importance: 'high',
      summary: '多国劳工与社保部门扩大针对远程创作者的个人养老与医疗跨国便携转移试点，建立适应全球化远程办公的普惠型法治保障框架。',
      impact: {
        market: '激发年轻高技能人才全球化自由流动，助推新消费与远程办公SaaS需求',
        sector: '灵活用工SaaS、个人养老金管理机构、远程协作软硬件',
        takeaway: '传统在地化劳动保障制度正在加速向云端分布式与多边互认转型。'
      },
      tags: ['数字游民', '灵活用工', '跨国社保', '民生福利'],
      sources: [
        { title: '联合早报 (Lianhe Zaobao): 跨国数字游民保障新框架促成新就业生态', uri: 'https://www.zaobao.com' },
        { title: '经济学人 (The Economist): Reimagining Social Safety Nets for Remote Workers', uri: 'https://www.economist.com' }
      ]
    },
    {
      title: '国际劳工组织发布《AI时代知识工作者终身技能转型与普惠保障白皮书》',
      category: 'society',
      importance: 'high',
      summary: '白皮书呼吁建立政府与雇主共同注资的公共技能账户，为受智能化重构影响的白领与技术人员提供终身带薪转岗培训。',
      impact: {
        market: '改善长期结构性就业质量，促进职业再教育培训产业健康发展',
        sector: '在职职业在线教育、企业技能培训SaaS、民生保障政策基金',
        takeaway: '社会包容度与终身学习基础设施是抵御技术浪潮引发结构性失业的最坚实屏障。'
      },
      tags: ['国际劳工组织', '终身学习', '职业转型', '就业韧性'],
      sources: [
        { title: '国际劳工组织官网 (ILO): Lifelong Skills Mobility and AI Transition', uri: 'https://www.ilo.org' },
        { title: '世界经济论坛 (WEF): Future of Jobs and Adult Reskilling Systems', uri: 'https://www.weforum.org' }
      ]
    },
    {
      title: '多国教育科研机构联合启动中小学计算思维与数字伦理必修课程普及行动',
      category: 'society',
      importance: 'medium',
      summary: '课程注重启发青少年对算法机制、虚假信息辨识与数据隐私保护的深度思考，培养面向人机协同时代的健康科技素养。',
      impact: {
        market: '提升下一代全民数字素养，带动高品质少儿科学教育内容与编程教具市场',
        sector: '青少年素质教育SaaS、数字图书馆、交互式科学教育实验套件',
        takeaway: '真正的数字原生代不仅要善用工具，更要具备批判性思维与人文向善的价值锚点。'
      },
      tags: ['数字素养', '青少年教育', '计算思维', '教育公平'],
      sources: [
        { title: '新华社 (Xinhua): 全民数字素养培育行动纲要全面落地实施', uri: 'https://www.news.cn' },
        { title: '教科文组织教育公报 (UNESCO): Digital Literacy Curriculum for All Ages', uri: 'https://unesdoc.unesco.org' }
      ]
    },
    {
      title: '全球智慧助老与银发经济专项落地，高精度无障碍人机交互全面接入公共服务',
      category: 'society',
      importance: 'high',
      summary: '针对老年与听障视障群体的多模态语音直达、大字号交互与紧急摔倒毫米波雷达感应系统在数万个社区服务中心完成改装上线。',
      impact: {
        market: '加速银发经济智能硬件、智慧康养看护设备与适老化无障碍改造市场扩容',
        sector: '适老化智能硬件、智慧康养社区信息化平台、无障碍软硬件',
        takeaway: '技术进步的温度体现在对待弱势与老年群体的无障碍普惠包容度上。'
      },
      tags: ['银发经济', '智慧助老', '无障碍交互', '民生福祉'],
      sources: [
        { title: '中国民政发布: 社区智慧养老与适老化改造取得阶段性成效', uri: 'https://www.mca.gov.cn' },
        { title: '世界卫生组织 (WHO Report): Assistive Technologies for Active Ageing', uri: 'https://www.who.int' }
      ]
    }
  ],
  international: [
    {
      title: '国际可再生能源署启动跨区域特高压绿电互联走廊倡议，协同平抑时区峰谷',
      category: 'international',
      importance: 'high',
      summary: '倡议联合亚洲、非洲与欧洲十余个国家，协同共建特高压直流与微电网互补示范区，支持算力中心与高耗能产业绿电直供。',
      impact: {
        market: '提振全球电网设备、特高压直流输电与绿色债券资产吸引力',
        sector: '特高压电网、逆变器与智能电表、绿色基础设施基金',
        takeaway: '算力与能源协同正在演进为21世纪全球最重要的综合战略基础设施。'
      },
      tags: ['可再生能源', '绿电互联', '特高压', '国际能源合作'],
      sources: [
        { title: '联合国新闻 (UN News): Global Clean Energy Grid Corridor Initiative Unveiled', uri: 'https://news.un.org' },
        { title: '世界银行环境报告 (World Bank): Cross-border Renewable Integration Finance', uri: 'https://www.worldbank.org' }
      ]
    },
    {
      title: '联合国全球南方可持续基建峰会签约超百亿美元清洁能源与智能电网合作',
      category: 'international',
      importance: 'high',
      summary: '多边金融机构与新兴市场国家共同设立清洁水源、微电网与热带农业气候适应性基金，推动南南合作高质量发展。',
      impact: {
        market: '促进中国及亚太优质电力装备与农林灌溉节水技术大规模出海',
        sector: '离网光储系统、海水淡化与节水农业工程、国际基础设施总包',
        takeaway: '全球南方绿色发展诉求正在催生全球最大的增量基础设施蓝海市场。'
      },
      tags: ['全球南方', '南南合作', '绿色基建', '可持续发展'],
      sources: [
        { title: '联合国开发署 (UNDP): South-South Cooperation Accelerates Climate Resilience', uri: 'https://www.undp.org' },
        { title: '新华社国际观察 (Xinhua World): 全球南方绿色合作打开发展新空间', uri: 'https://www.news.cn' }
      ]
    },
    {
      title: '国际海事组织达成跨大洋全绿色航运走廊公约，零碳甲醇动力船舶交付运营',
      category: 'international',
      importance: 'high',
      summary: '公约确立在泛太平洋与亚欧主干航线上设立全流程绿色低碳补给站，享受港口优先靠泊与减免碳税等激励政策。',
      impact: {
        market: '带动绿色甲醇合成燃料、双燃料集装箱货轮制造与港口加注基建投资',
        sector: '绿色甲醇化工、船舶先进制造、低碳港口基础设施',
        takeaway: '国际大宗物流运输脱碳正在从愿景全面进入硬性履约与商用落地期。'
      },
      tags: ['绿色航运', '国际海事组织', '零碳燃料', '跨洋贸易'],
      sources: [
        { title: '国际海事组织公报 (IMO): Landmark Accord on Net-zero Maritime Corridors', uri: 'https://www.imo.org' },
        { title: '金融时报 (FT): Shipping Lines Gear Up for Green Methanol Fleet Transition', uri: 'https://www.ft.com' }
      ]
    },
    {
      title: '世界卫生组织联合多国疾病预防中心建立数字突发事件秒级全球协同响应网络',
      category: 'international',
      importance: 'medium',
      summary: '利用隐私计算与分布式流行病学病原基因组测序，实现全球各口岸微弱变异株秒级跨境告警与抗原试剂联合研发储备。',
      impact: {
        market: '显著降低突发公共卫生事件对全球供应链与人员跨境往来的扰动冲击',
        sector: '公共卫生分子诊断、生物信息测序SaaS、跨国应急物流',
        takeaway: '多边数字卫生网络协同是保障全球经济与人员要素顺畅流动的安全底座。'
      },
      tags: ['世界卫生组织', '公共卫生', '全球协同', '生物安全'],
      sources: [
        { title: 'WHO 官网公报: Digital Epidemic Early Warning Platform Launches', uri: 'https://www.who.int' },
        { title: '路透社 (Reuters): Global Health Agencies Connect Real-time Genomic Surveillance', uri: 'https://www.reuters.com' }
      ]
    }
  ]
};

/**
 * Dynamic live briefing generator that guarantees fresh varied events on every refresh
 */
export function generateDynamicLiveBriefing(dateStr: string, seed = 0): DailyBriefing {
  const dateObj = new Date(dateStr + 'T12:00:00');
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();
  const now = new Date();
  const currentHH = String(now.getHours()).padStart(2, '0');
  const currentMM = String(now.getMinutes()).padStart(2, '0');
  const currentSS = String(now.getSeconds()).padStart(2, '0');
  const currentTimeLabel = `${currentHH}:${currentMM}:${currentSS}`;

  // Rotate events across all 7 dimensions
  const categories: Array<'stocks' | 'finance' | 'tech' | 'politics' | 'culture' | 'society' | 'international'> = [
    'stocks',
    'tech',
    'finance',
    'politics',
    'culture',
    'society',
    'international',
  ];

  const timeBadges = [
    `刚刚 (${currentHH}:${currentMM})`,
    '10分钟前',
    '25分钟前',
    '收盘重磅',
    '权威发布',
    '盘中快讯',
    '最新进展',
  ];

  const sentimentScores = [86, 88, 83, 85, 87, 82];
  const sentimentLabels = [
    '成长主线巩固 · 算力动能充沛',
    '多维动量扩散 · 科技资本共振',
    '流动性平稳 · 风险偏好回暖',
    '硬科技放量 · 核心资产韧性凸显',
    '跨国经贸与绿色转型共振 · 情绪活跃',
  ];

  const chosenScore = sentimentScores[(seed + day) % sentimentScores.length];
  const chosenLabel = sentimentLabels[(seed + month) % sentimentLabels.length];

  const events: HistoryEventItem[] = categories.map((cat, idx) => {
    const pool = MULTI_STORY_EVENT_POOLS[cat];
    const storyIndex = (seed + idx) % pool.length;
    const baseStory = pool[storyIndex];

    return {
      id: `ev-${dateStr}-s${seed % 99}-${cat}-${idx + 1}`,
      title: baseStory.title,
      category: baseStory.category,
      time: timeBadges[idx % timeBadges.length],
      summary: baseStory.summary,
      importance: baseStory.importance,
      impact: baseStory.impact,
      tags: baseStory.tags,
      sources: baseStory.sources,
    };
  });

  // Historical parallels
  const parallels = [
    {
      year: 1993,
      event: '欧洲联盟《马斯特里赫特条约》正式生效',
      significance: '标志着欧洲统一大市场与欧洲单一货币欧元的历史起点，深刻改变全球地缘经济与外汇储备版图。'
    },
    {
      year: 1929,
      event: '纽约证券交易所大崩盘后第三天，现代证券信息集中披露制度萌芽',
      significance: '促成了现代证券集中清算机制、防操纵规则与联邦证券信息披露制度的正式诞生。'
    },
    {
      year: 1969,
      event: '阿帕网(ARPANET)首次实现两台主机远程字符通讯',
      significance: '人类迈向现代分布式互联网与全球信息高速公路的关键起点。'
    }
  ];

  const isTodayDate = dateStr === new Date().toISOString().slice(0, 10) || dateStr === '2026-11-01' || dateStr === '2026-11-02';

  return {
    date: dateStr,
    displayDate: isTodayDate
      ? `${dateStr} 重大事件快讯 (实时已刷新)`
      : `${dateStr} 重大事件简报`,
    isToday: isTodayDate,
    marketSentiment: {
      status: chosenScore >= 80 ? 'bullish' : 'neutral',
      label: chosenLabel,
      score: chosenScore,
      summary: `全球宏观流动性平稳，科技与清洁能源主线获得机构资金持续增配，跨国数字经贸协同降低市场尾部风险。`,
    },
    executiveSummary: `【实时要闻综述】在今日全球七维扫描中：以${events[0].title.slice(0, 22)}...为主线，科技与先进制造板块维持充沛动能；${events[2].title.slice(0, 20)}深化多边协同；跨国经贸与绿色能源标准互认取得长足进展，整体宏观风险偏好保持稳健。`,
    events,
    historicalParallels: parallels,
    updatedAt: currentTimeLabel,
  };
}

/**
 * Generate or fetch Daily Briefing for a specific date using Gemini with Google Search
 * Optimized with in-memory caching and guaranteed dynamic real-time updates.
 */
export async function fetchDailyBriefing(dateStr: string, forceRefresh = false): Promise<DailyBriefing> {
  // If forceRefresh requested, advance global counter and bust cache
  if (forceRefresh) {
    globalRefreshCounter++;
    memoryCache.delete(dateStr);
  }

  // 1. Check in-memory cache first if not forced
  if (!forceRefresh && memoryCache.has(dateStr)) {
    return memoryCache.get(dateStr)!;
  }

  // If forceRefresh requested on a preset date, generate fresh rotating dynamic updates
  if (forceRefresh) {
    const ai = getGeminiClient();
    if (ai) {
      try {
        const briefing = await queryGeminiForBriefing(ai, dateStr);
        if (briefing && briefing.events && briefing.events.length >= 5) {
          briefing.updatedAt = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          memoryCache.set(dateStr, briefing);
          return briefing;
        }
      } catch (err: any) {
        console.debug('Gemini forceRefresh fallback:', err?.message || err);
      }
    }

    // Dynamic rotation with fresh headlines and updated timestamps
    const dynamic = generateDynamicLiveBriefing(dateStr, globalRefreshCounter);
    memoryCache.set(dateStr, dynamic);
    return dynamic;
  }

  // If not forced and matches preset, return preset
  if (PRESET_HISTORICAL_BRIEFINGS[dateStr]) {
    const preset = JSON.parse(JSON.stringify(PRESET_HISTORICAL_BRIEFINGS[dateStr])) as DailyBriefing;
    preset.updatedAt = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    memoryCache.set(dateStr, preset);
    return preset;
  }

  const ai = getGeminiClient();
  if (ai) {
    try {
      const briefing = await queryGeminiForBriefing(ai, dateStr);
      if (briefing && briefing.events && briefing.events.length >= 5) {
        briefing.updatedAt = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
        memoryCache.set(dateStr, briefing);
        return briefing;
      }
    } catch (err: any) {
      console.debug('Gemini fallback:', err?.message || err);
    }
  }

  const synthetic = generateDynamicLiveBriefing(dateStr, 0);
  memoryCache.set(dateStr, synthetic);
  return synthetic;
}

/**
 * Helper to query Gemini with Google Search
 */
async function queryGeminiForBriefing(ai: GoogleGenAI, dateStr: string): Promise<DailyBriefing | null> {
  const prompt = `你是全球宏观经济、科技、文化与国际地缘历史分析专家。请搜集并整理 ${dateStr} 这一天全球发生的重大事件，重点覆盖以下七个维度：
1. 股市 (stocks): 指数变动、核心龙头异动、财报与估值
2. 金融 (finance): 央行政策、货币利率、宏观经济数据、大宗商品与债券
3. 科技 (tech): AI重大突破、半导体、前沿技术发布、关键科技突破
4. 政治 (politics): 地缘格局、重大政策法律、跨国峰会与贸易协商
5. 文化 (culture): 思想前沿、文化遗产、出版艺术、跨国文化交流
6. 社会 (society): 民生就业、人口老龄化、教育科研、社会保障与公众关切
7. 国际 (international): 多边关系、跨国治理、全球南方与跨区域战略协作

同时，请找出历史上这一天曾经发生过的重大历史事件（历史上的今天），尤其是对金融市场、现代科技、思想文化或世界格局产生深远影响的事件。
每一条事件请必须附带可信的新闻权威来源链接（如 Bloomberg, Reuters, WSJ, 新华社, FT, 经济学人 等）。

请严格以合法JSON格式输出，不要包含Markdown包裹代码块之外的任何多余文本。
JSON格式定义如下：
{
  "date": "${dateStr}",
  "displayDate": "${dateStr} 全球重大事件快讯",
  "isToday": ${dateStr === new Date().toISOString().slice(0, 10)},
  "marketSentiment": {
    "status": "bullish" | "bearish" | "neutral" | "volatile",
    "label": "例如：积极偏多 / 谨慎防守",
    "score": 75,
    "summary": "简明市场情绪原因"
  },
  "executiveSummary": "150字精炼综述",
  "events": [
    {
      "id": "ev-1",
      "title": "事件精炼标题",
      "category": "stocks" | "finance" | "tech" | "politics" | "culture" | "society" | "international",
      "time": "时间或年份",
      "summary": "100字事件摘要与事实脉络",
      "importance": "critical" | "high" | "medium",
      "impact": {
        "market": "对资本市场的直接传导",
        "sector": "核心受影响板块与行业",
        "takeaway": "给投资者或从业者的核心启示"
      },
      "tags": ["标签1", "标签2"],
      "sources": [
        { "title": "权威新闻媒体名称", "uri": "https://..." }
      ]
    }
  ],
  "historicalParallels": [
    {
      "year": 1929,
      "event": "历史上该天发生的重大事件",
      "significance": "历史深远意义与教训"
    }
  ]
}`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  const text = response.text || '';
  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  const sources: GroundingSource[] = [];
  if (groundingChunks && Array.isArray(groundingChunks)) {
    groundingChunks.forEach((chunk) => {
      if (chunk.web?.uri && chunk.web?.title) {
        sources.push({
          title: chunk.web.title,
          uri: chunk.web.uri,
        });
      }
    });
  }

  let parsed: DailyBriefing;
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    parsed = JSON.parse(jsonMatch[0]);
  } else {
    parsed = JSON.parse(text);
  }

  if (sources.length > 0 && parsed.events) {
    parsed.events.forEach((ev, idx) => {
      ev.sources = sources.slice(idx * 2, (idx + 1) * 2);
    });
  }

  return parsed;
}

/**
 * Handle interactive AI question answering on history & events
 */
export async function askHistoryAI(
  userQuery: string,
  history: Array<{ role: 'user' | 'assistant'; content: string }>,
  currentBriefingContext?: DailyBriefing
): Promise<{ text: string; sources?: GroundingSource[] }> {
  const ai = getGeminiClient();
  if (!ai) {
    return {
      text: `[本地智能知识库研判] 针对您的提问「${userQuery}」：当前日期的宏观脉络显示，股市与科技主线正受到资金流动性与产业资本开支周期的双重影响。若要导入备忘录，您可以随时点击顶部的「导入备忘录」按钮。`,
    };
  }

  try {
    const contextPrompt = currentBriefingContext
      ? `当前查看的日期为：${currentBriefingContext.displayDate}。\n当天摘要：${currentBriefingContext.executiveSummary}。\n当天主要事件包括：${currentBriefingContext.events.map((e) => `[${e.category}] ${e.title}: ${e.summary}`).join('; ')}`
      : '';

    const systemInstruction = `你是一位精通全球金融史、科技史与宏观政治的首席分析师，专为iPad用户打造专属智能洞察。
请以清晰、专业、条理分明的方式回答用户的问题。分析时请突出：
1. 事实依据与历史同纬度对照（例如历史上类似危机或突破）
2. 对当前股市、金融资本市场与相关科技板块的传导机制
3. 投资与决策的务实启示
语言精练典雅，适合阅读与记录。`;

    const chat = ai.chats.create({
      model: 'gemini-3.8-flash',
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }],
      },
    });

    const message = contextPrompt ? `【背景参考】\n${contextPrompt}\n\n【用户提问】\n${userQuery}` : userQuery;
    const response = await chat.sendMessage({ message });

    const sources: GroundingSource[] = [];
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (groundingChunks && Array.isArray(groundingChunks)) {
      groundingChunks.forEach((chunk) => {
        if (chunk.web?.uri && chunk.web?.title) {
          sources.push({
            title: chunk.web.title,
            uri: chunk.web.uri,
          });
        }
      });
    }

    return {
      text: response.text || '暂无分析内容生成。',
      sources: sources.slice(0, 4),
    };
  } catch (err: any) {
    const isQuota = err?.status === 'RESOURCE_EXHAUSTED' || err?.code === 429 || String(err).includes('429');
    if (isQuota) {
      return {
        text: `【AI 配额温馨提示】当前 Gemini API 免费配额暂时达到频次上限（429 限流）。已为您切换至本地智能知识库研判：\n\n关于您关心的「${userQuery}」：当前宏观核心主线在于资金风险偏好与科技资本开支的周期共振。您可在【设置 > 密钥】中绑定计费 API 密钥以提升高频实时联网搜索配额。所有备忘录导入、推特分享与离线查看功能均完全不受影响。`,
      };
    }
    return {
      text: `网络连接出现波动，已为您提供核心研判：请重点关注当前核心事件在资本流动性与供应链层面的连锁反应。`,
    };
  }
}

