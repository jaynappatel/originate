const CONNECTOR_IDS = [
  'grata', 'affinity', 'clay', 'gmail', 'google-drive',
  'apollo', 'salesforce', 'linkedin-recruiter', 'costar',
];

const ROLES = [
  { key: 'discovery', label: 'Discovery' },
  { key: 'enrichment', label: 'Enrichment' },
  { key: 'crm', label: 'CRM' },
  { key: 'comms', label: 'Comms' },
  { key: 'documentStore', label: 'Document store' },
];

const CORE_SKILLS = [
  'category-research', 'discover-entities', 'score-entities', 'enrich-entities',
  'check-crm-history', 'draft-outreach', 'diligence-specialist', 'diligence-memo',
  'sync-to-crm',
];

let config = null;
let connectorCatalog = [];

function blankConfig() {
  return {
    org: { name: 'Your Company', approverTitle: 'deal lead', voiceProfiles: [{ id: 'default', styleNotes: 'Direct, specific, references one real detail about the entity.' }] },
    vertical: 'custom',
    vocabulary: { entity: 'company', entityPlural: 'companies', verdicts: ['PROCEED', 'PASS'] },
    pipeline: {
      stages: [
        { id: 'category-research', order: 10, enabled: true },
        { id: 'discover-entities', order: 15, enabled: true },
        { id: 'check-crm-history', order: 18, enabled: true },
        { id: 'score-entities', order: 20, enabled: true },
        { id: 'enrich-entities', order: 30, enabled: true },
        { id: 'draft-outreach', order: 35, enabled: true },
        { id: 'sync-to-crm', order: 40, enabled: true },
      ],
      stageA: { unitNoun: 'category', inputNoun: 'category name' },
    },
    criteria: {
      stageAQuestions: [
        { title: 'Fit thesis', prompt: 'What defines a qualifying entity for this pipeline?', jsonKey: 'fit_thesis' },
      ],
      immediatePass: [],
      tiers: [],
      judgmentSignals: [],
      redFlags: [],
      onMissingData: 'null-and-flag',
    },
    connectors: { discovery: [], enrichment: [], crm: [], comms: [], documentStore: [] },
    diligence: { enabled: false, specialists: [] },
    budget: {},
    agentRuntime: { primary: 'claude-code', skillEditing: 'both' },
  };
}

async function fetchJson(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`failed to fetch ${path}: ${res.status}`);
  return res.json();
}

async function loadConnectorCatalog() {
  const entries = await Promise.all(CONNECTOR_IDS.map(async (id) => {
    const data = await fetchJson(`../templates/connectors/${id}/connector.json`);
    return data;
  }));
  connectorCatalog = entries;
}

async function loadVertical(name) {
  if (name === 'custom') {
    config = blankConfig();
    return;
  }
  config = await fetchJson(`../templates/verticals/${name}/config.starter.json`);
}

function setActiveButton(container, value, attr) {
  container.querySelectorAll('button').forEach((b) => {
    b.classList.toggle('active', b.getAttribute(attr) === value);
  });
}

