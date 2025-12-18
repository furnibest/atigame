import { NextResponse } from 'next/server'

export async function GET() {
  // Debug environment variables (without exposing sensitive keys)
  const envCheck = {
    SUPABASE_URL: process.env.SUPABASE_URL ? 'SET' : 'NOT SET',
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT SET',
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? 'SET' : 'NOT SET',
    SUPABASE_STORAGE_BUCKET: process.env.SUPABASE_STORAGE_BUCKET || 'NOT SET',
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET',
  }

  return NextResponse.json({
    status: 'debug',
    environment: envCheck,
    nodeEnv: process.env.NODE_ENV,
  })
}

