import { NextResponse } from "next/server";
import { checkinTemplate } from "@/lib/coach";
import type { Bloat, Energy } from "@/lib/model";

// LLM 호출 전용 서버 라우트(docs/LLM.md 2장). 기본은 고정 템플릿이고, 환경변수가 모두 있을 때만 무료 티어 LLM을 부른다
// (docs/IMPLEMENTATION-PLAN.md 1장). 실패·타임아웃·형식 오류·금지 표현이 나오면 템플릿으로 대체해 데모가 멈추지 않게 한다.
// 보내는 값은 체크인 칩 선택값뿐이다(이름 등 식별정보 없음). 자유 입력이 없어 위험 신호 감지 대상 입력도 없다.

const BLOATS: Bloat[] = ["light", "mid", "heavy"];
const ENERGIES: Energy[] = ["good", "low"];
const TIMEOUT_MS = 8000;

// LLM.md 3장: 제한·단식·보상 운동·배출 행동·체형 평가·실패 프레임 표현이 섞이면 버린다.
const BANNED = /굶|단식|칼로리\s*제한|덜\s*먹|태우|구토|설사약|이뇨제|살쪘|살이\s*쪘|실패|나쁜\s*음식|죄책/;

const SYSTEM_PROMPT = `너는 다이어트 재도전 코치 앱 "Bodycast"의 체크인 코치다. 한국어 존댓말(해요체)로 2~3문장만 쓴다.
규칙:
- 극단적 칼로리 제한, 단식, 굶기, 이벤트 후 덜 먹기를 권하지 않는다. 평소 식사 리듬 유지를 권한다.
- "먹은 만큼 운동으로 태우기" 같은 보상·벌칙 표현을 쓰지 않는다. 배출 행동은 언급하지 않는다.
- 체형·외모·몸무게를 평가하지 않는다. 체중 변화는 수분 등으로 인한 일시적 변동으로만 설명한다.
- 음식을 좋고 나쁨으로 나누지 않고, 죄책감·비난 어조를 쓰지 않는다. "실패"라는 말을 쓰지 않는다.
- 새로운 숫자를 만들지 않는다. 시간 표현이 필요하면 "48~72시간"만 쓴다.
- 의학적 진단·처방을 하지 않는다.
응답은 {"message": "..."} 형태의 JSON 하나로만 한다.`;

const BLOAT_KO: Record<Bloat, string> = { light: "가벼움", mid: "약간 부음", heavy: "묵직함" };
const ENERGY_KO: Record<Energy, string> = { good: "개운함", low: "피곤함" };

async function callLLM(userPrompt: string): Promise<string | null> {
  const provider = process.env.COACH_LLM_PROVIDER;
  const key = process.env.COACH_LLM_API_KEY;
  const model = process.env.COACH_LLM_MODEL;
  if (!provider || !key || !model) return null;

  const signal = AbortSignal.timeout(TIMEOUT_MS);
  let text: string | undefined;

  if (provider === "groq") {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      signal,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model,
        temperature: 0.6,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    text = data?.choices?.[0]?.message?.content;
  } else if (provider === "gemini") {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: "POST",
        signal,
        headers: { "Content-Type": "application/json", "x-goog-api-key": key },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ role: "user", parts: [{ text: userPrompt }] }],
          generationConfig: { temperature: 0.6, responseMimeType: "application/json" },
        }),
      },
    );
    if (!res.ok) return null;
    const data = await res.json();
    text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  } else {
    return null;
  }

  if (typeof text !== "string") return null;
  const message = (JSON.parse(text) as { message?: unknown }).message;
  if (typeof message !== "string") return null;
  const trimmed = message.trim();
  if (trimmed.length === 0 || trimmed.length > 300 || BANNED.test(trimmed)) return null;
  return trimmed;
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as
    | { type?: string; bloat?: Bloat; energy?: Energy }
    | null;
  if (
    !body ||
    body.type !== "checkin" ||
    !BLOATS.includes(body.bloat as Bloat) ||
    !ENERGIES.includes(body.energy as Energy)
  ) {
    return NextResponse.json({ error: "invalid request" }, { status: 400 });
  }
  const input = { bloat: body.bloat as Bloat, energy: body.energy as Energy };
  const template = checkinTemplate(input);

  try {
    const message = await callLLM(
      `이벤트(회식·여행 등)가 끝난 다음 날 체크인이다. 체감 붓기: ${BLOAT_KO[input.bloat]}, 수면·에너지: ${ENERGY_KO[input.energy]}.
참고 문구(이 톤과 규칙을 지켜 새로 써도 된다): ${template}`,
    );
    if (message) return NextResponse.json({ message, source: "llm" });
  } catch {
    // 타임아웃·네트워크·JSON 파싱 오류 → 템플릿
  }
  return NextResponse.json({ message: template, source: "template" });
}
