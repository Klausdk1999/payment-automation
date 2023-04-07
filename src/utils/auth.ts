import { jwtVerify } from "jose";

interface UserJwtPayload {
  jti: string;
  iat: number;
  id: string;
  name: string;
  email: string;
  role: string;
  exp: number;
}

export const getJWTSecretKey = () => {
  const secret = process.env.JWT_SECRET_KEY;
  if (!secret || secret.length === 0) {
    throw new Error("JWT_SECRET_KEY not found");
  }
  return secret;
};

export const verifyAuth = async (token: string) => {
  try {
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(getJWTSecretKey())
    );
    
    return verified.payload as unknown as UserJwtPayload;
  } catch (err) {
    console.error("Invalid Token");
  }
};
