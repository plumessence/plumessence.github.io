import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeKatex from 'rehype-katex';
import rehypeStringify from 'rehype-stringify';
import { parse } from 'yaml';

const editor = document.querySelector<HTMLTextAreaElement>('#markdown-editor')!;
const preview = document.querySelector<HTMLElement>('#note-preview')!;
const status = document.querySelector<HTMLElement>('.writer-status')!;
const download = document.querySelector<HTMLButtonElement>('#download-note')!;
const github = document.querySelector<HTMLButtonElement>('#github-note')!;
const fileInput = document.querySelector<HTMLInputElement>('#file-input')!;
const draftSelect = document.querySelector<HTMLSelectElement>('#saved-drafts')!;
const repo = 'https://github.com/plumessence/plumessence.github.io';
const params = new URLSearchParams(location.search);
let editingId: string | null = null;
let dirty = false;
let draftKey = 'notebook-draft:new';
let renderVersion = 0;
let saveTimer: ReturnType<typeof setTimeout>;

const today = new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
const starter = `---\ntitle: "An idea worth keeping"\ndescription: "A sentence about where this thought begins."\ndate: "${today}"\ntopic: "Math"\ndraft: true\n---\n\nEvery idea begins somewhere.\n\n## A small observation\n\nHere is an inline equation: $e^{i\\pi} + 1 = 0$.\n\nAnd a little more room to think:\n\n$$\n\\sum_{k=1}^{n} k = \\frac{n(n+1)}{2}\n$$\n\nWhat does this make you wonder?\n`;

function setStatus(message: string) { status.textContent = message; }
function readStored(key: string) { try { return localStorage.getItem(key); } catch { return null; } }
function refreshDrafts() {
  draftSelect.replaceChildren(new Option('Restore a local draft…', ''));
  try {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('notebook-draft:')).sort().reverse();
    for (const key of keys) {
      const content = localStorage.getItem(key) || '';
      let title = 'Untitled note';
      try { title = parseNote(content).data.title; } catch {}
      const kind = key.includes(':backup:') ? 'Backup' : key.includes(':edit:') ? 'Edit' : 'Draft';
      draftSelect.add(new Option(`${kind}: ${title}`, key));
    }
  } catch {}
}
function saveDraft() {
  try { localStorage.setItem(draftKey, editor.value); dirty = false; refreshDrafts(); setStatus('Draft saved in this browser.'); }
  catch { setStatus('Browser storage is unavailable. Download your note to keep it.'); }
}
function parseNote(source: string) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) throw new Error('Start your note with the metadata fields between two lines of --- (see the example).');
  const data = parse(match[1], { maxAliasCount: 20 });
  if (!data || typeof data !== 'object') throw new Error('The metadata must contain your note’s fields.');
  for (const key of ['title', 'description', 'date', 'topic']) if (typeof data[key] !== 'string' || !data[key].trim()) throw new Error(`Add a nonempty ${key} field to your note’s metadata.`);
  if (!['Math', 'Machine learning', 'Schoolwork', 'Other'].includes(data.topic)) throw new Error('Choose one topic: Math, Machine learning, Schoolwork, or Other.');
  const date = new Date(data.date);
  if (Number.isNaN(date.valueOf())) throw new Error('Use a valid date, such as 2026-11-09.');
  for (const key of ['draft', 'example']) if (data[key] !== undefined && typeof data[key] !== 'boolean') throw new Error(`${key} must be true or false.`);
  return { data, body: source.slice(match[0].length) };
}

// Preserve math nodes through sanitization; KaTeX runs afterwards with trust disabled.
const processor = unified().use(remarkParse).use(remarkMath).use(remarkRehype)
  .use(rehypeSanitize, {
    ...defaultSchema,
    attributes: { ...defaultSchema.attributes, code: [['className', /^language-./, 'math-inline', 'math-display']] },
  })
  .use(rehypeKatex, { throwOnError: true, strict: false, trust: false })
  .use(rehypeStringify);

async function render() {
  const version = ++renderVersion;
  try {
    const { data, body } = parseNote(editor.value);
    const html = String(await processor.process(body));
    if (version !== renderVersion) return;
    preview.replaceChildren();
    const heading = document.createElement('h1'); heading.textContent = data.title;
    const meta = document.createElement('p'); meta.className = 'preview-meta'; meta.textContent = `${data.topic} · ${data.date}${data.draft ? ' · Draft' : ' · Ready to publish'}`;
    const description = document.createElement('p'); description.className = 'post-deck'; description.textContent = data.description;
    const article = document.createElement('div'); article.className = 'prose'; article.innerHTML = html;
    preview.append(heading, meta, description, article);
    download.disabled = false; github.disabled = false;
  } catch (error) {
    if (version !== renderVersion) return;
    const message = document.createElement('p'); message.className = 'preview-error'; message.textContent = `A little correction needed: ${error instanceof Error ? error.message : 'Check your Markdown and math.'}`;
    preview.replaceChildren(message);
    download.disabled = true; github.disabled = true;
  }
}

function filename() {
  if (editingId) return `${editingId}.md`;
  const { data } = parseNote(editor.value);
  const slug = data.title.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return `${slug || 'untitled-note'}.md`;
}