function setPet(elementId, state) {
  const el = document.getElementById(elementId);
  if (!el) return;
  const size = el.classList.contains('large') ? 64 : 28;
  el.innerHTML = renderPetSVG(state, size);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---------- onboarding gate ----------

const ONBOARDING_STEPS = [
  { state: 'thinking', status: 'Reading what you described...', log: '> parsing purpose statement' },
  { state: 'searching', status: 'Matching against the closest starting point...', log: '> comparing against vertical playbooks' },
  { state: 'generating', status: 'Writing your config and rendering skills...', log: '> resolving criteria, connectors, and voice profile' },
];

async function runOnboarding() {
  const vertical = document.getElementById('ob-vertical').value;
  const purpose = document.getElementById('ob-purpose').value.trim();
  const statusEl = document.getElementById('onboarding-status');
  const logEl = document.getElementById('onboarding-log');
  const doneEl = document.getElementById('onboarding-done');
  const generateBtn = document.getElementById('ob-generate-btn');
  const enterBtn = document.getElementById('ob-enter-btn');

  generateBtn.disabled = true;
  doneEl.hidden = true;
  enterBtn.hidden = true;
  logEl.textContent = '';

  await loadVertical(vertical);
  if (purpose) config.org.purposeNote = purpose;

  for (const step of ONBOARDING_STEPS) {
    setPet('onboarding-pet', step.state);
    statusEl.textContent = step.status;
    logEl.textContent += `${step.log}\n`;
    await sleep(700);
  }

  setPet('onboarding-pet', 'done');
  statusEl.textContent = 'Done.';
  const specialistCount = (config.diligence.specialists || []).length;
  doneEl.innerHTML = `<b>${config.org.name}</b> is ready. Config written, skills rendered for the ${vertical === 'custom' ? 'blank' : vertical} starting point`
    + (specialistCount ? ` with ${specialistCount} diligence specialist(s)` : '')
    + `. Open the console to review or edit anything before it runs.`;
  doneEl.hidden = false;
  enterBtn.hidden = false;
  generateBtn.disabled = false;
}

function enterConsole() {
  document.getElementById('onboarding').hidden = true;
  document.getElementById('main-shell').hidden = false;
  setActiveButton(document.getElementById('vertical-switcher'), config.vertical || 'custom', 'data-vertical');
  renderSidebar();
  renderConfigEditor();
  populateSpecialistPicker();
  setPet('topbar-pet', 'idle');
}

function wireOnboarding() {
  setPet('onboarding-pet', 'idle');
  document.getElementById('ob-generate-btn').addEventListener('click', runOnboarding);
  document.getElementById('ob-enter-btn').addEventListener('click', enterConsole);
  document.getElementById('nav-restart-onboarding').addEventListener('click', () => {
    document.getElementById('main-shell').hidden = true;
    document.getElementById('onboarding').hidden = false;
    document.getElementById('onboarding-done').hidden = true;
    document.getElementById('ob-enter-btn').hidden = true;
    document.getElementById('onboarding-status').textContent = '';
    document.getElementById('onboarding-log').textContent = '';
    setPet('onboarding-pet', 'idle');
  });
}

// ---------- main console ----------

function renderSidebar() {
  document.getElementById('f-org-name').value = config.org.name || '';
  document.getElementById('f-approver-title').value = config.org.approverTitle || '';
  document.getElementById('f-entity').value = config.vocabulary.entity || '';
  document.getElementById('f-entity-plural').value = config.vocabulary.entityPlural || '';
  document.getElementById('f-verdicts').value = (config.vocabulary.verdicts || []).join(', ');
  document.getElementById('f-runtime-primary').value = config.agentRuntime.primary || 'claude-code';
  document.getElementById('f-runtime-editing').value = config.agentRuntime.skillEditing || 'both';
  document.getElementById('f-diligence-enabled').checked = !!config.diligence.enabled;

  renderConnectorGroups();
  renderSpecialistList();
}

function renderConnectorGroups() {
  const wrap = document.getElementById('connector-groups');
  wrap.innerHTML = '';
  ROLES.forEach((role) => {
    const group = document.createElement('div');
    group.className = 'connector-role';
    const title = document.createElement('div');
    title.className = 'connector-role-title';
    title.textContent = role.label;
    group.appendChild(title);

    connectorCatalog
      .filter((c) => c.roles.includes(role.key))
      .forEach((c) => {
        const row = document.createElement('label');
        row.className = 'connector-option';
        const checked = (config.connectors[role.key] || []).includes(c.id);
        row.innerHTML = `<input type="checkbox" data-role="${role.key}" data-connector="${c.id}" ${checked ? 'checked' : ''}/> ${c.displayName}`;
        group.appendChild(row);
      });
    wrap.appendChild(group);
  });

  wrap.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
    cb.addEventListener('change', () => {
      const role = cb.getAttribute('data-role');
      const id = cb.getAttribute('data-connector');
      const list = config.connectors[role] || (config.connectors[role] = []);
      const idx = list.indexOf(id);
      if (cb.checked && idx === -1) list.push(id);
      if (!cb.checked && idx !== -1) list.splice(idx, 1);
      renderConfigEditor();
    });
  });
}

