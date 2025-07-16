export const setOsEnv = async (osEnv: string) => {
  localStorage.setItem('osEnv', osEnv);
};

export const getOsEnv = () => {
  return localStorage.getItem('osEnv');
};