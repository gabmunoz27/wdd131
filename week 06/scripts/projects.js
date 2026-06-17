/* ============================================================
   projects.js — project data, filtering, rendering
   Uses: objects, arrays, array methods, template literals,
         DOM interaction, events, conditional branching,
         localStorage
   ============================================================ */

// ── Project data ───────────────────────────────────────────
const projects = [
  {
    id: 'pa-email-flow',
    title: 'Automated Email Notification Flow',
    category: 'automation',
    icon: '⚡',
    description: 'Power Automate flow triggered by Microsoft Forms submissions, sending dynamic HTML email reports with conditional file attachments retrieved from OneDrive.',
    tags: ['Power Automate', 'Microsoft Forms', 'OneDrive', 'HTML Email'],
    highlights: ['Conditional branching for optional attachments', 'Dynamic HTML table generation via concat()', 'Cross-branch scope error resolution'],
    link: '#',
  },
  {
    id: 'pa-compliance-tracker',
    title: 'Compliance Report Tracker',
    category: 'automation',
    icon: '📋',
    description: 'Normalized SharePoint/Excel data model with automated Forms-to-Excel ingestion, duplicate detection, and mutex concurrency control for simultaneous write conflict resolution.',
    tags: ['Power Automate', 'SharePoint', 'Excel', 'Power BI'],
    highlights: ['Mutex pattern for concurrent write safety', 'Duplicate detection logic', 'Normalized relational data model'],
    link: '#',
  },
  {
    id: 'pa-aml-letters',
    title: 'AML Solicitud Justificativos Generator',
    category: 'automation',
    icon: '🏦',
    description: 'Automated HTML email generator for AML/compliance workflows at Banco Guayaquil, producing formatted account officer notification letters referencing resolution JPRF-F-2023-067.',
    tags: ['Power Automate', 'HTML Email', 'Compliance', 'AML'],
    highlights: ['Dynamic transaction row injection', 'Inline CSS email templates', 'Regulatory reference integration'],
    link: '#',
  },
  {
    id: 'ds-alimentos-sa',
    title: 'Alimentos SA — EDA Dashboard',
    category: 'data',
    icon: '📊',
    description: 'End-to-end data analyst assessment: exploratory data analysis across five Excel sheets, interactive Chart.js dashboard, 12-slide executive PowerPoint, and timed oral defense script.',
    tags: ['Excel', 'Chart.js', 'PowerPoint', 'EDA', 'Data Cleaning'],
    highlights: ['Multi-sheet EDA with cleaning flags', 'Interactive JS dashboard', '12-slide executive presentation'],
    link: '#',
  },
  {
    id: 'web-wdd131',
    title: 'WDD 131 — Temple Album & Ecuador Page',
    category: 'web',
    icon: '🌐',
    description: 'Responsive web pages built in BYU-Idaho WDD 131: an Ecuador country profile and a Temple photo album, applying HTML/CSS/JavaScript fundamentals including DOM events and dynamic rendering.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Responsive Design'],
    highlights: ['Responsive grid layouts', 'Dynamic card rendering', 'JavaScript event handling'],
    link: '#',
  },
  {
    id: 'csharp-mindfulness',
    title: 'C# Mindfulness Program',
    category: 'software',
    icon: '🧘',
    description: 'Object-oriented C# console application built in CSE 210 featuring three mindfulness activities (Breathing, Reflection, Listing) with polymorphism, inheritance, and encapsulation.',
    tags: ['C#', '.NET', 'OOP', 'Inheritance'],
    highlights: ['Polymorphic activity classes', 'Inheritance hierarchy design', 'Encapsulated state management'],
    link: '#',
  },
];

// ── Category labels ────────────────────────────────────────
const categoryLabels = {
  all:        'All Projects',
  automation: 'Power Automate',
  data:       'Data Analysis',
  web:        'Web Development',
  software:   'Software Dev',
};

// ── State ──────────────────────────────────────────────────
let activeFilter = loadFilter();

function loadFilter() {
  return localStorage.getItem('gm-project-filter') || 'all';
}

function saveFilter(filter) {
  localStorage.setItem('gm-project-filter', filter);
}

// ── Render projects grid ───────────────────────────────────
function renderProjects(filter) {
  const grid = document.querySelector('#projects-grid');
  if (!grid) return;

  const filtered = filter === 'all'
    ? projects
    : projects.filter(p => p.category === filter);

  if (filtered.length === 0) {
    grid.innerHTML = `<p class="text-muted" style="grid-column:1/-1;text-align:center;padding:3rem 0;">
      No projects found for this category.
    </p>`;
    return;
  }

  grid.innerHTML = filtered.map(p => buildCardHTML(p)).join('');

  // trigger reveal for newly inserted cards
  grid.querySelectorAll('[data-reveal]').forEach((el, i) => {
    setTimeout(() => el.classList.add('revealed'), i * 80);
  });
}

