// Evidence rubric for the 11 IV competencies.
// `anchors` can support practice evidence; `mentions` (the competency's name-level wording) only ever
// yields L1. Every cue list is derived from wording in the official IV definition (`trace`), never from the
// built-in example text. Cues are shown on the page so reviewers can see why a level was given.

// AI context: every competency in this talent profile is about AI. A course without any AI wording
// gets no evidence at all; for A/B/C, practice found only in units without AI wording is flagged for review.
export const AI_TERMS = /(?<![A-Za-z])(?:AI|A\.I\.|AIGC|GenAI)(?![A-Za-z])|人工智慧|生成式|ChatGPT|GPT|Gemini|Claude|Copilot|Perplexity|NotebookLM|Midjourney|DALL|Stable Diffusion|LLM|大型语言模型|语言模型|聊天机器人|机器学习|深度学习/i;

// Generic pedagogy cues (same for every competency).
export const CUES = {
  // Student practice: a scheduled or named learning activity that students carry out.
  activity: /第\s*[\d一二三四五六七八九十]+(?:\s*[–—\-~～至到、]\s*[\d一二三四五六七八九十]+)?\s*周|(?<![A-Za-z])W(?:eek)?\s*\d+|每周|课堂(?:上|中)?(?:练习|活动|实作|讨论|演练)|工作坊|实作|实习|演练|练习|分组|小组|专题|作业|任务|访谈|角色扮演|扮演|辩论|田野|实地|踏查|参访|走访|测试|标注|比较|评比|撰写|缴交|提交|简报|工作单|学习单|案例(?:分析|讨论)|个案(?:分析|讨论)/,
  // Concrete output that students hand in or present.
  output: /缴交|提交|上传|产出|报告|纪录|记录表|评比表|检核表|声明|学习单|工作单|日志|简报|作品|流程图|企划|提案|海报|影片|原型|心得|逐字稿|改善方案|服务方案|设计稿|立场书/,
  // Verification, reflection or assessment of the work.
  check: /评分|计分|评量|尺规|rubric|配分|占.{0,8}\d+\s*[%％]|\d+\s*[%％]|列入.{0,6}成绩|成绩|回馈|反思|覆核|检核|验证|比对|对照|误判率|错误率|正确率|准确率|正确性|准确性|指标|互评|评审|讲评/i,
  // Course-specific detail (quantities, weeks, named data).
  specific: /\d|[一二三四五六七八九十百千]+\s*(?:则|笔|份|位|组|项|次|周|篇|题|种|个|张|页|分钟|字|家|间)/,
};

// A sentence that only states intended outcomes ("培养…能力") carries no practice evidence.
export const GOAL_FRAME = /培养|提升|建立|强化|具备|养成|增进|厚植|启发|涵养|了解|认识|理解|强调|重视|教导|使学生|让学生|期望|期许|希望|目标|素养|观念|态度|意识/;
// "透过专题培养…" names an activity only as the means to a goal; still a goal statement.
export const VIA_GOAL = /(?:透过|借由|经由|藉著|以).{0,24}(?:培养|提升|建立|强化|养成|增进|厚植|涵养)/;
// Negation inside a clause suppresses every cue in that clause ("不安排实作", "未要求揭露").
// Excludes compounds that are not negations: 不同, 不断, 不仅, 不只, 无法取代, 不为AI所限制.
export const NEGATION = /(?:并)?(?:不(?:会|需要?|必|安排|进行|包含|涉及|要求|提供|实施|设计|列入|纳入|做|使用|讨论|练习|含|采|教|谈)|未(?:安排|进行|包含|涉及|要求|提供|实施|设计|列入|纳入|有|曾)|没有|无须|无需|毋须|免除|并无|不再)/;

