import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import sharp from 'sharp';
import { uploadImage } from '@/lib/supabase';

const SUPABASE_CONFIGURED =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY;

const MAX_DIM = 800;

async function optimize(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer)
    .resize(MAX_DIM, MAX_DIM, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('image') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'No se recibió ninguna imagen' }, { status: 400 });
  }

  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'El archivo debe ser una imagen' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const raw = Buffer.from(bytes);
  const optimized = await optimize(raw);

  const uniqueName = `${randomUUID()}.webp`;

  if (SUPABASE_CONFIGURED) {
    const url = await uploadImage(optimized, uniqueName, 'image/webp');
    if (url) {
      return NextResponse.json({ url });
    }
    console.warn('[upload] Supabase upload failed, falling back to local storage');
  }

  const uploadDir = join(process.cwd(), 'public', 'uploads');
  await writeFile(join(uploadDir, uniqueName), optimized);

  return NextResponse.json({ url: `/uploads/${uniqueName}` });
}
