import type { Config } from "tailwindcss";

// 색상·라운드 값은 docs/DESIGN.md "디자인 토큰 초안 [가정]"을 그대로 옮긴 것이다.
// 아직 최종 승인 전([가정]) 상태이므로, 승인되면 이 파일의 값만 갱신한다.
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: "#7FB3FF", // [가정] 연한 파스텔 블루
        accent: "#FF8B6B", // [가정] 소프트 코럴 (CTA)
        ink: "#2B2B33", // [가정] 기본 텍스트
        subtext: "#6B7280", // [가정] 보조 텍스트 (흰 배경 대비 ≈4.83:1)
        "on-brand": "#1C2333", // [가정] Primary/Accent 버튼 위 글자색 (대비 ≈7.33:1 / ≈6.85:1)
      },
      borderRadius: {
        card: "28px", // [가정]
        input: "20px", // [가정]
      },
    },
  },
  plugins: [],
};
export default config;
