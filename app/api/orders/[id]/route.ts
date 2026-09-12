import { NextRequest, NextResponse } from 'next/server';
import { getOrderById } from '@/lib/db';
import { checkRateLimit, rateLimitResponse, RATE_LIMIT_PRESETS } from '@/lib/rate-limit';
import { safeErrorResponse, unauthorizedResponse, forbiddenResponse } from '@/lib/security';
import { getAuthenticatedUser } from '@/lib/clerk-auth';
import { logSecurityEvent } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Rate Limiting (Spec 1, 16)
    const rateLimit = checkRateLimit(req, RATE_LIMIT_PRESETS.PUBLIC_API);
    if (!rateLimit.allowed) {
      return rateLimitResponse(rateLimit);
    }

    // 2. Authentication Enforcement (Spec 8, 9)
    const authUser = await getAuthenticatedUser(req);
    if (!authUser) {
      return unauthorizedResponse('Authentication required to view this order');
    }

    const { id } = params;
    if (!id || typeof id !== 'string') {
      return safeErrorResponse('Invalid order identifier', 400);
    }

    const order = await getOrderById(id);
    if (!order) {
      return safeErrorResponse('Order not found', 404);
    }

    // 3. IDOR / BOLA Prevention: Verify order ownership (Spec 9)
    if (authUser.role !== 'admin' && order.user_id !== authUser.id) {
      logSecurityEvent('IDOR_ATTEMPT', 'User attempted to access another user order by ID', {
        userId: authUser.id,
        endpoint: `/api/orders/${id}`,
        details: { requestedOrderId: id, orderOwnerId: order.user_id },
      });
      // Return 404 to avoid disclosing whether the order ID exists
      return safeErrorResponse('Order not found', 404);
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('[API Order ID GET] Error:', error);
    return safeErrorResponse('Failed to fetch order', 500);
  }
}
