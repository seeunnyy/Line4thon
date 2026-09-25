# UI-SPEC.md — 프로토타입 기준 UI 명세

## 0. 사용법
- 기준 화면은 프로토타입 "복귀 체크인"(390px 프레임 1장)이다. 이 화면은 이 문서와 같은 값으로 만든다.
- 다른 화면은 6장 규칙을 따라 같은 토큰·컴포넌트로 만든다.
- 이 문서의 수치는 사용자 승인 없이 바꾸지 않는다.
- 검증: docs/ui-spec-check.js (좌표표 EXPECT). 허용 오차는 박스 ±0.5px, 줄 수 동일.
- 알려진 오차(허용): 한 줄 전체 글자 폭이 프로토타입과 최대 약 2px 다를 수 있다(라틴·문장부호 자폭 차이). 일부 Safari 버전은 ascent-override를 지원하지 않아 글자가 최대 1px 어긋날 수 있다.

## 1. 폰트
- 한글: 나눔스퀘어라운드 Regular 400 / Bold 700. 영문·숫자·기본 문장부호: Google Sans 400 / 700 (아래 unicode-range 구간에만).
- 굵기는 400·700만 쓴다.
- Google Sans에 ascent-override / descent-override / line-gap-override를 준 것은 두 폰트의 세로 메트릭을 나눔스퀘어라운드에 맞추기 위해서다. 없으면 캡션·섹션 제목·링크가 프로토타입보다 1px 위로 간다.
- 자간·단어 간격: body word-spacing -0.01em (측정값). 화면 제목 letter-spacing -0.03em. 캡션(10px) letter-spacing .02em + word-spacing 0. 그 외 letter-spacing 0.
- 줄바꿈은 브라우저 기본(keep-all 금지). <html lang="ko">.
```css
@font-face{font-family:'Bodycast Sans';font-weight:400;font-style:normal;font-display:swap;src:url('/fonts/NanumSquareRound-400.woff2') format('woff2')}
@font-face{font-family:'Bodycast Sans';font-weight:700;font-style:normal;font-display:swap;src:url('/fonts/NanumSquareRound-700.woff2') format('woff2')}
/* 아래 두 개는 위 두 개보다 뒤에 선언해야 라틴 구간에서 이쪽이 이긴다 */
@font-face{font-family:'Bodycast Sans';font-weight:400;font-style:normal;font-display:swap;unicode-range:U+0020-007E,U+00A0-00FF,U+2010-2027;ascent-override:87.9%;descent-override:25.5%;line-gap-override:0%;src:url('/fonts/GoogleSans-latin-400.woff2') format('woff2')}
@font-face{font-family:'Bodycast Sans';font-weight:700;font-style:normal;font-display:swap;unicode-range:U+0020-007E,U+00A0-00FF,U+2010-2027;ascent-override:88.6%;descent-override:25.5%;line-gap-override:0%;src:url('/fonts/GoogleSans-latin-700.woff2') format('woff2')}
/* font-family 스택: 'Bodycast Sans','Apple SD Gothic Neo','Malgun Gothic',system-ui,sans-serif */
```

## 2. 색
| 토큰 | 값 | 쓰임 |
|---|---|---|
| surface | #FBF8FF | 프레임·헤더·탭바 배경 |
| surface-low | #F5F2FD | 비선택 칩, 말풍선, 안내 박스 |
| card | #FFFFFF | 카드(코치 카드, 패널) |
| ink | #1B1B22 | 본문 |
| subtext | #424751 | 보조 글자, 비활성 탭, 비선택 칩 글자 |
| cobalt | #1A5CA7 | 버튼 배경, 선택 칩, 오늘 표시, 섹션 제목 배지, 링크, 캡션 [2026-09-25 시안 실측으로 보정, 이전 #225FA5] |
| cobalt-pressed | #154A87 | 버튼 눌림 [확장, cobalt 보정에 맞춰 조정] |
| sky | #3B88DB | 활성 탭, 말풍선 라벨·아이콘 [2026-09-25 시안 추가] |
| primary | #7FB3FF | 로고 타일·그라데이션·아바타 링·홈 스탯 pill 아이콘 배지 등 장식 전용. 글자·아이콘 색으로 쓰지 않는다 |
| disc | #F0EFED | 아바타 원(빈 자리) |
| positive | #006B56 | 완료·긍정 표시 |
| line | #E4E1EC | 구분선, 비활성 버튼 배경, 비활성 점 [확장] |
| accent | #FF8B6B | 버튼에는 쓰지 않는다. 그라데이션 등 장식 포인트에만 |

