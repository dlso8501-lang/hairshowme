import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '이렇게해주세요 | AI 헤어스타일 시뮬레이터',
  description: '내 얼굴형에 원하는 헤어스타일을 자연스럽게 입혀 미용실에 보여주세요.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="ko"><body>{children}</body></html>;
}
