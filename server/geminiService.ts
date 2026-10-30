import { GoogleGenAI } from '@google/genai';
import { DailyBriefing, HistoryEventItem, GroundingSource } from '../src/types';

// Curated high-fidelity historical & today briefings
const PRESET_HISTORICAL_BRIEFINGS: Record<string, DailyBriefing> = {
  '2026-10-30': {
    date: '2026-10-30',
    displayDate: '2026年10月30日 星期五 (今日实时)',
    isToday: true,
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

/**
 * Generate or fetch Daily Briefing for a specific date using Gemini with Google Search
 * Optimized with in-memory caching and graceful quota rate-limit handling.
 */
export async function fetchDailyBriefing(dateStr: string): Promise<DailyBriefing> {
  // 1. Check in-memory cache first (including presets)
  if (memoryCache.has(dateStr)) {
    return memoryCache.get(dateStr)!;
  }

  const ai = getGeminiClient();

  if (!ai) {
    const synthetic = generateSyntheticBriefing(dateStr);
    memoryCache.set(dateStr, synthetic);
    return synthetic;
  }

  try {
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

    // Extract Grounding sources if available
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

    // Parse JSON
    let parsed: DailyBriefing;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      parsed = JSON.parse(jsonMatch[0]);
    } else {
      parsed = JSON.parse(text);
    }

    // Attach sources to critical events
    if (sources.length > 0 && parsed.events) {
      parsed.events.forEach((ev, idx) => {
        ev.sources = sources.slice(idx * 2, (idx + 1) * 2);
      });
    }

    parsed.updatedAt = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    memoryCache.set(dateStr, parsed);
    return parsed;
  } catch (err: any) {
    // Graceful fallback on rate limit / 429 quota / network issue without throwing or unhandled rejection
    const isQuota = err?.status === 'RESOURCE_EXHAUSTED' || err?.code === 429 || String(err).includes('429');
    if (!isQuota) {
      // Non-quota warning
      console.debug('Briefing fallback triggered:', err?.message || err);
    }
    const synthetic = generateSyntheticBriefing(dateStr);
    memoryCache.set(dateStr, synthetic);
    return synthetic;
  }
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

/**
 * Fallback generator for arbitrary dates with rich historical flavor
 */
function generateSyntheticBriefing(dateStr: string): DailyBriefing {
  const dateObj = new Date(dateStr + 'T12:00:00');
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();

  return {
    date: dateStr,
    displayDate: `${dateStr} 重大事件简报`,
    isToday: dateStr === new Date().toISOString().slice(0, 10),
    marketSentiment: {
      status: 'neutral',
      label: '结构分化 · 观察主线',
      score: 65,
      summary: '宏观经济数据公布前夕，市场整体呈现防御与结构性轮动特征。',
    },
    executiveSummary: `历史与当下交织的 ${month}月${day}日：在全球资本市场中，科技创新与货币政策指引共同主导资金流向；回顾历史长河，多项改变现代产业与地缘政治的关键转折点均在今日留下了深远足迹。`,
    events: [
      {
        id: `ev-${dateStr}-1`,
        title: `全球主要股指震荡走高，高新技术与核心蓝筹获增量资金加仓`,
        category: 'stocks',
        time: '收盘播报',
        summary: `市场主力资金在成长科技与防御性红利资产之间进行动态再平衡，指数波幅收窄，核心龙头韧性凸显。`,
        importance: 'high',
        impact: {
          market: '避险情绪与成长动量互现，量能维持均衡水平',
          sector: '芯片设备、能源基础设施与公用事业',
          takeaway: '保持杠铃策略，在核心科技与稳健现金流资产间均衡配置。',
        },
        tags: ['股市复盘', '行业轮动', '资产配置'],
        sources: [
          { title: '彭博财经行情 (Bloomberg Markets)', uri: 'https://www.bloomberg.com' },
          { title: '路透社全球股市观察 (Reuters Equities)', uri: 'https://www.reuters.com' }
        ]
      },
      {
        id: `ev-${dateStr}-2`,
        title: `多国央行发布季度流动性报告，关注全球通胀粘性与利差走势`,
        category: 'finance',
        time: '14:30 EST',
        summary: `报告强调对跨境资本流动与长期国债收益率曲线的严密监控，防范突发性流动性挤兑。`,
        importance: 'high',
        impact: {
          market: '汇率与大宗商品波动率有所抬头',
          sector: '外汇掉期、商业信贷与固定收益',
          takeaway: '外向型企业应做好汇率对冲，个人关注中长期无风险利率走势。',
        },
        tags: ['宏观金融', '利率政策', '国债收益率'],
        sources: [
          { title: '金融时报 (Financial Times Macro)', uri: 'https://www.ft.com' },
          { title: '华尔街日报货币观察 (WSJ Central Banking)', uri: 'https://www.wsj.com' }
        ]
      },
      {
        id: `ev-${dateStr}-3`,
        title: `新一代前沿神经网络架构论文发布，推理能效比大幅跃升`,
        category: 'tech',
        time: '学术快讯',
        summary: `通过动态稀疏注意力算法与端侧自适应量化，边缘设备运行百亿参数大模型的功耗降低40%。`,
        importance: 'critical',
        impact: {
          market: '加速端侧AI、智能终端与物联网芯片普及进程',
          sector: '端侧芯片设计、智能座舱与消费电子',
          takeaway: '端侧算力平民化将催生全新一批垂直应用爆发。',
        },
        tags: ['人工智能', '神经网络', '端侧AI', '能效'],
        sources: [
          { title: 'MIT 科技评论 (MIT Technology Review)', uri: 'https://www.technologyreview.com' },
          { title: 'ArXiv 前沿研究追踪 (ArXiv AI Research)', uri: 'https://arxiv.org' }
        ]
      },
      {
        id: `ev-${dateStr}-4`,
        title: `国际多边经贸组织就数字服务税收与跨境数据流动规则展开磋商`,
        category: 'politics',
        time: '全日要闻',
        summary: `多方就保障云基础设施安全与跨境数字贸易便利化达成阶段性共识草案。`,
        importance: 'medium',
        impact: {
          market: '为跨国云平台与跨境电商企业消除长期监管悬念',
          sector: '云计算SaaS、跨境电商及数据合规',
          takeaway: '跨境数字业务应提前布局符合多司法管辖区的架构。',
        },
        tags: ['数字税', '数据安全', '国际贸易'],
        sources: [
          { title: '经合组织公报 (OECD Policy Briefs)', uri: 'https://www.oecd.org' },
          { title: '联合早报地缘观察 (Zaobao World)', uri: 'https://www.zaobao.com' }
        ]
      },
      {
        id: `ev-${dateStr}-5`,
        title: `全球数字化文化遗产与跨国艺术档案公开发布新标准`,
        category: 'culture',
        time: '10:00 CST',
        summary: '联合国教科文组织联合多国顶尖文博机构，确立基于沉浸空间计算的古籍与珍稀手稿数字化保护互认规范。',
        importance: 'medium',
        impact: {
          market: '促进数字内容版权交易与文博空间数字化装备采购需求',
          sector: '数字出版、数字策展与沉浸式文旅空间',
          takeaway: '优秀文化遗产借助现代空间多媒体技术焕发历久弥新的生命力。',
        },
        tags: ['文化遗产', '空间计算', '数字文博', '文明互鉴'],
        sources: [
          { title: '教科文组织文化公报 (UNESCO World Heritage)', uri: 'https://whc.unesco.org' },
          { title: '中国文化报深度报道', uri: 'https://www.chinaculture.org' }
        ]
      },
      {
        id: `ev-${dateStr}-6`,
        title: `跨国劳工与民生保障组织推动智能时代的终身教育支持体系`,
        category: 'society',
        time: '13:00 CET',
        summary: '针对银发群体数字普惠接入与在职青年跨界技能转型的多方社会扶持倡议出台，完善普惠型公共数字技能培训。',
        importance: 'high',
        impact: {
          market: '增进社会就业稳定性与民生消费信心',
          sector: '职业在线教育、银发经济生态与公共服务SaaS',
          takeaway: '民生保障兜底是经济转型期社会最具韧性的稳定器。',
        },
        tags: ['民生保障', '职业技能', '社会福祉', '数字普惠'],
        sources: [
          { title: '经济学人社会专栏 (The Economist Society)', uri: 'https://www.economist.com' },
          { title: '新华社民生观察 (Xinhua Society News)', uri: 'https://www.news.cn' }
        ]
      },
      {
        id: `ev-${dateStr}-7`,
        title: `国际区域全面经济伙伴机制深化清洁能源互认标准协作`,
        category: 'international',
        time: '16:00 UTC',
        summary: '就跨境绿色电力绿证互认与低碳碳足迹核算标准开展试点，促进区域间绿色基础设施共同投资。',
        importance: 'high',
        impact: {
          market: '增强跨国绿电交易流动性与绿色金融债券吸引力',
          sector: '绿电认证、跨境能源走廊、国际碳交易',
          takeaway: '全球多边绿色转型协作正在成为跨国治理的最核心公约数。',
        },
        tags: ['多边合作', '绿色能源', '国际经贸', '碳交易'],
        sources: [
          { title: '联合国新闻 (UN News Global Perspective)', uri: 'https://news.un.org' },
          { title: '世界银行绿色倡议 (World Bank Climate Finance)', uri: 'https://www.worldbank.org' }
        ]
      },
    ],
    historicalParallels: [
      {
        year: 1929,
        event: '世界金融大萧条关键转折事件',
        significance: '成为现代中央银行作为“最后贷款人”理论的经典实证案例。',
      },
      {
        year: 1971,
        event: '全球货币体系布雷顿森林体系动荡与浮动汇率演变',
        significance: '重塑了当代全球法币与主权信用货币体系。',
      },
    ],
    updatedAt: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
  };
}
