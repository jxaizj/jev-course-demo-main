// Exploratory probe: can the checkpoint tell "goal only" from "practice / output / assessment"?
import {loadAgent} from './laya-node.mjs';
const agent = await loadAgent();
const T = {
  goal: '本课程培养学生查核 AI 生成内容的能力，建立资讯查证观念。',
  mention: '学生将了解 AI 可能产生错误资讯，并认识事实查核的重要性。',
  practice: '第 7 周课堂上，学生分组用 ChatGPT 产生三则新闻摘要，逐句比对原始新闻找出错误。',
  output: '第 7 周学生分组用 ChatGPT 产生三则新闻摘要，逐句比对原始新闻，缴交查核纪录表，标出每一处错误与正确来源。',
  assess: '第 7 周学生分组用 ChatGPT 产生三则新闻摘要，逐句比对原始新闻，缴交查核纪录表并撰写反思；教师依查核正确率与来源完整度评分，占学期成绩 10%。',
  negated: '本课程不安排 AI 内容查核的练习或作业，仅于期末提及资讯查证的重要性。',
  toolsOnly: '使用工具：ChatGPT、Gemini、Perplexity、Copilot、NotebookLM。',
  unrelated: '第 7 周学生分组操作滴定实验，缴交实验纪录表，依数据正确率评分。',
  otherAI: '第 7 周学生分组用 ChatGPT 比较三种 AI 工具的摘要速度，填写工具评比表并说明选用理由。',
};
const Q = {
  en_default: {type: 'noul', instructions: 'Do students check whether AI-generated content is correct?'},
  en_practice: {type: 'noul', instructions: 'Do students actually carry out an activity in which they check AI-generated content against sources?',
    criteria: {true: 'the text describes a concrete student activity checking AI output', false: 'the text only states a goal, mentions the topic, or describes no such activity'}},
  en_output: {type: 'noul', instructions: 'Do students hand in a concrete product (record, report, form) from checking AI-generated content?',
    criteria: {true: 'a named deliverable from the checking activity is required', false: 'no deliverable is named'}},
  en_assess: {type: 'noul', instructions: 'Is the fact-checking work graded, reviewed, or reflected on with stated criteria?',
    criteria: {true: 'grading, criteria, weighting, feedback or written reflection is stated', false: 'no assessment or reflection is stated'}},
  zh_practice: {type: 'noul', instructions: '学生是否实际进行查核 AI 生成内容的课堂活动？',
    criteria: {true: '有具体的学生查核活动', false: '只写目标、只提到主题，或没有这类活动'}},
  zh_assess: {type: 'noul', instructions: '查核成果是否有评分、评量标准或反思？',
    criteria: {true: '写明评分、标准、配分或反思', false: '没有写明评量或反思'}},
  choice_tier: {type: 'choice', instructions: 'What is the strongest evidence that students verify AI-generated content?',
    criteria: {P: 'no such content at all', Q: 'only a goal or a mention of the topic', R: 'students do a verification activity', S: 'students produce a named verification record', T: 'verification work is graded or reflected on'}},
};
console.log('text'.padEnd(10), Object.keys(Q).join(' | '));
for (const [name, t] of Object.entries(T)) {
  const r = (await agent.predict(t, Q)).answers;
  console.log(name.padEnd(10), Object.entries(r).map(([k, v]) => v.type === 'choice' ? v.choice + JSON.stringify(Object.values(v.probabilities).map(x => +x.toFixed(2))) : v.noul.toFixed(2)).join(' | '));
}
