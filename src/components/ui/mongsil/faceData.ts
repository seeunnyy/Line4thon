// 자동 생성(에셋 스크립트): 몽실이 얼굴 부품 아틀라스 좌표. 좌표는 몸 그림 픽셀 기준.
// patch = 부품을 지운 빈 얼굴(가장자리가 부드럽게 사라짐), sprites = 눈·입·눈썹·선글라스. (cx,cy) = 부품 중심이 놓일 자리, (ox,oy) = 부품 그림 안의 중심.
export type FaceSprite = { ax: number; ay: number; w: number; h: number; cx: number; cy: number; ox: number; oy: number };
export type FaceData = { atlas: { w: number; h: number }; patch: { ax: number; ay: number; x: number; y: number; w: number; h: number }; sprites: Partial<Record<SpriteName, FaceSprite>>; nose: [number, number] };
export type SpriteName = "glasses" | "eyeL" | "eyeR" | "arcL" | "arcR" | "arcUpL" | "arcUpR" | "smile" | "mouthO" | "browL" | "browR";

export const FACE: Record<"sunny" | "cloudy" | "rain", FaceData> = {
 "sunny": {
  "atlas": {
   "w": 256,
   "h": 294
  },
  "patch": {
   "ax": 0,
   "ay": 0,
   "x": 101,
   "y": 106,
   "w": 223,
   "h": 126
  },
  "sprites": {
   "glasses": {
    "ax": 0,
    "ay": 128,
    "w": 203,
    "h": 72,
    "cx": 215.41,
    "cy": 151.33,
    "ox": 104.41,
    "oy": 35.33
   },
   "eyeL": {
    "ax": 205,
    "ay": 128,
    "w": 42,
    "h": 49,
    "cx": 158.02,
    "cy": 157.03,
    "ox": 20.7,
    "oy": 24.08
   },
   "eyeR": {
    "ax": 0,
    "ay": 202,
    "w": 43,
    "h": 49,
    "cx": 266.62,
    "cy": 156.53,
    "ox": 21.35,
    "oy": 24.59
   },
   "arcL": {
    "ax": 45,
    "ay": 202,
    "w": 56,
    "h": 33,
    "cx": 158.22,
    "cy": 158.83,
    "ox": 27.61,
    "oy": 16.69
   },
   "arcR": {
    "ax": 103,
    "ay": 202,
    "w": 57,
    "h": 32,
    "cx": 265.62,
    "cy": 158.43,
    "ox": 27.99,
    "oy": 16.3
   },
   "arcUpL": {
    "ax": 162,
    "ay": 202,
    "w": 56,
    "h": 33,
    "cx": 158.22,
    "cy": 158.83,
    "ox": 27.61,
    "oy": 16.31
   },
   "arcUpR": {
    "ax": 0,
    "ay": 253,
    "w": 57,
    "h": 32,
    "cx": 265.62,
    "cy": 158.43,
    "ox": 27.99,
    "oy": 15.7
   },
   "smile": {
    "ax": 59,
    "ay": 253,
    "w": 60,
    "h": 33,
    "cx": 212.32,
    "cy": 205.63,
    "ox": 29.52,
    "oy": 17.12
   },
   "mouthO": {
    "ax": 121,
    "ay": 253,
    "w": 36,
    "h": 41,
    "cx": 211.82,
    "cy": 214.13,
    "ox": 17.54,
    "oy": 20.17
   }
  },
  "nose": [
   212.62,
   182.33
  ]
 },
 "cloudy": {
  "atlas": {
   "w": 256,
   "h": 193
  },
  "patch": {
   "ax": 0,
   "ay": 0,
   "x": 117,
   "y": 132,
   "w": 184,
   "h": 99
  },
  "sprites": {
   "eyeL": {
    "ax": 186,
    "ay": 0,
    "w": 42,
    "h": 49,
    "cx": 154.43,
    "cy": 156.87,
    "ox": 20.7,
    "oy": 24.08
   },
   "eyeR": {
    "ax": 0,
    "ay": 101,
    "w": 43,
    "h": 49,
    "cx": 263.03,
    "cy": 156.37,
    "ox": 21.35,
    "oy": 24.59
   },
   "arcL": {
    "ax": 45,
    "ay": 101,
    "w": 56,
    "h": 33,
    "cx": 154.63,
    "cy": 158.67,
    "ox": 27.61,
    "oy": 16.69
   },
   "arcR": {
    "ax": 103,
    "ay": 101,
    "w": 57,
    "h": 32,
    "cx": 262.03,
    "cy": 158.27,
    "ox": 27.99,
    "oy": 16.3
   },
   "arcUpL": {
    "ax": 162,
    "ay": 101,
    "w": 56,
    "h": 33,
    "cx": 154.63,
    "cy": 158.67,
    "ox": 27.61,
    "oy": 16.31
   },
   "arcUpR": {
    "ax": 0,
    "ay": 152,
    "w": 57,
    "h": 32,
    "cx": 262.03,
    "cy": 158.27,
    "ox": 27.99,
    "oy": 15.7
   },
   "smile": {
    "ax": 59,
    "ay": 152,
    "w": 60,
    "h": 33,
    "cx": 208.53,
    "cy": 205.07,
    "ox": 29.52,
    "oy": 17.12
   },
   "mouthO": {
    "ax": 121,
    "ay": 152,
    "w": 36,
    "h": 41,
    "cx": 208.23,
    "cy": 213.97,
    "ox": 17.54,
    "oy": 20.17
   }
  },
  "nose": [
   209.03,
   182.17
  ]
 },
 "rain": {
  "atlas": {
   "w": 256,
   "h": 251
  },
  "patch": {
   "ax": 0,
   "ay": 0,
   "x": 119,
   "y": 202,
   "w": 172,
   "h": 157
  },
  "sprites": {
   "browL": {
    "ax": 174,
    "ay": 0,
    "w": 42,
    "h": 29,
    "cx": 150.08,
    "cy": 226.14,
    "ox": 20.12,
    "oy": 13.13
   },
   "browR": {
    "ax": 0,
    "ay": 159,
    "w": 42,
    "h": 30,
    "cx": 259.58,
    "cy": 225.64,
    "ox": 20.6,
    "oy": 13.61
   },
   "eyeL": {
    "ax": 44,
    "ay": 159,
    "w": 42,
    "h": 49,
    "cx": 149.68,
    "cy": 271.14,
    "ox": 20.7,
    "oy": 24.08
   },
   "eyeR": {
    "ax": 88,
    "ay": 159,
    "w": 43,
    "h": 49,
    "cx": 258.28,
    "cy": 270.64,
    "ox": 21.35,
    "oy": 24.59
   },
   "arcL": {
    "ax": 133,
    "ay": 159,
    "w": 56,
    "h": 33,
    "cx": 149.68,
    "cy": 272.64,
    "ox": 27.61,
    "oy": 16.69
   },
   "arcR": {
    "ax": 191,
    "ay": 159,
    "w": 57,
    "h": 32,
    "cx": 258.28,
    "cy": 272.14,
    "ox": 27.99,
    "oy": 16.3
   },
   "arcUpL": {
    "ax": 0,
    "ay": 210,
    "w": 56,
    "h": 33,
    "cx": 149.68,
    "cy": 272.64,
    "ox": 27.61,
    "oy": 16.31
   },
   "arcUpR": {
    "ax": 58,
    "ay": 210,
    "w": 57,
    "h": 32,
    "cx": 258.28,
    "cy": 272.14,
    "ox": 27.99,
    "oy": 15.7
   },
   "smile": {
    "ax": 117,
    "ay": 210,
    "w": 60,
    "h": 33,
    "cx": 203.78,
    "cy": 319.34,
    "ox": 29.52,
    "oy": 17.12
   },
   "mouthO": {
    "ax": 179,
    "ay": 210,
    "w": 36,
    "h": 41,
    "cx": 203.48,
    "cy": 328.24,
    "ox": 17.54,
    "oy": 20.17
   }
  },
  "nose": [
   204.28,
   296.44
  ]
 }
};

