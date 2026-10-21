import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createGuestSession, GUEST_SESSION_COOKIE } from '../../lib/guest-session';
import { login, logout } from './auth';

jest.mock('next/headers', () => ({ cookies: jest.fn() }));
jest.mock('next/navigation', () => ({ redirect: jest.fn() }));
jest.mock('../../lib/guest-session', () => ({
  createGuestSession: jest.fn(),
  GUEST_SESSION_COOKIE: 'fixitcrm_session',
}));

const mockCookieSet = jest.fn();
const mockCookieDelete = jest.fn();

function createFormData(username: FormDataEntryValue | null, password: FormDataEntryValue | null) {
  const formData = new FormData();
  if (username !== null) formData.set('username', username);
  if (password !== null) formData.set('password', password);
  return formData;
}

describe('auth actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.GUEST_PASSWORD = 'correct-password';
    process.env.SESSION_SECRET = 'test-session-secret';
    jest.mocked(cookies).mockResolvedValue({
      set: mockCookieSet,
      delete: mockCookieDelete,
    } as unknown as Awaited<ReturnType<typeof cookies>>);
    jest.mocked(createGuestSession).mockResolvedValue('signed-session-token');
  });

  afterEach(() => {
    delete process.env.GUEST_PASSWORD;
    delete process.env.SESSION_SECRET;
  });

  it('returns a configuration error when credentials are not configured', async () => {
    delete process.env.SESSION_SECRET;

    await expect(login(null, createFormData('guest', 'correct-password'))).resolves.toEqual({
      error: 'Sign-in is not configured correctly.',
    });
    expect(cookies).not.toHaveBeenCalled();
  });

  it('returns a configuration error for a non-guest username', async () => {
    await expect(login(null, createFormData('admin', 'correct-password'))).resolves.toEqual({
      error: 'Sign-in is not configured correctly.',
    });
    expect(cookies).not.toHaveBeenCalled();
  });

  it('rejects a password that does not match', async () => {
    await expect(login(null, createFormData('guest', 'wrong-password'))).resolves.toEqual({
      error: 'That password did not match. Try again.',
    });
    expect(cookies).not.toHaveBeenCalled();
  });

  it('sets the guest session cookie and redirects after successful login', async () => {
    await login(null, createFormData('guest', 'correct-password'));

    expect(createGuestSession).toHaveBeenCalledTimes(1);
    expect(mockCookieSet).toHaveBeenCalledWith(GUEST_SESSION_COOKIE, 'signed-session-token', {
      httpOnly: true,
      maxAge: 60 * 60 * 8,
      path: '/',
      sameSite: 'lax',
      secure: false,
    });
    expect(redirect).toHaveBeenCalledWith('/dashboard');
  });

  it('deletes the guest session cookie and redirects on logout', async () => {
    await logout();

    expect(mockCookieDelete).toHaveBeenCalledWith(GUEST_SESSION_COOKIE);
    expect(redirect).toHaveBeenCalledWith('/');
  });
});