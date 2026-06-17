/* ============================================================
   contact.js — form validation, localStorage draft saving,
                DOM interaction, conditional branching
   ============================================================ */

// ── Field config ───────────────────────────────────────────
const fields = [
  { id: 'name',    label: 'Name',    validate: v => v.trim().length >= 2,   error: 'Please enter your full name (at least 2 characters).' },
  { id: 'email',   label: 'Email',   validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), error: 'Please enter a valid email address.' },
  { id: 'subject', label: 'Subject', validate: v => v !== '',               error: 'Please select a subject.' },
  { id: 'message', label: 'Message', validate: v => v.trim().length >= 20,  error: 'Message must be at least 20 characters.' },
];

// ── Draft save/load with localStorage ─────────────────────
const DRAFT_KEY = 'gm-contact-draft';

function saveDraft() {
  const draft = {};
  fields.forEach(f => {
    const el = document.getElementById(f.id);
    if (el) draft[f.id] = el.value;
  });
  localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

function loadDraft() {
  const raw = localStorage.getItem(DRAFT_KEY);
  if (!raw) return;

  try {
    const draft = JSON.parse(raw);
    let loaded = false;
    fields.forEach(f => {
      const el = document.getElementById(f.id);
      if (el && draft[f.id] !== undefined) {
        el.value = draft[f.id];
        if (draft[f.id]) loaded = true;
      }
    });
    if (loaded) showDraftBanner();
  } catch (_) {
    localStorage.removeItem(DRAFT_KEY);
  }
}

function clearDraft() {
  localStorage.removeItem(DRAFT_KEY);
}

function showDraftBanner() {
  const banner = document.querySelector('#draft-banner');
  if (banner) banner.style.display = 'flex';
}

// ── Validation ─────────────────────────────────────────────
function validateField(fieldConfig) {
  const el    = document.getElementById(fieldConfig.id);
  const errEl = document.getElementById(`${fieldConfig.id}-error`);
  if (!el || !errEl) return true;

  const isValid = fieldConfig.validate(el.value);
  errEl.classList.toggle('visible', !isValid);
  el.setAttribute('aria-invalid', String(!isValid));
  return isValid;
}

function validateAll() {
  return fields.every(f => validateField(f));
}

// ── Character counter for message ─────────────────────────
function initCharCounter() {
  const msg     = document.getElementById('message');
  const counter = document.getElementById('char-count');
  if (!msg || !counter) return;

  msg.addEventListener('input', () => {
    const len = msg.value.length;
    const min = 20;
    counter.textContent = len < min
      ? `${min - len} more characters needed`
      : `${len} characters`;
    counter.style.color = len < min ? 'var(--text-muted)' : 'var(--accent)';
  });
}

// ── Submit handler ─────────────────────────────────────────
function handleSubmit(e) {
  e.preventDefault();

  const isValid = validateAll();
  if (!isValid) {
    const firstError = document.querySelector('.form-error.visible');
    if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  // Build submission object using template literals
  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value;
  const message = document.getElementById('message').value.trim();

  const submission = {
    name,
    email,
    subject,
    message,
    timestamp: new Date().toISOString(),
  };

  // Store in localStorage (simulates send)
  const history = JSON.parse(localStorage.getItem('gm-contact-history') || '[]');
  history.push(submission);
  localStorage.setItem('gm-contact-history', JSON.stringify(history));
  clearDraft();

  // Show success state
  showSuccessMessage(name);
}

function showSuccessMessage(name) {
  const form    = document.querySelector('#contact-form');
  const success = document.querySelector('#form-success');
  if (!form || !success) return;

  form.style.display = 'none';
  success.style.display = 'block';
  success.querySelector('.success-name').textContent = name;
}

// ── Inline validation on blur ──────────────────────────────
function initInlineValidation() {
  fields.forEach(fieldConfig => {
    const el = document.getElementById(fieldConfig.id);
    if (!el) return;

    el.addEventListener('blur', () => {
      if (el.value !== '') validateField(fieldConfig);
    });

    el.addEventListener('input', () => {
      saveDraft();
      const errEl = document.getElementById(`${fieldConfig.id}-error`);
      if (errEl?.classList.contains('visible')) {
        validateField(fieldConfig);
      }
    });
  });
}

// ── Init ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadDraft();
  initInlineValidation();
  initCharCounter();

  const form = document.querySelector('#contact-form');
  if (form) form.addEventListener('submit', handleSubmit);

  // Discard draft button
  const discardBtn = document.querySelector('#discard-draft');
  if (discardBtn) {
    discardBtn.addEventListener('click', () => {
      clearDraft();
      fields.forEach(f => {
        const el = document.getElementById(f.id);
        if (el) el.value = '';
      });
      const banner = document.querySelector('#draft-banner');
      if (banner) banner.style.display = 'none';
    });
  }
});
