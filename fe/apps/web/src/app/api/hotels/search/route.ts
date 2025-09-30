import { HotelApiService } from '@/services/api/hotelsApi';
import { HotelApiError, HotelRequest, HotelRequestValidator } from '@/types/hotels.type';
import { NextRequest, NextResponse } from 'next/server';

const hotelApi = new HotelApiService(process.env.SERPAPI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    if (!process.env.SERPAPI_API_KEY) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    
    const completeRequest: HotelRequest = {
      ...body,
      engine: 'google_hotels',
      api_key: process.env.SERPAPI_API_KEY 
    };

    const errors = HotelRequestValidator.validateRequest(completeRequest);
    if (errors.length > 0) {
      console.error('Validation errors:', errors);
      return NextResponse.json(
        { error: `Validation errors: ${errors.join(', ')}` },
        { status: 400 }
      );
    }
    
    const result = await hotelApi.searchHotels(completeRequest);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Hotel search error:', error);
    
    if (error instanceof HotelApiError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode || 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    if (!process.env.SERPAPI_API_KEY) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    
    const hotelRequest = hotelApi.createBuilder()
      .search(searchParams.get('q') || 'Nha Trang Resorts')
      .dates(
        searchParams.get('check_in_date') || '2025-09-28',
        searchParams.get('check_out_date') || '2025-09-29'
      )
      .guests(
        parseInt(searchParams.get('adults') || '2'),
        parseInt(searchParams.get('children') || '0')
      )
      .localization('vn', 'vi', 'VND')
      .build();
    
    const result = await hotelApi.searchHotels(hotelRequest);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Hotel search error:', error);
    
    if (error instanceof HotelApiError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode || 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}