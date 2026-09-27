export const FAQS = [
  { id: 'order', intent: 'order', title: '订单 / 物流查询', question: '我的订单到哪了？', tags: ['订单', '物流', '快递', '配送', '发货', 'order'], answer: '可以先到「订单」查看最新物流节点。若订单超过预计送达时间，请把订单号发给人工客服，我们会继续帮你查。' },
  { id: 'refund', intent: 'refund', title: '退款与售后', question: '如何申请退款？', tags: ['退款', '退货', '售后', '钱', 'refund'], answer: '进入订单详情后选择「申请售后」，按页面提交原因与凭证即可。已发货订单的退款进度，也可以转人工帮你核对。' },
  { id: 'account', intent: 'account', title: '账号与登录', question: '忘记密码怎么办？', tags: ['密码', '登录', '账号', '验证码', 'account'], answer: '在登录页点击「忘记密码」，通过绑定手机或邮箱重置即可。若收不到验证码，请转人工处理。' },
  { id: 'product', intent: 'product', title: '产品与服务', question: '你们提供哪些服务？', tags: ['产品', '服务', '功能', '价格', '套餐', 'information'], answer: '这是一个本地客服 Demo，当前展示聊天、FAQ、意图分流和转人工流程。需要具体产品信息时，请告诉我你想了解的功能。' },
  { id: 'technical', intent: 'technical', title: '使用故障', question: '页面打不开或报错怎么办？', tags: ['打不开', '报错', '故障', '异常', 'bug', 'technical'], answer: '请先刷新页面并确认网络正常；如果仍然异常，请描述操作步骤或贴出错误信息，我会先分流到技术支持。' },
  { id: 'billing', intent: 'billing', title: '发票 / 账单', question: '如何开具发票？', tags: ['发票', '账单', '支付', '扣款', 'invoice', 'billing'], answer: '在订单或账单详情中选择「申请发票」。如果抬头或金额需要修改，建议转人工客服核对。' },
];

const RULES = [
  ['handoff', /人工|真人|投诉|负责人|转接/iu],
  ['order', /订单|物流|快递|配送|发货|到哪|进度/iu],
  ['refund', /退款|退货|售后|退钱|赔付/iu],
  ['account', /登录|登陆|密码|账号|帐号|验证码|绑定/iu],
  ['technical', /报错|错误|故障|异常|打不开|无法|bug|崩溃|技术/iu],
  ['billing', /发票|账单|支付|扣款|付款|收据/iu],
  ['product', /产品|服务|功能|价格|套餐|怎么用|介绍/iu],
];

export function findFAQ(text) {
  const value = String(text || '').trim().toLowerCase();
  if (!value) return null;
  let best = null;
  for (const faq of FAQS) {
    const score = faq.tags.reduce((n, tag) => n + (value.includes(tag.toLowerCase()) ? 1 : 0), 0);
    if (score && (!best || score > best.score)) best = { faq, score };
  }
  return best?.faq || null;
}

export function classifyFallback(text) {
  const value = String(text || '').trim();
  if (!value) return { intent: 'other', confidence: 0, handoff: false };
  for (const [intent, pattern] of RULES) {
    if (pattern.test(value)) return { intent, confidence: intent === 'handoff' ? 0.99 : 0.86, handoff: intent === 'handoff' };
  }
  return { intent: 'other', confidence: 0.45, handoff: false };
}

export function intentLabel(intent) {
  return ({ order: '订单进度', refund: '退款售后', account: '账号登录', product: '产品咨询', technical: '技术支持', billing: '账单发票', handoff: '转人工', other: '其他咨询' })[intent] || '其他咨询';
}

export function answerFor(intent, faq) {
  if (faq) return faq.answer;
  if (intent === 'handoff') return '好的，我已为你转接人工客服。请留下订单号或问题详情，人工客服接入后会继续处理。';
  if (intent === 'order') return '我已识别为订单进度问题。请提供订单号，或直接点击右侧「转人工」，我们会帮你查询。';
  if (intent === 'refund') return '我已识别为退款售后问题。你可以先查看订单详情中的售后入口，也可以转人工核对具体进度。';
  if (intent === 'technical') return '我已识别为技术支持问题。请补充操作步骤、设备和报错信息；如果问题紧急，可以直接转人工。';
  if (intent === 'account') return '我已识别为账号登录问题。先尝试通过绑定手机或邮箱重置密码，仍无法登录就转人工。';
  if (intent === 'billing') return '我已识别为账单发票问题。请说明订单号、抬头或扣款情况，我可以继续分流。';
  return '我暂时没有在 FAQ 中找到完全匹配的答案。你可以换一种说法，或点击右侧「转人工」继续处理。';
}

if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'test') {
  console.assert(findFAQ('我想申请退款')?.id === 'refund');
  console.assert(classifyFallback('页面打不开').intent === 'technical');
}

