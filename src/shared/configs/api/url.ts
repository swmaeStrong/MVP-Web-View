export const BASEURL =
  process.env.NODE_ENV === 'production'
    ? process.env.SERVER_URL
    : process.env.NEXT_PUBLIC_DEV_SERVER_URL;

export const PORTONE_STORE_ID =
  process.env.NODE_ENV === 'production'
    ? process.env.STORE_ID
    : process.env.NEXT_PUBLIC_STORE_ID;

export const KAKAO_PAY_CHANNEL_KEY =
  process.env.NODE_ENV === 'production'
    ? process.env.CHANNEL_KEY_KAKAO_PAY
    : process.env.NEXT_PUBLIC_CHANNEL_KEY_KAKAO_PAY;

export const APP_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.APP_URL
    : process.env.NEXT_PUBLIC_APP_URL;
