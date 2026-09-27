// Agent uses its browser provider when window exists, including in this dedicated worker.
self.window=self;
const MODEL_BASE = new URL("../model/", import.meta.url).href;
const CACHE = "laya-ts";
let manifest = null;
const progress = { done: 0, total: 1, files: {} };
const origFetch = window.fetch.bind(window);

async function readWithProgress(url, key) {
  const res = await origFetch(url);
  if (!res.ok) throw new Error(`下载失败：${url}（${res.status}）`);
  const reader = res.body.getReader(); const chunks = []; let got = 0;
  for (;;) { const { done, value } = await reader.read(); if (done) break; chunks.push(value); got += value.length; progress.files[key] = got; renderProgress(); }
  return new Blob(chunks);
}
window.fetch = async (input, init) => {
  const url = input instanceof URL ? input.href : typeof input === "string" ? input : input.url;
  if (init || !manifest || !url.startsWith(MODEL_BASE)) return origFetch(input, init);
  const name = url.slice(MODEL_BASE.length), entry = manifest.files[name];
  if (!entry) return origFetch(input, init);
  try { const hit = await (await caches.open(CACHE)).match(url); if (hit) { progress.files[name] = entry.size; renderProgress(); return hit; } } catch {}
  const blobs = [];
  for (const part of entry.parts || [name]) blobs.push(await readWithProgress(MODEL_BASE + part, name + "#" + part));
  for (const part of entry.parts || [name]) delete progress.files[name + "#" + part];
  progress.files[name] = entry.size;
  return new Response(new Blob(blobs), { status: 200, headers: { "Content-Type": "application/octet-stream" } });
};
function renderProgress() { self.postMessage({ event: 'progress', done: Object.values(progress.files).reduce((a, b) => a + b, 0), total: progress.total }); }
let model;
self.onmessage = async ({ data: { id, method, args } }) => {
  try {
    let result;
    if (method === 'load') {
      const { Agent, triageQuestions } = await import('./laya-browser.js');
      const res = await origFetch(MODEL_BASE + 'manifest.json');
      if (!res.ok) throw new Error('无法取得模型清单');
      manifest = await res.json(); progress.total = Object.values(manifest.files).reduce((n, f) => n + f.size, 0);
      const ort = await import('https://cdn.jsdelivr.net/npm/onnxruntime-web@1.30.0/dist/ort.bundle.min.mjs');
      const threads = self.crossOriginIsolated ? Math.min(4, navigator.hardwareConcurrency || 4) : 1;
      ort.env.wasm.numThreads = threads;
      model = await Agent.load(MODEL_BASE.replace(/\/$/, ''), { numThreads: threads });
      self.triageQuestions = triageQuestions;
      result = { threads };
    } else if (method === 'triage') {
      if (!model || !self.triageQuestions) throw new Error('模型尚未载入');
      result = await model.predict(String(args[0] || ''), self.triageQuestions());
    } else if (method === 'predict') {
      result = await model.predict(...args);
    } else if (method === 'prepare') {
      const { splitCourse } = await import('./course-engine.js');
      result = splitCourse(args[0], s => model.tok.encode(s), model.maxLen - model.headMaxLen - 8);
    } else throw new Error('Unknown worker method');
    self.postMessage({ id, result });
  } catch (e) { self.postMessage({ id, error: e.message || String(e) }); }
};
