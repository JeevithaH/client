/**
 * ==============================================================================
 * SHIPFOLD ATELIER — CLOUDFLARE D1 PRIMARY DATABASE ACCESS LAYER
 * ==============================================================================
 * 
 * Cloudflare D1 is the single source of truth for the entire application.
 * SQLite and better-sqlite3 runtime dependencies have been completely removed.
 * 
 * Architecture:
 *   - Universal D1 Client (Edge bindings in Cloudflare, HTTPS REST in Node.js)
 *   - Fully asynchronous queries using parameter binding (?)
 *   - Domain-focused modules for clean separation of concerns
 * ==============================================================================
 */

// 1. Client & Connection Management
export { db, getDb, isD1Configured, getD1Config } from './client';
export type { D1Database, D1PreparedStatement, D1Result, D1Config } from './client';

// 2. Categories
export { getCategories } from './categories';

// 3. Products & Variants
export {
  getAllProducts,
  getProductBySlug,
  getProductById,
  saveProductAdmin,
  deleteProductAdmin,
  getAllInventoryVariants,
  updateVariantStock,
} from './products';

// 4. Orders & Checkout
export {
  createOrderWithInventoryDeduction,
  getOrderById,
  getOrdersByUserId,
  getAllOrdersAdmin,
  updateOrderStatus,
} from './orders';

// 5. Users & Authentication
export {
  getUserByEmail,
  getAllUsersAdmin,
  toggleUserStatus,
  createUser,
  createVerifiedUser,
  updateUserPassword,
} from './users';

// 6. Coupons & Discounts
export {
  getCoupons,
  getAllCouponsAdmin,
  getCouponByCode,
  validateCouponForCheckout,
  saveCoupon,
  deleteCoupon,
} from './coupons';

// 7. Delivery Addresses
export { getUserAddresses, saveAddress } from './addresses';

// 8. Editorial & Promotional Placements
export {
  getAllPlacementsAdmin,
  getActivePlacements,
  getActivePlacementBySlot,
  savePlacement,
  deletePlacement,
  togglePlacementActive,
} from './placements';

// 9. Studio Director Metrics
export { getAdminDashboardMetrics } from './metrics';

// 10. Security & Auth Tokens
export { saveAuthToken, verifyAuthToken } from './auth-tokens';

// 11. Store & Shipping Settings
export { getShippingSettings, updateShippingSettings, calculateShippingFee, DEFAULT_SHIPPING_SETTINGS } from './settings';
export type { ShippingSettings } from './settings';

// 12. Stitchclothes & Glozin Dynamic Elements
export {
  getActiveHeroSlides,
  getAllHeroSlidesAdmin,
  saveHeroSlide,
  deleteHeroSlide,
  getActiveAnnouncements,
  getAllAnnouncementsAdmin,
  saveAnnouncement,
  deleteAnnouncement,
  getActiveMarqueeItems,
  getAllMarqueeItemsAdmin,
  saveMarqueeItem,
  deleteMarqueeItem,
  getActiveTrustPillars,
  getAllTrustPillarsAdmin,
  saveTrustPillar,
  getActiveSocialProofNotifications,
  getAllSocialProofAdmin,
  saveSocialProofNotification,
  deleteSocialProofNotification,
  getSiteSettings,
  updateSiteSetting,
  DEFAULT_SITE_SETTINGS,
  getActiveRackGarments,
  getAllRackGarmentsAdmin,
  saveRackGarment,
  deleteRackGarment
} from './stitch';
