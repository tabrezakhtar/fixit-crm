import { SignJWT, jwtVerify } from 'jose';

export const GUEST_SESSION_COOKIE = 'fixitcrm_session';

function getSessionSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error('SESSION_SECRET is not configured.');

  return new TextEncoder().encode(secret);
}

export function createGuestSession() {
  return new SignJWT({})
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject('guest')
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(getSessionSecret());
}

export async function verifyGuestSession(token: string | undefined) {
  if (!token || !process.env.SESSION_SECRET) return false;

  try {
    const { payload } = await jwtVerify(token, getSessionSecret(), { algorithms: ['HS256'] });
    return payload.sub === 'guest';
  } catch {
    return false;
  }
}