declare global {
  interface Window {
    __GAME_URL__: string;
  }
}

const GAME_URL = window.__GAME_URL__ || 'https://engine.gtavice.city:8443';

const $ = <T extends HTMLElement = HTMLElement>(sel: string) => document.querySelector<T>(sel)!;

const playBtn = $<HTMLButtonElement>('#play');
const overlay = $<HTMLElement>('#overlay');
const stage = $<HTMLDivElement>('#frame-stage');
const tpl = $<HTMLTemplateElement>('#frame-tpl');
const exitBtn = $<HTMLButtonElement>('#exit');
const fsBtn = $<HTMLButtonElement>('#fs');

function mountGame() {
  stage.replaceChildren();
  const fragment = tpl.content.cloneNode(true) as DocumentFragment;
  const frame = fragment.querySelector('iframe') as HTMLIFrameElement;
  frame.src = GAME_URL;
  stage.appendChild(frame);
  requestAnimationFrame(() => frame.focus());
}

function openOverlay() {
  overlay.hidden = false;
  document.body.style.overflow = 'hidden';
  mountGame();
}

function closeOverlay() {
  if (document.fullscreenElement) {
    document.exitFullscreen().catch(() => {});
  }
  overlay.hidden = true;
  overlay.removeAttribute('data-fs');
  document.body.style.overflow = '';
  stage.replaceChildren();
}

async function toggleFullscreen() {
  if (!document.fullscreenElement) {
    try { await overlay.requestFullscreen(); } catch { /* noop */ }
  } else {
    try { await document.exitFullscreen(); } catch { /* noop */ }
  }
}

function onFullscreenChange() {
  if (document.fullscreenElement === overlay) {
    overlay.dataset.fs = 'on';
    fsBtn.setAttribute('aria-label', 'Exit fullscreen');
    const label = fsBtn.querySelector<HTMLSpanElement>('.bar-label');
    if (label) label.textContent = label.dataset.active ?? 'WINDOWED';
  } else {
    overlay.removeAttribute('data-fs');
    fsBtn.setAttribute('aria-label', 'Enter fullscreen');
    const label = fsBtn.querySelector<HTMLSpanElement>('.bar-label');
    if (label) label.textContent = label.dataset.default ?? 'FULLSCREEN';
  }
}

playBtn.addEventListener('click', openOverlay);
exitBtn.addEventListener('click', closeOverlay);
fsBtn.addEventListener('click', toggleFullscreen);
document.addEventListener('fullscreenchange', onFullscreenChange);

document.addEventListener('keydown', (e) => {
  if (overlay.hidden) return;
  if (e.key === 'Escape' && e.shiftKey) {
    e.preventDefault();
    closeOverlay();
  } else if (e.key === 'F11') {
    e.preventDefault();
    toggleFullscreen();
  }
});
