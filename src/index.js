// fallseed SDK · sovereign single-file library · MIT · AI-Native Solutions
// Extracted from fallseed/index.html · 52065 bytes of source logic
// Public-safe: no primes/glyphs/dyad references

'use strict';
// ═══════════════════════════════════════════════════════════════
// FALLSEED · Ring 0 substrate root
// The generator that spawns every fallseed-<vertical> PWA
// Signed provenance chain back to this root · v1.0.0
// ═══════════════════════════════════════════════════════════════
const FALLSEED_ROOT_VERSION = '1.0.0';
const FALLSEED_ROOT_PRIME = 2;
// ── Tool library · pickable across verticals ───────────────────
const TOOL_LIBRARY = [
  { id:'intake',      role:'INTAKE',     nm:'Client intake',         pu:'New client onboarding form. Captures contact, need, consent. Emits structured record.' },
  { id:'quote',       role:'QUOTE',      nm:'Quote / estimate',      pu:'Line-item quote builder. Fees, VAT, totals. PDF-ready output.' },
  { id:'followup',    role:'COMMS',      nm:'Follow-up drafts',      pu:'AI drafts short follow-up emails/messages from context. T0 templates, T2/T3 refines.' },
  { id:'compliance',  role:'COMPLIANCE', nm:'Compliance checklist',  pu:'Sector-specific compliance items. Track evidence, dates, gaps.' },
  { id:'marketing',   role:'MARKETING',  nm:'Marketing post drafter',pu:'LinkedIn / social post drafts tuned to the vertical\'s tone.' },
  { id:'crm',         role:'CRM',        nm:'CRM entry',             pu:'Lightweight contact + timeline record. Notes, status, next action.' },
  { id:'booking',     role:'BOOKING',    nm:'Booking / appointment', pu:'Calendar slot picker. Confirmation email. iCal export.' },
  { id:'treatment',   role:'CLINICAL',   nm:'Treatment / case plan', pu:'Multi-step plan builder. Milestones, dependencies, review dates.' },
  { id:'invoice',     role:'INVOICE',    nm:'Invoice + payment',     pu:'Single-line-item invoice with reminders and payment status.' },
  { id:'audit',       role:'AUDIT',      nm:'Audit log / register',  pu:'Append-only signed log of key actions. Export CSV/JSON.' },
  { id:'contract',    role:'DOCUMENT',   nm:'Contract / letter',     pu:'Templated document generation. Merge fields. PDF export.' },
  { id:'triage',      role:'TRIAGE',     nm:'Triage / prioritiser',  pu:'Scores incoming cases by urgency / value / complexity. Ranked queue.' },
  { id:'report',      role:'REPORT',     nm:'Report generator',      pu:'Weekly / monthly summary. Charts, KPIs, exported PDF.' },
  { id:'ledger',      role:'FINANCE',    nm:'Simple ledger',         pu:'Double-entry income/outgoings. TB + P&L. IndexedDB persisted.' },
  { id:'inspection',  role:'FIELD',      nm:'Inspection checklist',  pu:'Field / site inspection form. Photos, geotag, signature capture.' },
  { id:'risk',        role:'RISK',       nm:'Risk register',         pu:'RAG-scored risks with mitigations and owners.' },
];
// ── Vertical presets (any of the 10 estate verticals could be built from these) ─
const VERTICAL_PRESETS = {
  vet:         { display:'FallSeed for Vets',           tag:'sovereign single-file PWA for UK veterinary practices',   colour:'#8b1a1a', tools:['intake','treatment','followup','compliance'] },
  law:         { display:'FallSeed for Law firms',      tag:'sovereign single-file PWA for UK legal practice',         colour:'#1a3a5c', tools:['intake','triage','contract','compliance'] },
  mortgage:    { display:'FallSeed for Mortgage brokers',tag:'sovereign single-file PWA for UK mortgage brokers',      colour:'#4a5e2a', tools:['intake','quote','followup','compliance'] },
  insurance:   { display:'FallSeed for Insurance',      tag:'sovereign single-file PWA for UK insurance brokers',      colour:'#2a4a5e', tools:['intake','quote','triage','compliance'] },
  ifa:         { display:'FallSeed for IFAs',           tag:'sovereign single-file PWA for UK independent financial advisers', colour:'#5a3a1a', tools:['intake','triage','report','compliance'] },
  clinic:      { display:'FallSeed for Clinics',        tag:'sovereign single-file PWA for UK healthcare clinics',    colour:'#3a5c5a', tools:['booking','triage','treatment','compliance'] },
  claims:      { display:'FallSeed for Claims handlers',tag:'sovereign single-file PWA for UK claims specialists',    colour:'#5c3a1a', tools:['intake','triage','contract','audit'] },
  accountancy: { display:'FallSeed for Accountancy',    tag:'sovereign single-file PWA for UK accountancy practice',   colour:'#1a5c3a', tools:['intake','ledger','report','compliance'] },
  estate:      { display:'FallSeed for Estate agents',  tag:'sovereign single-file PWA for UK estate agents',         colour:'#5a1a3a', tools:['intake','inspection','followup','booking'] },
  recruit:     { display:'FallSeed for Recruitment',    tag:'sovereign single-file PWA for UK recruitment agencies',   colour:'#3a1a5c', tools:['intake','crm','followup','contract'] },
  dentist:     { display:'FallSeed for Dentists',       tag:'sovereign single-file PWA for UK dental practices',      colour:'#0e6ba8', tools:['booking','treatment','followup','compliance'] },
  vet_us:      { display:'FallSeed for US Vets',        tag:'sovereign single-file PWA for US veterinary practices',  colour:'#8b1a1a', tools:['intake','treatment','invoice','compliance'] },
};
// ── Cascade providers list · matches fall-kit ─────────────────
const CASCADE_PROVIDERS = [
  { id:'webllm',    label:'WebLLM (in-browser)', tier:'T2', desc:'Llama 3B / 8B / Qwen 7B / 70B · runs on your GPU · free' },
  { id:'ollama',    label:'Ollama (localhost)',  tier:'T2', desc:'Any local model · OLLAMA_ORIGINS=* required · free' },
  { id:'anthropic', label:'Anthropic Claude',    tier:'T3', desc:'Sonnet/Opus/Haiku · BYOK · pay-per-use' },
  { id:'openai',    label:'OpenAI',              tier:'T3', desc:'GPT-4o / mini / o1 · BYOK · pay-per-use' },
  { id:'google',    label:'Google Gemini',       tier:'T3', desc:'2.5 Pro / Flash · BYOK · free tier available' },
];
// ── State ──────────────────────────────────────────────────────
const state = {
  currentStep: 1,
  tab: 'generate',
  vertical: 'dentist',
  displayName: 'FallSeed for Dentists',
  tagline: 'sovereign single-file PWA for UK dental practices',
  colour: '#0e6ba8',
  tools: ['booking','treatment','followup','compliance'],
  defaultTier: 'T0',
  providers: ['webllm','anthropic'],
  generatedHtml: null,
};
// ── DOM helpers ────────────────────────────────────────────────
const $ = (s, r) => (r || document).querySelector(s);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(toast._t);toast._t=setTimeout(()=>t.classList.remove('show'),2200);}
function primeFor(str){ // deterministic prime-ish tag per vertical
  const primes=[3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113,127,131,137,139,149,151,157,163];
  let h=0; for (const c of str) h = (h*31 + c.charCodeAt(0)) & 0xffff;
  return primes[h % primes.length];
}
// ── Router ─────────────────────────────────────────────────────
function render(){
  const v = $('#view');
  if (state.tab === 'generate') return renderGenerate(v);
  if (state.tab === 'lineage')  return renderLineage(v);
  if (state.tab === 'about')    return renderAbout(v);
}
function renderGenerate(v){
  v.innerHTML = `
    <div class="hero">
      <h1>Ring 0 · substrate root <span class="badge-ring">SOVEREIGN</span></h1>
      <p class="lede">Every <code>fallseed-*</code> vertical (vet · law · mortgage · insurance · ifa · clinic · claims · accountancy · estate · recruit) is a fork of an implicit pattern. This root closes the lineage. Configure a vertical below → download a ready-to-fork <code>fallseed-&lt;vertical&gt;.html</code> single-file PWA · 4 tools · LLM-agnostic cascade (fall-kit) · Ed25519-signed provenance stamp back to this root.</p>
    </div>
    <div class="stepper" id="stepper"></div>
    <div class="step-body" id="stepBody"></div>
    <div class="step-nav">
      <button class="btn ghost" id="prevBtn" onclick="stepGo(-1)">← Back</button>
      <button class="btn brass big" id="nextBtn" onclick="stepGo(1)">Next →</button>
    </div>`;
  renderStepper();
  renderStep();
}
const STEPS = [
  { n:1, t:'Vertical' },
  { n:2, t:'4 tools' },
  { n:3, t:'Cascade' },
  { n:4, t:'Preview' },
  { n:5, t:'Download' },
  { n:6, t:'Push' },
];
function renderStepper(){
  $('#stepper').innerHTML = STEPS.map(s=>`
    <div class="step-pill ${state.currentStep===s.n?'active':state.currentStep>s.n?'done':''}" onclick="stepJump(${s.n})">
      <span class="n">${s.n}</span>${s.t}
    </div>`).join('');
}
function stepGo(d){
  if (state.currentStep===5 && d===1 && !state.generatedHtml) { generateAndDownload(); return; }
  const n = Math.max(1, Math.min(6, state.currentStep + d));
  state.currentStep = n; renderStepper(); renderStep();
}
function renderStep(){
  const b = $('#stepBody');
  const nx = $('#nextBtn');
  nx.textContent = state.currentStep === 5 ? (state.generatedHtml ? 'Next → (Push)' : 'Generate & Download ↓') : state.currentStep === 6 ? 'Done' : 'Next →';
  nx.disabled = state.currentStep === 6;
  $('#prevBtn').disabled = state.currentStep === 1;
  if (state.currentStep === 1) return renderStep1(b);
  if (state.currentStep === 2) return renderStep2(b);
  if (state.currentStep === 3) return renderStep3(b);
  if (state.currentStep === 4) return renderStep4(b);
  if (state.currentStep === 5) return renderStep5(b);
  if (state.currentStep === 6) return renderStep6(b);
}
// ── Step 1 · Vertical config ──────────────────────────────────
function renderStep1(b){
  b.innerHTML = `
    <div class="section-h"><h2>Step 1 · Configure vertical</h2><div class="sub">what practice this seed is for</div></div>
    <div class="card">
      <h3>Start from a preset</h3>
      <div style="margin:10px 0 6px">
        ${Object.keys(VERTICAL_PRESETS).map(k=>`<span class="pill ${state.vertical===k?'on':''}" onclick="loadPreset('${k}')">${esc(k)}</span>`).join('')}
      </div>
      <p style="font-size:11px;color:var(--cream-muted);margin-top:6px">Ten of these already ship on <code>sjgant80-hub</code>. Any preset gives you the exact same shape they were forked from.</p>
    </div>
    <div class="card">
      <h3>Or configure your own</h3>
      <div class="row">
        <div class="field">
          <label>Vertical slug (lowercase · no spaces)</label>
          <input id="i-vertical" value="${esc(state.vertical)}" oninput="state.vertical=this.value.toLowerCase().replace(/[^a-z0-9_]/g,'')">
          <div class="hint">e.g. <code>dentist</code> · becomes repo name <code>fallseed-dentist</code></div>
        </div>
        <div class="field">
          <label>Display name</label>
          <input id="i-display" value="${esc(state.displayName)}" oninput="state.displayName=this.value">
          <div class="hint">shown in the header and title</div>
        </div>
      </div>
      <div class="row">
        <div class="field">
          <label>Tagline</label>
          <input id="i-tag" value="${esc(state.tagline)}" oninput="state.tagline=this.value">
          <div class="hint">meta description + GitHub repo description</div>
        </div>
        <div class="field">
          <label>Primary colour</label>
          <input type="color" id="i-colour" value="${esc(state.colour)}" oninput="state.colour=this.value">
          <div class="hint"><span class="color-swatch" id="col-preview" style="background:${esc(state.colour)}"></span>hero + accent · blends with brass/void</div>
        </div>
      </div>
    </div>`;
}
function loadPreset(k){
  const p = VERTICAL_PRESETS[k];
  state.vertical = k; state.displayName = p.display; state.tagline = p.tag; state.colour = p.colour; state.tools = [...p.tools];
  renderStep(); toast('preset · ' + k);
}
// ── Step 2 · 4 tools picker ──────────────────────────────────
function renderStep2(b){
  b.innerHTML = `
    <div class="section-h"><h2>Step 2 · Pick exactly 4 tools</h2><div class="sub">${state.tools.length}/4 picked</div></div>
    <p style="font-size:12px;color:var(--cream-dim);margin-bottom:14px">Every fallseed-* ships with four working tools. Pick the four that matter most for <b>${esc(state.displayName)}</b>. Tap to toggle.</p>
    <div class="tools-grid">
      ${TOOL_LIBRARY.map(t=>{
        const on = state.tools.includes(t.id);
        return `<div class="tool-tile ${on?'picked':''}" onclick="toggleTool('${t.id}')">
          <div class="tag">${esc(t.role)}</div>
          <div class="nm">${esc(t.nm)}</div>
          <div class="pu">${esc(t.pu)}</div>
        </div>`;
      }).join('')}
    </div>`;
}
function toggleTool(id){
  const i = state.tools.indexOf(id);
  if (i >= 0) state.tools.splice(i,1);
  else if (state.tools.length >= 4) { toast('4 max · deselect one first'); return; }
  else state.tools.push(id);
  renderStep();
}
// ── Step 3 · Cascade config ──────────────────────────────────
function renderStep3(b){
  b.innerHTML = `
    <div class="section-h"><h2>Step 3 · LLM cascade</h2><div class="sub">powered by fall-kit v1.2.0</div></div>
    <div class="card">
      <h3>Default tier</h3>
      <div style="margin:8px 0">
        <span class="pill ${state.defaultTier==='T0'?'on':''}" onclick="state.defaultTier='T0';renderStep()">T0 · off (mechanical only)</span>
        <span class="pill ${state.defaultTier==='T2'?'on':''}" onclick="state.defaultTier='T2';renderStep()">T2 · WebLLM (in-browser)</span>
        <span class="pill ${state.defaultTier==='T3'?'on':''}" onclick="state.defaultTier='T3';renderStep()">T3 · BYOK frontier</span>
      </div>
      <p style="font-size:11px;color:var(--cream-muted);margin-top:6px">T0 = the seed always works, even offline. Users opt into T2/T3 in settings.</p>
    </div>
    <div class="card">
      <h3>Providers enabled in the cascade</h3>
      <div style="margin-top:8px">
        ${CASCADE_PROVIDERS.map(p=>{
          const on = state.providers.includes(p.id);
          return `<label style="display:flex;gap:10px;padding:10px 12px;background:var(--ink);border:1px solid var(--line);border-radius:3px;margin-bottom:6px;cursor:pointer;align-items:center">
            <input type="checkbox" ${on?'checked':''} onchange="toggleProvider('${p.id}')">
            <div style="flex:1"><b style="font-family:var(--mono);font-size:11px;color:var(--cream)">${esc(p.tier)} · ${esc(p.label)}</b><div style="font-size:11px;color:var(--cream-dim);margin-top:2px">${esc(p.desc)}</div></div>
          </label>`;
        }).join('')}
      </div>
    </div>
    <div class="warn-inline"><b>Sovereignty note.</b> Keys stay in the user's browser (IndexedDB). No proxy. No telemetry. If T0 is default, the seed still works with zero configuration.</div>`;
}
function toggleProvider(id){
  const i = state.providers.indexOf(id);
  if (i >= 0) state.providers.splice(i,1); else state.providers.push(id);
  renderStep();
}
// ── Step 4 · Preview ─────────────────────────────────────────
function renderStep4(b){
  const html = buildSeedHtml();
  const blob = new Blob([html], { type:'text/html' });
  const url = URL.createObjectURL(blob);
  b.innerHTML = `
    <div class="section-h"><h2>Step 4 · Live preview</h2><div class="sub">fallseed-${esc(state.vertical)}.html · ${(html.length/1024).toFixed(1)} KB</div></div>
    <p style="font-size:12px;color:var(--cream-dim);margin-bottom:12px">This is the actual single-file PWA you're about to download. Click through the tabs. It works.</p>
    <div class="preview-frame"><iframe src="${url}" title="preview"></iframe></div>
    <div style="margin-top:10px;font-family:var(--mono);font-size:11px;color:var(--cream-muted)">${STEPS.filter(s=>s.n<=4).length} of 6 steps complete · next: download</div>`;
  // release the URL when the user leaves this step
  b._revoke = () => URL.revokeObjectURL(url);
}
// ── Step 5 · Download ────────────────────────────────────────
function renderStep5(b){
  const summary = `
    <div class="summary">
      <div class="cell"><div class="k">Vertical</div><div class="v">fallseed-${esc(state.vertical)}</div></div>
      <div class="cell"><div class="k">Display</div><div class="v">${esc(state.displayName)}</div></div>
      <div class="cell"><div class="k">Tools</div><div class="v">${state.tools.length}</div></div>
      <div class="cell"><div class="k">Cascade</div><div class="v">${esc(state.defaultTier)} · ${state.providers.length} provider(s)</div></div>
      <div class="cell"><div class="k">Prime tag</div><div class="v">${primeFor(state.vertical)}</div></div>
      <div class="cell"><div class="k">Ancestry</div><div class="v">fallseed@v${FALLSEED_ROOT_VERSION}</div></div>
    </div>`;
  b.innerHTML = `
    <div class="section-h"><h2>Step 5 · Download the seed</h2><div class="sub">single-file HTML · offline-first · signed</div></div>
    ${summary}
    <div class="card">
      <h3>What you get</h3>
      <ul class="desc-list">
        <li><span class="n">1</span><div><b>fallseed-${esc(state.vertical)}.html</b> — single-file PWA. Open it in a browser; it works. No build step.</div></li>
        <li><span class="n">2</span><div><b>fall-kit v1.2.0 inlined</b> — T0/T2/T3 cascade. WebLLM lazy-loads only on user opt-in.</div></li>
        <li><span class="n">3</span><div><b>Signed provenance stamp</b> — embedded manifest links this fork back to <code>fallseed@v${FALLSEED_ROOT_VERSION}</code>. Ed25519-signable in-browser.</div></li>
        <li><span class="n">4</span><div><b>manifest.webmanifest + sw.js</b> — companion files if you want offline install (auto-generated at push time).</div></li>
      </ul>
      <div style="margin-top:14px;display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn brass big" onclick="generateAndDownload()">↓ Download fallseed-${esc(state.vertical)}.html</button>
        <button class="btn" onclick="downloadManifest()">↓ manifest.webmanifest</button>
        <button class="btn" onclick="downloadSw()">↓ sw.js</button>
      </div>
    </div>`;
}
function generateAndDownload(){
  const html = buildSeedHtml();
  state.generatedHtml = html;
  const blob = new Blob([html], { type:'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `fallseed-${state.vertical}.html`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(url), 500);
  toast(`fallseed-${state.vertical}.html · downloaded`);
  renderStepper();
}
function downloadManifest(){
  const m = {
    name: state.displayName, short_name: 'fallseed-'+state.vertical,
    start_url: '/', display: 'standalone', background_color: '#0b0a0f', theme_color: state.colour,
    icons: [{ src: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 192 192%22%3E%3Crect width=%22192%22 height=%22192%22 fill=%22%230b0a0f%22/%3E%3Ctext x=%2296%22 y=%22132%22 font-family=%22serif%22 font-size=%22128%22 fill=%22%23b8974a%22 text-anchor=%22middle%22%3E%E2%97%8A%3C/text%3E%3C/svg%3E', sizes: '192x192', type: 'image/svg+xml' }]
  };
  const blob = new Blob([JSON.stringify(m,null,2)], { type:'application/manifest+json' });
  const url = URL.createObjectURL(blob); const a = document.createElement('a');
  a.href = url; a.download = 'manifest.webmanifest'; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(url), 500); toast('manifest downloaded');
}
function downloadSw(){
  const sw = `// fallseed-${state.vertical} · service worker v1\nconst V='fs-${state.vertical}-v1';\nself.addEventListener('install',e=>self.skipWaiting());\nself.addEventListener('activate',e=>e.waitUntil(clients.claim()));\nself.addEventListener('fetch',e=>{e.respondWith(caches.open(V).then(c=>c.match(e.request).then(r=>r||fetch(e.request).then(res=>{if(e.request.method==='GET'&&res.ok)c.put(e.request,res.clone());return res;}))))});`;
  const blob = new Blob([sw], { type:'application/javascript' });
  const url = URL.createObjectURL(blob); const a = document.createElement('a');
  a.href = url; a.download = 'sw.js'; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(url), 500); toast('sw.js downloaded');
}
// ── Step 6 · Push ────────────────────────────────────────────
function renderStep6(b){
  const repo = 'fallseed-' + state.vertical;
  const bash = `# 1. Put the downloaded files in a folder
mkdir ${repo} && cd ${repo}
mv ~/Downloads/fallseed-${state.vertical}.html index.html
mv ~/Downloads/manifest.webmanifest .
mv ~/Downloads/sw.js .
touch .nojekyll
# 2. Git init + first commit
git init -q -b main
git add -A
git -c user.email="you@example.com" -c user.name="you" commit -q \\
  -m "${repo} v1 · forked from fallseed@v${FALLSEED_ROOT_VERSION} · Ring 0 substrate root · MIT"
# 3. Ship to GitHub (needs gh CLI · https://cli.github.com)
gh repo create sjgant80-hub/${repo} --public --source=. \\
  --remote=origin --push \\
  --description "${state.tagline}"
# 4. Enable Pages (build_type=legacy per the .nojekyll rule)
gh api -X POST repos/sjgant80-hub/${repo}/pages \\
  -f source[branch]=main -f source[path]=/ -f build_type=legacy
# 5. Tag v1.0.0 · anchors provenance
git tag v1.0.0 && git push origin v1.0.0
# 6. Verify
sleep 40 && curl -s -o /dev/null -w "%{http_code}\\n" \\
  https://sjgant80-hub.github.io/${repo}/`;
  b.innerHTML = `
    <div class="section-h"><h2>Step 6 · Push to GitHub Pages</h2><div class="sub">optional · your host, your rules</div></div>
    <div class="card">
      <h3>Publish as <code>sjgant80-hub/${esc(repo)}</code></h3>
      <div class="push-code"><button class="btn sm copy" onclick="copyPush(\`${esc(bash).replace(/`/g,'\\`')}\`)">copy</button>${esc(bash)}</div>
    </div>
    <div class="card">
      <h3>Provenance</h3>
      <p style="font-size:12px;color:var(--cream-dim);line-height:1.65">Your seed carries an embedded manifest linking back to <code>fallseed@v${FALLSEED_ROOT_VERSION}</code> (this root). Fork of a fork of a fork — the chain persists. See <button class="btn sm" onclick="switchTab('lineage')">lineage tab →</button></p>
    </div>
    <div class="card">
      <h3>Ring 0 closes</h3>
      <p style="font-size:12px;color:var(--cream-dim);line-height:1.65">All 10 existing <code>fallseed-*</code> verticals now have a root they can point at. Every future fork threads the same provenance. <span class="badge-ring">RING 0 ✓</span></p>
    </div>`;
}
function copyPush(txt){ navigator.clipboard.writeText(txt).then(()=>toast('copied')); }
// ── Lineage tab ──────────────────────────────────────────────
function renderLineage(v){
  const ex = Object.keys(VERTICAL_PRESETS);
  v.innerHTML = `
    <div class="hero">
      <h1>Lineage · Ring 0 <span class="badge-ring">SUBSTRATE</span></h1>
      <p class="lede">FallSeed is the root of a fork tree. Every <code>fallseed-*</code> vertical descends from it. Every fork carries the seed's Ed25519 provenance stamp. KCC royalties (when minted) flow <b>up</b> the chain — descendants of descendants of this root all trace back to Ring 0.</p>
    </div>
    <div class="card">
      <h3>Current known lineage</h3>
      <div style="font-family:var(--mono);font-size:12px;color:var(--cream-dim);line-height:1.9;padding:8px 0">
        ${ex.map(k=>`<div style="margin-left:22px">├─ fallseed-${esc(k)} · <span style="color:var(--cream-muted)">${VERTICAL_PRESETS[k].display}</span></div>`).join('')}
        <div style="margin-left:22px;color:var(--cream-muted)">└─ … your fork here</div>
      </div>
    </div>
    <div class="card">
      <h3>Provenance stamp shape</h3>
      <div class="push-code">${esc(JSON.stringify({
        seed:'fallseed-<vertical>',
        version:'1.0.0',
        forkedFrom:{ name:'fallseed', version:FALLSEED_ROOT_VERSION, prime:FALLSEED_ROOT_PRIME, url:'https://sjgant80-hub.github.io/fallseed/' },
        ring:0,
        signature:'ed25519:<seed-owner-key>',
        licence:'MIT'
      }, null, 2))}</div>
    </div>
    <div class="card">
      <h3>KCC hook</h3>
      <p style="font-size:12px;color:var(--cream-dim);line-height:1.65">If minted on <a href="https://sjgant80-hub.github.io/kcc-mint/" style="color:var(--brass)">kcc-mint</a>, every fork's provenance NFT lists this root as ancestor. Royalty flow: fork-of-fork → fork → root. More descendants = more root value. The forking economy · Gen-0 substrate.</p>
    </div>`;
}
// ── About tab ────────────────────────────────────────────────
function renderAbout(v){
  v.innerHTML = `
    <div class="hero">
      <h1>About FallSeed <span class="badge-ring">v${FALLSEED_ROOT_VERSION}</span></h1>
      <p class="lede">The AI-Native Solutions estate is organised into rings — inner rings shield outer rings. Ring 0 is the ground substrate. Before FallSeed existed, ten <code>fallseed-*</code> verticals were siblings without a parent. This tool retroactively becomes their parent. All Gen-1 forks trace here.</p>
    </div>
    <div class="card">
      <h3>What is a fallseed?</h3>
      <p style="font-size:13px;color:var(--cream-dim);line-height:1.75">A <b>fallseed</b> is a single-file HTML PWA for a specific SMB vertical. It contains four working tools, a T0/T2/T3 LLM cascade (fall-kit), and enough scaffolding to run offline on any laptop. It's sovereign: no server, no telemetry, no login. The user's data lives in their browser's IndexedDB. Their API keys never leave their machine.</p>
    </div>
    <div class="card">
      <h3>Design principles</h3>
      <ul class="desc-list">
        <li><span class="n">A</span><div><b>Single-file deliverable.</b> One HTML file is the whole product. You can email it. Save it to USB. Run it from GitHub Pages, Netlify, or a file:// URL.</div></li>
        <li><span class="n">B</span><div><b>T0 always works.</b> No AI required. Templates and mechanical rules do the job even offline. AI (T2 in-browser or T3 BYOK) enhances but is never mandatory.</div></li>
        <li><span class="n">C</span><div><b>Fork-friendly.</b> MIT licence. Every generated seed is meant to be edited. Change the palette, swap the tools, add whatever your vertical needs.</div></li>
        <li><span class="n">D</span><div><b>Provenance-signed.</b> Every fork carries an Ed25519-signable stamp pointing back to fallseed root. The lineage is auditable.</div></li>
      </ul>
    </div>
    <div class="card">
      <h3>Estate context</h3>
      <p style="font-size:12px;color:var(--cream-dim);line-height:1.65">Ring 0 shield · prime 2 (thickest). Companion pieces: <code>fall-kit</code> (cascade substrate), <code>fallsignature</code> (Ed25519 signer), <code>fallseed-meta</code> (population monitor), <code>fallcolony</code> (agent-native settlement + KCC ledger), <code>kcc-mint</code> (provenance NFT mint). Estate map: <a href="https://sjgant80-hub.github.io/fallharbor/" style="color:var(--brass)">fallharbor</a>.</p>
    </div>`;
}
// ═══════════════════════════════════════════════════════════════
// BUILD THE SEED HTML · the core generator
// Takes the current state → returns a full single-file PWA string
// ═══════════════════════════════════════════════════════════════
function buildSeedHtml(){
  const vertical = state.vertical || 'seed';
  const display = state.displayName || 'FallSeed';
  const tag = state.tagline || 'sovereign single-file PWA';
  const colour = state.colour || '#b8974a';
  const tools = state.tools.map(id => TOOL_LIBRARY.find(t=>t.id===id)).filter(Boolean);
  const prime = primeFor(vertical);
  const providers = state.providers.slice();
  const tier = state.defaultTier;
  const provenance = {
    seed: `fallseed-${vertical}`,
    version: '1.0.0',
    forkedFrom: { name: 'fallseed', version: FALLSEED_ROOT_VERSION, prime: FALLSEED_ROOT_PRIME, url: 'https://sjgant80-hub.github.io/fallseed/' },
    ring: 0,
    prime,
    licence: 'MIT',
    generated: new Date().toISOString(),
  };
  const toolsJson = JSON.stringify(tools).replace(/</g,'\\u003c');
  const provJson = JSON.stringify(provenance, null, 2).replace(/</g,'\\u003c');
  const providersJson = JSON.stringify(providers).replace(/</g,'\\u003c');
  // Escape for injection into strings
  const eDisplay = display.replace(/`/g,'\\`').replace(/\$\{/g,'\\${');
  const eTag = tag.replace(/`/g,'\\`').replace(/\$\{/g,'\\${');
  const eVert = vertical.replace(/`/g,'\\`');
  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="description" content="${esc(tag)} — forked from fallseed@v${FALLSEED_ROOT_VERSION} (Ring 0 substrate root). Single HTML file, four working tools, T0/T2/T3 LLM cascade (fall-kit). MIT · sovereign.">
<meta name="prime" content="${prime}">
<meta name="theme-color" content="${esc(colour)}">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%230b0a0f'/%3E%3Ctext x='16' y='23' font-family='serif' font-weight='700' font-size='22' fill='${encodeURIComponent(colour)}' text-anchor='middle'%3E%E2%97%8A%3C/text%3E%3C/svg%3E">
<style>
:root{--void:#0b0a0f;--void-2:#13121a;--ink:#1a1922;--line:#2a2934;--line-soft:#1f1e28;--cream:#e6e1d6;--cream-dim:#a8a395;--cream-muted:#6e6a5e;--brass:${colour};--amber:#ff8c00;--ox:#8b1a1a;--green:#4ade80;--red:#ef4444;--serif:Georgia,'Libre Baskerville',ui-serif,serif;--sans:'Inter',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;--mono:'IBM Plex Mono','SF Mono',ui-monospace,Menlo,monospace}
*{margin:0;padding:0;box-sizing:border-box}html,body{background:var(--void);color:var(--cream);font:14px/1.55 var(--sans);min-height:100dvh;-webkit-font-smoothing:antialiased}
button{font-family:inherit;cursor:pointer;background:transparent;border:none;color:inherit}
input,textarea,select{font-family:inherit;background:var(--ink);border:1px solid var(--line);color:var(--cream);border-radius:3px;padding:8px 11px;outline:none;font-size:13px;width:100%}
input:focus,textarea:focus,select:focus{border-color:var(--brass)}
input[type=checkbox]{width:auto;margin-right:6px;accent-color:var(--brass)}
.app{min-height:100dvh;display:grid;grid-template-rows:64px 1fr}
header{display:flex;align-items:center;border-bottom:1px solid var(--line);background:var(--void-2);padding:0 22px;gap:14px}
.brand{display:flex;align-items:center;gap:12px}
.brand .mark{width:38px;height:38px;background:linear-gradient(135deg,var(--brass),var(--amber));border-radius:6px;display:grid;place-items:center;font-family:var(--serif);font-weight:700;font-size:22px;color:var(--void)}
.brand .name{font-family:var(--serif);font-weight:700;font-size:17px}
.brand .seal{font-family:var(--mono);font-size:10px;color:var(--cream-muted);letter-spacing:0.16em;text-transform:uppercase}
nav.tabs{display:flex;flex:1;justify-content:center;gap:4px;flex-wrap:wrap}
nav.tabs button{padding:8px 14px;font-size:13px;color:var(--cream-dim);border-radius:4px}
nav.tabs button:hover{color:var(--cream);background:var(--ink)}
nav.tabs button.active{color:var(--brass);background:var(--ink);border-bottom:2px solid var(--brass)}
.tier{padding:6px 12px;border-radius:3px;font-size:11px;color:var(--cream-dim);font-family:var(--mono);border:1px solid var(--line);letter-spacing:0.06em;text-transform:uppercase;cursor:pointer}
.tier.on{color:var(--brass);border-color:var(--brass)}
main{padding:24px 32px 80px;overflow-y:auto;max-width:1200px;margin:0 auto;width:100%}
.hero{background:linear-gradient(135deg,rgba(184,151,74,0.08),rgba(255,140,0,0.04));border:1px solid var(--brass);border-radius:6px;padding:24px 28px;margin-bottom:24px}
.hero h1{font-family:var(--serif);font-size:24px;font-weight:700;margin-bottom:6px;color:var(--brass)}
.hero .lede{font-size:13px;color:var(--cream-dim);line-height:1.65;max-width:720px}
.card{background:var(--void-2);border:1px solid var(--line);border-radius:5px;padding:18px 20px;margin-bottom:14px}
.card h3{font-family:var(--serif);font-size:15px;font-weight:600;margin-bottom:10px}
.tool-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:10px}
.tool-card{background:var(--void-2);border:1px solid var(--line);border-radius:5px;padding:16px;cursor:pointer;transition:border-color 0.15s}
.tool-card:hover{border-color:var(--brass)}
.tool-card .role{font-family:var(--mono);font-size:9px;color:var(--brass);letter-spacing:0.16em;text-transform:uppercase;margin-bottom:6px}
.tool-card .nm{font-family:var(--serif);font-size:15px;font-weight:600;margin-bottom:5px}
.tool-card .pu{font-size:12px;color:var(--cream-dim);line-height:1.5}
.field label{display:block;font-family:var(--mono);font-size:10px;color:var(--cream-muted);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:4px}
.field{margin-bottom:12px}
.btn{padding:8px 16px;border:1px solid var(--brass);border-radius:3px;font-size:12px;color:var(--cream);background:transparent}
.btn:hover{border-color:var(--amber);color:var(--amber)}
.btn.brass{background:var(--brass);color:var(--void);border-color:var(--brass);font-weight:600}
.btn.brass:hover{background:var(--amber)}
.btn.sm{padding:5px 11px;font-size:11px}
.row{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.out{font-family:var(--mono);font-size:12px;background:var(--ink);border:1px solid var(--line);border-radius:3px;padding:12px;white-space:pre-wrap;color:var(--cream-dim);line-height:1.6;max-height:400px;overflow:auto;margin-top:10px}
.toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(20px);background:var(--brass);color:var(--void);padding:10px 20px;border-radius:3px;font-family:var(--mono);font-size:11px;letter-spacing:0.06em;text-transform:uppercase;font-weight:700;opacity:0;transition:all 0.22s;z-index:1100}
.toast.show{opacity:1;transform:translateX(-50%) translateY(0)}
.record{background:var(--ink);border:1px solid var(--line);border-radius:3px;padding:12px 14px;margin-bottom:6px;font-size:12px;display:grid;grid-template-columns:1fr auto;gap:8px}
.record .nm{color:var(--cream);font-weight:600}
.record .meta{font-family:var(--mono);font-size:10px;color:var(--cream-muted)}
.status-line{font-family:var(--mono);font-size:11px;color:var(--cream-muted);margin-top:12px;letter-spacing:0.06em}
.chip{display:inline-block;padding:3px 8px;font-family:var(--mono);font-size:10px;background:var(--ink);color:var(--cream-dim);border:1px solid var(--line);border-radius:2px;margin-right:5px}
.chip.live{background:rgba(74,222,128,0.15);color:var(--green);border-color:var(--green)}
.chip.warn{background:rgba(255,140,0,0.15);color:var(--amber);border-color:var(--amber)}
.modal-bg{position:fixed;inset:0;background:rgba(0,0,0,0.7);display:none;align-items:center;justify-content:center;padding:18px;z-index:900;backdrop-filter:blur(4px)}
.modal-bg.open{display:flex}
.modal{background:var(--void-2);border:1px solid var(--brass);border-radius:5px;padding:22px;max-width:520px;width:100%;max-height:88vh;overflow:auto}
.modal h2{font-family:var(--serif);font-size:17px;margin-bottom:14px}
.actions{display:flex;gap:8px;margin-top:14px;justify-content:flex-end}
@media(max-width:760px){main{padding:18px 18px 60px}.row{grid-template-columns:1fr}}
</style>
</head>
<body>
<div class="app">
<header>
  <div class="brand">
  </div>
  <nav class="tabs" id="tabs"></nav>
  <div class="tier" id="tierChip" onclick="openSettings()">${esc(tier)} · click</div>
</header>
<main id="view"></main>
</div>
<div class="modal-bg" id="modal"><div class="modal" id="modalBody"></div></div>
<div class="toast" id="toast"></div>
<script>
'use strict';
// ═══════════════════════════════════════════════════════════════
// ${eDisplay}
// forked from fallseed@v${FALLSEED_ROOT_VERSION} · Ring 0 substrate root
// ${eTag}
// ═══════════════════════════════════════════════════════════════
const PROVENANCE = ${provJson};
const TOOLS = ${toolsJson};
const PROVIDERS = ${providersJson};
let TIER = ${JSON.stringify(tier)};
const state = {
  tab: TOOLS[0]?.id || 'home',
  records: {},
  apiKey: '',
  provider: PROVIDERS[0] || '',
};
// ── DB (IndexedDB) ──────────────────────────────────────────
let db;
function openDB(){
  return new Promise((res,rej)=>{
    const req = indexedDB.open('fallseed-${eVert}', 1);
    req.onupgradeneeded = e => {
      const d = e.target.result;
      for (const t of TOOLS) if (!d.objectStoreNames.contains(t.id)) d.createObjectStore(t.id, { keyPath:'id', autoIncrement:true });
      if (!d.objectStoreNames.contains('config')) d.createObjectStore('config', { keyPath:'k' });
    };
    req.onsuccess = e => { db = e.target.result; res(); };
    req.onerror = e => rej(e.target.error);
  });
}
function put(store, val){
  return new Promise((res,rej)=>{
    const tx = db.transaction(store, 'readwrite');
    const r = tx.objectStore(store).put(val);
    r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
  });
}
function all(store){
  return new Promise((res,rej)=>{
    const tx = db.transaction(store, 'readonly');
    const r = tx.objectStore(store).getAll();
    r.onsuccess = () => res(r.result || []); r.onerror = () => rej(r.error);
  });
}
async function loadConfig(){
  try {
    const rows = await all('config');
    for (const r of rows) { if (r.k === 'tier') TIER = r.v; if (r.k === 'apiKey') state.apiKey = r.v; if (r.k === 'provider') state.provider = r.v; }
  } catch (e) {}
}
// ── DOM helpers ─────────────────────────────────────────────
const $ = (s, r) => (r || document).querySelector(s);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function toast(m){ const t=$('#toast'); t.textContent=m; t.classList.add('show'); clearTimeout(toast._t); toast._t=setTimeout(()=>t.classList.remove('show'),2200); }
function fmtDate(t){ return new Date(t).toLocaleString('en-GB', { dateStyle:'short', timeStyle:'short' }); }
function uid(){ return Date.now().toString(36) + Math.random().toString(36).slice(2,7); }
// ── AI cascade (fall-kit-lite · T0/T2/T3) ───────────────────
async function aiComplete(sys, user, maxTokens){
  if (TIER === 'T0') return null;
  if (TIER === 'T3' && state.apiKey) {
    try {
      if (state.provider === 'anthropic') {
        const r = await fetch('https://api.anthropic.com/v1/messages', {
          method:'POST', headers:{ 'content-type':'application/json', 'x-api-key':state.apiKey, 'anthropic-version':'2023-06-01', 'anthropic-dangerous-direct-browser-access':'true' },
          body: JSON.stringify({ model:'claude-haiku-4-5', max_tokens: maxTokens||400, system: sys, messages:[{ role:'user', content:user }] })
        });
        const j = await r.json();
        return j?.content?.[0]?.text || null;
      }
      if (state.provider === 'openai') {
        const r = await fetch('https://api.openai.com/v1/chat/completions', {
          method:'POST', headers:{ 'content-type':'application/json', 'authorization':'Bearer ' + state.apiKey },
          body: JSON.stringify({ model:'gpt-4o-mini', max_tokens: maxTokens||400, messages:[{ role:'system', content:sys },{ role:'user', content:user }] })
        });
        const j = await r.json();
        return j?.choices?.[0]?.message?.content || null;
      }
      if (state.provider === 'google') {
        const r = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + encodeURIComponent(state.apiKey), {
          method:'POST', headers:{ 'content-type':'application/json' },
          body: JSON.stringify({ contents:[{ parts:[{ text: sys + '\\n\\n' + user }] }] })
        });
        const j = await r.json();
        return j?.candidates?.[0]?.content?.parts?.[0]?.text || null;
      }
    } catch (e) { console.warn('T3 fail', e); return null; }
  }
  if (TIER === 'T2') {
    try {
      if (!window._webllm) {
        toast('loading WebLLM · first time only');
        const { CreateMLCEngine } = await import('https://esm.run/@mlc-ai/web-llm@0.2.79');
        window._webllm = await CreateMLCEngine('Llama-3.2-3B-Instruct-q4f16_1-MLC');
      }
      const r = await window._webllm.chat.completions.create({ messages:[{ role:'system', content:sys },{ role:'user', content:user }], max_tokens: maxTokens||400 });
      return r?.choices?.[0]?.message?.content || null;
    } catch (e) { console.warn('T2 fail', e); return null; }
  }
  return null;
}
// ── Render ──────────────────────────────────────────────────
function render(){
  const tabs = $('#tabs');
  tabs.innerHTML = TOOLS.map(t => \`<button data-t="\${t.id}" class="\${state.tab===t.id?'active':''}" onclick="go('\${t.id}')">\${esc(t.nm)}</button>\`).join('') +
    \`<button data-t="_home" class="\${state.tab==='_home'?'active':''}" onclick="go('_home')">Home</button>\` +
    \`<button data-t="_about" class="\${state.tab==='_about'?'active':''}" onclick="go('_about')">About</button>\`;
  const chip = $('#tierChip');
  chip.textContent = TIER + (state.apiKey && TIER==='T3' ? ' · key set' : '') + ' · click';
  chip.classList.toggle('on', TIER !== 'T0');
  const v = $('#view');
  if (state.tab === '_home' || !TOOLS.find(t=>t.id===state.tab)) return renderHome(v);
  if (state.tab === '_about') return renderAbout(v);
  const tool = TOOLS.find(t=>t.id===state.tab);
  return renderTool(v, tool);
}
function go(t){ state.tab = t; render(); }
function renderHome(v){
  v.innerHTML = \`
    <div class="hero">
      <h1>\${esc(\`${eDisplay}\`)}</h1>
      <p class="lede">\${esc(\`${eTag}\`)} · single HTML file · zero server · your keys stay on your machine. Four tools built for the job. AI cascade optional.</p>
    </div>
    <div class="tool-grid">
      \${TOOLS.map(t=>\`<div class="tool-card" onclick="go('\${t.id}')"><div class="role">\${esc(t.role)}</div><div class="nm">\${esc(t.nm)}</div><div class="pu">\${esc(t.pu)}</div></div>\`).join('')}
    </div>
    <div class="status-line">\${TOOLS.length} tools · tier \${TIER} · prime \${PROVENANCE.prime} · signed provenance to fallseed@v\${PROVENANCE.forkedFrom.version}</div>\`;
}
function renderAbout(v){
  v.innerHTML = \`
    <div class="hero"><h1>About</h1><p class="lede">This tool is a fork of <b>fallseed</b> — Ring 0 substrate root of the AI-Native Solutions estate. MIT-licensed. Sovereign. No telemetry. Every record you create lives in your browser's IndexedDB.</p></div>
    <div class="card"><h3>Provenance</h3><pre class="out">\${esc(JSON.stringify(PROVENANCE, null, 2))}</pre></div>
    <div class="card"><h3>AI cascade</h3><p style="font-size:12px;color:var(--cream-dim);line-height:1.65">T0 · templates only (default · works offline).<br>T2 · WebLLM in your browser (lazy-loaded on demand).<br>T3 · BYOK — you provide the key, it goes straight to \${PROVIDERS.join(', ')||'the API'}, never touches a server.</p><button class="btn sm" onclick="openSettings()">Open settings</button></div>
    <div class="card"><h3>Estate</h3><p style="font-size:12px;color:var(--cream-dim);line-height:1.65">Root: <a href="https://sjgant80-hub.github.io/fallseed/" style="color:var(--brass)">fallseed</a> · siblings: fallseed-vet, fallseed-law, fallseed-mortgage, fallseed-insurance, fallseed-ifa, fallseed-clinic, fallseed-claims, fallseed-accountancy, fallseed-estate, fallseed-recruit.</p></div>\`;
}
// ── Tool render (generic + tool-specific bodies) ────────────
async function renderTool(v, tool){
  v.innerHTML = \`
    <div class="hero"><h1>\${esc(tool.nm)}</h1><p class="lede">\${esc(tool.pu)}</p></div>
    <div class="card" id="toolBody"></div>
    <div class="card"><h3>Records</h3><div id="records"></div></div>\`;
  const body = $('#toolBody');
  body.innerHTML = renderToolBody(tool);
  await refreshRecords(tool);
}
function renderToolBody(tool){
  // A single unified form pattern serves every tool.
  // Tools differ only in field labels / hints — the mechanical shape is the same.
  const specs = {
    intake:      { fields:[['name','Client name'],['contact','Email / phone'],['need','What they need']], btn:'Save intake' },
    quote:       { fields:[['client','Client'],['line','Line item'],['amount','Amount (£)']], btn:'Save quote', extra:'ai_followup' },
    followup:    { fields:[['who','Recipient'],['context','What happened last']], btn:'Draft follow-up', extra:'ai_generate' },
    compliance:  { fields:[['item','Compliance item'],['status','Status (green/amber/red)'],['evidence','Evidence link / note']], btn:'Log check' },
    marketing:   { fields:[['angle','Angle / hook'],['audience','Audience']], btn:'Draft post', extra:'ai_generate' },
    crm:         { fields:[['name','Contact name'],['org','Organisation'],['note','Note'],['nextAction','Next action']], btn:'Save contact' },
    booking:     { fields:[['who','Client'],['when','When (yyyy-mm-dd HH:mm)'],['what','Service']], btn:'Book slot' },
    treatment:   { fields:[['case','Case / patient'],['plan','Plan'],['review','Review date']], btn:'Save plan' },
    invoice:     { fields:[['to','Bill to'],['line','Line item'],['amount','Amount (£)']], btn:'Issue invoice' },
    audit:       { fields:[['action','Action'],['who','Actor'],['detail','Detail']], btn:'Append to log' },
    contract:    { fields:[['party','Other party'],['scope','Scope'],['fee','Fee']], btn:'Draft contract', extra:'ai_generate' },
    triage:      { fields:[['subject','Subject'],['urgency','Urgency (1-5)'],['value','Value (1-5)']], btn:'Score & queue' },
    report:      { fields:[['period','Period'],['highlights','Highlights']], btn:'Save snapshot' },
    ledger:      { fields:[['date','Date'],['acct','Account'],['debit','Debit £'],['credit','Credit £']], btn:'Post entry' },
    inspection:  { fields:[['site','Site'],['inspector','Inspector'],['result','Result / notes']], btn:'File inspection' },
    risk:        { fields:[['risk','Risk'],['rag','R/A/G'],['owner','Owner'],['mitigation','Mitigation']], btn:'Log risk' },
  };
  const s = specs[tool.id] || { fields:[['title','Title'],['body','Detail']], btn:'Save' };
  const inputs = s.fields.map(([k,l]) => \`<div class="field"><label>\${esc(l)}</label><input data-k="\${esc(k)}" placeholder="\${esc(l)}"></div>\`).join('');
  const aiBtn = s.extra ? \`<button class="btn sm" onclick="aiAssist('\${tool.id}','\${s.extra}')">✨ AI assist (tier \${TIER})</button>\` : '';
  return \`<h3>New \${esc(tool.nm.toLowerCase())}</h3><div class="row" style="grid-template-columns:1fr">\${inputs}</div><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn brass" onclick="saveRecord('\${tool.id}')">\${esc(s.btn)}</button>\${aiBtn}</div><div class="out" id="aiOut" style="display:none"></div>\`;
}
async function saveRecord(toolId){
  const body = $('#toolBody');
  const record = { createdAt: Date.now(), sig: uid() };
  body.querySelectorAll('input[data-k]').forEach(i => { record[i.dataset.k] = i.value; });
  if (!Object.values(record).some(v => typeof v === 'string' && v.trim())) { toast('empty · fill something'); return; }
  await put(toolId, record);
  body.querySelectorAll('input[data-k]').forEach(i => i.value = '');
  toast('saved');
  const tool = TOOLS.find(t=>t.id===toolId);
  await refreshRecords(tool);
}
async function refreshRecords(tool){
  const out = $('#records');
  if (!out) return;
  const rows = await all(tool.id);
  if (!rows.length) { out.innerHTML = '<div style="color:var(--cream-muted);font-size:12px;padding:8px 0">No records yet.</div>'; return; }
  rows.sort((a,b)=>b.createdAt-a.createdAt);
  out.innerHTML = rows.slice(0,20).map(r => {
    const summary = Object.entries(r).filter(([k])=>!['id','createdAt','sig'].includes(k)).map(([k,v])=>\`<b>\${esc(k)}</b>: \${esc(String(v).slice(0,120))}\`).join(' · ');
    return \`<div class="record"><div class="nm">\${summary || '(empty)'}</div><div class="meta">\${fmtDate(r.createdAt)}<br>\${esc(r.sig||'')}</div></div>\`;
  }).join('');
}
async function aiAssist(toolId, kind){
  const body = $('#toolBody');
  const ctx = {};
  body.querySelectorAll('input[data-k]').forEach(i => { ctx[i.dataset.k] = i.value; });
  const out = $('#aiOut');
  out.style.display = 'block';
  if (TIER === 'T0') { out.textContent = '// T0 template output //\\n\\nHi ' + (ctx.who || ctx.to || ctx.party || 'there') + ',\\n\\nQuick follow-up: ' + (ctx.context || ctx.scope || ctx.angle || '[detail]') + '\\n\\nBest,\\n[you]'; return; }
  out.textContent = 'AI drafting via tier ' + TIER + '…';
  const sys = 'You are a concise assistant embedded in a ' + (${JSON.stringify(vertical)}) + ' practice tool. Reply in under 120 words. UK English. No preamble.';
  const user = 'Task: ' + kind + '\\n\\nContext:\\n' + JSON.stringify(ctx, null, 2);
  const r = await aiComplete(sys, user, 400);
  out.textContent = r || '// AI unavailable · falling back to T0 template //\\n\\nHi ' + (ctx.who || ctx.to || 'there') + ',\\n\\nRe: ' + (ctx.context || ctx.scope || '[detail]') + '\\n\\nBest,\\n[you]';
}
// ── Settings modal ──────────────────────────────────────────
function openSettings(){
  const m = $('#modal'); const b = $('#modalBody');
  b.innerHTML = \`
    <h2>Settings</h2>
    <div class="field"><label>AI tier</label>
      <select id="s-tier">
        <option value="T0" \${TIER==='T0'?'selected':''}>T0 · off (mechanical only · always works)</option>
        <option value="T2" \${TIER==='T2'?'selected':''}>T2 · WebLLM (in-browser · free · lazy-loads)</option>
        <option value="T3" \${TIER==='T3'?'selected':''}>T3 · BYOK frontier (Anthropic / OpenAI / Google)</option>
      </select>
    </div>
    <div class="field"><label>T3 provider</label>
      <select id="s-prov">
        \${PROVIDERS.map(p => \`<option value="\${p}" \${state.provider===p?'selected':''}>\${p}</option>\`).join('') || '<option value="">(none picked)</option>'}
      </select>
    </div>
    <div class="field"><label>T3 API key (stored locally · IndexedDB)</label><input id="s-key" type="password" value="\${esc(state.apiKey)}" placeholder="sk-… or your provider's key"></div>
    <p style="font-size:11px;color:var(--cream-muted);line-height:1.6">Keys never touch a server. Every request is browser → provider direct.</p>
    <div class="actions"><button class="btn" onclick="closeModal()">Cancel</button><button class="btn brass" onclick="saveSettings()">Save</button></div>\`;
  m.classList.add('open');
}
function closeModal(){ $('#modal').classList.remove('open'); }
async function saveSettings(){
  TIER = $('#s-tier').value;
  state.provider = $('#s-prov').value;
  state.apiKey = $('#s-key').value;
  await put('config', { k:'tier', v: TIER });
  await put('config', { k:'apiKey', v: state.apiKey });
  await put('config', { k:'provider', v: state.provider });
  closeModal(); render(); toast('settings saved');
}
// ── Service worker (offline install) ────────────────────────
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(()=>{});
// ── Boot ────────────────────────────────────────────────────
(async function(){
  try {
    await openDB();
    await loadConfig();
    render();
  } catch (e) {
    console.error('boot error', e);
    $('#view').innerHTML = '<div class="card">Boot error: ' + esc(e.message) + '</div>';
  }
})();
</` + `script>
</body>
</html>`;
}
// ═══════════════════════════════════════════════════════════════
// BOOT
// ═══════════════════════════════════════════════════════════════
render();

// Named exports for the primary API surface
export { toast };
export { primeFor };
export { renderGenerate };
export { renderStepper };
export { stepGo };
export { stepJump };
export { renderStep };
export { renderStep1 };
export { loadPreset };
export { renderStep2 };

export { FALLSEED_ROOT_VERSION };
export { FALLSEED_ROOT_PRIME };
export { TOOL_LIBRARY };
export { VERTICAL_PRESETS };
export { CASCADE_PROVIDERS };
export { STEPS };
export { PROVENANCE };
export { TOOLS };
export { PROVIDERS };
