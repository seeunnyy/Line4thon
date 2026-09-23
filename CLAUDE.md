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
Session 1 완료(문서 보강·브랜드 반영). 다음: Session 2 — Next.js 초기화(모바일 셸 포함)

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
- Follow docs/DESIGN.md for UI direction.
- Follow docs/ARCHITECTURE.md for project structure.
- Follow docs/PRD.md for product requirements.
- Follow docs/SIMULATION.md for calculation constants and formulas.
- Follow docs/LLM.md for LLM integration and safety rules.