## 3. 반경·그림자
- 반경은 이 집합만 쓴다: 0(칩·입력·패널·안내), 8(말풍선 좌상단), 12(로고 타일), 28(56px 버튼의 pill), 32(코치 카드·큰 카드·바텀시트 위쪽), 원(50%/9999).
- 말풍선 반경: 8px 32px 32px 32px (좌상단만 8).
| 이름 | 값 | 쓰임 |
|---|---|---|
| header | 0 4px 12px rgba(34,95,165,.05) | 헤더 |
| coach | 0 8px 24px rgba(34,95,165,.08) | 코치 카드·큰 카드 |
| panel | 0 4px 16px rgba(34,95,165,.06) | 자가 체크 패널 |
| tabbar | 0 -4px 16px rgba(34,95,165,.10) | 탭바 |
| cta | 0 4px 6px -1px rgba(0,0,0,.1), 0 2px 4px -2px rgba(0,0,0,.1) | lg 버튼 (Tailwind shadow-md) |
| avatar | 0 2px 8px rgba(0,0,0,.08) | 헤더 아바타 원 |
| badge | 0 1px 3px rgba(0,0,0,.12) | 아바타 배지 |

## 4. 타입 스케일 (px / 줄높이)
| 이름 | 크기 / 줄높이 | 굵기 | 쓰임 |
|---|---|---|---|
| display | 24 / 29, letter-spacing -0.03em | 700 | 화면 제목 |
| cta | 18 / normal | 700 | lg 버튼 라벨, 워드마크 |
| lead | 15 / 23 | 400 | 말풍선 본문 |
| section | 14 / 20 | 400 | 섹션 제목 |
| label | 13 / 18 (링크는 13 / 19.5) | 400 | 입력 라벨, 텍스트 링크 |
| body | 12 / 18 | 400 | 부제, 칩, 안내 |
| caption | 10 / 15, letter-spacing .02em | 400 | 체크인 캡션 전용 |
| tab | 12 / 16 | 400 | 탭 라벨(활성 시 700) |
| hero-num | 32 / 40 | 700 | 큰 숫자 전용 [확장] |
| heading | 16 / 22 | 700 | 섹션 제목 [2026-09-25 시안 실측 추가, 이전 section 14/20 그대로 썼음] |
| pill | 15 / 18 | 700 | 홈 스탯 pill 값 [2026-09-25 시안 실측 추가] |

