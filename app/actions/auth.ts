'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createGuestSession, GUEST_SESSION_COOKIE } from '../../lib/guest-session';

export type LoginState = { error: string } | null;

export async function login(_previousState: LoginState, formData: FormData): Promise<LoginState> {
  const username = formData.get('username');
  const password = formData.get('password');

  if (
    username !== 'guest' ||
    typeof password !== 'string' ||
    !process.env.GUEST_PASSWORD ||
    !process.env.SESSION_SECRET
  ) {
    return { error: 'Sign-in is not configured correctly.' };
  }

  if (password !== process.env.GUEST_PASSWORD) {
    return { error: 'That password did not match. Try again.' };
  }

  const cookieStore = await cookies();
  cookieStore.set(GUEST_SESSION_COOKIE, await createGuestSession(), {
    httpOnly: true,
    maxAge: 60 * 60 * 8,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  redirect('/dashboard');
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(GUEST_SESSION_COOKIE);
  redirect('/');
}