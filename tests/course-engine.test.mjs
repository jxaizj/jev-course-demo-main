// Functional tests (behaviour of the engine). Scoring validity is measured separately in calibration/.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {splitCourse, splitUnits, analyzeUnits, scoreAbility, mergeCompetency, modelQuestions, levelOf, MODEL_POLICY} from '../assets/course-engine.js';
import {ABILITIES} from '../assets/abilities.js';
import {RUBRIC} from '../assets/rubric.js';
import {SAMPLES, REAL_SYLLABI} from '../assets/samples.js';
import {parseTokenizerJson, encodeWithData} from '../assets/laya-browser.js';

const data = parseTokenizerJson(JSON.parse(fs.readFileSync(new URL('../model/tokenizer.json', import.meta.url))));
const enc = s => encodeWithData(data, s);
let n = 0; const t = (name, fn) => { fn(); n++; console.log('ok', name); };

t('token-bounded chunking is lossless', () => {
  const sample = ABILITIES.map(a => a.good).join('\n\n');
  for (const text of ['', sample, sample.repeat(8), '🚀'.repeat(2000)]) {
    const chunks = splitCourse(text, enc, 760);
    assert.equal(chunks.join(''), text);
    assert(chunks.every(c => enc(c).length <= 760));
  }
});

t('11 official IV competencies, each with a traceable rubric entry and one model question', () => {
  const ids = ABILITIES.flatMap(a => a.comps.map(([id]) => id));
  assert.equal(ids.length, 11);
  assert.deepEqual(Object.keys(RUBRIC).sort(), [...ids].sort());
  for (const id of ids) {
    const r = RUBRIC[id];
    assert(r.trace && r.anchors.length && r.mentions && r.model && r.practice && r.output && r.checkHint, id);
  }
  assert.equal(Object.keys(modelQuestions(ids)).length, 11);
});

t('no built-in example wording is embedded in the rules (no example detection)', () => {
  const src = fs.readFileSync(new URL('../assets/rubric.js', import.meta.url), 'utf8') + fs.readFileSync(new URL('../assets/course-engine.js', import.meta.url), 'utf8');
  for (const ex of [...ABILITIES.flatMap(ab => [ab.good, ab.bad]), ...SAMPLES.map(s => s.text)]) {
    const plain = ex.replace(/\s/g, '');
    // 8-character Chinese phrases; generic product names such as "Perplexity" are allowed.
    for (let i = 0; i + 8 <= plain.length; i++) {
      const w = plain.slice(i, i + 8);
      if ((w.match(/\p{Script=Han}/gu) || []).length >= 6) assert(!src.includes(w), `rules contain example text: ${w}`);
    }
  }
});