## 5. 기준 구현 — 복귀 체크인 (390px)
아래는 프로토타입과 대조해 검증한 참고 구현이다. 실제 앱에서는 header는 문서 흐름 안에 두고(absolute 아님), 이 화면에는 탭바가 없다.
**[2026-09-25 변경]** 아래 `header`/`.brand`/`.tile`/`.avatar-h` 4개 규칙은 8장으로 대체됐다(브랜드 헤더는 홈과 공용 컴포넌트라 홈 시안 반영 시 같이 바뀐다). 헤더 높이(64)와 그 아래 세로 흐름(h1 y72 이하)은 그대로 유효하다.
```css
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Bodycast Sans',sans-serif;color:#1B1B22;word-spacing:-0.01em;-webkit-font-smoothing:antialiased}
.frame{width:390px;background:#FBF8FF}
header{height:64px;background:#FBF8FF;box-shadow:0 4px 12px rgba(34,95,165,.05);display:flex;align-items:center;justify-content:space-between;padding:0 26px 0 20px}
.brand{display:flex;align-items:center;gap:8px}
.tile{width:32px;height:32px;border-radius:12px;background:#7FB3FF}
.brand span{position:relative;top:1px;font-weight:700;font-size:18px}
.avatar-h{width:32px;height:32px;border-radius:50%;background:#F0EFED;box-shadow:0 2px 8px rgba(0,0,0,.08)}
main{padding:0 20px}
h1{margin-top:8px;font-weight:700;font-size:24px;line-height:29px;letter-spacing:-0.03em}
.sub{margin-top:12px;font-size:12px;line-height:18px;color:#424751}
.coach{margin-top:16px;background:#fff;border-radius:32px;padding:16px;display:flex;gap:16px;box-shadow:0 8px 24px rgba(34,95,165,.08)}
.av{position:relative;flex:none;width:64px;height:64px;border-radius:50%;background:#F0EFED}
.badge{position:absolute;left:47.5px;top:47px;width:21px;height:21px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.12)}
.bubble{flex:1;min-width:0;background:#F5F2FD;border-radius:8px 32px 32px 32px;padding:15px 16px 16px} /* 390px에서 폭 238 */
.bubble p{font-size:15px;line-height:23px}
.cap{margin-top:5px;display:flex;align-items:center;gap:3px;font-size:10px;line-height:15px;letter-spacing:.02em;word-spacing:0;color:#225FA5}
.cap i{display:block;width:12px;height:12px}
.sec{margin-top:25px;height:20px;display:flex;align-items:center;gap:8px;font-size:14px;line-height:20px}
.sec i{display:block;width:15px;height:15px}
.card2{margin-top:8px;background:#fff;padding:16px 25px 16px 16px;box-shadow:0 4px 16px rgba(34,95,165,.06)}
.lab{height:20px;display:flex;align-items:center;gap:3px;font-size:13px;line-height:18px;color:#424751;margin-bottom:8px}
.lab i{display:block;width:12px;height:12px}
.lab.l2 i{width:14px;height:14px}
.row{display:flex;gap:4px}
.chip{background:#F5F2FD;color:#424751;font-size:12px;line-height:18px;text-align:center}
.chip.on{background:#225FA5;color:#fff}
.r1 .chip{flex:1;height:57px;padding-top:5px}
.r1 .chip i{display:block;width:24px;height:24px;margin:0 auto}
.r2 .chip{flex:1;height:38px;display:flex;align-items:center;justify-content:center;gap:4px}
.r2 .chip i{display:block;width:16px;height:16px}
.gap12{height:12px}
.notice{margin-top:24px;background:#F5F2FD;padding:8px 25px 8px 8px;display:flex;gap:3.3px;font-size:12px;line-height:18px;color:#424751}
.notice i{flex:none;display:block;width:14px;height:14px;margin-top:2px}
.cta{margin-top:24px;height:56px;border-radius:28px;background:#225FA5;color:#fff;display:flex;align-items:center;justify-content:center;gap:20px;font-weight:700;font-size:18px;box-shadow:0 4px 6px -1px rgba(0,0,0,.1),0 2px 4px -2px rgba(0,0,0,.1)}
.cta i{display:block;width:15px;height:15px}
.link{margin-top:1px;height:44px;display:flex;align-items:center;justify-content:center;font-size:13px;line-height:19.5px;color:#225FA5}
```
```html
<div class="frame">
<header><div class="brand"><div class="tile"></div><span>Bodycast</span></div><div class="avatar-h"></div></header>
<main>
<h1>이벤트가 끝났나요?<br>복귀 체크인</h1>
<p class="sub">하루 일탈은 전체의 실패가 아니에요.<br>다시 시작해도 이전의 기록은 고스란히 남아있어요.</p>
<section class="coach"><div class="av"><div class="badge"></div></div>
<div class="bubble"><p>“어제 맛있는 시간 보내셨나요?<br>숫자에 놀라지 마세요, 지금은<br>수분이 잠시 머물러 있는 자연스러운 소나기 시간이에요!”</p><div class="cap"><i></i><span>체수분은 하루나 이틀 내에 서서히 걷혀요</span></div></div></section>
<div class="sec"><i></i><span>현재 몸 상태 자가 체크</span></div>
<section class="card2">
<div class="lab"><i></i><span>체감 붓기 정도</span></div>
<div class="row r1"><div class="chip"><i></i>가벼움</div><div class="chip on"><i></i>약간 부음</div><div class="chip"><i></i>묵직함</div></div>
<div class="gap12"></div>
<div class="lab l2"><i></i><span>수면 및 에너지 상태</span></div>
<div class="row r2"><div class="chip"><i></i>개운함</div><div class="chip on"><i></i>피곤함</div></div>
</section>
<div class="notice"><i></i><p>Bodycast의 복귀 가이드는 … 전문의와 상의하세요.</p></div>
<div class="cta"><span>체크인 완료하기</span><i></i></div>
<div class="link">홈 예보로 바로 건너뛰기</div>
</main></div>
```
- 세로 흐름(검증됨): 헤더 64 → h1 y72(높이 58) → 부제 y142(36) → 코치 카드 y194(175) → 섹션 제목 y394(20) → 패널 y422(195) → 안내 y641(88) → CTA y753(56) → 링크 y810(44). 좌표표 전체는 docs/ui-spec-check.js의 EXPECT.
- 안내 문구의 줄바꿈은 폭 299.7px(패널 오른쪽 안쪽 여백 25 포함)에서 자연스럽게 4줄이 되어야 한다.