function renderSpecialistList() {
  const ul = document.getElementById('specialist-list');
  ul.innerHTML = '';
  const specialists = config.diligence.specialists || [];
  if (specialists.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'No specialists configured for this vertical.';
    ul.appendChild(li);
    return;
  }
  specialists.forEach((s) => {
    const li = document.createElement('li');
    li.innerHTML = `<b>${s.id}</b> — reads diligence/[entity]/${s.folder}/`;
    ul.appendChild(li);
  });
}

function renderConfigEditor() {
  document.getElementById('config-editor').value = JSON.stringify(config, null, 2);
  const status = document.getElementById('json-status');
  status.textContent = '';
  status.className = '';
}

function wireSidebarInputs() {
  document.getElementById('f-org-name').addEventListener('input', (e) => {
    config.org.name = e.target.value;
    renderConfigEditor();
  });
  document.getElementById('f-approver-title').addEventListener('input', (e) => {
    config.org.approverTitle = e.target.value;
    renderConfigEditor();
  });
  document.getElementById('f-entity').addEventListener('input', (e) => {
    config.vocabulary.entity = e.target.value;
    renderConfigEditor();
  });
  document.getElementById('f-entity-plural').addEventListener('input', (e) => {
    config.vocabulary.entityPlural = e.target.value;
    renderConfigEditor();
  });
  document.getElementById('f-verdicts').addEventListener('input', (e) => {
    config.vocabulary.verdicts = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
    renderConfigEditor();
  });
  document.getElementById('f-runtime-primary').addEventListener('change', (e) => {
    config.agentRuntime.primary = e.target.value;
    renderConfigEditor();
  });
  document.getElementById('f-runtime-editing').addEventListener('change', (e) => {
    config.agentRuntime.skillEditing = e.target.value;
    renderConfigEditor();
  });
  document.getElementById('f-diligence-enabled').addEventListener('change', (e) => {
    config.diligence.enabled = e.target.checked;
    renderConfigEditor();
  });
}

function wireVerticalSwitcher() {
  const nav = document.getElementById('vertical-switcher');
  nav.addEventListener('click', async (e) => {
    const btn = e.target.closest('button[data-vertical]');
    if (!btn) return;
    const name = btn.getAttribute('data-vertical');
    setActiveButton(nav, name, 'data-vertical');
    await loadVertical(name);
    renderSidebar();
    renderConfigEditor();
    populateSpecialistPicker();
  });
}

const TAB_TITLES = { config: 'Config', generate: 'Generate skill' };

function activateTab(tab) {
  document.querySelectorAll('.tab-btn[data-tab]').forEach((b) => {
    b.classList.toggle('active', b.getAttribute('data-tab') === tab);
  });
  document.querySelectorAll('.nav-item[data-tab]').forEach((b) => {
    b.classList.toggle('active', b.getAttribute('data-tab') === tab);
  });
  document.getElementById('tab-config').hidden = tab !== 'config';
  document.getElementById('tab-generate').hidden = tab !== 'generate';
  document.getElementById('topbar-title').textContent = TAB_TITLES[tab] || tab;
}

function wireTabs() {
  document.querySelectorAll('.tab-btn[data-tab], .nav-item[data-tab]').forEach((btn) => {
    btn.addEventListener('click', () => activateTab(btn.getAttribute('data-tab')));
  });
}

function populateSkillSelect() {
  const sel = document.getElementById('skill-select');
  sel.innerHTML = '';
  CORE_SKILLS.forEach((id) => {
    const opt = document.createElement('option');
    opt.value = id;
    opt.textContent = id;
    sel.appendChild(opt);
  });
  sel.addEventListener('change', populateSpecialistPicker);
}

function populateSpecialistPicker() {
  const sel = document.getElementById('skill-select');
  const wrap = document.getElementById('specialist-picker-wrap');
  const picker = document.getElementById('specialist-select');
  if (sel.value !== 'diligence-specialist') {
    wrap.hidden = true;
    return;
  }
  wrap.hidden = false;
  picker.innerHTML = '';
  (config.diligence.specialists || []).forEach((s, i) => {
    const opt = document.createElement('option');
    opt.value = String(i);
    opt.textContent = `${s.id} (${s.folder})`;
    picker.appendChild(opt);
  });
}

