# ARCHITECTURE.md

## Service Structure
User → Landing Page → 이벤트 등록 → 시뮬레이션 결과 → 재개 체크인 → State → Data → Tests → Deploy

## Planned Routes
- `/`: Landing page
- `/app`: 메인 대시보드 (날씨 UI)
- `/app/event/new`: 이벤트 등록
- `/app/event/[id]/simulation`: 시뮬레이션 결과
- `/app/checkin`: 재개 준비도 체크인

## Source Structure
- `src/`: application source code
- `docs/`: project documents
- `tests/`: test code
