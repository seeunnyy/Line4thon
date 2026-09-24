// SIMULATION.md 5장 검증 예시. 실행: node tests/simulation.check.mts (Node 23.6+는 TS를 그대로 실행한다)
import assert from "node:assert/strict";
import { PRESET_KCAL, intensityRatio, simulate } from "../src/lib/simulation.ts";

const near = (a: number, b: number, eps = 0.005) => Math.abs(a - b) <= eps;

// 회식 1회 +1,500kcal → 실제 지방 1,500 ÷ 7,700 ≈ 0.19kg
const s = simulate(1500);
assert.ok(near(s.fatKg, 0.19), `실제 지방 ${s.fatKg}`);

// 48~72시간에 걸쳐 표시체중이 실제 지방선으로 수렴한다
assert.ok(s.displayedAt(0) > s.displayedAt(24));
assert.ok(s.displayedAt(24) > s.displayedAt(48));
assert.ok(near(s.displayedAt(72), s.fatKg, 1e-9), "72시간에 실제 지방선과 같아야 한다");
assert.ok(near(s.displayedAt(60), s.fatKg, 1e-9), "60시간 이후는 실제 지방만 남는다");

// 강도 비율 clamp(4장 2)
assert.equal(intensityRatio(0), 0);
assert.equal(intensityRatio(650), 0);
assert.equal(intensityRatio(2000), 1);
assert.equal(intensityRatio(5000), 1);

// 프리셋(2장)
assert.deepEqual(PRESET_KCAL, { light: 650, normal: 1000, many: 2000 });

// 참고 출력: 다음 날(t=24h) 표시체중. 5장은 "+1~2kg"이라고 적고 있다.
for (const kcal of [650, 1000, 1500, 2000]) {
  const x = simulate(kcal);
  const h24 = x.displayedAt(24);
  const inRange = h24 >= 1 && h24 <= 2;
  console.log(
    `${kcal}kcal  지방 ${x.fatKg.toFixed(2)}kg  t0 ${x.displayedAt(0).toFixed(2)}  t24 ${h24.toFixed(2)}kg${inRange ? "" : "  ← 5장 '+1~2kg' 범위 밖"}`,
  );
}
console.log("simulation.check: OK");