## 6. 확장 규칙 (다른 화면용)
- 좌우 여백 20. 화면 제목은 헤더 아래 8px에서 display. 섹션 간격 24~25, 제목과 내용 8, 카드 안 패딩 16, 카드 안 항목 간격 12, 칩 간격 4. 4의 배수를 우선한다.
- 반경은 3장 집합만. 폼 컨트롤(칩·입력·세그먼트)은 직각(0). 카드는 큰 요약·말풍선·이벤트 카드=32, 그룹 패널=0.
- 버튼은 코발트 배경 + 흰 글자뿐이다(다른 색 버튼 없음). lg(56) / md(44) / sm(36, 클릭 영역 44). 텍스트 링크는 코발트 글자 13px, 높이 44.
- 입력창: 높이 52, 배경 surface-low, 반경 0, 글자 16px 이상, focus는 코발트 2px 아웃라인.
- 새 화면에서는 12px 미만 글자 금지(캡션 10px은 체크인 전용), 터치 영역 44px 이상.
- 아이콘은 Icon.tsx의 선 아이콘을 쓴다(24×24, currentColor, 굵기 2, round, 채움 없음. 크기는 유지). 이미지는 Avatar의 빈 자리를 쓴다. 아바타는 #F0EFED 원. 예외: 탭바 아이콘은 채운 아이콘이다(8장).
- 스크롤 화면의 하단 CTA는 sticky bottom, 좌우 20, 아래 24 + safe-area.
- 탭바: 높이 64 + safe-area, 4열 균등, 아이콘 박스 24(위 패딩 9, 채운 아이콘), 라벨 12/16(활성 700), 아이콘·라벨 간격 2, 활성=sky, 비활성=subtext, 배경 surface, 그림자 tabbar. 탭 구성은 홈·예보·기록·내 설정 [2026-09-25 변경, 이전 "마이페이지"]. 탭바는 탭 최상위 화면(/app, /app/forecast, /app/log, /app/me)에서만 보인다.
- 카피: 해요체, 짧게, 비난 없음, 수치는 "약"·범위 표현.

## 7. 프로토타입과 의도적으로 다른 점
1. 버튼: 프로토타입은 #7FB3FF + 진한 남색 글자 → 코발트 + 흰 글자(사용자 요청). 선택 칩·활성 탭·링크는 프로토타입과 같은 #225FA5.
2. 탭 구성: 프로토타입(홈·예보·복귀 체크인·기록) 대신 원래 구성(홈·예보·기록·마이페이지). 체크인 화면은 하위 흐름이라 탭바를 숨긴다.
3. CTA 문구: 프로토타입 라벨이 읽히지 않아 "체크인 완료하기".
4. 아이콘: 프로토타입 에셋 대신 Icon.tsx의 선 아이콘. 이미지: 빈 자리.
5. 프로토타입에서 서로 달랐던 칩 높이(약 53~57)는 57로 통일.
6. 말풍선 폭은 390px에서 238이고, 그보다 좁거나 넓으면 유동이다.

## 8. 홈 화면 시안 반영 [2026-09-25, 사용자 승인]
사용자가 홈 화면 시안(402px 캡처, 몽실이 뒤 떠다니는 그라디언트 포함)을 픽셀 단위로 실측해 달라고 요청했고,
"탭바·네비게이션바·말풍선 글자 크기와 위치, 버튼 형식 등을 다른 페이지에도 통일 적용"하라고 명시했다. 그래서 아래
값은 홈뿐 아니라 공용 컴포넌트(Header, TabBar, SectionTitle, Button, SpeechBubble)를 통해 전체 화면에 적용된다.
1장 "사용자 승인 없이 바꾸지 않는다" 규칙에 따라 이 절이 곧 그 승인 기록이다.

