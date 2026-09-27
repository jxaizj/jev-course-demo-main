import { strict as assert } from 'node:assert';
import { FAQS, answerFor, classifyFallback, findFAQ } from '../assets/support-engine.js';

assert.equal(FAQS.length, 6);
assert.equal(findFAQ('我想申请退款')?.id, 'refund');
assert.equal(findFAQ('页面打不开').id, 'technical');
assert.equal(classifyFallback('请转人工客服').intent, 'handoff');
assert.equal(classifyFallback('订单怎么还没发货').intent, 'order');
assert.match(answerFor('handoff'), /人工客服/);
console.log('PASS: support FAQ, intent routing and handoff checks.');