// 웃는 입 곡선: 부품 그림 안 x0~x1 구간의 처짐(px, 양끝 = 0). 입을 펴거나(무표정) 더 웃게(>1) 굽힐 때 쓴다.
export const SMILE = { x0: 9, x1: 50, sag: [0.25, 0.25, 0.25, 0.75, 1.75, 3.25, 3.75, 4.75, 4.75, 5.75, 5.75, 6.75, 6.75, 7.25, 7.75, 7.75, 8.25, 8.25, 8.25, 8.25, 8.25, 8.25, 8.25, 8.25, 8.25, 7.75, 7.75, 7.25, 7.25, 6.75, 6.75, 5.75, 5.25, 4.75, 4.25, 3.25, 1.75, 0.75, 0.75, 0.25, 0.25, 0] } as const;

// 소나기 몽실이의 우산 시트(mongsil-rain-umbrella.png). 우산은 몸에서 분리된 별도 부품이다.
// back = 우산 윗면·안쪽(머리 뒤), front = 손잡이·막대(머리·귀 앞). 좌표는 몸 그림 픽셀 기준.
export type UmbrellaPart = { ax: number; ay: number; x: number; y: number; w: number; h: number };
export const UMBRELLA: { sheet: { w: number; h: number }; back: UmbrellaPart; front: UmbrellaPart } = {
  "sheet": {
    "w": 357,
    "h": 525
  },
  "back": {
    "ax": 0,
    "ay": 0,
    "x": 157,
    "y": 1,
    "w": 357,
    "h": 174
  },
  "front": {
    "ax": 0,
    "ay": 176,
    "x": 339,
    "y": 111,
    "w": 51,
    "h": 349
  }
};
