// 커스텀 컬러 설정
export interface CustomColors {
  mainColor: string;      // 메인 컬러
  backgroundColor: string; // 배경 컬러
}

// 기본 컬러
export const defaultColors: CustomColors = {
  mainColor: '#3f72af',      // 파란색 (메인)
  backgroundColor: '#f5fafc', // 연한 파란빛 회색 (서브/배경)
};