// Independent validation set. Written AFTER the rubric was frozen (commit c32da85) and never used
// to change cue lists or thresholds. Different departments and wording from the calibration set.
// Labels are PROVISIONAL, drafted by Claude (AI assistant) from the official IV wording.
// They are NOT teacher or expert annotations and must be reviewed by people before being relied on.
export const LABEL_STATUS = '暂定标签：由 Claude 依官方 IV 定义拟定，非教师或专家人工标注，需人工复核。规则冻结后才撰写。';

const filler = n => Array.from({length: n}, (_, i) =>
  `Week ${i + 1}：热力学第 ${i + 1} 章，教师讲解例题，学生完成课本习题并于下周课堂检讨。`).join('\n');

export const CASES = [
  {id: 'val-mech-design', kind: '具体正例', title: 'AI 辅助产品设计（机械系三年级）',
    text: `一、课程说明
本课程带学生把生成式 AI 用在产品设计流程的前期发想与后期检验。

二、教学活动
1. 第 2 周：学生用 Midjourney 与 Stable Diffusion 各产生 20 张椅子概念图，比较两者在结构可行性与风格控制上的差异，交一页比较说明并选定后续使用的工具。
2. 第 5–6 周：各组到校内图书馆观察学生实际坐姿与使用情境，拍照记录 30 笔观察，据此提出自己的设计概念，AI 只能用来整理观察笔记。
3. 第 9 周：AI 生成图若参考他人作品，须在作品说明中注明使用的工具与提示词，并检查是否侵害著作权。
4. 第 12–14 周：学生用 AI 对设计做结构强度的初步推估，再以有限元素分析软体验算，记录 AI 推估与实际分析的差距。

三、评量
期末提交设计原型与设计报告，由业师与教师依评分尺规共同评分（50%）；比较说明与观察纪录各占 15%。`,
    expect: {'A-1-IV-1': 4, 'D-3-IV-1': 4, 'B-1-IV-1': 3, 'C-1-IV-1': 4, 'B-2-IV-1': 3},
    why: 'A-1 比较两工具、交比较说明并配分；D-3 实地观察并提出自己的设计，有观察纪录配分；B-1 注明工具与提示词、检查著作权（无评分）；C-1 用 AI 推估再以专业软体验算并记录差距，期末报告评分；记录 AI 推估误差也属辨识 AI 误判，暂定 B-2 L3。'},
  {id: 'val-vague', kind: '空泛反例', title: '智慧观光导论（观光系一年级）',
    text: `本课程希望学生拥抱 AI 时代，具备前瞻视野与创新思维。
课程将融入人工智慧相关议题，使学生了解 AI 对观光产业的冲击，并培养批判思考、团队合作、沟通表达与终身学习能力，成为产业所需的跨域人才。`,
    expect: {'A-2-IV-1': 1, 'B-3-IV-1': 1, 'C-2-IV-1': 1, 'D-2-IV-1': 1, 'D-3-IV-1': 1},
    why: '全部是愿景与能力名词，没有任何学生任务。提到终身学习、产业冲击、跨域、沟通、创新，最高 L1。'},
  {id: 'val-d-only', kind: '部分涵盖', title: '长期照顾服务实务（社工系三年级）',
    text: `第 3 周：照服机构已导入 AI 排班与风险预警系统。学生到机构见习，观察照服员如何看待系统建议。

第 4–5 周：学生两人一组访谈一位长者与一位家属，了解他们对照顾安排的期待，撰写访谈纪录。

第 7 周：情境演练：AI 预警显示某长者跌倒风险高，建议限制其活动。学生扮演社工，与扮演长者的同学沟通，并自行决定要不要采纳系统建议，写下决定理由；演练后由教师与同学给回馈。`,
    expect: {'D-1-IV-1': 3, 'D-2-IV-1': 4, 'D-3-IV-1': 2},
    why: '只涉及 D。D-1 自行决定并写理由、有回馈；D-2 访谈纪录＋演练回馈；D-3 实地见习观察但没有产出或评量，暂定 L2。'},
  {id: 'val-noai-history', kind: '无 AI 课程', title: '台湾史（通识）',
    text: `第 1–4 周：清领时期的移垦社会，学生阅读史料并撰写 800 字心得。
第 5–8 周：日治时期的现代化，学生分组到地方文史馆参访，缴交参访报告。
第 9 周：分组辩论「殖民现代性」，依评分尺规评分。
第 10–16 周：战后史，期末学生访谈家中长辈的生命经验，完成口述历史作品。`,
    expect: {},
    why: '活动具体但完全没有 AI 情境；参访、访谈、辩论不应被当成 AI 人才图像证据。'},
  {id: 'val-tools-bullets', kind: '只列工具名称', title: '商业简报技巧（企管系一年级）',
    text: `使用软体与 AI 工具
- PowerPoint
- Canva
- ChatGPT
- Gamma
- Copilot

评分：出席 20%、期中简报 40%、期末简报 40%。`,
    expect: {},
    why: '只列出工具与评分比例，没说明学生如何使用 AI，也没有任何细项相关叙述。'},
  {id: 'val-negation', kind: '否定叙述', title: '财务报表分析（财金系三年级）',
    text: `本课程的作业与考试均不使用生成式 AI，因此不需要撰写 AI 使用声明，也不进行 AI 工具的比较。

第 6 周：学生用 ChatGPT 解读一家上市公司的财报，再逐项核对 AI 说明与原始财报数字，找出错误并缴交核对表，由助教批改。`,
    expect: {'B-2-IV-1': 4},
    why: '开头否定 B-1、A-1，不应计入。第 6 周核对 AI 对财报的解读并找出错误、缴交核对表并批改，属 B-2 L4。也接近 C-1，但没有形成解决方案，暂定 C-1 L0。'},
  {id: 'val-reordered-dup', kind: '重复文字与顺序改变', title: '数据新闻实作（新闻系三年级）',
    text: `期末：各组提交数据新闻作品，依尺规评分。

第 10 周：学生用 AI 分析 2,000 笔市府开放资料，找出交通事故热点，并用专业统计方法验证 AI 的结论。

第 10 周：学生用 AI 分析 2,000 笔市府开放资料，找出交通事故热点，并用专业统计方法验证 AI 的结论。

第 3 周：学生练习将受访者个资去识别化，并在稿件末标注 AI 使用范围。

第 10 周：学生用 AI 分析 2,000 笔市府开放资料，找出交通事故热点，并用专业统计方法验证 AI 的结论。`,
    expect: {'C-1-IV-1': 3, 'B-1-IV-1': 2},
    why: '第 10 周段落重复三次、顺序打乱，不应加分。C-1 有练习与验证（期末作品评分未直接连到此活动），暂定 L3；B-1 有练习但无产出与检核，L2。'},
  {id: 'val-long-tail', kind: '长课纲尾段才有证据', title: '工程热力学与 AI 应用（机械系二年级）',
    text: `${filler(16)}

Week 17：学生用 AI 助理规划一套热交换器的设计计算流程，小组画出人机分工流程图，标明哪些计算由 AI 产生、哪些由人工覆核，并记录 AI 算错的地方。
Week 18：各组口头报告流程图与错误纪录，教师依尺规评分。`,
    expect: {'C-3-IV-1': 4, 'B-2-IV-1': 4},
    why: '前 16 周没有 AI；Week 17–18 才有人机分工流程图、人工覆核、AI 错误纪录与评分（C-3 L4）。记录 AI 算错处属辨识 AI 误判（B-2），暂定 L4。'},
  {id: 'val-teacher-demo', kind: '教师示范（学生未实作）', title: '法律资讯检索（法律系二年级）',
    text: `第 8 周：教师示范如何用 AI 搜寻判决，并说明 AI 可能捏造判决字号的风险及查证的重要。
第 9–16 周：民法案例研读，期末笔试。`,
    expect: {'B-2-IV-1': 1, 'A-2-IV-1': 1},
    why: '只有教师示范与说明，学生没有实作，最高 L1。'},
  {id: 'val-a-only', kind: 'A 证据不应被当成 B/C/D', title: '英文自学策略（外文系一年级）',
    text: `第 1 周：学生设定一学期的英文自学目标。
第 2–17 周：学生每周用 AI 对话练习英文口说 30 分钟，在学习历程档案记录 AI 纠正的文法重点，以及下周要调整的练习方式。
第 18 周：缴交学习历程档案，教师依反思深度评分。`,
    expect: {'A-2-IV-1': 4},
    why: '全为 A-2（AI 辅助自学、学习历程与反思评分）。与 AI 对话练习口说不是与真人互动，不属 D-2；记录 AI 纠正的文法不是查核 AI 错误，不属 B-2。'},
  {id: 'val-goal-plus-grading', kind: '只有目标与评分（无活动）', title: '资讯伦理（资管系二年级）',
    text: `课程目标：建立学生 AI 伦理与个资保护观念，理解 AI 对社会的影响。

评分方式：AI 使用声明 10%、期中考 40%、期末考 50%。`,
    expect: {'B-1-IV-1': 1, 'B-3-IV-1': 1},
    why: '只有目标与配分，没有说明学生做什么练习。声明列入配分但没有活动，最高 L1。'},
  {id: 'val-english', kind: '中英混写', title: 'Global Marketing with AI（国企系，英语授课）',
    text: `Week 4: Students use ChatGPT to draft market-entry reports, then fact-check every statistic against official trade data and submit a verification log (10%).

Week 7: Role-play negotiation with a partner acting as a Japanese buyer; students must consider cultural differences, and write a reflection afterwards.`,
    expect: {'B-2-IV-1': 4, 'D-2-IV-1': 3},
    why: '英文描述。B-2 查核统计并缴交纪录配分；D-2 角色扮演、考量文化差异并写反思。规则以中文为主，此案例检查英文课纲的限制。'},
];
