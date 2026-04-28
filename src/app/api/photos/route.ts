import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/photos
 * Returns photos based on filter
 * 
 * Query params:
 * - approved: boolean (default: true) - filter by approval status
 * - status: pending|approved|rejected (returns only this status)
 * - all: true - returns all photos (for admin panel)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const allPhotos = searchParams.get('all') === 'true';
    const approvedOnly = searchParams.get('approved') !== 'false' && !allPhotos && !status;
    
    let photos;
    
    if (allPhotos) {
      // Return all photos (for admin panel)
      photos = await prisma.photo.findMany({
        orderBy: { uploadedAt: 'desc' }
      });
    } else if (status) {
      // Return photos with specific status
      photos = await prisma.photo.findMany({
        where: { status: status },
        orderBy: { uploadedAt: 'desc' }
      });
    } else if (approvedOnly) {
      // Return only approved photos (for public gallery)
      photos = await prisma.photo.findMany({
        where: { status: 'approved' },
        orderBy: { uploadedAt: 'desc' }
      });
    } else {
      photos = [];
    }
    
    // Convert BigInt to number for JSON serialization
    const serializedPhotos = photos.map(photo => ({
      ...photo,
      uploadedAt: Number(photo.uploadedAt),
      likedBy: photo.likedBy ? photo.likedBy.split(',').filter(Boolean) : []
    }));
    
    return NextResponse.json({
      photos: serializedPhotos,
      total: serializedPhotos.length,
      approvedOnly: approvedOnly
    });
  } catch (error) {
    console.error('Error fetching photos:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to fetch photos', details: errorMessage },
      { status: 500 }
    );
  }
}