editor.addEventListener('input', () => {
  dirty = true;
  clearTimeout(saveTimer);
  setStatus('Saving draft…');
  saveTimer = setTimeout(saveDraft, 450);
  void render();
});

download.addEventListener('click', () => {
  try {
    const name = filename();
    const url = URL.createObjectURL(new Blob([editor.value], { type: 'text/markdown;charset=utf-8' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = name; anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    saveDraft(); setStatus(`Downloaded ${name}. Add it to src/content/posts to publish.`);
  } catch (error) { setStatus(error instanceof Error ? error.message : 'Check your note first.'); }
});

github.addEventListener('click', () => {
  try {
    const name = filename();
    const url = new URL(editingId ? `${repo}/edit/main/src/content/posts/${encodeURIComponent(editingId)}.md` : `${repo}/new/main/src/content/posts`);
    if (!editingId) { url.searchParams.set('filename', name); url.searchParams.set('value', editor.value); }
    else {
      // GitHub's edit page does not accept a replacement body in the URL.
      setStatus('Opening the existing file. Copy your Markdown here, paste it over the file on GitHub, then commit.');
    }
    if (url.href.length > 7500) { setStatus('This note is too long for a GitHub link. Download the .md file, then upload it to src/content/posts on GitHub.'); return; }
    saveDraft();
    if (editingId) setStatus('Opening GitHub. Use Copy Markdown, replace the existing file’s contents, and commit.');
    else setStatus('Opening GitHub. Review your note, set draft: false when ready, and commit to publish.');
    window.open(url.href, '_blank', 'noopener,noreferrer');
  } catch (error) { setStatus(error instanceof Error ? error.message : 'Check your note first.'); }
});

document.querySelector('#copy-note')!.addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(editor.value); setStatus('Markdown copied. Paste it into your file on GitHub.'); }
  catch { editor.focus(); editor.select(); setStatus('Select and copy the Markdown with your keyboard.'); }
});
document.querySelector('#import-note')!.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', async () => {
  const file = fileInput.files?.[0]; if (!file) return;
  if (file.size > 2 * 1024 * 1024) { setStatus('Please choose a Markdown file smaller than 2 MB.'); fileInput.value = ''; return; }
  saveDraft();
  const content = await file.text();
  const importedId = file.name.replace(/\.(md|markdown)$/i, '');
  editingId = null; draftKey = `notebook-draft:import:${importedId}`;
  history.replaceState({}, '', '/write/');
  editor.value = content; await render(); saveDraft(); setStatus(`Imported ${file.name}. Download this note or save it as a new file on GitHub.`);
  fileInput.value = '';
});
document.querySelector('#reset-note')!.addEventListener('click', () => {
  saveDraft();
  // Keep the previous draft in its own recoverable local snapshot.
  try { localStorage.setItem(`notebook-draft:backup:${Date.now()}`, editor.value); localStorage.removeItem('notebook-draft:new'); } catch {}
  editingId = null; draftKey = 'notebook-draft:new'; editor.value = starter;
  history.replaceState({}, '', '/write/'); void render(); saveDraft(); setStatus('A fresh page. The previous note is retained in this browser’s draft backups.'); editor.focus();
});
draftSelect.addEventListener('change', () => {
  const key = draftSelect.value; if (!key) return;
  const content = readStored(key); if (content === null) return;
  saveDraft();
  draftKey = key; editingId = key.startsWith('notebook-draft:edit:') ? key.slice('notebook-draft:edit:'.length) : null;
  editor.value = content;
  const url = new URL('/write/', location.origin);
  if (editingId) url.searchParams.set('edit', editingId);
  history.replaceState({}, '', url);
  void render(); setStatus('Local draft restored.');
});
window.addEventListener('beforeunload', event => { if (dirty) { saveDraft(); if (dirty) { event.preventDefault(); event.returnValue = ''; } } });

async function initialize() {
  const requested = params.get('edit');
  if (requested && /^[a-zA-Z0-9_/-]+$/.test(requested) && !requested.includes('..')) {
    editingId = requested; draftKey = `notebook-draft:edit:${requested}`;
    const stored = readStored(draftKey);
    if (stored !== null) { editor.value = stored; setStatus('Your local edits have been restored.'); }
    else {
      editor.disabled = true;
      try {
        const response = await fetch(`/source/${requested}.md`);
        if (!response.ok) throw new Error('This note could not be loaded. Open it directly on GitHub or return to your writing.');
        editor.value = await response.text(); setStatus('Note loaded. Edits stay in this browser until you commit them on GitHub.');
      } catch (error) {
        editingId = null; draftKey = 'notebook-draft:new'; editor.value = readStored(draftKey) || starter;
        setStatus(error instanceof Error ? error.message : 'Unable to load this note. Your local draft is shown instead.');
      } finally { editor.disabled = false; }
    }
  } else { const stored = readStored(draftKey); editor.value = stored ?? starter; setStatus(stored === null ? 'A fresh page. Drafts save automatically in this browser.' : 'Your local draft has been restored.'); }
  await render(); refreshDrafts();
}
void initialize();
