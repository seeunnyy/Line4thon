# CLAUDE.md

## Project
다이어트 예보 — 이벤트 대응형 다이어트 재도전 코치 MVP (해커톤 '애니멀리그' 출품작)

## Product Idea
이 앱은 다이어트를 3회 이상 시도했다가 중단한 경험이 있는 "N차 재도전자"가 회식·여행·명절 같은 예정된 이벤트로 인한 급격한 이탈을 막고, 무너지더라도 심리적 부담 없이 재도전할 수 있도록, 이벤트를 미리 시뮬레이션하고 전/후 대응 가이드를 제공하는 것으로 돕는다.

## Tech Stack
- Next.js
- React
- TypeScript
- Tailwind CSS
- Claude Code
- GitHub

## Current Stage
Session 1: 프로젝트 셋업 및 컨텍스트 설계

## Working Rules
- 변경 제안 전 관련 파일을 먼저 읽는다.
- 파일을 수정하기 전 계획을 먼저 설명한다.
- 변경은 작게 유지한다.
- 불필요한 의존성을 추가하지 않는다.
- 프로젝트 방향이 바뀌면 문서를 업데이트한다.
- 커밋 전 변경된 파일을 요약한다.

## Boundaries
Do not add:
- payment
- complex authentication
- real-time collaboration
- large file upload
- multiple external API integrations (LLM API 1개 연동만 허용, 웨어러블·InBody 등은 2단계 이후로 보류)

## References
- Follow docs/DESIGN.md for UI direction.
- Follow docs/ARCHITECTURE.md for project structure.
- Follow docs/PRD.md for product requirements.