function setStatusPill(mode, text) {
  const pill = document.getElementById('status-pill');
  pill.classList.remove('busy', 'fail');
  if (mode === 'busy') pill.classList.add('busy');
  if (mode === 'fail') pill.classList.add('fail');
  document.getElementById('status-pill-text').textContent = text;
}

async function generateSkill() {
  const skillId = document.getElementById('skill-select').value;
  const output = document.getElementById('generated-output');
  setPet('topbar-pet', 'thinking');
  setStatusPill('busy', 'Generating');
  await sleep(250);
  try {
    const res = await fetch(`../templates/core/${skillId}/SKILL.md.tmpl`);
    const source = await res.text();
    let ctx = config;
    if (skillId === 'diligence-specialist') {
      const specialists = config.diligence.specialists || [];
      if (specialists.length === 0) {
        output.textContent = 'No specialists configured -- add one in the raw config JSON, or switch verticals.';
        setPet('topbar-pet', 'idle');
        setStatusPill('ready', 'Ready');
        return;
      }
      const idx = Number(document.getElementById('specialist-select').value || 0);
      ctx = Object.assign({}, config, { specialist: specialists[idx] });
    }
    setPet('topbar-pet', 'generating');
    await sleep(250);
    output.textContent = renderTemplate(source, ctx);
    setPet('topbar-pet', 'done');
    setStatusPill('ready', 'Ready');
    await sleep(1200);
    setPet('topbar-pet', 'idle');
  } catch (err) {
    output.textContent = `Could not generate: ${err.message}`;
    setPet('topbar-pet', 'failed');
    setStatusPill('fail', 'Error');
  }
}

function wireGenerate() {
  document.getElementById('generate-btn').addEventListener('click', generateSkill);
}

function wireJsonEditor() {
  document.getElementById('apply-json-btn').addEventListener('click', () => {
    const status = document.getElementById('json-status');
    try {
      const parsed = JSON.parse(document.getElementById('config-editor').value);
      config = parsed;
      status.textContent = 'Applied.';
      status.className = 'ok';
      renderSidebar();
      populateSpecialistPicker();
    } catch (err) {
      status.textContent = `Invalid JSON: ${err.message}`;
      status.className = 'error';
    }
  });

  document.getElementById('copy-json-btn').addEventListener('click', async () => {
    await navigator.clipboard.writeText(JSON.stringify(config, null, 2));
    const status = document.getElementById('json-status');
    status.textContent = 'Copied to clipboard.';
    status.className = 'ok';
  });
}

// Deep-link support: ?vertical=vc&tab=generate&skill=category-research&autogen=1
// skips the onboarding gate entirely and lets a specific console view be
// bookmarked, shared, or screenshotted directly.
async function applyDeepLink() {
  const params = new URLSearchParams(window.location.search);

  // ?autoOnboard=1 triggers the setup flow itself (useful for demos and
  // for screenshotting the onboarding gate mid-animation).
  if (params.get('autoOnboard') === '1') {
    const v = params.get('vertical') || 'vc';
    document.getElementById('ob-vertical').value = v;
    document.getElementById('ob-purpose').value = params.get('purpose') || '';
    await runOnboarding();
    if (params.get('enter') === '1') enterConsole();
    return true;
  }

  const vertical = params.get('vertical');
  if (!vertical) return false;
  if (['vc', 'recruiting', 'real-estate', 'custom'].includes(vertical)) {
    await loadVertical(vertical);
    enterConsole();
  }
  const tab = params.get('tab');
  if (tab === 'generate') {
    activateTab('generate');
    const skill = params.get('skill');
    if (skill && CORE_SKILLS.includes(skill)) {
      document.getElementById('skill-select').value = skill;
      populateSpecialistPicker();
    }
    if (params.get('autogen') === '1') {
      await generateSkill();
    }
  }
  return true;
}

async function init() {
  await loadConnectorCatalog();
  wireOnboarding();
  wireSidebarInputs();
  wireVerticalSwitcher();
  wireTabs();
  populateSkillSelect();
  wireGenerate();
  wireJsonEditor();
  await applyDeepLink();
}

init();
