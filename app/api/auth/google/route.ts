import { NextRequest, NextResponse } from 'next/server';

// Define a proper interface for user data
interface UserData {
  _id: string;
  email: string;
  voice?: string;
  [key: string]: unknown; // For any additional properties
}



interface GoogleAuthResponse {
  user: UserData;
  [key: string]: unknown; // For any additional properties
}

export async function GET(request: NextRequest) {
  try {
    // Forward the request to your backend server
    const response = await fetch('https://backend.vanii.ai/auth/api/v1/user/google', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },

    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || 'Authentication failed' },
        { status: response.status }
      );
    }

    const data = await response.json() as GoogleAuthResponse;
    
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