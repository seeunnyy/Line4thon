# CLAUDE.md

## Project
Bodycast — 이벤트 대응형 다이어트 재도전 코치 모바일 서비스 MVP (해커톤 '애니멀리그' 출품작)

## Product Idea
이 앱은 다이어트를 3회 이상 시도했다가 중단한 경험이 있는 "N차 재도전자"가 회식·여행·명절 같은 예정된 이벤트로 인한 급격한 이탈을 막고, 무너지더라도 심리적 부담 없이 재도전할 수 있도록, 이벤트를 미리 시뮬레이션하고 전/후 대응 가이드를 제공하는 것으로 돕는다.

## Tech Stack
- Next.js
- React
- TypeScript
- Tailwind CSS
- Claude Code
- GitHub
- 모바일 우선 웹앱 (스마트폰 세로 화면 기준, 폭 390px)

## Current Stage
P0 기능 구현 완료(2026-09-24): 저장 모듈·시뮬레이션 엔진·온보딩/이벤트/체크인 저장·`/api/coach`(템플릿 우선)·데모 데이터/초기화. P1 기록 탭도 실데이터로 연결. 남은 것: 홈 "오늘의 상태" 카드 데이터 출처, P2(경험치·아바타 반응 배선).
구현 순서·기능별 가능 여부 판단·무료 API 대안은 docs/IMPLEMENTATION-PLAN.md를 따른다(2026-09-24, "무료/무결제만" 제약 조건 포함 — docs/LLM.md의 공급자 확정 항목보다 이 문서가 우선한다).

## Working Rules
- 변경 제안 전 관련 파일을 먼저 읽는다.
- 파일을 수정하기 전 계획을 먼저 설명한다.
- 변경은 작게 유지한다.
- 불필요한 의존성을 추가하지 않는다.
- 프로젝트 방향이 바뀌면 문서를 업데이트한다.
- 커밋 전 변경된 파일을 요약한다.
- 숫자·상수·공식은 docs/SIMULATION.md 값만 쓴다. 문서에 없으면 지어내지 말고 나에게 묻는다.
- LLM 관련 작업은 docs/LLM.md를 따른다.
- P0 → P1 → P2 순서를 지킨다.
- 모든 화면은 모바일 세로(기준 폭 390px)에서 먼저 설계하고 확인한다. 데스크톱용 별도 레이아웃은 만들지 않는다.
- 프로토타입 기준 화면(복귀 체크인)의 수치는 docs/UI-SPEC.md 값만 쓴다. 임의로 바꾸지 않는다. 버튼은 코발트 배경 + 흰 글자다.
- 화면 시안 단계(로직 없음)에서는 P1 화면(기록·아바타 꾸미기)도 정적 화면까지만 만든다. 기능 구현은 P0 → P1 → P2 순서를 지킨다.
- 화면 시안의 샘플 데이터는 `src/mocks/sample.ts`에만 두고 화면에 "샘플" 표시를 붙인다. 기능 구현 때 저장 모듈 데이터로 교체하고, `?state=`·`?weather=` 미리보기 스위치와 `src/app/dev`는 함께 지운다.

## Boundaries
Do not add:
- payment
- complex authentication
- real-time collaboration
- large file upload
- multiple external API integrations (LLM API 1개 연동만 허용, 웨어러블·InBody 등은 2단계 이후로 보류)
- 네이티브 앱 빌드·앱스토어 배포
- 푸시 알림

## References
- Follow docs/IMPLEMENTATION-PLAN.md for the build order, feature-by-feature feasibility, and free-tier-only tech choices (supersedes docs/LLM.md's provider line where they conflict).
- Follow docs/DESIGN.md for UI direction.
- Follow docs/ARCHITECTURE.md for project structure.
- Follow docs/PRD.md for product requirements.
- Follow docs/SIMULATION.md for calculation constants and formulas.
- Follow docs/LLM.md for LLM integration and safety rules.
- Follow docs/UI-SPEC.md for prototype-based UI measurements.
