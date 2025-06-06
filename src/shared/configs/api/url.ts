export const BASEURL =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_PROD_SERVER_URL
    : process.env.NEXT_PUBLIC_DEV_SERVER_URL;

export const PORTONE_STORE_ID = process.env.NEXT_PUBLIC_STORE_ID;
export const TOSS_CHANNEL_KEY =
  process.env.NEXT_PUBLIC_CHANNEL_KEY_TOSS_PAYMENTS;
export const KAKAOPAY_CHANNEL_KEY =
  process.env.NEXT_PUBLIC_CHANNEL_KEY_KAKAO_PAY;
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL;
