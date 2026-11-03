/** @jest-environment node */

import { cookies } from 'next/headers';
import { generateQuotePdf } from '../../../../../lib/quote-pdf';
import { prisma } from '../../../../../lib/prisma';
import { GUEST_SESSION_COOKIE, verifyGuestSession } from '../../../../../lib/guest-session';
import { GET } from './route';

jest.mock('next/headers', () => ({ cookies: jest.fn() }));
jest.mock('../../../../../lib/quote-pdf', () => ({ generateQuotePdf: jest.fn() }));
jest.mock('../../../../../lib/prisma', () => ({
  prisma: { quote: { findUnique: jest.fn() } },
}));
jest.mock('../../../../../lib/guest-session', () => ({
  GUEST_SESSION_COOKIE: 'fixitcrm_session',
  verifyGuestSession: jest.fn(),
}));

const mockCookieGet = jest.fn();

describe('GET /api/quotes/[reference]/pdf', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCookieGet.mockReturnValue({ value: 'session-token' });
    jest.mocked(cookies).mockResolvedValue({ get: mockCookieGet } as never);
  });

  it('rejects requests without a valid guest session', async () => {
    jest.mocked(verifyGuestSession).mockResolvedValue(false);

    const response = await GET(new Request('http://localhost'), {
      params: Promise.resolve({ reference: 'QT-3101' }),
    });

    expect(response.status).toBe(401);
    expect(prisma.quote.findUnique).not.toHaveBeenCalled();
  });

  it('returns an inline PDF for a valid quote', async () => {
    jest.mocked(verifyGuestSession).mockResolvedValue(true);
    jest.mocked(prisma.quote.findUnique).mockResolvedValue({
      reference: 'QT-3101',
      status: 'Sent',
      issuedAt: new Date('2026-10-12T00:00:00.000Z'),
      validUntil: new Date('2026-10-26T00:00:00.000Z'),
      customer: {
        firstName: 'Grace',
        lastName: 'Lin',
        email: 'grace@example.com',
        phone: null,
        addressLine1: null,
        addressLine2: null,
        city: null,
        county: null,
        postcode: null,
      },
      repairJob: null,
      items: [{ description: 'Keyboard assembly', quantity: 1, unitPricePence: 12900 }],
    } as never);
    jest.mocked(generateQuotePdf).mockResolvedValue(Buffer.from('%PDF-test'));

    const response = await GET(new Request('http://localhost'), {
      params: Promise.resolve({ reference: 'QT-3101' }),
    });

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('application/pdf');
    expect(response.headers.get('content-disposition')).toContain('inline; filename="QT-3101.pdf"');
    expect(Buffer.from(await response.arrayBuffer()).toString()).toBe('%PDF-test');
    expect(mockCookieGet).toHaveBeenCalledWith(GUEST_SESSION_COOKIE);
  });
});