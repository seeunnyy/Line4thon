"use client";

import { useState } from "react";
import Header from "@/components/ui/Header";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import HeroBackdrop from "@/components/ui/HeroBackdrop";
import SegmentedTabs from "@/components/ui/SegmentedTabs";
import { AVATAR_CATEGORIES, SKIN_TONES, type AvatarCategory } from "@/mocks/sample";

const TILE_COUNT = 9;

const OPTIONS = AVATAR_CATEGORIES.map((c) => ({ value: c, label: c }));

// 아바타 꾸미기(P1 정적 시안). 미리보기 + 카테고리 탭 + 선택지 그리드.
// 항목 이미지는 에셋이 정해질 때까지 빈 사각 자리이고, 선택 상태만 카테고리별로 기억한다. 몸 모양 옵션은 없다.
export default function AvatarCustomizePage() {
  const [category, setCategory] = useState<AvatarCategory>("얼굴형");
  const [picked, setPicked] = useState<Record<AvatarCategory, number>>({
    얼굴형: 0,
    헤어: 0,
    피부톤: 0,
    표정: 0,
    의상: 0,
    소품: 0,
  });

  const select = (index: number) => setPicked((prev) => ({ ...prev, [category]: index }));

  return (
    <div className="flex min-h-dvh flex-col">
      <Header
        variant="back"
        backHref="/app/me"
        title="아바타 꾸미기"
        right={
          <Button size="sm" href="/app">
            완료
          </Button>
        }
      />

      <main className="flex-1 pb-8">
        <HeroBackdrop weather="sunny" className="flex justify-center py-6">
          <Avatar size={180} ring />
        </HeroBackdrop>

        <SegmentedTabs
          scrollable
          label="꾸미기 항목"
          idBase="avatar-category"
          options={OPTIONS}
          value={category}
          onChange={setCategory}
          className="mt-4 px-5"
        />

        <div
          role="tabpanel"
          id="avatar-category-panel"
          aria-labelledby={`avatar-category-tab-${category}`}
          className="mt-4 px-5"
        >
          {category === "피부톤" ? (
            <div role="radiogroup" aria-label="피부톤 선택" className="flex justify-between">
              {SKIN_TONES.map((tone, i) => {
                const selected = picked[category] === i;
                return (
                  <button
                    key={tone}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    aria-label={`피부톤 ${i + 1}`}
                    onClick={() => select(i)}
                    style={{ backgroundColor: tone }}
                    className={`h-11 w-11 rounded-full outline outline-2 outline-offset-2 ${
                      selected ? "outline-cobalt" : "outline-transparent"
                    }`}
                  />
                );
              })}
            </div>
          ) : (
            <div role="radiogroup" aria-label={`${category} 선택`} className="grid grid-cols-3 gap-2">
              {Array.from({ length: TILE_COUNT }, (_, i) => {
                const selected = picked[category] === i;
                return (
                  <button
                    key={i}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    aria-label={`${category} ${i + 1}`}
                    onClick={() => select(i)}
                    className={`aspect-square w-full border-2 bg-surface-low ${
                      selected ? "border-cobalt" : "border-transparent"
                    }`}
                  />
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
