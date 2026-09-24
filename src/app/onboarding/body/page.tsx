"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/ui/Header";
import ProgressDots from "@/components/ui/ProgressDots";
import Field from "@/components/ui/Field";
import ChipGroup from "@/components/ui/ChipGroup";
import Chip from "@/components/ui/Chip";
import Card from "@/components/ui/Card";
import StickyBottom from "@/components/ui/StickyBottom";
import Button from "@/components/ui/Button";
import TextLink from "@/components/ui/TextLink";
import {
  ACTIVITY_OPTIONS,
  SEX_OPTIONS,
  calcTdee,
  formatTdee,
  type ActivityLevel,
  type Sex,
} from "@/lib/tdee";
import { getStore, updateStore } from "@/lib/storage";

// 빈 칸·0은 입력하지 않은 것으로 본다.
const toNumber = (v: string) => {
  const n = parseFloat(v);
  return Number.isFinite(n) && n > 0 ? n : null;
};

// 몸 정보 입력(온보딩 2/3). 모두 선택 입력이고, "다음"을 누르면 채운 만큼 프로필에 저장한다.
// 5개가 모두 채워지면 "다음"이 같은 화면의 결과 상태(하루 권장 섭취 칼로리)를 먼저 보여준다(SIMULATION.md 6장).
// 마이페이지에서 수정하러 들어온 경우(아바타 설정이 이미 있음)에는 아바타 대신 마이페이지로 돌아간다.
export default function BodyPage() {
  const router = useRouter();
  const [sex, setSex] = useState<Sex | null>(null);
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [activity, setActivity] = useState<ActivityLevel | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [nickname, setNickname] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const { profile, avatar } = getStore();
    setEditing(avatar !== null);
    if (!profile) return;
    setNickname(profile.nickname);
    setSex(profile.sex);
    setAge(profile.age ? String(profile.age) : "");
    setHeight(profile.heightCm ? String(profile.heightCm) : "");
    setWeight(profile.weightKg ? String(profile.weightKg) : "");
    setActivity(profile.activity);
  }, []);

  const tdee = calcTdee({
    sex,
    age: toNumber(age),
    heightCm: toNumber(height),
    weightKg: toNumber(weight),
    activity,
  });
  const hasTdee = tdee !== null && tdee > 0;

  const next = editing ? "/app/me" : "/onboarding/avatar";
  const goAvatar = () => router.push(next);

  const save = () =>
    updateStore((s) =>
      s.profile
        ? {
            ...s,
            profile: {
              ...s.profile,
              sex,
              age: toNumber(age),
              heightCm: toNumber(height),
              weightKg: toNumber(weight),
              activity,
            },
          }
        : s,
    );

  if (showResult && hasTdee) {
    return (
      <div className="flex min-h-dvh flex-col">
        <Header
          variant="back"
          backHref="/onboarding/profile"
          center={<ProgressDots total={3} current={2} />}
        />

        <main className="flex-1 px-5 pb-6">
          <h1 className="mt-2 text-display font-bold">하루 권장 섭취 칼로리를 계산했어요</h1>
          <p className="mt-3 text-body text-subtext">
            키·체중·나이·활동량으로 계산한 추정치예요.
          </p>

          <Card className="mt-6 px-5 py-6 text-center">
            <p className="text-label text-subtext">
              {nickname ? `${nickname}님의 하루 권장 섭취 칼로리는` : "하루 권장 섭취 칼로리는"}
            </p>
            <p className="mt-2">
              <span className="text-hero-num font-bold text-cobalt">{formatTdee(tdee)}</span>
              <span className="ml-1 text-lead font-bold text-ink">이에요</span>
            </p>
          </Card>

          <p className="mt-4 text-body text-subtext">
            이벤트 없는 날은 이만큼 먹는 게 &lsquo;평소&rsquo;예요. 예보는 이 기준에서 더 먹는 양으로
            계산해요.
          </p>
        </main>

        <StickyBottom>
          <Button size="lg" icon onClick={goAvatar}>
            다음
          </Button>
          <TextLink onClick={() => setShowResult(false)} className="mt-1">
            다시 입력할게요
          </TextLink>
        </StickyBottom>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <Header
        variant="back"
        backHref="/onboarding/profile"
        center={<ProgressDots total={3} current={2} />}
      />

      <main className="flex-1 px-5 pb-6">
        <h1 className="mt-2 text-display font-bold">평소 하루를 알려 주세요</h1>
        <p className="mt-3 text-body text-subtext">
          하루 권장 섭취 칼로리를 계산해 이벤트 없는 날의 기준으로 써요. 모두 선택이라 건너뛰어도
          괜찮아요.
        </p>

        <div className="mt-6">
          <p className="mb-2 text-label text-subtext">성별</p>
          <ChipGroup label="성별" columns={2}>
            {SEX_OPTIONS.map((s) => (
              <Chip
                key={s.id}
                size="row"
                label={s.label}
                selected={sex === s.id}
                onClick={() => setSex(s.id)}
              />
            ))}
          </ChipGroup>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <Field
            label="나이"
            unit="세"
            inputMode="numeric"
            value={age}
            onChange={(e) => setAge(e.target.value.replace(/[^0-9]/g, ""))}
            maxLength={3}
          />
          <Field
            label="키"
            unit="cm"
            inputMode="numeric"
            value={height}
            onChange={(e) => setHeight(e.target.value.replace(/[^0-9]/g, ""))}
            maxLength={3}
          />
          <Field
            label="체중"
            unit="kg"
            inputMode="decimal"
            value={weight}
            onChange={(e) => setWeight(e.target.value.replace(/[^0-9.]/g, ""))}
            maxLength={5}
          />
        </div>

        <div className="mt-6">
          <p className="mb-2 text-label text-subtext">평소 얼마나 움직이나요?</p>
          <ChipGroup label="평소 얼마나 움직이나요?" columns={2}>
            {ACTIVITY_OPTIONS.map((a) => (
              <Chip
                key={a.id}
                size="stack"
                label={a.label}
                subLabel={a.sub}
                selected={activity === a.id}
                onClick={() => setActivity(a.id)}
              />
            ))}
          </ChipGroup>
        </div>
        <p className="mt-2 text-body text-subtext">나중에 마이페이지에서 입력해도 돼요.</p>
      </main>

      <StickyBottom>
        <Button
          size="lg"
          icon
          onClick={() => {
            save();
            if (hasTdee) setShowResult(true);
            else goAvatar();
          }}
        >
          다음
        </Button>
        <TextLink href={next} className="mt-1">
          나중에 할게요
        </TextLink>
      </StickyBottom>
    </div>
  );
}
