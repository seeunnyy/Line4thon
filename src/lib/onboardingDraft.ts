// 온보딩 1단계 닉네임을 2단계 결과 화면으로 넘기는 임시 통로. 저장 모듈(P0)이 생기면 그쪽으로 바꾸고 이 파일은 지운다.
// sessionStorage는 막혀 있을 수 있어 실패해도 조용히 넘어간다(닉네임 없이 문장이 성립한다).

const KEY = "bodycast:onboarding-nickname";

export function saveDraftNickname(nickname: string) {
  try {
    sessionStorage.setItem(KEY, nickname);
  } catch {}
}

export function loadDraftNickname(): string | null {
  try {
    return sessionStorage.getItem(KEY);
  } catch {
    return null;
  }
}
