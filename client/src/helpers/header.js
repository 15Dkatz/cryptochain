export const header = () => {
  const authInfo = JSON.parse(localStorage.getItem('persist:auth'));
  if(authInfo && authInfo.jwt) return { Authorization: `Bearer ${JSON.parse(authInfo.jwt)}`};
  return {};
};
