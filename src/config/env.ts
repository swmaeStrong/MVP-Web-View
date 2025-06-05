// 개발 환경용 기본값
const DEV_DEFAULTS = {
  STORE_ID: 'store-472929b2-b8a5-4579-9666-e30402a31c25',
  CHANNEL_KEY_TOSS_PAYMENTS: 'channel-key-f285b864-d7c2-4a6e-9240-088e50965f51',
  CHANNEL_KEY_KAKAO_PAY: 'channel-key-822083c9-0cb6-4c16-8f00-f66f722b4ebe',
};

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// 환경 변수 설정
export const ENV = {
  // 포트원 설정 - 프로덕션에서는 환경변수 필수, 개발에서는 기본값 fallback
  PORTONE_STORE_ID: IS_PRODUCTION 
    ? process.env.NEXT_PUBLIC_STORE_ID!
    : process.env.NEXT_PUBLIC_STORE_ID || DEV_DEFAULTS.STORE_ID,
  
  // 결제 채널 키
  TOSS_CHANNEL_KEY: IS_PRODUCTION
    ? process.env.NEXT_PUBLIC_CHANNEL_KEY_TOSS_PAYMENTS!
    : process.env.NEXT_PUBLIC_CHANNEL_KEY_TOSS_PAYMENTS || DEV_DEFAULTS.CHANNEL_KEY_TOSS_PAYMENTS,
    
  KAKAOPAY_CHANNEL_KEY: IS_PRODUCTION
    ? process.env.NEXT_PUBLIC_CHANNEL_KEY_KAKAO_PAY!
    : process.env.NEXT_PUBLIC_CHANNEL_KEY_KAKAO_PAY || DEV_DEFAULTS.CHANNEL_KEY_KAKAO_PAY,
  
  // 앱 설정
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  
  // 환경 확인
  IS_PRODUCTION,
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
};

// 환경 변수 검증 함수
export const validateEnv = () => {
  console.log(`🌍 현재 환경: ${IS_PRODUCTION ? '🚀 프로덕션' : '🛠️ 개발'}`);
  
  if (IS_PRODUCTION) {
    // 프로덕션 환경에서는 모든 환경 변수가 필수
    const requiredEnvs = ['NEXT_PUBLIC_STORE_ID', 'NEXT_PUBLIC_CHANNEL_KEY_TOSS_PAYMENTS', 'NEXT_PUBLIC_CHANNEL_KEY_KAKAO_PAY'];
    const missingEnvs = requiredEnvs.filter(env => !process.env[env]);
    
    if (missingEnvs.length > 0) {
      console.error('🚨 프로덕션 환경에서 필수 환경 변수가 누락되었습니다:', missingEnvs);
      throw new Error(`프로덕션 환경 변수 누락: ${missingEnvs.join(', ')}`);
    }
    console.log('✅ 프로덕션 환경: 모든 환경 변수가 설정되어 있습니다.');
  } else {
    // 개발 환경에서는 .env 파일 상태 확인
    const envVarsFromFile = [
      'NEXT_PUBLIC_STORE_ID',
      'NEXT_PUBLIC_CHANNEL_KEY_TOSS_PAYMENTS',
      'NEXT_PUBLIC_CHANNEL_KEY_KAKAO_PAY'
    ].filter(key => process.env[key]);
    
    console.log(`📁 .env에서 로드된 변수 (${envVarsFromFile.length}/3):`, envVarsFromFile);
    
    if (envVarsFromFile.length === 0) {
      console.warn('⚠️ .env 파일이 없거나 비어있습니다. 기본값을 사용합니다.');
      console.log('💡 .env 파일 생성 예시:');
      console.log(`NEXT_PUBLIC_STORE_ID=${DEV_DEFAULTS.STORE_ID}`);
      console.log(`NEXT_PUBLIC_CHANNEL_KEY_TOSS_PAYMENTS=${DEV_DEFAULTS.CHANNEL_KEY_TOSS_PAYMENTS}`);
      console.log(`NEXT_PUBLIC_CHANNEL_KEY_KAKAO_PAY=${DEV_DEFAULTS.CHANNEL_KEY_KAKAO_PAY}`);
    } else if (envVarsFromFile.length < 3) {
      console.warn('⚠️ 일부 환경 변수가 .env에 설정되지 않아 기본값을 사용합니다.');
    } else {
      console.log('✅ 모든 환경 변수가 .env에서 로드되었습니다.');
    }
  }
}; 