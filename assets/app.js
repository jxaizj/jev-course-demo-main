import { FAQS, answerFor, classifyFallback, findFAQ, intentLabel } from './support-engine.js';

const $ = id => document.getElementById(id);
const esc = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const now = () => new Intl.DateTimeFormat('zh-CN', { hour: '2-digit', minute: '2-digit' }).format(new Date());
const MODEL_INTENTS = { refund: 'refund', technical_help: 'technical', billing_question: 'billing', information: 'product', cancellation: 'account', other: 'other' };

let worker;
let requestId = 0;
let loading;
let modelReady = false;
let modelCalls = 0;
let handoff = false;
let messages = [];
const pending = new Map();

function rpc(method, ...args) {
  if (!worker) {
    worker = new Worker(new URL('./model-worker.js', import.meta.url), { type: 'module' });
    worker.onmessage = ({ data }) => {
      if (data.event === 'progress') {
        const percent = Math.min(100, data.done / data.total * 100);
        $('modelProgress').value = percent;
        $('modelProgress').hidden = false;
        $('modelInfo').textContent = `下载本地模型 ${Math.round(percent)}% · ${Math.round(data.done / 1e6)} / ${Math.round(data.total / 1e6)} MB`;
        return;
      }
      const task = pending.get(data.id);
      if (!task) return;
      pending.delete(data.id);
      data.error ? task.reject(new Error(data.error)) : task.resolve(data.result);
    };
    worker.onerror = event => {
      pending.forEach(task => task.reject(new Error(event.message || '背景模型执行失败')));
      pending.clear(); worker.terminate(); worker = null; modelReady = false;
    };
  }
  return new Promise((resolve, reject) => {
    const id = ++requestId;
    pending.set(id, { resolve, reject });
    worker.postMessage({ id, method, args });
  });
}

function setModelState(kind, label, info) {
  $('modelDot').className = `dot ${kind}`;
  $('modelState').textContent = label;
  $('modelInfo').textContent = info;
}

async function loadModel() {
  if (modelReady) return true;
  if (loading) return loading;
  loading = (async () => {
    $('loadModel').disabled = true;
    setModelState('loading', 'Laya 载入中', '首次载入约 300 MB，完成后使用浏览器快取；资料不会离开本机。');
    try {
      const result = await rpc('load');
      modelReady = true; $('loadModel').hidden = true; $('modelProgress').hidden = true;
      $('modelBackend').textContent = `WASM × ${result.threads}`;
      setModelState('ready', 'Laya 本地已就绪', '聊天分流会在浏览器内执行，未连接远端模型 API。');
      return true;
    } catch (error) {
      $('loadModel').disabled = false;
      setModelState('error', '模型载入失败', `${error.message}；仍可使用 FAQ 与规则分流。`);
      return false;
    } finally { loading = null; }
  })();
  return loading;
}

function renderFaqs() {
  $('faqList').innerHTML = FAQS.map(faq => `<button class="faq" type="button" data-question="${esc(faq.question)}"><span>${esc(faq.title)}</span><b>${esc(faq.question)}</b></button>`).join('');
  $('faqList').querySelectorAll('[data-question]').forEach(button => button.addEventListener('click', () => sendText(button.dataset.question)));
}

function renderMessages() {
  $('messages').innerHTML = messages.map(message => `<article class="message ${message.role}">
    <div class="avatar">${message.role === 'user' ? '我' : 'J'}</div>
    <div class="bubble-wrap"><div class="bubble">${esc(message.text).replace(/\n/g, '<br>')}</div><time>${message.source ? esc(message.source) + ' · ' : ''}${message.time}</time></div>
  </article>`).join('');
  $('messages').scrollTop = $('messages').scrollHeight;
}

function addMessage(role, text, source = '') {
  messages.push({ role, text, source, time: now() });
  renderMessages();
}

function setTyping(show) {
  $('typing').hidden = !show;
  if (show) $('messages').scrollTop = $('messages').scrollHeight;
}

function updateIntent(intent, confidence, source, raw = '') {
  const label = intentLabel(intent);
  $('intentName').textContent = label;
  $('intentRoute').textContent = intent === 'handoff' ? '人工客服队列' : ({ order: '订单服务', refund: '售后服务', account: '账号支持', product: '产品顾问', technical: '技术支持', billing: '财务与账单', other: '通用客服' }[intent] || '通用客服');
  $('intentConfidence').textContent = `${Math.round((confidence || 0) * 100)}%`; $('intentBar').style.width = `${Math.round((confidence || 0) * 100)}%`;
  $('intentSource').textContent = source || '规则兜底';
  $('rawIntent').textContent = raw ? JSON.stringify(raw, null, 2) : '尚未执行 Laya 分流';
}

async function classify(text) {
  const fallback = classifyFallback(text);
  if (fallback.handoff || !modelReady) return { ...fallback, source: modelReady ? '本地规则 · 优先转人工' : '本地规则兜底' };
  try {
    const result = await rpc('triage', text); modelCalls++;
    const answer = result?.answers?.intent;
    const modelIntent = MODEL_INTENTS[answer?.choice] || 'other';
    const intent = fallback.intent !== 'other' ? fallback.intent : modelIntent;
    return { intent, confidence: fallback.intent !== 'other' ? fallback.confidence : (answer?.confidence || 0), source: 'Laya 本地推理', raw: result };
  } catch (error) {
    return { ...fallback, source: `规则兜底 · ${error.message}` };
  }
}

async function sendText(value) {
  const text = String(value || '').trim();
  if (!text) return;
  $('composer').value = '';
  addMessage('user', text);
  setTyping(true);
  const faq = findFAQ(text);
  const result = await classify(text);
  if (result.intent === 'handoff') handoff = true;
  updateIntent(result.intent, result.confidence, result.source, result.raw);
  await new Promise(resolve => setTimeout(resolve, 260));
  setTyping(false);
  addMessage('assistant', handoff && result.intent !== 'handoff' ? '当前会话已在人工队列中，我会把这条消息一并转交。请稍候。' : answerFor(result.intent, faq), result.source);
  $('callCount').textContent = String(modelCalls);
}

function transferToHuman() {
  handoff = true;
  updateIntent('handoff', 0.99, '用户主动选择');
  addMessage('assistant', '已转人工客服。请留下订单号、联系方式和问题详情，人工接入后会继续处理。', '人工队列');
  $('handoffButton').disabled = true; $('handoffButton').textContent = '已进入人工队列';
}

function resetConversation() {
  handoff = false; messages = [];
  $('handoffButton').disabled = false; $('handoffButton').textContent = '转人工客服';
  updateIntent('other', 0, '等待下一条消息');
  addMessage('assistant', '你好，我是 Jev 本地客服 Demo。可以直接提问，也可以从右侧 FAQ 开始。', '本地 FAQ');
}

$('loadModel').addEventListener('click', () => void loadModel());
$('handoffButton').addEventListener('click', transferToHuman);
$('newChat').addEventListener('click', resetConversation);
$('composerForm').addEventListener('submit', event => { event.preventDefault(); void sendText($('composer').value); });
$('composer').addEventListener('keydown', event => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); $('composerForm').requestSubmit(); } });
$('showRaw').addEventListener('click', () => { $('rawPanel').hidden = !$('rawPanel').hidden; });
renderFaqs(); resetConversation();
