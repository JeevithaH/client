import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/lib/db/client';

export async function POST() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthenticated' }, { status: 401 });
    }

    const email = user.emailAddresses?.[0]?.emailAddress?.toLowerCase().trim();
    if (!email) {
      return NextResponse.json({ success: false, message: 'No email found' }, { status: 400 });
    }

    const name = [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Patron';
    const avatar = user.imageUrl || null;

    // Upsert into Cloudflare D1
    const existing = await db
      .prepare('SELECT id FROM users WHERE LOWER(email) = ?')
      .bind(email)
      .first<{ id: string }>();

    if (existing) {
      await db
        .prepare('UPDATE users SET name = ?, avatar = ?, is_verified = 1 WHERE id = ?')
        .bind(name, avatar, existing.id)
        .run();
    } else {
      await db
        .prepare(
          `INSERT INTO users (id, name, email, password_hash, role, status, is_verified, avatar)
           VALUES (?, ?, ?, 'oauth_user', 'customer', 'active', 1, ?)`
        )
        .bind(user.id, name, email, avatar)
        .run();
    }

    return NextResponse.json({ success: true, user: { id: user.id, email, name } });
  } catch (error: unknown) {
    console.error('[Sync Clerk User Error]:', error);
    return NextResponse.json({ success: false, message: (error as Error).message }, { status: 500 });
  }
}
