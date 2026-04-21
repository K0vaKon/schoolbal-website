import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    console.log('Upload API called');
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      console.log('No file received');
      return NextResponse.json({ error: 'No file received.' }, { status: 400 });
    }

    console.log('File received:', file.name, file.size);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = `photo-${Date.now()}-${file.name}`;
    const path = join(process.cwd(), 'public', 'uploads', filename);
    console.log('Saving to path:', path);

    await mkdir(join(process.cwd(), 'public', 'uploads'), { recursive: true });
    console.log('Directory ensured');

    await writeFile(path, buffer);
    console.log('File written');

    const url = `/uploads/${filename}`;

    console.log('Returning URL:', url);
    return NextResponse.json({ url });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload file.', details: error.message }, { status: 500 });
  }
}
