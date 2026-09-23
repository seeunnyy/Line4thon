// 복귀 체크인 좌표 검증. Chrome DevTools 콘솔에 붙여넣어 실행한다.
// 사용: 창 폭 390px(모바일 에뮬레이션 390×844)로 /app/checkin을 맨 위 스크롤 상태로 열고 실행. 허용 오차 ±0.5px.
// EXPECT = [x, y, width, height] — 프레임(data-spec="frame") 왼쪽 위 기준.
(async () => {
  await document.fonts.ready;
  const EXPECT = {
    header: [0, 0, 390, 64], tile: [20, 16, 32, 32], wordmark: [60, 22.5, 80, 21], 'avatar-h': [332, 16, 32, 32],
    h1: [20, 72, 350, 58], sub: [20, 142, 350, 36],
    coach: [20, 194, 350, 175], 'coach-avatar': [36, 210, 64, 64], bubble: [116, 210, 238, 143],
    'bubble-text': [132, 225, 206, 92], caption: [132, 322, 206, 15],
    section: [20, 394, 350, 20], panel: [20, 422, 350, 195],
    'label-1': [36, 438, 309, 20],
    'chip-1-1': [36, 466, 100.33, 57], 'chip-1-2': [140.33, 466, 100.33, 57], 'chip-1-3': [244.66, 466, 100.33, 57],
    'label-2': [36, 535, 309, 20], 'chip-2-1': [36, 563, 152.5, 38], 'chip-2-2': [192.5, 563, 152.5, 38],
    notice: [20, 641, 350, 88], 'notice-text': [45.3, 649, 299.7, 72],
    cta: [20, 753, 350, 56], link: [20, 810, 350, 44],
  };
  const LINES = { h1: 2, sub: 2, 'bubble-text': 4, 'notice-text': 4 };
  const TOL = 0.5;
  const frame = document.querySelector('[data-spec="frame"]');
  if (!frame) return console.error('data-spec="frame" 요소가 없어요');
  const f = frame.getBoundingClientRect();
  if (Math.abs(f.width - 390) > 0.5) console.warn(`프레임 폭이 ${f.width}px 예요. 390px에서만 유효해요.`);
  const round = (v) => Math.round(v * 100) / 100;
  const rows = Object.entries(EXPECT).map(([key, exp]) => {
    const el = document.querySelector(`[data-spec="${key}"]`);
    if (!el) return { 요소: key, 결과: '요소 없음' };
    const r = el.getBoundingClientRect();
    const got = [r.x - f.x, r.y - f.y, r.width, r.height].map(round);
    const diff = got.map((v, i) => round(v - exp[i]));
    let lineOk = true, lines = '';
    if (LINES[key]) {
      const n = Math.round(r.height / parseFloat(getComputedStyle(el).lineHeight));
      lineOk = n === LINES[key];
      lines = `${n}줄(기대 ${LINES[key]})`;
    }
    const ok = diff.every((d) => Math.abs(d) <= TOL) && lineOk;
    return { 요소: key, 기대: exp.join(', '), 실제: got.join(', '), 차이: diff.join(', '), 줄수: lines, 결과: ok ? 'PASS' : 'FAIL' };
  });
  console.table(rows);
  const fails = rows.filter((r) => r.결과 !== 'PASS');
  console.log(fails.length ? `FAIL ${fails.length}건 / 전체 ${rows.length}건` : `전부 PASS (${rows.length}건)`);
  const loaded = [...document.fonts].filter((x) => x.status === 'loaded').map((x) => `${x.family} ${x.weight}`);
  console.log('로드된 폰트 면:', loaded.join(' | ') || '없음 (폰트 파일 경로를 확인하세요)');
})();
