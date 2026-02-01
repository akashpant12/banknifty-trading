// Angel One Login API Route
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { apiKey, username, password, totp } = await request.json();

    // Angel One login endpoint
    const response = await fetch('https://apidev.angelbroking.com/gtt/v1/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-ApiKey': apiKey,
      },
      body: JSON.stringify({
        clientcode: username,
        password: password,
        totp: totp,
      }),
    });

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Angel One API error:', error);
    return NextResponse.json({ 
      status: false, 
      message: error.message || 'API request failed' 
    }, { status: 500 });
  }
}
