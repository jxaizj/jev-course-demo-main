// Exploratory probe: competency specificity via one choice question over all 11 IV competencies.
import {loadAgent} from './laya-node.mjs';
import {ABILITIES} from '../assets/abilities.js';
const agent = await loadAgent();
const OPTS = {
  N: 'none of these; no AI-related learning activity',
  A1: 'students evaluate and choose AI tools for learning tasks',
  A2: 'students keep a reflective log of self-directed learning with AI',
  B1: 'students disclose AI use and handle copyright or personal data',
  B2: 'students fact-check AI output or identify AI security and bias risks',
  B3: 'students judge the social impact of AI and take responsibility',
  C1: 'students analyse a real problem with AI and verify the solution',
  C2: 'students examine AI limitations and integrate cross-field knowledge',
  C3: 'students design a human-AI workflow and review AI errors',
  D1: 'students make their own decisions instead of following AI',
  D2: 'students practise empathy through communication or role-play with people',
  D3: 'students observe real-world needs and create original ideas',
};
const q = {c: {type: 'choice', instructions: 'Which learning activity does this course text describe most clearly?', criteria: OPTS}};
const texts = {
  ...Object.fromEntries(ABILITIES.map(a => ['good' + a.id, a.good])),
  ...Object.fromEntries(ABILITIES.map(a => ['bad' + a.id, a.bad])),
  toolsOnly: '使用工具：ChatGPT、Gemini、Perplexity、Copilot、NotebookLM。',
  factcheck: '第 7 周学生分组用 ChatGPT 产生三则新闻摘要，逐句比对原始新闻，缴交查核纪录表。',
  unrelated: '第 7 周学生分组操作滴定实验，缴交实验纪录表，依数据正确率评分。',
  interview: '第 12 周学生访谈三位社区长者，了解他们使用数位服务的困难，撰写访谈纪录并提出改善构想。',
};
for (const [n, t] of Object.entries(texts)) {
  const p = (await agent.predict(t, q)).answers.c.probabilities;
  const top = Object.entries(p).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k, v]) => `${k}:${v.toFixed(2)}`);
  console.log(n.padEnd(10), top.join(' '));
}
