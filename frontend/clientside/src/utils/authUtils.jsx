import { jwtDecode } from "jwt-decode";

export function getAuthToken() {
  const token = localStorage.getItem("token");
  return token;
}

export function isTokenExpired(token) {
  if (!token) return true;
  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime;
  } catch (error) {
    return true;
  }
}
