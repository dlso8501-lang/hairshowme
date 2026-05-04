import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';
import { toFile } from 'openai/uploads';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const selfie = form.get('selfie');
    const style = form.get('style');
    const note = String(form.get('note') || '');

    if (!(selfie instanceof File) || !(style instanceof File)) {
      return NextResponse.json({ error: '내 사진과 참고 헤어스타일 사진을 모두 업로드해주세요.' }, { status: 400 });
    }

    const selfieFile = await toFile(Buffer.from(await selfie.arrayBuffer()), selfie.name || 'selfie.jpg', { type: selfie.type || 'image/jpeg' });
    const styleFile = await toFile(Buffer.from(await style.arrayBuffer()), style.name || 'style.jpg', { type: style.type || 'image/jpeg' });

    const prompt = `
첫 번째 이미지는 사용자의 얼굴과 현재 머리 사진입니다. 두 번째 이미지는 참고용 헤어스타일입니다.
사용자의 얼굴형, 피부톤, 표정, 정체성, 배경 분위기는 최대한 유지하세요.
참고 이미지의 헤어스타일만 자연스럽게 사용자의 머리에 적용하세요.
미용실에서 보여줄 수 있는 현실적인 결과물이어야 합니다.
연예인 얼굴이나 신체 특징은 복사하지 말고, 머리 길이, 앞머리, 볼륨, 컬, 컬러, 질감만 반영하세요.
과도한 보정, 성형 느낌, 부자연스러운 합성, 얼굴 변형은 피하세요.
추가 요청: ${note}
`.trim();

    const result = await client.images.edit({
      model: 'gpt-image-1.5',
      image: [selfieFile, styleFile],
      prompt,
      size: '1024x1024',
      output_format: 'jpeg',
      input_fidelity: 'high',
    });

    const image = result.data?.[0]?.b64_json;
    if (!image) return NextResponse.json({ error: '이미지를 생성하지 못했습니다.' }, { status: 500 });

    return NextResponse.json({ image: `data:image/jpeg;base64,${image}` });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || '생성 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
