import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * PATCH /api/photos/[id]
 * Update photo status or metadata
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const photo = await prisma.photo.update({
      where: { id },
      data: body,
    });

    // Convert BigInt to number
    return NextResponse.json({
      ...photo,
      uploadedAt: Number(photo.uploadedAt),
      likedBy: photo.likedBy ? photo.likedBy.split(',').filter(Boolean) : []
    });
  } catch (error) {
    console.error('Error updating photo:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to update photo', details: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/photos/[id]
 * Delete a photo
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.photo.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting photo:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to delete photo', details: errorMessage },
      { status: 500 }
    );
  }
}
