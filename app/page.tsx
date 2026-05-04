'use client';

import { useState } from 'react';
import { Sparkles, Upload, Scissors, ImageDown, ShieldCheck } from 'lucide-react';

export default function Home() {
  const [selfie, setSelfie] = useState<File | null>(null);
  const [style, setStyle] = useState<File | null>(null);
  const [note, setNote] = useState('앞머리와 전체적인 볼륨감 위주로 자연스럽게 적용해주세요.');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState('');

  async function generate() {
    if (!selfie || !style) { setError('내 사진과 참고 헤어스타일 사진을 모두 넣어주세요.'); return; }
    setLoading(true); setError(''); setResult(null);
    const fd = new FormData();
    fd.append('selfie', selfie); fd.append('style', style); fd.append('note', note);
    const res = await fetch('/api/generate', { method: 'POST', body: fd });
    const data = await res.json();
    if (!res.ok) setError(data.error || '오류가 발생했습니다.');
    else setResult(data.image);
    setLoading(false);
  }

  return (
    <main>
      <section className="hero">
        <nav><div className="logo"><Scissors size={20}/> 이렇게해주세요</div><a>Beta</a></nav>
        <div className="heroGrid">
          <div>
            <p className="eyebrow"><Sparkles size={16}/> AI 헤어 상담 이미지</p>
            <h1>연예인 머리 말고,<br/>내 얼굴에 입혀보고 미용실 가세요.</h1>
            <p className="sub">내 사진과 원하는 헤어스타일 사진을 넣으면, 얼굴형은 유지하고 머리만 자연스럽게 바꿔드립니다.</p>
            <div className="badges"><span>얼굴형 반영</span><span>미용실 상담용</span><span>자연스러운 합성</span></div>
          </div>
          <div className="card glass">
            <div className="uploadGrid">
              <Uploader title="내 사진" file={selfie} onChange={setSelfie}/>
              <Uploader title="원하는 머리 사진" file={style} onChange={setStyle}/>
            </div>
            <label className="note">세부 요청<textarea value={note} onChange={e=>setNote(e.target.value)} /></label>
            <button onClick={generate} disabled={loading}>{loading ? '자연스럽게 입히는 중...' : '내 얼굴에 헤어스타일 입히기'}</button>
            {error && <p className="error">{error}</p>}
          </div>
        </div>
      </section>

      <section className="resultWrap">
        <div className="preview">
          {result ? <img src={result} alt="생성 결과"/> : <div className="empty"><Upload/><p>결과 이미지가 여기에 표시됩니다.</p></div>}
        </div>
        <div className="how">
          <h2>사용 흐름</h2>
          <p><b>1.</b> 정면 또는 자연광 셀카 업로드</p>
          <p><b>2.</b> 원하는 연예인/모델 헤어 사진 업로드</p>
          <p><b>3.</b> 미용실에 보여줄 결과 이미지 저장</p>
          {result && <a className="download" href={result} download="ireoke-hair-result.jpg"><ImageDown size={18}/> 이미지 저장</a>}
          <div className="trust"><ShieldCheck size={18}/> 얼굴은 바꾸지 않고 헤어스타일 참고용으로만 생성합니다.</div>
        </div>
      </section>
    </main>
  );
}

function Uploader({title, file, onChange}:{title:string; file:File|null; onChange:(f:File|null)=>void}) {
  return <label className="uploader"><input type="file" accept="image/*" onChange={e=>onChange(e.target.files?.[0] || null)}/><Upload/><b>{title}</b><span>{file ? file.name : '사진 업로드'}</span></label>;
}
