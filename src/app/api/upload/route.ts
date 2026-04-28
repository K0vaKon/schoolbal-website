import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    console.log('Upload API called');
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;
    const uploaderName = data.get('uploaderName') as string;
    const uploaderEmail = data.get('uploaderEmail') as string;

    if (!file) {
      console.log('No file received');
      return NextResponse.json({ error: 'No file received.' }, { status: 400 });
    }

    if (!uploaderName || !uploaderEmail) {
      return NextResponse.json({ error: 'Missing uploader information' }, { status: 400 });
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

    // Save photo metadata to database with status='pending'
    const photo = await prisma.photo.create({
      data: {
        filename: file.name,
        url: url,
        status: 'pending',
        uploaderName: uploaderName,
        uploaderEmail: uploaderEmail,
        uploadedAt: BigInt(Date.now()),
      },
    });

    console.log('Photo saved to database:', photo.id);
    return NextResponse.json({ url, photoId: photo.id });
  } catch (error) {
    console.error('Upload error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to upload file.', details: errorMessage }, { status: 500 });
  }
}