### 8-1. 브랜드 헤더 (Header variant="brand")
- 좌우 패딩 16(이전 20/26, 좌우 비대칭이었음 → 대칭 16으로 변경).
- 로고 타일 32×32, 반경 12(불변), 배경 primary, 안에 흰색 cloud 아이콘(18px) — 이전에는 빈 타일이었다.
- 타일-워드마크 간격 12(이전 8).
- 워드마크: display 토큰(24/29, -0.03em, 700). 이전에는 cta 토큰(18px)을 썼다.
- 헤더 오른쪽 아바타: 40×40(이전 32).

### 8-2. 섹션 제목 (SectionTitle)
- 아이콘을 24×24 cobalt 배지(반경 8) 안에 흰색 14px 아이콘으로 감싼다. 이전에는 배지 없이 cobalt 선 아이콘만 15px로 뒀다.
- 글자는 heading 토큰(16/22, 700). 이전에는 section 토큰(14/20, 400, 얇은 글자)이었다.
- 배지 색은 아이콘 종류와 무관하게 항상 cobalt다 — 어느 페이지에서 어떤 아이콘을 넘겨도 같은 규칙.

### 8-3. 말풍선 (SpeechBubble)
- 위 줄(아이콘+라벨) 색을 cobalt에서 sky로 변경. 날씨 아이콘은 상태에 따라 sun/cloud/rain으로 바뀐다(이전엔 sun 고정이었던 홈 쪽 버그를 같이 고쳤다).

### 8-4. 버튼 (Button)
- lg 버튼에 `fullWidth` prop 추가(기본 true = 기존과 동일하게 꽉 채움). `fullWidth={false}`면 내용 너비만큼만 차지하고 좌우 패딩 32(px-8) — 카드 안에서 가운데 정렬되는 pill 버튼(빈 상태 CTA 등)에 쓴다.

### 8-5. 탭바 (TabBar)
- 아이콘을 선 아이콘 → 채운 아이콘으로 변경(홈·예보·기록·내 설정 4종, 이 파일 안에서만 쓰는 전용 SVG라 Icon.tsx 레지스트리에는 넣지 않았다).
- 활성 색을 cobalt → sky로 변경, 활성 라벨은 700(비활성은 400 유지).
- "마이페이지" → "내 설정"으로 라벨 변경.

### 8-6. 홈 화면 구조
- 히어로부터 카드 목록까지 배경(날씨별 그라디언트 + 몽실이 뒤로 떠다니는 흐린 그라디언트 덩어리 3개)이 탭바 바로 위까지 끊기지 않고 이어진다(HeroBackdrop이 페이지 전체를 감싼다). 덩어리는 blur-3xl + 낮은 불투명도, 9~12초 주기로 각자 다르게 이동·확대되며 motion-safe로만 움직인다.
- "오늘의 상태" 6칸(좌 3·몽실이·우 3, 진행바 포함) 구성을 걷어내고, 몽실이 바로 아래에 pill 3개(칼로리 / 오늘의 걸음 / 체중 변화)를 가로로 둔다. pill은 흰 배경 + primary색 원형 아이콘 배지(48px, pill 높이 40보다 커서 위아래로 살짝 튀어나옴) + 굵은 값 + 회색 캡션.
- "맞춤 기록" 칩, 샘플 태그, 하단 날씨 pill·캡션 문구는 시안에 없어 제거했다.
- 이번 주 예보 카드의 "오늘" 칸은 둥근 모서리(반경 16)를 추가했다(이전엔 각진 채로 배경만 cobalt였다).
- 빈 상태(다가오는 이벤트 없음) 아바타는 96→112, 액션 버튼은 lg + fullWidth=false, 문구는 "이벤트 등록하기"(이전 "이벤트 예보 만들기").
- "이번 주 예보" → "이번주 예보"(시안 표기 그대로, 띄어쓰기 제거).
