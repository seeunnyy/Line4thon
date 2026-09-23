import TabBar from "@/components/TabBar";

// 홈·예보·마이페이지 3개 탭 화면에만 적용되는 레이아웃.
// 이벤트 등록/결과, 체크인, 아바타 꾸미기 같은 하위 흐름은 이 그룹 밖에 있어 탭바가 보이지 않는다.
export default function TabsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-dvh flex-col">
      <div className="flex-1">{children}</div>
      <TabBar />
    </div>
  );
}
