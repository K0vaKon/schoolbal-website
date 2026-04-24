import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/photos
 * Returns only approved photos
 * 
 * Query params:
 * - approved: boolean (default: true) - filter by approval status
 */
export async function GET(request: NextRequest) {
  try {
    // This endpoint is prepared for future database integration.
    // Currently, photo filtering happens on the client side via localStorage
    // because the data is stored in browser's localStorage.
    //
    // When integrating with a backend database, you would:
    // 1. Query the database for photos
    // 2. Filter by status === 'approved'
    // 3. Return the filtered results
    
    const { searchParams } = new URL(request.url);
    const approvedOnly = searchParams.get('approved') !== 'false';
    
    // For now, return empty array as a placeholder
    // The Gallery component will use localStorage directly on the client
    const photos = [];
    
    // Example of what would happen with a real database:
    // const dbPhotos = await db.photos.findMany({
    //   where: approvedOnly ? { status: 'approved' } : {},
    //   orderBy: { uploadedAt: 'desc' }
    // });
    
    return NextResponse.json({
      photos: photos,
      total: photos.length,
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
