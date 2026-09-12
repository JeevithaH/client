import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      message: 'Cloudflare D1 is the primary database. Tables and initial datasets are provisioned via d1/schema.sql and d1/seed.sql.',
    });
  } catch (error) {
    console.error('[API Seed] Error:', error);
    return NextResponse.json({ success: false, message: 'Database seeding failed' }, { status: 500 });
  }
}
