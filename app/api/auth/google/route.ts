import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    // Forward the request to your backend server
    const response = await fetch('http://localhost:4000/auth/api/v1/user/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || 'Authentication failed' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Set any necessary cookies from the backend response
    const cookies = response.headers.getSetCookie();
    const responseWithCookies = NextResponse.json(data);
    
    // Forward cookies from the backend to the client
    cookies.forEach(cookie => {
      responseWithCookies.headers.append('Set-Cookie', cookie);
    });

    return responseWithCookies;
  } catch (error) {
    console.error('Google auth error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 