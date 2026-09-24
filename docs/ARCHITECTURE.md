# ARCHITECTURE.md

## Platform
- 모바일 우선 웹앱(Next.js). 공통 레이아웃이 앱 셸을 담당한다: 데스크톱에서는 390px 폰 프레임, 모바일은 360~430px 유동, 세이프에어리어, 탭바.
- 네이티브 앱 빌드·앱스토어 배포는 범위 밖이다. 2단계에서 웨어러블(HealthKit 등)이나 푸시 알림이 필요해지면 그때 네이티브 전환을 검토한다.

## Service Structure
User → 스플래시/인트로 → 온보딩(정보 입력 → 몸 정보 → 아바타) → 탭 화면(홈/예보/기록/마이페이지) → 이벤트 등록 → 시뮬레이션 결과 → 재개 체크인 → State(localStorage) → Tests → Deploy

## Planned Routes
- `/`: 스플래시/인트로 (프로필·아바타가 이미 있으면 `/app`으로 이동)
- `/onboarding/profile`: 내 정보 입력
- `/onboarding/body`: 몸 정보 입력(성별·나이·키·체중·활동량, 모두 선택. 하루 권장 섭취 칼로리 계산용)
- `/onboarding/avatar`: 아바타 설정
- `/app`: 홈 (탭)
- `/app/forecast`: 예보 목록 (탭)
- `/app/event/new`: 이벤트 등록
- `/app/event/[id]/simulation`: 시뮬레이션 결과
- `/app/checkin`: 재개 체크인
- `/app/log`: 기록 (탭, P1)
- `/app/me`: 마이페이지 (탭)
- `/app/me/avatar`: 아바타 꾸미기
- `/api/coach`: LLM 호출 전용 서버 API 라우트

### 라우팅 규칙
- `/app/*`은 프로필·아바타가 없으면 `/onboarding/profile`로 보낸다.
- 탭바는 공통 레이아웃에서 탭 화면에만 표시한다 (구현 방식은 Session 2 계획에서 정하고, 여기에는 규칙만 적는다).

## Data Storage (결정)
- 해커톤 MVP는 DB·서버 저장·로그인 없이 브라우저 localStorage에 저장한다 (CLAUDE.md의 Boundaries와 일치).
- 저장 대상은 아래 8가지로 최소화한다:
  - 프로필 (닉네임 등) (P0)
  - 아바타 설정 (P0)
  - 이벤트 (P0)
  - 시뮬레이션 결과 (전/후 가이드 포함) (P0)
  - 체크인 (P0)
  - 체중 기록 (P1, 날씨 UI의 7일 이동평균용)
  - 재도전 이력 (경험치) (P2)
  - 동반자 상태 (P2)
- 기획서 9절의 11개 테이블 설계(Users, WeightLogs, TDEEMetrics, Events, SimulationResults, NutritionGuides, CheckIns, RelapseReframingLogs, RetryHistory, CompanionState, WearableSync)는 정식 배포용 초안이며 MVP 범위 밖이다. 삭제하지 않고 참고용으로 남긴다.
- localStorage 접근은 한 곳(저장 모듈)으로 모아 나중에 DB로 교체할 수 있게 하고, 클라이언트 컴포넌트에서만 접근한다.
- 한계: 데이터는 브라우저·기기별로 저장되며, 모바일 Safari에서는 장기간 미사용 시 삭제되거나 사생활 보호 모드에서 제한될 수 있다. MVP 한계로 두고 정식 출시 때 서버 저장으로 전환한다.

## LLM Integration
- 서버 API 라우트 1개(`/api/coach`)로만 LLM을 호출한다. 브라우저에서 직접 호출하지 않는다.
- 세부 규칙(연동 규칙, 안전 규칙, 폴백 처리 등)은 docs/LLM.md를 따른다.

## Source Structure
- `src/`: application source code
  - `src/app/`: 라우트 (탭 화면은 `app/app/(tabs)/`, 하위 흐름은 그 밖에 둔다)
  - `src/components/ui/`: 공통 UI 컴포넌트 (Button, Chip, Card, Header, BottomSheet 등). 아바타는 `Avatar`(원형 얼굴)와 `Mongsil`(전신 + 날씨 소품). 전신의 몸통은 클라이언트 컴포넌트 `MongsilBody`가 정지 그림 위에 2.5D WebGL 캔버스를 얹어 움직이고, 그 엔진은 `src/components/ui/mongsil/`(`layout.ts` 좌표·`motion.ts` 날씨별 안무(calm/lively)·`engine.ts` WebGL·`faceData.ts` 얼굴 부품 좌표, 외부 라이브러리 없음)에 있다. WebGL을 못 쓰면 정지 그림 + CSS 숨쉬기로 대체된다
  - `src/lib/`: 로직. `storage.ts`(localStorage 유일 접근점 + `useStore` 훅), `simulation.ts`(SIMULATION.md 계산), `forecast.ts`(날씨 규칙·주간 스트립·D-day·예보 장면), `coach.ts`(안전 규칙 템플릿 문구), `tdee.ts`(하루 권장 섭취 칼로리), `model.ts`(타입), `dates.ts`, `demo.ts`(데모 데이터)
  - `src/mocks/sample.ts`: 아직 데이터 출처가 없는 화면 값만 남은 샘플(홈 "오늘의 상태" 카드, 아바타 꾸미기 자리 표시)
- `public/avatar/`: 몽실이 에셋(투명 PNG, 2.5D 깊이맵 PNG, 얼굴 부품 아틀라스 PNG, 소나기 우산 분리 PNG). 내용은 docs/DESIGN.md의 Character & Avatar Rules 참고
- `docs/`: project documents
- `tests/`: test code

## Tests / Deploy
- 배포 URL은 실제 스마트폰(iOS Safari, Android Chrome 최신)에서 확인한다.
- 개발 중에는 브라우저 모바일 뷰포트(390×844)로 확인한다.