export const RUBRIC = {
  'A-1-IV-1': {
    trace: '评估并选用适切工具，以支援学习、资讯管理与资料产出',
    anchors: [/(?:比较|评比|评估|选用|挑选|筛选|测试|试用).{0,24}(?:工具|模型|平台|服务|AI|ChatGPT|Gemini|Claude|Copilot|Perplexity|NotebookLM)/i,
      /(?:工具|模型|平台).{0,10}(?:比较|评比|评估|选用|选择)/, /选用理由|工具评比|评比表/],
    mentions: /AI\s*工具|善用.{0,6}(?:AI|工具)/i,
    practice: '学生实际比较或试用多种 AI 工具，依任务选用',
    output: '评比表、选用理由、工具比较报告',
    checkHint: '依明确指标（正确性、来源、耗时等）评比，或有评分',
    model: 'Do students compare or evaluate different AI tools and choose one for a learning task?',
  },
  'A-2-IV-1': {
    trace: '将AI有策略地融入自主学习历程，进行资料检索、统整分析与反思调整',
    anchors: [/学习(?:历程|日志|纪录|记录|策略|计划|档案)|自主学习|自学|后设认知|终身学习/,
      /(?:用|以|运用|透过|借助|使用).{0,12}(?:AI|ChatGPT|Gemini|Claude|Copilot|Perplexity|NotebookLM|生成式).{0,14}(?:检索|搜寻|整理|摘要|统整|归纳|复习|学习)/i,
      /(?:产业|新兴).{0,6}(?:趋势|AI\s*工具)/],
    mentions: /自主学习|终身学习|学习效能/,
    practice: '学生实际用 AI 检索、整理资料或规划自己的学习',
    output: '学习日志、学习历程档案、整理笔记',
    checkHint: '定期反思并调整学习方式，或列入评量',
    model: 'Do students record or reflect on how they learn with AI, such as keeping a learning log?',
  },
  'B-1-IV-1': {
    trace: '遵循智慧财产权、个资保护及使用规范，清楚揭露AI使用方式与范围',
    anchors: [/揭露|(?:使用|AI).{0,4}声明|标注.{0,10}(?:AI|工具|提示词|使用)|著作权|智慧财产|智财|版权|授权|个资|个人资料|隐私|去识别|抄袭|学术伦理|引用规范|使用规范/],
    mentions: /伦理|法规|法律|智财|规范/,
    practice: '作业要求揭露 AI 使用，或实际处理著作权／个资问题',
    output: 'AI 使用声明、去识别化资料、授权检核',
    checkHint: '声明内容被检核或列入成绩',
    model: 'Must students disclose their AI use, or practise handling copyright or personal data rules?',
  },
  'B-2-IV-1': {
    trace: '辨识资料安全、偏见与误判等风险；具备资讯查证能力，识别AI生成之虚假或误导性内容',
    anchors: [/查核|查证|事实查核|核实|假讯息|虚假|不实|错误资讯|误导|幻觉|偏见|偏误|误判|资安|资料安全|深伪|deepfake|提示注入|防护措施|(?:比对|核对).{0,8}(?:来源|原文|出处|资料)/i,
      /(?:AI|ChatGPT|Gemini|Claude|Copilot|生成).{0,16}(?:错误|错处|漏洞|不正确)|(?:找出|标出|记录|辨识|检查|指出).{0,16}(?:错误|错处)/i],
    mentions: /资安|风险|安全|查证/,
    practice: '学生实际查核 AI 产出，或找出偏误与资安风险',
    output: '查核纪录、风险清单',
    checkHint: '查核结果被比对、评分或回馈',
    model: 'Do students fact-check AI output or identify AI bias, errors or security risks?',
  },
  'B-3-IV-1': {
    trace: '理解AI应用对个人、专业、产业与社会之影响，提出专业判断，并对自身决策及其后果负责',
    anchors: [/(?:社会|产业|职场|工作|个人|他人|环境|就业).{0,6}(?:影响|冲击)|伦理(?:议题|两难|案例|辩论|讨论)|辩论|利害关系人|当责|问责|承担.{0,6}(?:责任|后果)|价值判断|立场/],
    mentions: /负责|责任|社会影响|价值/,
    practice: '学生实际讨论或辩论 AI 应用的影响，提出自己的判断',
    output: '立场报告、影响分析',
    checkHint: '判断理由被评量或回馈',
    model: 'Do students debate or judge the social or ethical impact of an AI application and take a position?',
  },
  'C-1-IV-1': {
    trace: '运用AI辅助整理问题背景，结合AI分析结果与自身专业知识进行判读与验证，形成解决方案',
    anchors: [/(?:AI|ChatGPT|Gemini|Claude|Copilot|模型|生成式).{0,14}(?:分析|分类|预测|归纳)/i,
      /(?:AI|ChatGPT|Gemini|Claude|Copilot|生成式).{0,14}整理.{0,6}(?:问题|背景|变项|限制)/i,
      /(?:依|结合|根据|运用).{0,8}专业.{0,8}(?:修改|修正|判读|验证|审阅|检核)/, /解决方案|改善方案/],
    mentions: /解决问题|问题解决|分析问题|解决方案/,
    practice: '学生实际用 AI 分析真实资料或问题',
    output: '分析报告、改善方案',
    checkHint: '以专业知识或人工结果验证 AI 分析',
    model: 'Do students use AI to analyse real data or a real problem and verify a proposed solution?',
  },
  'C-2-IV-1': {
    trace: '理解AI资料来源、模型运作与推论机制的原理与限制，判断AI适合的角色与阶段，结合多元跨域知识',
    anchors: [/(?:模型|AI|演算法).{0,8}(?:原理|运作|机制|限制|局限|局限)|资料来源|训练资料|推论机制|跨领域|跨域|跨科|跨系|(?:整合|结合).{0,8}(?:知识|观点|专业)|适合.{0,8}(?:角色|阶段)/],
    mentions: /跨领域|跨域|逻辑思维|整合能力/,
    practice: '学生实际检验 AI 限制，或整合不同领域知识',
    output: '限制分析、跨域整合方案',
    checkHint: '说明判断依据并接受评量',
    model: 'Do students examine how an AI model works or where it fails, and combine knowledge from other fields?',
  },
  'C-3-IV-1': {
    trace: '运用AI优化工作流程，辨识并回馈AI错误与偏见，评估AI介入对方案品质与风险的影响',
    anchors: [/人机(?:分工|协作|合作)|分工|工作流程|流程(?:图|优化|设计|改善|改造)|workflow/i,
      /(?:人工|由人|人为).{0,8}(?:覆核|审核|检查|确认|标注|校正)|回馈.{0,6}(?:错误|AI)|误判率|错误率/],
    mentions: /人机协作|协作|工作流程/,
    practice: '学生实际规划人与 AI 的分工，并覆核 AI 结果',
    output: '分工流程图、错误纪录',
    checkHint: '计算错误率或评估 AI 介入的品质影响',
    model: 'Do students plan which workflow steps AI performs and which a human reviews, and track AI errors?',
  },
  'D-1-IV-1': {
    trace: '在AI协力的过程中依循专业与伦理自主判断，并承担结果责任',
    anchors: [/(?:自行|自己|由人|由学生|亲自|独立|人类).{0,6}(?:判断|决定|决策)|必须由人|人为(?:判断|决策)|判断理由|决策理由|取舍|不(?:直接|盲目)?(?:采用|照搬).{0,6}(?:AI|建议)/i],
    mentions: /判断|决策/,
    practice: '学生在 AI 建议之外自行判断并说明理由',
    output: '决策纪录、判断理由',
    checkHint: '判断结果经讨论、反思或评量',
    model: 'Do students make a decision themselves and justify it, rather than following the AI?',
  },
  'D-2-IV-1': {
    trace: '在AI辅助沟通与协作中理解并尊重他人观点与需求，考量不同族群与社会情境，展现同理心',
    anchors: [/访谈|角色扮演|扮演|同理|换位思考|倾听|协商|面对面|不同(?:族群|文化|背景|世代)|(?:与|和|向).{0,8}(?:顾客|客户|使用者|长者|民众|病人|病患|居民|业师|家长|同学)(?:互动|沟通|对话|交流|说明)|沟通(?:练习|演练)/],
    mentions: /同理|沟通|人际|互动/,
    practice: '学生实际与真人互动（访谈、扮演、服务）',
    output: '访谈纪录、演练回馈',
    checkHint: '对互动过程进行反思或回馈',
    model: 'Do students interview, role-play or communicate with real people and consider their needs?',
  },
  'D-3-IV-1': {
    trace: '具备对真实世界环境的观察能力，结合生活体验与洞察真实世界问题，整合多元观点并实践',
    anchors: [/实地|田野|踏查|观察|参访|走访|生活(?:经验|体验)|洞察|创意|创新|原创|创作|设计(?:提案|作品|方案|思考)|原型|prototype/i],
    mentions: /创意|创造|创新|洞察/,
    practice: '学生实地观察或提出自己的创作／设计',
    output: '观察纪录、设计提案、原型',
    checkHint: '作品经回馈、反思或评量',
    model: 'Do students observe real-world situations and create their own original ideas or designs?',
  },
};

// D-competencies describe human abilities "in AI collaboration"; their AI context is expected to come
// from another part of the course, so they are not flagged when the unit itself has no AI wording.
export const COURSE_LEVEL_AI = new Set(['D-1-IV-1', 'D-2-IV-1', 'D-3-IV-1']);

export const LEVELS = [
  ['L0', '未见', '课纲没有提到这项能力'],
  ['L1', '仅提及', '只写目标或名称，没有学生练习'],
  ['L2', '有练习', '学生实际进行相关活动'],
  ['L3', '有产出或检核', '练习并有具体产出，或有验证／反思／评量'],
  ['L4', '产出且检核', '练习、具体产出、验证／反思／评量都有'],
];
