const mockJwtBuilder = {
  setProtectedHeader: jest.fn().mockReturnThis(),
  setSubject: jest.fn().mockReturnThis(),
  setIssuedAt: jest.fn().mockReturnThis(),
  setExpirationTime: jest.fn().mockReturnThis(),
  sign: jest.fn().mockResolvedValue('guest-token'),
};
const mockSignJWT = jest.fn(() => mockJwtBuilder);
const mockJwtVerify = jest.fn();

jest.doMock('jose', () => ({ SignJWT: mockSignJWT, jwtVerify: mockJwtVerify }));

const { createGuestSession, getGuestSessionUsername, GUEST_SESSION_COOKIE, verifyGuestSession } =
  require('./guest-session') as typeof import('./guest-session');

describe('guest sessions', () => {
  const originalSecret = process.env.SESSION_SECRET;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.SESSION_SECRET = 'test-secret-for-session-tests';
  });

  afterAll(() => {
    if (originalSecret === undefined) {
      delete process.env.SESSION_SECRET;
    } else {
      process.env.SESSION_SECRET = originalSecret;
    }
  });

  it('exports the expected session cookie name', () => {
    expect(GUEST_SESSION_COOKIE).toBe('fixitcrm_session');
  });

  it('creates a token that verifies as the guest session', async () => {
    mockJwtVerify.mockResolvedValue({ payload: { sub: 'guest' } });
    const token = await createGuestSession();

    expect(token).toBe('guest-token');
    expect(mockJwtBuilder.setProtectedHeader).toHaveBeenCalledWith({ alg: 'HS256' });
    expect(mockJwtBuilder.setSubject).toHaveBeenCalledWith('guest');
    expect(mockJwtBuilder.setExpirationTime).toHaveBeenCalledWith('8h');
    await expect(getGuestSessionUsername(token)).resolves.toBe('guest');
    await expect(verifyGuestSession(token)).resolves.toBe(true);
  });

  it('rejects missing, malformed, and non-guest tokens', async () => {
    await expect(getGuestSessionUsername(undefined)).resolves.toBeNull();
    mockJwtVerify.mockRejectedValueOnce(new Error('Invalid token'));
    await expect(getGuestSessionUsername('not-a-token')).resolves.toBeNull();
    mockJwtVerify.mockResolvedValue({ payload: { sub: 'someone-else' } });
    await expect(getGuestSessionUsername('other-user-token')).resolves.toBeNull();
    await expect(verifyGuestSession('other-user-token')).resolves.toBe(false);
  });

  it('fails to create a token when the signing secret is missing', async () => {
    delete process.env.SESSION_SECRET;

    expect(() => createGuestSession()).toThrow('SESSION_SECRET is not configured.');
  });
});
