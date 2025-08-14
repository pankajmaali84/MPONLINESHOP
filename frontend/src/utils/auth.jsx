// utils/auth.js
export const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1])); // decode JWT
    const exp = payload.exp * 1000; // JWT exp is in seconds
    return Date.now() >= exp;
  } catch (err) {
    return true; // invalid token means expired
  }
};
