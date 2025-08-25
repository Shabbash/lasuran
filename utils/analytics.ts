// Simple, typed, centralized dataLayer tracking

type AnyObj = Record<string, any>;
type Currency = 'SAR' | 'USD' | 'AED' | string;

function pushDL(payload: AnyObj) {
  if (process.client || window) {
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push(payload);
  }
}

// Generic
export function track(event: string, params: AnyObj = {}) {
  pushDL({ event, ...params });
}

// Auth
export const trackSendOtp = (phone: string) =>
  track('send_otp', { phone });

export const trackLogin = (method: 'otp' | 'password' | string = 'otp') =>
  track('login', { method });

export const trackRegistration = (user_id?: number | string) =>
  track('registration', user_id ? { user_id } : {});

// Browsing
export const trackViewItem = (item: {
  item_id: string | number;
  item_name?: string;
  price?: number;
  currency?: Currency;
  item_category?: string;
  source_component?: string;
}) => track('view_item', item);

export const trackChangeLocale = (locale: 'ar' | 'en' | string) =>
  track('change_locale', { locale });

export const trackDialogOpen = (component: string) =>
  track('dialog_open', { component });

export const trackDialogClose = (component: string) =>
  track('dialog_close', { component });

// Cart
export const trackAddToCart = (item: {
  item_id: string | number;
  item_name?: string;
  price?: number;
  currency?: Currency;
  quantity?: number;
}) => track('add_to_cart', { quantity: 1, ...item });

// Purchase
export const trackPurchase = (purchase: {
  transaction_id: string;
  value: number;
  currency?: Currency;
  items: Array<{ item_id: string | number; item_name?: string; price?: number; quantity?: number }>;
}) => track('purchase', { currency: 'SAR', ...purchase });
