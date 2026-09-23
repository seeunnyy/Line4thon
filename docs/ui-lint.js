// 화면 점검: 가로 스크롤, 터치 44px 미만, 12px 미만 글자. Chrome DevTools 콘솔에 붙여넣어 실행한다.
// 예외: 프로토타입 규격 때문에 44px 미만인 요소(체크인 38px 칩)는 data-touch-ok 속성으로 표시한다.
(() => {
  const frame = document.querySelector('[data-spec="frame"]') || document.body;
  const out = [];
  const name = (el) => `${el.tagName.toLowerCase()}${el.getAttribute('aria-label') ? `[${el.getAttribute('aria-label')}]` : ''} "${(el.textContent || '').trim().slice(0, 14)}"`;
  const root = document.documentElement;
  if (root.scrollWidth > window.innerWidth) out.push({ 검사: '가로 스크롤', 내용: `scrollWidth ${root.scrollWidth} > innerWidth ${window.innerWidth}` });
  frame.querySelectorAll('a[href],button,input,select,textarea,[role="radio"],[role="tab"]').forEach((el) => {
    if (el.hasAttribute('data-touch-ok')) return;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return;
    if (r.width < 44 || r.height < 44) out.push({ 검사: '터치 44px 미만', 내용: `${name(el)} ${r.width.toFixed(1)}×${r.height.toFixed(1)}` });
  });
  const walker = document.createTreeWalker(frame, NodeFilter.SHOW_TEXT);
  const seen = new Set();
  while (walker.nextNode()) {
    const t = walker.currentNode;
    const el = t.parentElement;
    if (!t.textContent.trim() || seen.has(el)) continue;
    seen.add(el);
    if (el.closest('[data-spec="caption"]')) continue;
    const s = parseFloat(getComputedStyle(el).fontSize);
    if (s < 12) out.push({ 검사: '12px 미만 글자', 내용: `${s}px ${name(el)}` });
  }
  out.length ? console.table(out) : console.log('이상 없음');
})();
