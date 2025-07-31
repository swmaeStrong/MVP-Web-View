export const setOsEnv = async (osEnv: string) => {
  localStorage.setItem('osEnv', osEnv);
  console.log('OsEnv 저장 완료', osEnv);
};

export const getOsEnv = () => {
  return localStorage.getItem('osEnv');
};