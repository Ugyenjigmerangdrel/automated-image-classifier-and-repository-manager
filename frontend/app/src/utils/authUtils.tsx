import {jwtDecode} from "jwt-decode";

// Define the shape of the decoded JWT (adjust fields based on your JWT structure)
interface DecodedToken {
  exp: number; // Expiration time in seconds since the epoch
}

export function getAuthToken(): string | null {
  const token = localStorage.getItem("token");
  return token;
}

export function isTokenExpired(token: string | null): boolean {
  if (!token) return true;
  try {
    const decodedToken = jwtDecode<DecodedToken>(token);
    const currentTime = Date.now() / 1000; // Convert milliseconds to seconds
    return decodedToken.exp < currentTime;
  } catch (error) {
    return true;
  }
}
