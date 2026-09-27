// Calibration set: used to develop cue lists and choose model thresholds.
// Labels are PROVISIONAL, drafted by Claude (AI assistant) from the official IV wording.
// They are NOT teacher or expert annotations and must be reviewed by people before being relied on.
// expect: competency -> evidence level L0–L4 (unlisted = L0). why: short provisional rationale.
import {ABILITIES} from '../../assets/abilities.js';

export const LABEL_STATUS = '暂定标签：由 Claude 依官方 IV 定义拟定，非教师或专家人工标注，需人工复核。';

const weeks = (from, to, topic) => Array.from({length: to - from + 1}, (_, i) =>
  `第 ${from + i} 周：${topic[i % topic.length]}。教师讲授相关章节，学生完成课后阅读与随堂小考。`).join('\n');

export const CASES = [
  {id: 'cal-builtin-good', kind: '具体正例', title: '顾客关系管理与 AI 应用（餐旅系三年级）',
    text: ABILITIES.map(a => a.good).join('\n\n'),
    expect: {'A-1-IV-1': 4, 'A-2-IV-1': 4, 'B-1-IV-1': 4, 'B-2-IV-1': 4, 'C-1-IV-1': 4, 'C-3-IV-1': 4, 'D-1-IV-1': 3, 'D-2-IV-1': 3},
    why: '页面内建范例。A/B/C 有周次、产出与配分；D 有角色扮演与反思但无评分产出。B-3、C-2、D-3 未见对应活动。'},
  {id: 'cal-builtin-bad', kind: '空泛反例', title: '顾客关系管理与 AI 应用（餐旅系三年级）',
    text: ABILITIES.map(a => a.bad).join('\n\n'),
    expect: {'A-1-IV-1': 1, 'A-2-IV-1': 1, 'B-1-IV-1': 1, 'B-2-IV-1': 1, 'B-3-IV-1': 1, 'C-1-IV-1': 1, 'C-2-IV-1': 1, 'D-2-IV-1': 1, 'D-3-IV-1': 1},
    why: '页面内建反例。只写能力名称与目标，没有学生活动，最高仅 L1。'},
  {id: 'cal-partial-writing', kind: '部分涵盖', title: 'AI 辅助学术写作（通识，一年级）',
    text: `课程目标：培养学生以负责任的方式使用生成式 AI 撰写学术报告。

第 2 周：学生以同一题目分别使用 ChatGPT、Claude 与 Perplexity 搜寻文献，依引用正确性与可追溯性填写工具评比表，并说明最后选用哪一个工具。

第 4 周：AI 使用揭露。每份作业须附 AI 使用声明，列出使用的工具、提示词与修改段落；助教抽查声明与作业是否一致，列入作业成绩。

第 6 周：学生逐一核对 AI 产生的 10 笔参考文献是否真实存在，缴交查核纪录，标出虚构的文献。

第 8–16 周：学生完成个人期末报告，教师依写作尺规评分。`,
    expect: {'A-1-IV-1': 4, 'B-1-IV-1': 4, 'B-2-IV-1': 3},
    why: '只涵盖 A-1、B-1、B-2。A-1 有评比表且依指标评比；B-1 声明被抽查列入成绩；B-2 有查核纪录但未写评分方式。C、D 与 A-2 无证据。'},
  {id: 'cal-noai-accounting', kind: '无 AI 课程', title: '中级会计学（会计系二年级）',
    text: `课程目标：熟悉财务报表编制与分录原则。

第 1–6 周：分录练习与试算表，每周缴交习题，占 20%。
第 7 周：学生分组访谈两位事务所会计师，了解查帐实务，缴交访谈纪录。
第 8–15 周：合并报表、租赁会计，课堂分组个案分析并上台简报。
第 16 周：期末考 40%。`,
    expect: {},
    why: '具体但没有任何 AI 情境。人才图像细项皆以 AI 为前提，访谈也不列入 D-2。'},
  {id: 'cal-tools-only', kind: '只列工具名称', title: '数位行销概论（企管系二年级）',
    text: `本课程使用工具：ChatGPT、Gemini、Copilot、Canva、Midjourney。

课程目标：提升学生数位行销能力与 AI 素养。

评量方式：期中考 30%、期末考 40%、出席 30%。`,
    expect: {},
    why: '只列工具与一般目标，没有说明学生怎么使用，也没有提到任何细项的能力名称。'},
  {id: 'cal-negation', kind: '否定叙述', title: '程式设计（一）（资工系一年级）',
    text: `本课程不安排 AI 工具的比较或评估活动，也不要求学生揭露 AI 使用。

第 3–10 周：学生每周完成程式作业，缴交原始码并由助教测试评分。

第 11 周：学生使用 GitHub Copilot 完成同一题作业，比对自己写的版本与 AI 产生的版本，记录 AI 程式码中的 3 个错误，缴交错误纪录。

本课程未安排任何访谈或角色扮演。`,
    expect: {'B-2-IV-1': 4, 'C-3-IV-1': 3},
    why: '否定句中的 A-1、B-1、D-2 不应计入。第 11 周找出 AI 程式错误属 B-2（有纪录并比对）；也涉及覆核 AI 产出，暂定 C-3 L3。'},
  {id: 'cal-duplicate', kind: '重复文字', title: 'AI 辅助学术写作（通识，一年级）',
    text: null, // filled below: the partial case repeated three times
    expect: {'A-1-IV-1': 4, 'B-1-IV-1': 4, 'B-2-IV-1': 3},
    why: '与 cal-partial-writing 相同内容重复三次，等级不应提高。'},
  {id: 'cal-longtail', kind: '长课纲尾段才有证据', title: '行销研究（企管系三年级）',
    text: `课程目标：学习行销研究的设计与分析方法。\n\n${weeks(1, 15, ['研究问题与假设', '次级资料搜集', '问卷设计', '抽样方法', '量表信效度', '叙述统计', '交叉分析', '回归分析', '因素分析', '集群分析', '联合分析', '质性研究', '焦点团体', '研究伦理', '报告撰写'])}\n\n第 16 周：学生取得合作咖啡店 500 则线上评论，用 ChatGPT 分类顾客抱怨主题，再人工抽查 60 则计算 AI 误判率。\n第 17 周：各组绘制人机分工流程图，说明哪些步骤由 AI 处理、哪些由人覆核，并提出改善方案向店长简报，依尺规评分。`,
    expect: {'C-1-IV-1': 4, 'C-3-IV-1': 4, 'B-2-IV-1': 3},
    why: '前 15 周无 AI；第 16–17 周才有 C-1、C-3 证据（分析、改善方案、误判率、尺规）。计算误判率也属辨识 AI 误判（B-2），暂定 L3。'},
  {id: 'cal-nursing', kind: '具体正例（其他领域）', title: 'AI 与照护沟通（护理系四年级）',
    text: `第 5 周：学生使用 AI 聊天机器人产生卫教单张初稿，再依照护专业知识修改，缴交修改前后对照表。

第 6 周：病历资料去识别化练习：学生找出模拟病历中 5 类个人资料并遮罩，缴交处理纪录。

第 9–10 周：模拟病房角色扮演。学生扮演护理师，向扮演家属的同学说明 AI 风险评估结果，并自行判断是否需要通报医师；演练后撰写反思，由教师回馈。`,
    expect: {'B-1-IV-1': 3, 'C-1-IV-1': 2, 'D-1-IV-1': 3, 'D-2-IV-1': 3, 'B-2-IV-1': 1},
    why: 'B-1 去识别化并缴交纪录；D-1 自行判断、D-2 角色扮演，皆有反思回馈。第 5 周依专业修改 AI 初稿接近 C-1，但未写验证方式，暂定 L2。'},
  {id: 'cal-a-only', kind: 'A 证据不应被当成 B/C/D', title: '自主学习专题（通识）',
    text: `第 1 周：学生订定个人学习计划，选定一项想自学的技能。

第 2–3 周：学生比较 NotebookLM、ChatGPT 与 Perplexity 整理学习资料的效果，填写工具评比表并写下选用理由。

第 4–15 周：每周撰写 AI 学习日志，记录如何用 AI 搜寻与整理资料、遇到的困难与调整的学习策略；每月与教师面谈一次，教师依日志给予回馈，日志占 40%。`,
    expect: {'A-1-IV-1': 3, 'A-2-IV-1': 4},
    why: '全为 A 的证据（工具评比、学习日志与反思）。与教师面谈是学习辅导，不视为 D-2 的同理互动；B/C/D 应为 L0。'},
  {id: 'cal-grading-table', kind: '证据分散（活动与评量分开写）', title: '新闻采访与 AI（传播系二年级）',
    text: `第 4 周：学生用 AI 产生一则地方新闻初稿，逐句比对原始新闻稿与官方资料，标出错误与误导之处。

第 8 周：学生访谈三位在地商家，了解他们对 AI 生成新闻的看法。

第 12 周：分组辩论「新闻媒体是否应全面使用 AI 写稿」，说明对记者工作与读者的影响。

评量方式：
- 查核纪录 20%
- 访谈逐字稿与心得 20%
- 辩论表现 20%（依评分尺规）
- 期末作品 40%`,
    expect: {'B-2-IV-1': 4, 'D-2-IV-1': 4, 'B-3-IV-1': 3},
    why: '活动写在周次，评量写在最后的列表，应整合全课程证据：B-2 查核＋纪录配分；D-2 访谈＋逐字稿配分；B-3 辩论影响并依尺规评分，但未写具体产出，暂定 L3。'},
];
CASES.find(c => c.id === 'cal-duplicate').text = Array(3).fill(CASES.find(c => c.id === 'cal-partial-writing').text).join('\n\n');
