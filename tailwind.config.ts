import type { Config } from "tailwindcss";

// 색상·반경·그림자·타입 스케일은 docs/UI-SPEC.md 2~4장(프로토타입 기준, 검증됨)을 그대로 옮긴 것이다.
// 값을 바꿀 일이 생기면 이 파일 한 곳만 고치면 된다. UI-SPEC.md 값이 먼저이고, 여기는 그 반영본이다.
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Bodycast Sans",
          "Apple SD Gothic Neo",
          "Malgun Gothic",
          "system-ui",
          "sans-serif",
        ],
      },
      colors: {
        surface: "#FBF8FF", // 프레임·헤더·탭바 배경
        "surface-low": "#F5F2FD", // 비선택 칩, 말풍선, 안내 박스
        card: "#FFFFFF", // 카드(코치 카드, 패널)
        ink: "#1B1B22", // 본문
        subtext: "#424751", // 보조 글자, 비활성 탭, 비선택 칩 글자
        cobalt: "#225FA5", // 버튼 배경, 선택 칩, 활성 탭, 링크, 캡션
        "cobalt-pressed": "#1B4D87", // 버튼 눌림
        primary: "#7FB3FF", // 장식 전용(로고 타일 등). 글자·아이콘 색으로 쓰지 않는다
        disc: "#F0EFED", // 아바타 원(빈 자리)
        positive: "#006B56", // 완료·긍정 표시
        line: "#E4E1EC", // 구분선, 비활성 버튼 배경, 비활성 점
        accent: "#FF8B6B", // 버튼에는 쓰지 않는다. 장식 포인트에만
      },
      borderRadius: {
        card: "32px", // 코치 카드·큰 카드·바텀시트 위쪽
        pill: "28px", // 56px 버튼의 pill
        tile: "12px", // 로고 타일
      },
      boxShadow: {
        header: "0 4px 12px rgba(34,95,165,.05)",
        coach: "0 8px 24px rgba(34,95,165,.08)",
        panel: "0 4px 16px rgba(34,95,165,.06)",
        tabbar: "0 -4px 16px rgba(34,95,165,.10)",
        avatar: "0 2px 8px rgba(0,0,0,.08)",
        badge: "0 1px 3px rgba(0,0,0,.12)",
        // cta 그림자는 Tailwind 기본 shadow-md 값과 동일해 별도 토큰을 두지 않는다.
      },
      fontSize: {
        // 이름: [크기, { lineHeight, letterSpacing }]. 굵기(400/700)는 font-normal/font-bold로 따로 지정한다.
        display: ["24px", { lineHeight: "29px", letterSpacing: "-0.03em" }],
        cta: ["18px", { lineHeight: "normal" }],
        lead: ["15px", { lineHeight: "23px" }],
        section: ["14px", { lineHeight: "20px" }],
        label: ["13px", { lineHeight: "18px" }],
        body: ["12px", { lineHeight: "18px" }],
        caption: ["10px", { lineHeight: "15px", letterSpacing: ".02em" }],
        tab: ["12px", { lineHeight: "16px" }],
        "hero-num": ["32px", { lineHeight: "40px" }],
      },
      // 바텀시트 등장 모션. prefers-reduced-motion에서는 motion-safe: 접두사로 꺼진다.
      keyframes: {
        "sheet-up": { from: { transform: "translateY(100%)" }, to: { transform: "translateY(0)" } },
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
      },
      animation: {
        "sheet-up": "sheet-up 240ms ease-out",
        "fade-in": "fade-in 200ms ease-out",
      },
    },
  },
  plugins: [],
};
export default config;