t('sample picker: unique ids, fictional samples labelled, real syllabi only as links', () => {
  assert.equal(new Set(SAMPLES.map(s => s.id)).size, SAMPLES.length);
  assert(SAMPLES.every(s => s.title && s.text.trim() && s.label && s.kind));
  assert(SAMPLES.filter(s => !['good', 'bad'].includes(s.id)).every(s => s.kind.startsWith('虚构')));
  assert(REAL_SYLLABI.every(r => /^https:\/\//.test(r.url) && !('text' in r)));
});

t('units split on blank lines, week headings and bullets', () => {
  const u = splitUnits('课程目标：略\n第 1 周：甲\n第 2–3 周：乙\n延续说明\n\n- 报告 20%\n- 考试 80%');
  assert.deepEqual(u, ['课程目标：略', '第 1 周：甲', '第 2–3 周：乙\n延续说明', '- 报告 20%', '- 考试 80%']);
  // Schedule tables pasted from course systems.
  assert.deepEqual(splitUnits('课程进度\n1\t2/18 导论\n2\t2/25 实作'), ['课程进度', '1\t2/18 导论', '2\t2/25 实作']);
  assert.deepEqual(splitUnits('进度\n1 2/18 导论\n2 2/25 实作'), ['进度', '1 2/18 导论', '2 2/25 实作']);
});

const levels = (text, title = '测试课程') => {
  const a = analyzeUnits(splitUnits(text), title);
  return Object.fromEntries(Object.keys(RUBRIC).map(id => [id, mergeCompetency(id, a).level]));
};
const B2 = 'B-2-IV-1';

t('evidence ladder L1 → L4 for one competency', () => {
  assert.equal(levels('培养学生查证 AI 资讯的能力。')[B2], 1);
  assert.equal(levels('第 5 周：学生分组用 AI 产生摘要，逐句比对原始来源找出错误。')[B2], 3); // 比对 is a check
  assert.equal(levels('第 5 周：学生分组用 AI 产生摘要，找出幻觉内容。')[B2], 2);
  assert.equal(levels('第 5 周：学生分组用 AI 产生摘要，找出幻觉内容，缴交纪录。')[B2], 3);
  assert.equal(levels('第 5 周：学生分组用 AI 产生摘要，找出幻觉内容，缴交纪录，占 10%。')[B2], 4);
});

t('goal-only and "透过…培养" statements never count as practice', () => {
  assert.equal(levels('透过专题培养学生运用 AI 解决问题的能力。')['C-1-IV-1'], 1);
  assert.equal(levels('让学生善用 AI 工具，提升学习效能。')['A-1-IV-1'], 1);
});

t('negated clauses are ignored', () => {
  const l = levels('本课程不安排 AI 工具的比较活动，也不要求学生揭露 AI 使用。\n第 2 周：学生完成习题。');
  assert.equal(l['A-1-IV-1'], 0); assert.equal(l['B-1-IV-1'], 0);
});

t('a course without any AI wording gets no evidence', () => {
  const l = levels('第 3 周：学生分组访谈社区长者，缴交访谈纪录，依尺规评分。', '社区服务学习');
  assert(Object.values(l).every(v => v === 0));
});

t('tool names alone are not evidence', () => {
  const l = levels('使用工具：ChatGPT、Gemini、Copilot。\n评分：期中 50%、期末 50%。');
  assert(Object.values(l).every(v => v === 0));
});

const course = 'AI 课程\n\n第 2 周：学生比较 ChatGPT 与 Gemini 整理笔记的效果，填写评比表。\n\n第 6 周：学生用 AI 产生新闻摘要，找出幻觉内容。\n\n第 9 周：学生访谈两位店家，撰写访谈纪录并反思。\n\n评量：\n- 查核纪录 20%';
t('evidence is merged across units (activity in one unit, grading line in another)', () => {
  assert.equal(levels(course)[B2], 4);
});
t('reordering and duplicating units do not change levels', () => {
  const units = splitUnits(course), base = levels(course);
  assert.deepEqual(levels([...units].reverse().join('\n\n')), base);
  assert.deepEqual(levels(units.concat(units, units).join('\n\n')), base);
});
t('removing the key activity lowers the level', () => {
  const without = splitUnits(course).filter(u => !u.includes('幻觉')).join('\n\n');
  assert.equal(levels(without)[B2], 1);
});
t('evidence only at the end of a long course is found', () => {
  const filler = Array.from({length: 40}, (_, i) => `第 ${i + 1} 周：统计方法第 ${i + 1} 章，教师讲授，学生阅读课本。`).join('\n');
  assert.equal(levels(filler + '\n第 41 周：学生绘制人机分工流程图，标出哪些步骤由 AI 处理、哪些由人工覆核，缴交流程图。')['C-3-IV-1'], 4);
});

t('scores: level mean ×25, metrics defined, null when nothing relevant', () => {
  const a = analyzeUnits(splitUnits(course), 'AI');
  const r = scoreAbility(ABILITIES[1], a, null);
  assert.equal(r.total, Math.round((levelOf(mergeCompetency('B-1-IV-1', a)) + 4 + levelOf(mergeCompetency('B-3-IV-1', a))) / 12 * 100));
  const empty = scoreAbility(ABILITIES[0], analyzeUnits(['第 1 周：学生阅读课本。'], '会计'), null);
  assert.equal(empty.total, 0); assert.equal(empty.scores.supported, null); assert.equal(empty.scores.boilerplate, null);
  assert.equal(empty.status, 'insufficient');
});

t('model probabilities never change levels, scores or review status; agreement is descriptive', () => {
  const a = analyzeUnits(splitUnits(course), 'AI');
  const low = a.map(() => Object.fromEntries(Object.keys(RUBRIC).map(id => [id, 0.01])));
  const high = a.map(() => Object.fromEntries(Object.keys(RUBRIC).map(id => [id, 0.99])));
  for (const ab of ABILITIES) {
    const base = scoreAbility(ab, a, null), rl = scoreAbility(ab, a, low), rh = scoreAbility(ab, a, high);
    for (const r of [rl, rh]) {
      assert.deepEqual([r.total, r.scores, r.status], [base.total, base.scores, base.status]);
      assert.deepEqual(r.comps.map(c => c.review), base.comps.map(c => c.review));
    }
    rl.comps.forEach(c => assert.equal(c.modelAgrees, c.level < 2));
    rh.comps.forEach(c => assert.equal(c.modelAgrees, c.level >= 2));
    assert(base.comps.every(c => c.modelAgrees === null));
  }
  assert(MODEL_POLICY.agree > 0 && MODEL_POLICY.agree < 1);
});

t('practice found only in units without AI wording is flagged for review (A/B/C)', () => {
  const a = analyzeUnits(splitUnits('AI 导论\n\n第 3 周：学生分组将病历资料去识别化，缴交处理纪录。'), '');
  const r = scoreAbility(ABILITIES[1], a, null);
  const b1 = r.comps.find(c => c.id === 'B-1-IV-1');
  assert(b1.level >= 2 && b1.review); assert.equal(r.status, 'review');
});

console.log(`PASS: ${n} functional tests.`);
