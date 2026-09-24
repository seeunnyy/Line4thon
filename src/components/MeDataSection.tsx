"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BottomSheet from "@/components/ui/BottomSheet";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import MenuRow from "@/components/ui/MenuRow";
import SectionTitle from "@/components/ui/SectionTitle";
import TextLink from "@/components/ui/TextLink";
import { loadDemoData } from "@/lib/demo";
import { clearStore } from "@/lib/storage";

type Sheet = "demo" | "reset" | null;

// 마이페이지 "시연·데이터": 데모 데이터 불러오기(오늘 기준 샘플 이벤트로 교체) / 데이터 초기화(저장소 비우고 처음으로).
export default function MeDataSection() {
  const router = useRouter();
  const [sheet, setSheet] = useState<Sheet>(null);
  const [notice, setNotice] = useState(false);

  const close = () => setSheet(null);
  const confirmDemo = () => {
    loadDemoData();
    setSheet(null);
    setNotice(true);
  };
  const confirmReset = () => {
    setSheet(null);
    clearStore();
    router.replace("/");
  };

  return (
    <>
      <SectionTitle icon="clock">시연·데이터</SectionTitle>
      <Card variant="panel" className="mt-2 divide-y divide-line">
        <MenuRow
          label="데모 데이터 불러오기"
          tag="시연용"
          onClick={() => {
            setNotice(false);
            setSheet("demo");
          }}
        />
        <MenuRow
          label="데이터 초기화"
          onClick={() => {
            setNotice(false);
            setSheet("reset");
          }}
        />
      </Card>
      <p role="status" className="mt-2 text-body text-subtext">
        {notice ? "데모 데이터를 불러왔어요. 홈과 예보에서 확인해 보세요." : ""}
      </p>

      <BottomSheet open={sheet === "demo"} onClose={close} title="데모 데이터를 불러올까요?">
        <p className="mt-2 text-body text-subtext">
          시연용 샘플 이벤트가 채워져요. 지금 저장된 이벤트와 체크인은 바뀌어요.
        </p>
        <Button size="md" onClick={confirmDemo} className="mt-5 w-full">
          불러오기
        </Button>
        <TextLink onClick={close} className="mt-1">
          취소
        </TextLink>
      </BottomSheet>

      <BottomSheet open={sheet === "reset"} onClose={close} title="모든 데이터를 지울까요?">
        <p className="mt-2 text-body text-subtext">
          저장된 프로필, 이벤트, 체크인 기록이 이 기기에서 지워져요. 되돌릴 수 없어요.
        </p>
        <Button size="md" onClick={confirmReset} className="mt-5 w-full">
          초기화하기
        </Button>
        <TextLink onClick={close} className="mt-1">
          취소
        </TextLink>
      </BottomSheet>
    </>
  );
}
