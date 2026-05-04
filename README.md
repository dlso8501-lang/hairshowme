# 이렇게해주세요 — AI 헤어스타일 시뮬레이터

자기 사진 + 원하는 헤어스타일 참고 사진을 업로드하면, 내 얼굴형에 맞게 자연스럽게 헤어스타일을 합성해 미용실에서 보여줄 이미지를 만드는 MVP입니다.

## 추천 도메인
- ireokehair.com
- hairplease.ai
- ireokehaejwo.kr
- showhair.ai

## 실행
```bash
npm install
cp .env.example .env.local
npm run dev
```

## 배포
Vercel에 올리고 `OPENAI_API_KEY` 환경변수를 설정하세요.
