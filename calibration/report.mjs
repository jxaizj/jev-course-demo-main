// Build calibration/results/REPORT.md from calibration.json and validation.json.
import fs from 'node:fs';
const load = s => JSON.parse(fs.readFileSync(new URL(`./results/${s}.json`, import.meta.url), 'utf8'));
const sets = ['calibration', 'validation'].filter(s => fs.existsSync(new URL(`./results/${s}.json`, import.meta.url))).map(s => [s, load(s)]);
const AB = ['A', 'B', 'C', 'D'];
const L = [];
L.push('# 评分校准报告（自动产生）', '', '由 `node calibration/run.mjs <set>` 产生原始结果，`node calibration/report.mjs` 产生本档。', '',
  '> 所有预期等级皆为 **暂定标签**：由 Claude 依官方 IV 定义拟定，并非教师或专家人工标注。验证集在规则冻结（commit c32da85）后才撰写，未用来调整规则或门槛。', '');
for (const [name, {summary: s, results}] of sets) {
  L.push(`## ${name === 'calibration' ? '校准集' : '验证集'}（${s.cases} 门课 × 11 细项 = ${s.cells} 格）`, '');
  L.push('### 修改前（v1）与修改后（v2）各向度分数', '', '| 案例 | 类型 | v1 A/B/C/D | v2 A/B/C/D | v2 状态 |', '|---|---|---|---|---|');
  for (const r of results) {
    const v1 = AB.map(a => r.legacy.abilities[a].total).join(' / ');
    const v2 = AB.map(a => r.abilities[a].total).join(' / ');
    const st = AB.map(a => ({ok: '✓', review: '复核', insufficient: '不足'})[r.abilities[a].status]).join(' ');
    L.push(`| ${r.id} | ${r.kind} | ${v1} | ${v2} | ${st} |`);
  }
  L.push('', '### 细项判定与暂定标签的一致性', '');
  L.push(`- v2 证据等级完全一致：${(s.exactAgreement * 100).toFixed(1)}%；差距 ≤1 级：${(s.within1 * 100).toFixed(1)}%`);
  L.push(`- v2 以「≥L2（有学生练习）」判断是否涵盖：一致率 ${(s.rubricAccuracyAtL2 * 100).toFixed(1)}%`);
  L.push(`- v1 以「细项 P(是) ≥ 0.5」判断是否涵盖：一致率 ${(s.legacy.detailAccuracyAt50 * 100).toFixed(1)}%；AUROC ${s.legacy.detailAuroc}；在 ${s.legacy.negatives} 个应为未涵盖的格子中误判 ${s.legacy.falsePositivesAt50} 个`);
  L.push(`- v2 误把其他证据算成此细项（预期 L0、判为 ≥L2）：${s.falseAttribution.length ? s.falseAttribution.join('、') : '无'}`);
  L.push(`- v2 漏判（预期 ≥L2、判为 <L2）：${s.missed.length ? s.missed.join('、') : '无'}`);
  L.push(`- 变形测试：段落重排 ${s.metamorphic.reorder ? '不变 ✓' : '有变动 ✗'}；内容重复 ${s.metamorphic.duplicate ? '不加分 ✓' : '加分 ✗'}；删除关键段落 ${s.metamorphic.deletion ? '等级降至 <L2 ✓' : '未下降 ✗'}`, '');
  L.push('### 等级不一致的格子', '', '| 案例 | 细项 | 暂定 | v2 |', '|---|---|---|---|');
  for (const r of results) for (const c of r.cmp) if (c.expect !== c.got) L.push(`| ${r.id} | ${c.id} | L${c.expect} | L${c.got} |`);
  L.push('', '### Laya 机率能否分辨「此细项有练习」（课程层级，全段最高 P）', '', '| 细项 | 正例数 | 负例数 | 正例平均 P | 负例平均 P | AUROC |', '|---|---|---|---|---|---|');
  for (const m of s.model) L.push(`| ${m.id} | ${m.pos} | ${m.neg} | ${m.meanPos ?? '–'} | ${m.meanNeg ?? '–'} | ${m.auroc ?? '–'} |`);
  L.push('');
}
fs.writeFileSync(new URL('./results/REPORT.md', import.meta.url), L.join('\n') + '\n');
console.log(L.join('\n'));
