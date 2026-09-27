// Exploratory probe: diagonal (right competency) vs off-diagonal responses of per-competency noul questions.
import {loadAgent} from './laya-node.mjs';
const agent = await loadAgent();
const variant = process.argv[2] || 'plain';
const Qs = {
  A1: 'Do students compare or evaluate different AI tools and choose one for a task?',
  A2: 'Do students record or reflect on how they learn with AI, such as a learning log?',
  B1: 'Must students disclose their AI use, or handle copyright or personal data rules?',
  B2: 'Do students fact-check AI output or identify AI bias, errors or security risks?',
  B3: 'Do students debate or judge the social or ethical impact of an AI application?',
  C1: 'Do students use AI to analyse real data or a real problem and propose a solution?',
  C2: 'Do students examine how an AI model works or its limits, and combine knowledge from other fields?',
  C3: 'Do students plan which steps AI does and which a human reviews in a workflow?',
  D1: 'Do students make a decision themselves and justify it, rather than following the AI?',
  D2: 'Do students interview, role-play or communicate with real people and consider their needs?',
  D3: 'Do students observe real-world situations and create their own original ideas or designs?',
};
const crit = {true: 'yes, the text describes students doing exactly this', false: 'no, the text is about something else, only states a goal, or says it is not done'};
const q = Object.fromEntries(Object.entries(Qs).map(([k, ins]) => [k, variant === 'crit' ? {type: 'noul', instructions: ins, criteria: crit} : {type: 'noul', instructions: ins}]));
const T = {
  A1: '第 3 周学生比较 ChatGPT、Perplexity、NotebookLM 整理文献的正确性与耗时，填写评比表并选定工具。',
  A2: '每周学生撰写 AI 学习日志，记录提问方式、AI 回答的问题与自己如何修正学习策略。',
  B1: '所有作业须附 AI 使用声明，标注使用的工具与提示词；并练习将客户资料去识别化。',
  B2: '学生分组用 ChatGPT 产生新闻摘要，逐句比对原始新闻，找出错误与偏误，缴交查核纪录。',
  B3: '学生针对 AI 监控员工的案例进行辩论，分析对员工与企业的影响，并撰写立场报告。',
  C1: '学生取得合作店家 300 笔销售资料，用 AI 分析销售趋势并提出库存改善方案。',
  C2: '学生测试模型在不同资料来源下的输出差异，说明其限制，并结合行销与统计知识修正分析。',
  C3: '小组绘制人机分工流程图，标出哪些步骤交给 AI、哪些由人覆核，并记录 AI 错误回报。',
  D1: '学生看完 AI 建议的补偿方案后，自行决定是否给予补偿，并写下判断理由与承担的后果。',
  D2: '学生访谈三位社区长者，了解他们使用数位服务的困难，并进行服务情境角色扮演。',
  D3: '学生实地观察夜市人潮与摊商需求，提出自己的创新服务设计，AI 只用于整理观察纪录。',
  goal: '培养学生运用 AI 的能力，提升自主学习、伦理素养、解决问题与沟通创造力。',
  tools: '使用工具：ChatGPT、Gemini、Perplexity、Copilot、NotebookLM。',
  noAI: '第 1–18 周：会计原则、分录练习、试算表编制，期中期末笔试。',
};
console.log('text  ', Object.keys(Qs).map(k => k.padStart(4)).join(' '), ' diag  maxOff');
const M = {};
for (const [n, t] of Object.entries(T)) {
  const a = (await agent.predict(t, q)).answers;
  M[n] = Object.fromEntries(Object.entries(a).map(([k, v]) => [k, v.noul]));
  const off = Object.entries(M[n]).filter(([k]) => k !== n).map(([, v]) => v);
  console.log(n.padEnd(6), Object.keys(Qs).map(k => M[n][k].toFixed(2).padStart(4)).join(' '), ' ', (M[n][n] ?? NaN).toFixed(2), ' ', Math.max(...off).toFixed(2));
}