// ── Build card HTML using template literals ────────────────
function buildCardHTML(project) {
  const chipsHTML = project.tags
    .map(tag => `<span class="chip">${tag}</span>`)
    .join('');

  const highlightsHTML = project.highlights
    .map(h => `<li style="font-size:0.8rem;color:var(--text-secondary);padding-left:0.75rem;position:relative;">
      <span style="position:absolute;left:0;color:var(--accent);">›</span>${h}
    </li>`)
    .join('');

  return `
    <article class="project-card" data-reveal data-id="${project.id}">
      <div class="card-header">
        <div>
          <span class="card-category">${categoryLabels[project.category]}</span>
          <h3 style="margin-top:0.3rem;">${project.title}</h3>
        </div>
        <span class="card-icon" aria-hidden="true">${project.icon}</span>
      </div>
      <div class="card-body">
        <p>${project.description}</p>
        <ul style="margin-top:0.75rem;margin-bottom:1rem;display:flex;flex-direction:column;gap:0.3rem;">
          ${highlightsHTML}
        </ul>
        <div class="card-chips">${chipsHTML}</div>
      </div>
      <div class="card-footer">
        <a href="${project.link}" class="btn btn-outline" aria-label="View ${project.title}">
          View project
        </a>
        <button class="btn btn-outline save-btn" data-id="${project.id}" aria-label="Save ${project.title}">
          ${isSaved(project.id) ? '★ Saved' : '☆ Save'}
        </button>
      </div>
    </article>`;
}

// ── Filter buttons ─────────────────────────────────────────
function initFilters() {
  const filterBar = document.querySelector('#filter-bar');
  if (!filterBar) return;

  const categories = ['all', 'automation', 'data', 'web', 'software'];
  filterBar.innerHTML = categories
    .map(cat => `
      <button class="filter-btn${cat === activeFilter ? ' active' : ''}"
              data-filter="${cat}"
              aria-pressed="${cat === activeFilter}">
        ${categoryLabels[cat]}
      </button>`)
    .join('');

  filterBar.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;

    const filter = btn.dataset.filter;
    if (filter === activeFilter) return;

    activeFilter = filter;
    saveFilter(filter);

    filterBar.querySelectorAll('.filter-btn').forEach(b => {
      const isActive = b.dataset.filter === filter;
      b.classList.toggle('active', isActive);
      b.setAttribute('aria-pressed', String(isActive));
    });

    renderProjects(filter);
  });
}

// ── Save / bookmark with localStorage ─────────────────────
function getSaved() {
  const raw = localStorage.getItem('gm-saved-projects');
  return raw ? JSON.parse(raw) : [];
}

function isSaved(id) {
  return getSaved().includes(id);
}

function toggleSave(id) {
  const saved = getSaved();
  const idx   = saved.indexOf(id);
  if (idx === -1) {
    saved.push(id);
  } else {
    saved.splice(idx, 1);
  }
  localStorage.setItem('gm-saved-projects', JSON.stringify(saved));
  return idx === -1; // true = now saved
}

function initSaveButtons() {
  document.querySelector('#projects-grid')?.addEventListener('click', (e) => {
    const btn = e.target.closest('.save-btn');
    if (!btn) return;

    const id      = btn.dataset.id;
    const nowSaved = toggleSave(id);
    btn.textContent = nowSaved ? '★ Saved' : '☆ Save';

    const project = projects.find(p => p.id === id);
    const name    = project ? project.title : 'Project';

    showProjectToast(nowSaved, name);
  });
}

function showProjectToast(saved, name) {
  const msg = saved
    ? `<span class="toast-accent">★ Saved:</span> ${name}`
    : `<span class="toast-accent">Removed:</span> ${name}`;

  // reuse showToast from main.js
  if (typeof showToast === 'function') {
    showToast(msg);
  }
}

// ── Counter ────────────────────────────────────────────────
function updateCounter() {
  const counter = document.querySelector('#project-count');
  if (!counter) return;

  const filter   = activeFilter;
  const count    = filter === 'all' ? projects.length : projects.filter(p => p.category === filter).length;
  counter.textContent = `${count} project${count !== 1 ? 's' : ''}`;
}

// ── Init ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initFilters();
  renderProjects(activeFilter);
  initSaveButtons();
  updateCounter();

  // update counter on filter change (via MutationObserver on grid)
  const grid = document.querySelector('#projects-grid');
  if (grid) {
    new MutationObserver(updateCounter).observe(grid, { childList: true });
  }
});
