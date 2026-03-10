import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Event } from '@/database';

interface RouteParams {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * GET /api/events/[slug]
 * Fetches a single event by its slug
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    // Extract and validate slug parameter (await params in Next.js 13+)
    const { slug } = await params;

    if (!slug || typeof slug !== 'string') {
      return NextResponse.json(
        { error: 'Slug parameter is required and must be a string' },
        { status: 400 }
      );
    }

    // Validate slug format (alphanumeric, hyphens only)
    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(slug)) {
      return NextResponse.json(
        { error: 'Invalid slug format. Only lowercase letters, numbers, and hyphens are allowed' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Query event by slug
    const event = await Event.findOne({ slug }).lean();

    if (!event) {
      return NextResponse.json(
        { error: `Event with slug "${slug}" not found` },
        { status: 404 }
      );
    }

    // Return event data
    return NextResponse.json(
      { 
        success: true,
        data: event 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error fetching event:', error);

    // Handle specific error types
    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'Failed to fetch event', message: error.message },
        { status: 500 }
      );
    }

    // Handle unexpected errors
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
