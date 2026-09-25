// 복귀 체크인 좌표 검증. Chrome DevTools 콘솔에 붙여넣어 실행한다.
// 사용: 창 폭 390px(모바일 에뮬레이션 390×844)로 /app/checkin을 맨 위 스크롤 상태로 열고 실행. 허용 오차 ±0.5px.
// EXPECT = [x, y, width, height] — 프레임(data-spec="frame") 왼쪽 위 기준.
(async () => {
  await document.fonts.ready;
  // [2026-09-25 변경] 브랜드 헤더가 홈 시안 실측치로 바뀌어 tile/wordmark/avatar-h를 다시 계산했다(UI-SPEC.md 8-1장).
  // wordmark는 워드마크 폰트가 cta(18px)→display(24px)로 바뀌어 실제 글자 폭을 다시 재야 한다. x/y는 레이아웃 계산값,
  // width/height는 cta 시절 실측값(80×21)에 24/18 배율을 곱한 추정값(106.7×29)이라 이 항목만 결과를 눈으로도 같이 확인할 것.
  const EXPECT = {
    header: [0, 0, 390, 64], tile: [16, 16, 32, 32], wordmark: [60, 17.5, 106.7, 29], 'avatar-h': [334, 12, 40, 40],
    h1: [20, 72, 350, 58], sub: [20, 142, 350, 36],
    coach: [20, 194, 350, 175], 'coach-avatar': [36, 210, 64, 64], bubble: [116, 210, 238, 143],
    'bubble-text': [132, 225, 206, 92], caption: [132, 322, 206, 15],
    // section 높이가 20→24로 늘어나(배지형 섹션 제목, UI-SPEC.md 8-2장) 아래 panel/notice/cta/link의 y가
    // 전부 몇 px씩 밀린다. 여기 적힌 값은 옛 20 기준이라 그대로 두면 이 줄들은 FAIL이 뜨는 게 정상이고,
    // 실제 좌표는 이 화면을 열어 나온 값으로 다시 채워 넣을 것(수치를 추측해서 넣지 않았다).
    section: [20, 394, 350, 24], panel: [20, 422, 350, 195],
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
